<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\CollectorReceipt;
use App\Models\Core\User;
use App\Models\Keuangan\Account;
use App\Models\Keuangan\AccountBalance;
use App\Models\Keuangan\Iuran;
use App\Models\Keuangan\IuranSetoran;
use App\Models\Keuangan\JournalEntry;
use App\Models\Keuangan\JournalLine;
use App\Models\Keuangan\SetoranKolektor;
use App\Services\FcmService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SetoranKolektorController extends Controller
{
    protected FcmService $fcm;

    public function __construct(FcmService $fcm)
    {
        $this->fcm = $fcm;
    }

    /**
     * Daftar iuran kolektor yang sudah diterima kolektor,
     * belum dibatalkan, belum punya tanggal setor, dan
     * belum pernah dimasukkan ke batch setoran_kolektors.
     */
    public function pendingReceipts(Request $request)
    {
        $user = $request->user();

        // Iuran yang sudah pernah masuk batch setoran apa pun
        $iuranIdsInSetoran = IuranSetoran::query()
            ->pluck('iuran_id')
            ->all();

        $rows = CollectorReceipt::query()
            ->with(['anggota', 'refIuran'])
            ->where('kolektor_user_id', $user->id)
            ->where('is_canceled', false)
            ->whereNull('tgl_setor')
            ->when(! empty($iuranIdsInSetoran), function ($q) use ($iuranIdsInSetoran) {
                $q->whereNotIn('iuran_id', $iuranIdsInSetoran);
            })
            ->orderByDesc('tanggal_bayar')
            ->get()
            ->map(function (CollectorReceipt $receipt) {
                return [
                    'id' => $receipt->id,
                    'iuran_id' => $receipt->iuran_id,
                    'anggota_id' => $receipt->anggota_id,
                    'anggota_nama' => $receipt->anggota?->nama,
                    'anggota_kode' => $receipt->anggota?->kode,
                    'ref_iuran_id' => $receipt->ref_iuran_id,
                    'ref_iuran_nama' => $receipt->refIuran?->nama_iuran,
                    'jumlah' => (float) $receipt->jumlah,
                    'tanggal_bayar' => optional($receipt->tanggal_bayar)->toDateString(),
                    'catatan' => $receipt->catatan,
                ];
            });

        return ResponseFormatter::success(
            $rows,
            'Daftar iuran kolektor yang siap disetor ke bendahara.'
        );
    }

    /**
     * Kolektor membuat batch setoran ke bendahara dari beberapa receipt.
     */
    public function store(Request $request)
    {
        $rules = [
            'tanggal' => 'required|date',
            'receipt_ids' => 'required|array|min:1',
            'receipt_ids.*' => 'integer|exists:collector_receipts,id',
        ];

        $v = Validator::make($request->all(), $rules);
        if ($v->fails()) {
            return ResponseFormatter::error('Validasi gagal', $v->errors(), 422);
        }

        $user = $request->user();
        $tanggal = Carbon::parse($request->tanggal)->toDateString();

        $receipts = CollectorReceipt::query()
            ->whereIn('id', $request->receipt_ids)
            ->where('kolektor_user_id', $user->id)
            ->where('is_canceled', false)
            ->whereNull('tgl_setor')
            ->get();

        if ($receipts->isEmpty()) {
            return ResponseFormatter::error(
                'Tidak ada transaksi yang valid untuk dibuat setoran.',
                null,
                422
            );
        }

        // Pastikan semua iuran belum pernah dimasukkan ke batch setoran lain
        $iuranIds = $receipts->pluck('iuran_id')->filter()->unique()->values();

        if ($iuranIds->isEmpty()) {
            return ResponseFormatter::error(
                'Beberapa transaksi belum memiliki iuran terkait.',
                null,
                422
            );
        }

        $existingInSetoran = IuranSetoran::whereIn('iuran_id', $iuranIds)->exists();
        if ($existingInSetoran) {
            return ResponseFormatter::error(
                'Sebagian iuran sudah pernah dimasukkan ke setoran lain.',
                null,
                422
            );
        }

        $totalNominal = (float) $receipts->sum('jumlah');

        try {
            $setoran = DB::transaction(function () use ($user, $tanggal, $totalNominal, $iuranIds) {
                // Catat setoran dengan bendahara_id sementara = kolektor,
                // akan diganti saat bendahara menyetujui.
                $setoran = SetoranKolektor::create([
                    'kolektor_id' => $user->id,
                    'bendahara_id' => $user->id,
                    'tanggal' => $tanggal,
                    'nominal_total' => $totalNominal,
                    'journal_entry_id_setoran' => null,
                ]);

                $pivotRows = $iuranIds->map(function ($iuranId) use ($setoran) {
                    return [
                        'iuran_id' => $iuranId,
                        'setoran_kolektor_id' => $setoran->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all();

                IuranSetoran::insert($pivotRows);

                return $setoran->fresh(['kolektor']);
            });
        } catch (\Throwable $e) {
            report($e);

            return ResponseFormatter::error(
                'Gagal membuat setoran kolektor.',
                null,
                500
            );
        }

        // Kirim notifikasi ke semua bendahara ketika kolektor submit setoran
        $nominalFormatted = number_format($totalNominal, 0, ',', '.');

        $bendaharaUsers = User::role('bendahara')
            ->with(['devices' => function ($q) {
                $q->where('is_active', true);
            }])
            ->get();

        foreach ($bendaharaUsers as $bendahara) {
            $devices = $bendahara->devices;
            if ($devices->isEmpty()) {
                continue;
            }

            $this->fcm->sendToUserDevices(
                $devices,
                [
                    'type' => 'setoran_submitted',
                    'title' => 'Setoran kolektor menunggu penerimaan',
                    'body' => sprintf(
                        'Kolektor %s menyetor tanggal %s sebesar %s, mohon diterima.',
                        $setoran->kolektor?->name ?? $user->name,
                        $setoran->tanggal,
                        $nominalFormatted
                    ),
                    'data' => [
                        'setoran_id' => $setoran->id,
                        'kolektor_id' => $setoran->kolektor_id,
                        'nominal_total' => $setoran->nominal_total,
                        'role' => 'bendahara',
                    ],
                ],
                null
            );
        }

        return ResponseFormatter::success(
            $setoran,
            'Setoran kolektor berhasil dibuat dan menunggu verifikasi bendahara.',
            201
        );
    }

    /**
     * Bendahara: daftar setoran kolektor yang belum diposting ke jurnal.
     */
    public function pendingSetoranUntukBendahara(Request $request)
    {
        $rows = SetoranKolektor::query()
            ->with('kolektor')
            ->whereNull('journal_entry_id_setoran')
            ->orderByDesc('tanggal')
            ->get()
            ->map(function (SetoranKolektor $setoran) {
                return [
                    'id' => $setoran->id,
                    'tanggal' => $setoran->tanggal,
                    'nominal_total' => (float) $setoran->nominal_total,
                    'kolektor_id' => $setoran->kolektor_id,
                    'kolektor_nama' => $setoran->kolektor?->name,
                    'iuran_count' => $setoran->iuran_setorans()->count(),
                ];
            });

        return ResponseFormatter::success(
            $rows,
            'Daftar setoran kolektor yang menunggu penerimaan bendahara.'
        );
    }

    /**
     * Bendahara: ringkasan saldo kolektor per orang.
     * - saldo_di_tangan: iuran yang sudah diterima kolektor tapi belum disetor (tahun berjalan)
     * - total_disetor_tahun_ini: total setoran yang sudah diterima bendahara (tahun berjalan)
     * - total_pending_setoran: total setoran yang sudah diajukan kolektor tapi belum diterima bendahara
     */
    public function summaryUntukBendahara(Request $request)
    {
        $year = (int) now()->format('Y');

        // Dana masih di tangan kolektor (iuran belum disetor ke bendahara)
        $saldoPerKolektor = CollectorReceipt::query()
            ->selectRaw('kolektor_user_id as kolektor_id, SUM(jumlah) as saldo_di_tangan')
            ->where('is_canceled', false)
            ->whereNull('tgl_setor')
            ->whereYear('tanggal_bayar', $year)
            ->groupBy('kolektor_user_id')
            ->pluck('saldo_di_tangan', 'kolektor_id');

        // Total yang sudah disetor ke bendahara dalam tahun berjalan
        $disetorPerKolektor = SetoranKolektor::query()
            ->selectRaw('kolektor_id, SUM(nominal_total) as total_disetor')
            ->whereNotNull('journal_entry_id_setoran')
            ->whereYear('tanggal', $year)
            ->groupBy('kolektor_id')
            ->pluck('total_disetor', 'kolektor_id');

        // Setoran yang sedang menunggu diterima bendahara
        $pendingPerKolektor = SetoranKolektor::query()
            ->selectRaw('kolektor_id, SUM(nominal_total) as total_pending, COUNT(*) as pending_count')
            ->whereNull('journal_entry_id_setoran')
            ->groupBy('kolektor_id')
            ->get()
            ->keyBy('kolektor_id');

        // Kumpulkan semua kolektor yang punya aktivitas
        $kolektorIds = collect([
            $saldoPerKolektor->keys(),
            $disetorPerKolektor->keys(),
            $pendingPerKolektor->keys(),
        ])->flatten()->unique()->filter()->values();

        if ($kolektorIds->isEmpty()) {
            return ResponseFormatter::success([], 'Tidak ada aktivitas setoran kolektor.');
        }

        $kolektorUsers = User::whereIn('id', $kolektorIds)->get()->keyBy('id');

        $rows = $kolektorIds->map(function ($kolektorId) use (
            $kolektorUsers,
            $saldoPerKolektor,
            $disetorPerKolektor,
            $pendingPerKolektor
        ) {
            $user = $kolektorUsers->get($kolektorId);
            $pending = $pendingPerKolektor->get($kolektorId);

            return [
                'kolektor_id' => (int) $kolektorId,
                'kolektor_nama' => $user?->name,
                'saldo_di_tangan' => (float) ($saldoPerKolektor[$kolektorId] ?? 0),
                'total_disetor_tahun_ini' => (float) ($disetorPerKolektor[$kolektorId] ?? 0),
                'total_pending_setoran' => (float) ($pending->total_pending ?? 0),
                'pending_count' => (int) ($pending->pending_count ?? 0),
            ];
        })->values();

        return ResponseFormatter::success(
            $rows,
            'Ringkasan setoran kolektor untuk bendahara.'
        );
    }

    /**
     * Bendahara menerima satu setoran kolektor dan memindahkan saldo
     * dari kas kolektor ke kas bendahara.
     */
    public function approve(Request $request, $id)
    {
        $user = $request->user();

        /** @var SetoranKolektor|null $setoran */
        $setoran = SetoranKolektor::query()
            ->where('id', $id)
            ->whereNull('journal_entry_id_setoran')
            ->first();

        if (! $setoran) {
            return ResponseFormatter::error(
                'Setoran tidak ditemukan atau sudah diproses.',
                null,
                404
            );
        }

        $iuranSetorans = IuranSetoran::with('iuran')
            ->where('setoran_kolektor_id', $setoran->id)
            ->get();

        if ($iuranSetorans->isEmpty()) {
            return ResponseFormatter::error(
                'Setoran ini tidak memiliki detail iuran.',
                null,
                422
            );
        }

        $iurans = $iuranSetorans->pluck('iuran')->filter();
        if ($iurans->isEmpty()) {
            return ResponseFormatter::error(
                'Data iuran pada setoran ini tidak lengkap.',
                null,
                422
            );
        }

        // Asumsikan semua iuran dalam satu setoran berasal dari company_code yang sama
        $companyCode = $iurans->pluck('company_code')->filter()->unique()->first() ?? 'BSKM';

        $tanggal = Carbon::parse($setoran->tanggal);

        // Akun kas bendahara utama (default 1101)
        $kasBendahara = Account::where('kode', '1101')->first();
        if (! $kasBendahara) {
            return ResponseFormatter::error(
                'Akun kas bendahara (1101) tidak ditemukan.',
                null,
                422
            );
        }

        // Akun kas kolektor, menggunakan nama kolektor seperti pada pencatatan awal
        $kolektorUser = User::with(['devices' => function ($q) {
            $q->where('is_active', true);
        }])->find($setoran->kolektor_id);
        if (! $kolektorUser) {
            return ResponseFormatter::error(
                'Data kolektor tidak ditemukan.',
                null,
                422
            );
        }

        $kasKolektor = $this->findCollectorCashAccount($kolektorUser) ?? Account::where('kode', '1102')->first();
        if (! $kasKolektor) {
            return ResponseFormatter::error(
                'Akun kas kolektor tidak ditemukan.',
                null,
                422
            );
        }

        try {
            $result = DB::transaction(function () use (
                $setoran,
                $user,
                $companyCode,
                $tanggal,
                $kasBendahara,
                $kasKolektor
            ) {
                // Buat jurnal pemindahan kas
                $journal = JournalEntry::create([
                    'company_code' => $companyCode,
                    'date' => $tanggal->toDateString(),
                    'description' => "Setoran kolektor {$setoran->kolektor?->name} ke bendahara",
                    'reference' => "SETORAN_KOLEKTOR#{$setoran->id}",
                    'source_module' => 'setoran_kolektor',
                    'created_by' => $user->id,
                ]);

                JournalLine::insert([
                    [
                        'journal_entry_id' => $journal->id,
                        'account_id' => $kasBendahara->id,
                        'account_code' => $kasBendahara->kode,
                        'debit' => (float) $setoran->nominal_total,
                        'credit' => 0,
                        'subledger_type' => null,
                        'subledger_id' => null,
                        'notes' => 'Terima setoran kolektor',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'journal_entry_id' => $journal->id,
                        'account_id' => $kasKolektor->id,
                        'account_code' => $kasKolektor->kode,
                        'debit' => 0,
                        'credit' => (float) $setoran->nominal_total,
                        'subledger_type' => null,
                        'subledger_id' => null,
                        'notes' => 'Setor ke bendahara',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);

                // Update ledger kas bendahara dan kas kolektor
                $this->updateLedger(
                    $companyCode,
                    $kasBendahara,
                    (float) $setoran->nominal_total,
                    0,
                    $tanggal,
                    null,
                    null
                );

                $this->updateLedger(
                    $companyCode,
                    $kasKolektor,
                    0,
                    (float) $setoran->nominal_total,
                    $tanggal,
                    null,
                    null
                );

                // Tandai setoran dan kolektor_receipts sebagai sudah disetor
                $setoran->journal_entry_id_setoran = $journal->id;
                $setoran->bendahara_id = $user->id;
                $setoran->save();

                $iuranIds = $setoran->iuran_setorans()->pluck('iuran_id')->all();

                CollectorReceipt::where('kolektor_user_id', $setoran->kolektor_id)
                    ->whereIn('iuran_id', $iuranIds)
                    ->whereNull('tgl_setor')
                    ->update([
                        'tgl_setor' => $tanggal->toDateString(),
                    ]);

                return [
                    'setoran' => $setoran->fresh(['kolektor']),
                    'journal_entry' => $journal,
                ];
            });
        } catch (\Throwable $e) {
            report($e);

            return ResponseFormatter::error(
                'Gagal memproses penerimaan setoran kolektor.',
                null,
                500
            );
        }

        // Setelah bendahara menyetujui, kirim notifikasi ke kolektor
        if ($kolektorUser && $kolektorUser->devices->isNotEmpty()) {
            $nominalFormatted = number_format($setoran->nominal_total, 0, ',', '.');

            $this->fcm->sendToUserDevices(
                $kolektorUser->devices,
                [
                    'type' => 'setoran_approved',
                    'title' => 'Setoran kamu telah diterima',
                    'body' => sprintf(
                        'Setoran tanggal %s sebesar %s telah diterima bendahara %s.',
                        $setoran->tanggal,
                        $nominalFormatted,
                        $user->name
                    ),
                    'data' => [
                        'setoran_id' => $setoran->id,
                        'journal_entry_id' => $result['journal_entry']->id ?? null,
                        'nominal_total' => $setoran->nominal_total,
                        'role' => 'kolektor',
                        'bendahara_id' => $user->id,
                    ],
                ],
                null
            );
        }

        return ResponseFormatter::success(
            $result,
            'Setoran kolektor berhasil diterima bendahara.'
        );
    }

    protected function findCollectorCashAccount(User $user): ?Account
    {
        $exactName = "Kas Kolektor - {$user->name}";

        $account = Account::where('nama', $exactName)->first();
        if ($account) {
            return $account;
        }

        $account = Account::where('nama', 'like', "Kas Kolektor -%{$user->name}%")->first();
        if ($account) {
            return $account;
        }

        return Account::where('kode', 'like', '11K%')
            ->where('nama', 'like', 'Kas Kolektor - %')
            ->first();
    }

    protected function updateLedger(
        string $companyCode,
        Account $account,
        float $debit,
        float $credit,
        Carbon $tanggal,
        ?string $subledgerType,
        ?int $subledgerId
    ): void {
        $year = (int) $tanggal->format('Y');
        $month = (int) $tanggal->format('m');

        $balance = AccountBalance::firstOrCreate(
            [
                'company_code' => $companyCode,
                'account_id' => $account->id,
                'account_code' => $account->kode,
                'year' => $year,
                'month' => $month,
                'subledger_type' => $subledgerType,
                'subledger_id' => $subledgerId,
            ],
            [
                'opening_balance' => 0,
                'debit_total' => 0,
                'credit_total' => 0,
                'closing_balance' => 0,
            ]
        );

        // Initialize opening balance from previous month's closing if not yet set
        if ($balance->opening_balance == 0 && $balance->debit_total == 0 && $balance->credit_total == 0) {
            $prevYear = $month === 1 ? $year - 1 : $year;
            $prevMonth = $month === 1 ? 12 : $month - 1;
            $prev = AccountBalance::where('company_code', $companyCode)
                ->where('account_id', $account->id)
                ->where('account_code', $account->kode)
                ->where('year', $prevYear)
                ->where('month', $prevMonth)
                ->where('subledger_type', $subledgerType)
                ->where('subledger_id', $subledgerId)
                ->first();
            if ($prev) {
                $balance->opening_balance = $prev->closing_balance;
            }
        }

        $balance->debit_total += $debit;
        $balance->credit_total += $credit;
        $balance->closing_balance =
            $balance->opening_balance +
            $balance->debit_total -
            $balance->credit_total;

        $balance->save();
    }
}
