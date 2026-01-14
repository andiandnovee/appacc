<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\CollectorReceipt;
use App\Models\Keanggotaan\Anggota;
use App\Models\Keuangan\Account;
use App\Models\Keuangan\AccountBalance;
use App\Models\Keuangan\Iuran;
use App\Models\Keuangan\JournalEntry;
use App\Models\Keuangan\JournalLine;
use App\Models\Master\RefIuran;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class KolektorReceiptController extends Controller
{
    protected string $companyCode = 'BSKM';

    /**
     * Search anggota untuk input penerimaan iuran
     */
    public function searchAnggota(Request $request)
    {
        $keyword = $request->get('q', '');

        $query = Anggota::query()
            ->where('status', 'aktif')
            ->where('is_dummy', false);

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('nama', 'like', "%{$keyword}%")
                    ->orWhere('kode', 'like', "%{$keyword}%")
                    ->orWhere('no_hp', 'like', "%{$keyword}%");
            });
        }

        $anggotas = $query->with(['alamats.perum'])
            ->orderBy('nama')
            ->limit(20)
            ->get()
            ->map(function ($a) {
                $alamat = $a->alamats->first();

                return [
                    'id' => $a->id,
                    'kode' => $a->kode,
                    'nama' => $a->nama,
                    'no_hp' => $a->no_hp,
                    'perum' => $alamat?->perum?->nama ?? '-',
                    'no_rumah' => $alamat?->no_rumah ?? '-',
                ];
            });

        return ResponseFormatter::success($anggotas, 'Daftar anggota');
    }

    /**
     * Show detail satu receipt
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $receipt = CollectorReceipt::with(['anggota', 'refIuran'])
            ->where('id', $id)
            ->where('kolektor_user_id', $user->id)
            ->first();

        if (! $receipt) {
            return ResponseFormatter::error('Receipt tidak ditemukan', null, 404);
        }

        return ResponseFormatter::success($receipt, 'Detail receipt');
    }

    /**
     * Store: Kolektor input penerimaan iuran dari anggota
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $rules = [
            'anggota_id' => 'required|exists:anggotas,id',
            'ref_iuran_id' => 'required|exists:ref_iurans,id',
            'jumlah' => 'required|numeric|min:1',
            'tanggal_bayar' => 'required|date',
            'catatan' => 'nullable|string|max:255',
            'periode_bulan' => 'nullable|integer|min:1|max:12',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ResponseFormatter::error('Validasi gagal', $validator->errors(), 422);
        }

        $anggotaId = $request->anggota_id;
        $refIuranId = $request->ref_iuran_id;
        $jumlah = (float) $request->jumlah;
        $tanggalBayar = Carbon::parse($request->tanggal_bayar);
        $catatan = $request->catatan ?? '';
        $periodeBulanInput = $request->periode_bulan; // null jika tidak dikirim

        // Cari akun kas kolektor
        $kasKolektor = $this->findCollectorCashAccount($user);
        if (! $kasKolektor) {
            return ResponseFormatter::error(
                'Akun kas kolektor tidak ditemukan. Hubungi admin.',
                null,
                422
            );
        }

        // Cari akun liabilitas (2101)
        $akunLiabilitas = Account::where('kode', '2101')->first();
        if (! $akunLiabilitas) {
            return ResponseFormatter::error('Akun liabilitas 2101 tidak ditemukan', null, 422);
        }

        // Cari anggota
        $anggota = Anggota::find($anggotaId);
        if (! $anggota) {
            return ResponseFormatter::error('Anggota tidak ditemukan', null, 404);
        }

        // Cari ref iuran
        $refIuran = RefIuran::find($refIuranId);
        if (! $refIuran) {
            return ResponseFormatter::error('Jenis iuran tidak ditemukan', null, 404);
        }

        try {
            $result = DB::transaction(function () use (
                $user,
                $anggota,
                $refIuran,
                $jumlah,
                $tanggalBayar,
                $catatan,
                $kasKolektor,
                $akunLiabilitas,
                $periodeBulanInput
            ) {
                // 1. Buat record Iuran
                $bulanMap = [
                    1 => 'JANUARI', 2 => 'FEBRUARI', 3 => 'MARET', 4 => 'APRIL',
                    5 => 'MEI', 6 => 'JUNI', 7 => 'JULI', 8 => 'AGUSTUS',
                    9 => 'SEPTEMBER', 10 => 'OKTOBER', 11 => 'NOVEMBER', 12 => 'DESEMBER',
                ];

                // Gunakan periode_bulan dari request jika ada, jika tidak gunakan bulan dari tanggal_bayar
                if ($periodeBulanInput) {
                    $bulanKe = (int) $periodeBulanInput;
                } else {
                    $bulanKe = (int) $tanggalBayar->format('m');
                }
                $periode = $bulanMap[$bulanKe] ?? 'UNKNOWN';

                $iuran = Iuran::create([
                    'company_code' => $this->companyCode,
                    'kode' => $anggota->kode.'-'.$tanggalBayar->format('Ymd').'-'.time(),
                    'anggota_id' => $anggota->id,
                    'ref_iuran_id' => $refIuran->id,
                    'jumlah' => (int) $jumlah,
                    'tanggal_bayar' => $tanggalBayar->toDateString(),
                    'periode_bulan' => $periode,
                    'catatan' => $catatan ?: "Terima dari kolektor {$user->name}",
                    'is_dummy' => false,
                ]);

                // 2. Buat Journal Entry
                $journal = JournalEntry::create([
                    'company_code' => $this->companyCode,
                    'date' => $tanggalBayar->toDateString(),
                    'description' => "Penerimaan iuran dari {$anggota->nama} via kolektor {$user->name}",
                    'reference' => "IURAN#{$iuran->id}",
                    'source_module' => 'iuran',
                    'created_by' => $user->id,
                ]);

                // 3. Journal Lines
                // Debit: Kas Kolektor
                // Credit: Liabilitas (2101) per anggota
                JournalLine::insert([
                    [
                        'journal_entry_id' => $journal->id,
                        'account_id' => $kasKolektor->id,
                        'account_code' => $kasKolektor->kode,
                        'subledger_type' => null,
                        'subledger_id' => null,
                        'debit' => $jumlah,
                        'credit' => 0,
                        'notes' => "Penerimaan kas dari {$anggota->nama}",
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'journal_entry_id' => $journal->id,
                        'account_id' => $akunLiabilitas->id,
                        'account_code' => $akunLiabilitas->kode,
                        'subledger_type' => 'anggota',
                        'subledger_id' => $anggota->id,
                        'debit' => 0,
                        'credit' => $jumlah,
                        'notes' => "Liabilitas iuran {$anggota->nama}",
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);

                // 4. Update Ledger - Kas Kolektor
                $this->updateLedger(
                    $this->companyCode,
                    $kasKolektor,
                    $jumlah,
                    0,
                    $tanggalBayar,
                    null,
                    null
                );

                // 5. Update Ledger - Liabilitas per anggota
                $this->updateLedger(
                    $this->companyCode,
                    $akunLiabilitas,
                    0,
                    $jumlah,
                    $tanggalBayar,
                    'anggota',
                    $anggota->id
                );

                // 6. Buat CollectorReceipt
                $receipt = CollectorReceipt::create([
                    'kolektor_user_id' => $user->id,
                    'anggota_id' => $anggota->id,
                    'ref_iuran_id' => $refIuran->id,
                    'iuran_id' => $iuran->id,
                    'journal_entry_id' => $journal->id,
                    'jumlah' => $jumlah,
                    'tanggal_bayar' => $tanggalBayar->toDateString(),
                    'catatan' => $catatan,
                    'tgl_setor' => null,
                    'is_canceled' => false,
                ]);

                return [
                    'receipt' => $receipt->fresh(['anggota', 'refIuran']),
                    'iuran' => $iuran,
                    'journal' => $journal,
                ];
            });

            return ResponseFormatter::success(
                $result,
                'Penerimaan iuran berhasil dicatat',
                201
            );
        } catch (\Throwable $e) {
            report($e);

            return ResponseFormatter::error(
                'Gagal mencatat penerimaan iuran: '.$e->getMessage(),
                null,
                500
            );
        }
    }

    /**
     * Cancel pending receipt (belum disetor ke bendahara)
     */
    public function cancelPending(Request $request)
    {
        $user = $request->user();

        $rules = [
            'receipt_id' => 'required|exists:collector_receipts,id',
            'reason' => 'required|string|max:255',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ResponseFormatter::error('Validasi gagal', $validator->errors(), 422);
        }

        $receipt = CollectorReceipt::where('id', $request->receipt_id)
            ->where('kolektor_user_id', $user->id)
            ->whereNull('tgl_setor')
            ->where('is_canceled', false)
            ->first();

        if (! $receipt) {
            return ResponseFormatter::error(
                'Receipt tidak ditemukan atau sudah diproses/dibatalkan',
                null,
                404
            );
        }

        try {
            DB::transaction(function () use ($receipt, $user, $request) {
                // 1. Cancel receipt
                $receipt->update([
                    'is_canceled' => true,
                    'canceled_at' => now(),
                    'canceled_by' => $user->id,
                    'cancel_reason' => $request->reason,
                ]);

                // 2. Cancel iuran jika ada
                if ($receipt->iuran_id) {
                    Iuran::where('id', $receipt->iuran_id)->update([
                        'is_canceled' => true,
                    ]);
                }

                // 3. Reverse ledger entries
                $kasKolektor = $this->findCollectorCashAccount($user);
                $akunLiabilitas = Account::where('kode', '2101')->first();

                if ($kasKolektor) {
                    $tanggal = Carbon::parse($receipt->tanggal_bayar);

                    // Reverse Kas Kolektor (credit to reduce)
                    $this->updateLedger(
                        'BSKM',
                        $kasKolektor,
                        0,
                        (float) $receipt->jumlah,
                        $tanggal,
                        null,
                        null
                    );

                    // Reverse Liabilitas (debit to reduce)
                    if ($akunLiabilitas) {
                        $this->updateLedger(
                            'BSKM',
                            $akunLiabilitas,
                            (float) $receipt->jumlah,
                            0,
                            $tanggal,
                            'anggota',
                            $receipt->anggota_id
                        );
                    }
                }
            });

            return ResponseFormatter::success(
                $receipt->fresh(),
                'Penerimaan iuran berhasil dibatalkan'
            );
        } catch (\Throwable $e) {
            report($e);

            return ResponseFormatter::error(
                'Gagal membatalkan penerimaan: '.$e->getMessage(),
                null,
                500
            );
        }
    }

    /**
     * Daftar setoran kolektor yang belum disetor ke bendahara (ringkasan per anggota)
     */
    public function pendingSetor(Request $request)
    {
        $user = $request->user();

        $rows = CollectorReceipt::query()
            ->join('anggotas', 'collector_receipts.anggota_id', '=', 'anggotas.id')
            ->leftJoin('iuran_setorans', 'collector_receipts.iuran_id', '=', 'iuran_setorans.iuran_id')
            ->leftJoin('setoran_kolektors', 'iuran_setorans.setoran_kolektor_id', '=', 'setoran_kolektors.id')
            ->where('collector_receipts.kolektor_user_id', $user->id)
            ->whereNull('collector_receipts.tgl_setor')
            ->groupBy('collector_receipts.anggota_id', 'anggotas.nama', 'anggotas.no_hp')
            ->select([
                'collector_receipts.anggota_id',
                'anggotas.nama',
                'anggotas.no_hp',
                DB::raw('SUM(CASE WHEN collector_receipts.is_canceled = 0 THEN 1 ELSE 0 END) as transaksi_count'),
                DB::raw('SUM(CASE WHEN collector_receipts.is_canceled = 0 THEN collector_receipts.jumlah ELSE 0 END) as total_jumlah'),
                DB::raw('SUM(CASE WHEN collector_receipts.is_canceled = 1 THEN 1 ELSE 0 END) as transaksi_count_batal'),
                DB::raw('SUM(CASE WHEN collector_receipts.is_canceled = 1 THEN collector_receipts.jumlah ELSE 0 END) as total_jumlah_batal'),
                DB::raw('SUM(CASE WHEN collector_receipts.is_canceled = 0 AND iuran_setorans.id IS NULL THEN 1 ELSE 0 END) as transaksi_count_belum_ajukan'),
            ])
            ->get();

        return ResponseFormatter::success(
            $rows,
            'Berhasil mengambil daftar setoran pending per anggota'
        );
    }

    protected function findCollectorCashAccount($user): ?Account
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
