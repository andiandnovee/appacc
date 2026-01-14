<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Keuangan\Account;
use App\Models\Keuangan\AccountBalance;
use App\Services\JournalEntryService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CashbookController extends Controller
{
    public function getAccounts()
    {
        // Ambil semua akun yang tidak punya child (leaf accounts)
        // Kecuali akun kas (11xx)
        $allAccounts = Account::select('accounts.id', 'accounts.kode', 'accounts.nama')
            ->leftJoin('accounts as children', 'accounts.id', '=', 'children.parent_id')
            ->whereNull('children.id') // tidak punya child
            ->where('accounts.kode', 'not like', '11%') // exclude kas accounts
            ->orderBy('accounts.kode', 'asc')
            ->groupBy('accounts.id', 'accounts.kode', 'accounts.nama')
            ->get();

        return ResponseFormatter::success([
            'accounts' => $allAccounts,
        ], 'Daftar akun berhasil dimuat');
    }

    public function kasMasuk(Request $request)
    {
        $rules = [
            'tanggal' => 'required|date',
            'jumlah' => 'required|numeric|min:1',
            'keterangan' => 'nullable|string',
            'kas_account_code' => 'required|string',
            'credit_account_code' => 'required|string',
        ];
        $v = Validator::make($request->all(), $rules);
        if ($v->fails()) {
            return ResponseFormatter::error('Validasi gagal', $v->errors(), 422);
        }
        $tanggal = Carbon::parse($request->tanggal)->toDateString();
        $jumlah = (float) $request->jumlah;
        $keterangan = $request->keterangan ?: 'Kas Masuk';
        $kasCode = $request->kas_account_code ?: '1101';
        $creditCode = $request->credit_account_code ?: '4103';
        try {
            $journal = DB::transaction(function () use ($tanggal, $jumlah, $keterangan, $kasCode, $creditCode) {
                return JournalEntryService::create($tanggal, $keterangan, null, 'cashbook')
                    ->addLine($kasCode, $jumlah, 0, null, null, 'Kas masuk')
                    ->addLine($creditCode, 0, $jumlah, null, null, 'Pendapatan kas masuk')
                    ->save();
            });
        } catch (\Throwable $e) {
            report($e);
            return ResponseFormatter::error('Gagal mencatat kas masuk.', null, 500);
        }
        return ResponseFormatter::success($journal, 'Kas masuk berhasil dicatat', 201);
    }

    public function kasKeluar(Request $request)
    {
        $rules = [
            'tanggal' => 'required|date',
            'jumlah' => 'required|numeric|min:1',
            'jenis_pengeluaran' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'kas_account_code' => 'required|string',
            'debit_account_code' => 'required|string',
        ];
        $v = Validator::make($request->all(), $rules);
        if ($v->fails()) {
            return ResponseFormatter::error('Validasi gagal', $v->errors(), 422);
        }
        $tanggal = Carbon::parse($request->tanggal)->toDateString();
        $jumlah = (float) $request->jumlah;
        $jenis = $request->jenis_pengeluaran ?: 'Pengeluaran';
        $keterangan = ($request->keterangan ?: 'Kas Keluar') . ($jenis ? " - $jenis" : '');
        $kasCode = $request->kas_account_code ?: '1101';
        $debitCode = $request->debit_account_code ?: '5399';
        try {
            $journal = DB::transaction(function () use ($tanggal, $jumlah, $keterangan, $kasCode, $debitCode) {
                return JournalEntryService::create($tanggal, $keterangan, null, 'cashbook')
                    ->addLine($debitCode, $jumlah, 0, null, null, 'Beban kas keluar')
                    ->addLine($kasCode, 0, $jumlah, null, null, 'Kas keluar')
                    ->save();
            });
        } catch (\Throwable $e) {
            report($e);
            return ResponseFormatter::error('Gagal mencatat kas keluar.', null, 500);
        }
        return ResponseFormatter::success($journal, 'Kas keluar berhasil dicatat', 201);
    }

    public function kasMasukHistory(Request $request)
    {
        $limit = $request->integer('limit', 50);
        $kasCode = $request->get('kas_account_code', '1101');

        try {
            $kasAccount = Account::where('kode', $kasCode)->first();
            if (!$kasAccount) {
                return ResponseFormatter::error('Akun kas tidak ditemukan', null, 404);
            }

            $journals = DB::table('journal_entries as je')
                ->join('journal_lines as jl', 'je.id', '=', 'jl.journal_entry_id')
                ->where('je.source_module', 'cashbook')
                ->where('jl.account_id', $kasAccount->id)
                ->where('jl.debit', '>', 0)
                ->whereNull('jl.subledger_type')
                ->select('je.id', 'je.date as tanggal', 'jl.debit as jumlah', 'je.description as keterangan', 'je.created_at')
                ->orderByDesc('je.date')
                ->orderByDesc('je.id')
                ->limit($limit)
                ->get();

            return ResponseFormatter::success($journals, 'History kas masuk berhasil dimuat');
        } catch (\Throwable $e) {
            report($e);
            return ResponseFormatter::error('Gagal memuat history', null, 500);
        }
    }

    public function kasKeluarHistory(Request $request)
    {
        $limit = $request->integer('limit', 50);
        $kasCode = $request->get('kas_account_code', '1101');

        try {
            $kasAccount = Account::where('kode', $kasCode)->first();
            if (!$kasAccount) {
                return ResponseFormatter::error('Akun kas tidak ditemukan', null, 404);
            }

            $journals = DB::table('journal_entries as je')
                ->join('journal_lines as jl', 'je.id', '=', 'jl.journal_entry_id')
                ->where('je.source_module', 'cashbook')
                ->where('jl.account_id', $kasAccount->id)
                ->where('jl.credit', '>', 0)
                ->whereNull('jl.subledger_type')
                ->select('je.id', 'je.date as tanggal', 'jl.credit as jumlah', 'je.description as keterangan', 'je.created_at')
                ->orderByDesc('je.date')
                ->orderByDesc('je.id')
                ->limit($limit)
                ->get();

            // Parse jenis_pengeluaran dari keterangan if available
            $journals = $journals->map(function ($j) {
                $keterangan = $j->keterangan ?? '';
                $jenis = '';
                // Extract jenis from "Kas Keluar - Jenis"
                if (preg_match('/ - (.+)$/', $keterangan, $matches)) {
                    $jenis = $matches[1];
                    $keterangan = preg_replace('/ - .+$/', '', $keterangan);
                }
                $j->jenis_pengeluaran = $jenis;
                $j->keterangan = $keterangan;
                return $j;
            });

            return ResponseFormatter::success($journals, 'History kas keluar berhasil dimuat');
        } catch (\Throwable $e) {
            report($e);
            return ResponseFormatter::error('Gagal memuat history', null, 500);
        }
    }

    public function kasPosition(Request $request)
    {
        $accountCode = $request->get('account_code', '1101');
        $asOf = $request->get('as_of');
        $yearFilter = $request->integer('year') ?: intval(date('Y'));
        $account = Account::where('kode', $accountCode)->first();
        if (! $account) {
            return ResponseFormatter::error('Akun kas tidak ditemukan', null, 404);
        }
        $balanceQuery = AccountBalance::where('company_code', 'BSKM')
            ->where('account_id', $account->id)
            ->whereNull('subledger_type')
            ->whereNull('subledger_id');

        $summary = (clone $balanceQuery)
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->first();

        $history = (clone $balanceQuery)
            ->where('year', $yearFilter)
            ->orderBy('month')
            ->get();

        // Build year view: opening carry-forward and monthly totals for kas utama
        $prevYear = $yearFilter - 1;
        $prevMainCF = AccountBalance::where('company_code', 'BSKM')
            ->where('account_id', $account->id)
            ->whereNull('subledger_type')
            ->whereNull('subledger_id')
            ->where('year', $prevYear)
            ->orderByDesc('month')
            ->first();
        $yearOpeningMain = $prevMainCF?->closing_balance ?? 0.0;

        // Collector year opening (sum Dec previous year across subledgers)
        $collectorAccount = Account::where('kode', '1102')->first();
        $yearOpeningCollector = 0.0;
        if ($collectorAccount) {
            $prevCollectorDec = AccountBalance::where('company_code', 'BSKM')
                ->where('account_id', $collectorAccount->id)
                ->where('subledger_type', 'kolektor')
                ->whereNotNull('subledger_id')
                ->where('year', $prevYear)
                ->where('month', 12)
                ->get();
            $yearOpeningCollector = $prevCollectorDec->sum('closing_balance');
        }

        // Monthly roll-up for selected year
        $monthly = [];
        $mainRunning = $yearOpeningMain;
        $collectorRunning = $yearOpeningCollector;
        for ($m = 1; $m <= 12; $m++) {
            // Main month
            $mainBalance = (clone $balanceQuery)->where('year', $yearFilter)->where('month', $m)->first();
            $mainDebit = $mainBalance?->debit_total ?? 0.0;
            $mainCredit = $mainBalance?->credit_total ?? 0.0;
            $mainOpening = $mainRunning;
            $mainClosing = round($mainOpening + $mainDebit - $mainCredit, 2);
            $mainRunning = $mainClosing;

            // Collector month aggregate
            $collectorDebit = 0.0;
            $collectorCredit = 0.0;
            if ($collectorAccount) {
                $collectorMonthRows = AccountBalance::where('company_code', 'BSKM')
                    ->where('account_id', $collectorAccount->id)
                    ->where('subledger_type', 'kolektor')
                    ->whereNotNull('subledger_id')
                    ->where('year', $yearFilter)
                    ->where('month', $m)
                    ->get(['debit_total', 'credit_total', 'closing_balance']);
                $collectorDebit = $collectorMonthRows->sum('debit_total');
                $collectorCredit = $collectorMonthRows->sum('credit_total');
            }
            $collectorOpening = $collectorRunning;
            $collectorClosing = round($collectorOpening + $collectorDebit - $collectorCredit, 2);
            $collectorRunning = $collectorClosing;

            $monthly[] = [
                'year' => $yearFilter,
                'month' => $m,
                'main' => [
                    'opening' => $mainOpening,
                    'debit' => $mainDebit,
                    'credit' => $mainCredit,
                    'closing' => $mainClosing,
                ],
                'collector' => [
                    'opening' => $collectorOpening,
                    'debit' => $collectorDebit,
                    'credit' => $collectorCredit,
                    'closing' => $collectorClosing,
                ],
                'total' => [
                    'opening' => round($mainOpening + $collectorOpening, 2),
                    'debit' => round($mainDebit + $collectorDebit, 2),
                    'credit' => round($mainCredit + $collectorCredit, 2),
                    'closing' => round($mainClosing + $collectorClosing, 2),
                ],
            ];
        }

        // Aggregate kas kolektor (mis. akun 1102) dari subledger per kolektor
        $collectorTotal = null;
        if ($collectorAccount) {
            $collectorTotal = AccountBalance::where('company_code', 'BSKM')
                ->where('account_id', $collectorAccount->id)
                ->where('subledger_type', 'kolektor')
                ->whereNotNull('subledger_id')
                ->select('year', 'month', 'closing_balance')
                ->orderByDesc('year')
                ->orderByDesc('month')
                ->get()
                ->groupBy(function ($row) {
                    return $row->year . '-' . $row->month;
                })
                ->map(function ($rows) {
                    return $rows->sum('closing_balance');
                })
                ->first();
        }

        $kasUtamaClosing = $summary?->closing_balance ?? 0.0;
        $kasKolektorClosing = $collectorTotal ?? 0.0;

        // If as_of provided, recompute balances up to specific date
        if ($asOf) {
            try {
                $date = new \DateTime($asOf);
                $year = (int)$date->format('Y');
                $month = (int)$date->format('m');
                $day = (int)$date->format('d');

                // Base opening = previous month closing for kas utama
                $prevYear = $month === 1 ? $year - 1 : $year;
                $prevMonth = $month === 1 ? 12 : $month - 1;
                $prevMain = AccountBalance::where('company_code', 'BSKM')
                    ->where('account_id', $account->id)
                    ->whereNull('subledger_type')
                    ->whereNull('subledger_id')
                    ->where('year', $prevYear)
                    ->where('month', $prevMonth)
                    ->first();
                $mainOpening = $prevMain?->closing_balance ?? 0.0;

                // Sum journal lines in current month up to as_of for kas utama
                $mainDelta = \App\Models\Keuangan\JournalLine::where('account_id', $account->id)
                    ->whereHas('journalEntry', function ($q) use ($year, $month, $day) {
                        $q->whereYear('date', $year)
                            ->whereMonth('date', $month)
                            ->whereDate('date', '<=', sprintf('%04d-%02d-%02d', $year, $month, $day));
                    })
                    ->selectRaw('COALESCE(SUM(debit),0) as debit_sum, COALESCE(SUM(credit),0) as credit_sum')
                    ->first();
                $kasUtamaClosing = round($mainOpening + ($mainDelta->debit_sum ?? 0) - ($mainDelta->credit_sum ?? 0), 2);

                // Kolektor: aggregate previous closing + current month deltas per subledger
                $collectorAccount = Account::where('kode', '1102')->first();
                $kasKolektorClosing = 0.0;
                if ($collectorAccount) {
                    // Previous month totals across subledgers
                    $prevCollectorTotals = AccountBalance::where('company_code', 'BSKM')
                        ->where('account_id', $collectorAccount->id)
                        ->where('subledger_type', 'kolektor')
                        ->whereNotNull('subledger_id')
                        ->where('year', $prevYear)
                        ->where('month', $prevMonth)
                        ->get();
                    $prevTotal = $prevCollectorTotals->sum('closing_balance');

                    // Current month deltas up to as_of
                    $collectorDelta = \App\Models\Keuangan\JournalLine::where('account_id', $collectorAccount->id)
                        ->where('subledger_type', 'kolektor')
                        ->whereNotNull('subledger_id')
                        ->whereHas('journalEntry', function ($q) use ($year, $month, $day) {
                            $q->whereYear('date', $year)
                                ->whereMonth('date', $month)
                                ->whereDate('date', '<=', sprintf('%04d-%02d-%02d', $year, $month, $day));
                        })
                        ->selectRaw('COALESCE(SUM(debit),0) as debit_sum, COALESCE(SUM(credit),0) as credit_sum')
                        ->first();
                    $kasKolektorClosing = round($prevTotal + ($collectorDelta->debit_sum ?? 0) - ($collectorDelta->credit_sum ?? 0), 2);
                }
            } catch (\Throwable $e) {
                // ignore and fallback to latest closing
            }
        }

        $totalKas = round($kasUtamaClosing + $kasKolektorClosing, 2);
        return ResponseFormatter::success([
            'summary' => $summary,
            'history' => $history,
            'account' => ['id' => $account->id, 'kode' => $account->kode, 'nama' => $account->nama],
            'collector' => [
                'account' => $collectorAccount ? ['id' => $collectorAccount->id, 'kode' => $collectorAccount->kode, 'nama' => $collectorAccount->nama] : null,
                'closing_total' => $kasKolektorClosing,
            ],
            'total_cash' => $totalKas,
            'as_of' => $asOf,
            'year' => $yearFilter,
            'year_opening' => [
                'main' => $yearOpeningMain,
                'collector' => $yearOpeningCollector,
                'total' => round($yearOpeningMain + $yearOpeningCollector, 2),
            ],
            'monthly' => $monthly,
        ], 'Posisi kas berhasil dimuat');
    }
}
