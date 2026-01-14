<?php

namespace App\Services\Imports;

use App\Models\Keanggotaan\Alamat;
use App\Models\Keanggotaan\Anggota;
use App\Models\Keuangan\Account;
use App\Models\Keuangan\AccountBalance;
use App\Models\Keuangan\Iuran;
use App\Models\Keuangan\JournalEntry;
use App\Models\Keuangan\JournalLine;
use App\Models\Master\Perum;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ImportIuranTanahService
{
    protected string $companyCode = 'BSKM';

    protected int $refIuranId = 2;

    protected array $bulanMap = [
        'JANUARI',
        'FEBRUARI',
        'MARET',
        'APRIL',
        'MEI',
        'JUNI',
        'JULI',
        'AGUSTUS',
        'SEPTEMBER',
        'OKTOBER',
        'NOVEMBER',
        'DESEMBER',
    ];

    public function import(string $filePath, bool $dryRun = false): array
    {
        $summary = [
            'created_anggotas' => 0,
            'created_iurans' => 0,
            'created_journals' => 0,
            'skipped_rows' => 0,
            'errors' => [],
            'rows_total' => 0,
        ];

        // ----------------------------------------------------------------------
        // 1. Read Excel
        // ----------------------------------------------------------------------
        $collections = Excel::toCollection(null, $filePath);
        if ($collections->isEmpty()) {
            throw new \Exception("File Excel kosong / tidak dapat dibaca: {$filePath}");
        }

        $sheet = $collections->first();
        $rows = $sheet->slice(1);
        $summary['rows_total'] = $rows->count();

        // ----------------------------------------------------------------------
        // 2. Validate Accounts
        // ----------------------------------------------------------------------
        $akunKas = Account::where('kode', '1101')->first();
        $akun2101 = Account::where('kode', '2101')->first();

        if (! $akunKas || ! $akun2101) {
            $summary['errors'][] = 'Akun 1101 atau 2101 tidak ditemukan.';
            if (! $dryRun) {
                throw new \Exception('Akun 1101 atau 2101 tidak ditemukan.');
            }
        }

        // ----------------------------------------------------------------------
        // 3. TRUNCATE (only if not dry-run)
        // ----------------------------------------------------------------------
        if (! $dryRun) {

            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            $tables = [
                'iuran_setorans',
                'setoran_kolektors',
                'iurans',
                'journal_lines',
                'journal_entries',
                'account_balances',
                'alamats',
                'anggotas',
                'perums',
                'subledgers',
            ];

            foreach ($tables as $t) {
                DB::table($t)->truncate();
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }

        // ----------------------------------------------------------------------
        // 4. DRY RUN (simulasi tanpa insert)
        // ----------------------------------------------------------------------
        if ($dryRun) {

            foreach ($rows as $row) {

                $kode = trim((string) ($row[0] ?? ''));

                if (empty($kode)) {
                    $summary['skipped_rows']++;

                    continue;
                }

                $summary['created_anggotas']++;

                for ($i = 0; $i < 12; $i++) {
                    $colIndex = 7 + $i;
                    $jumlah = floatval($row[$colIndex] ?? 0);
                    if ($jumlah > 0) {
                        $summary['created_iurans']++;
                        $summary['created_journals']++;
                    }
                }
            }

            return $summary;
        }

        // ----------------------------------------------------------------------
        // 5. IMPORT REAL
        // ----------------------------------------------------------------------
        DB::transaction(function () use ($rows, $akunKas, $akun2101, &$summary) {

            foreach ($rows as $row) {

                $kode = trim((string) ($row[0] ?? ''));
                $nama = trim((string) ($row[1] ?? ''));
                $perumName = trim((string) ($row[2] ?? ''));
                $noRumah = trim((string) ($row[3] ?? ''));
                $noHp = trim((string) ($row[4] ?? ''));
                $saldo2024 = floatval($row[5] ?? 0);

                if (empty($kode)) {
                    $summary['skipped_rows']++;

                    continue;
                }

                // Fix UNIQUE no_hp
                if (empty($noHp)) {
                    $noHp = 'NOHP-'.uniqid();
                }

                // ------------------------------------------------------------------
                // PERUM
                // ------------------------------------------------------------------
                $perum = Perum::firstOrCreate(
                    ['nama' => $perumName ?: 'UNKNOWN'],
                    ['is_dummy' => 0]
                );

                // ------------------------------------------------------------------
                // ANGGOTA
                // ------------------------------------------------------------------
                $anggota = Anggota::create([
                    'kode' => $kode,
                    'company_code' => $this->companyCode,
                    'nama' => $nama ?: $kode,
                    'no_hp' => $noHp,
                    'status' => 'aktif',
                    'is_dummy' => 0,
                ]);

                $summary['created_anggotas']++;

                // ------------------------------------------------------------------
                // ALAMAT
                // ------------------------------------------------------------------
                Alamat::create([
                    'anggota_id' => $anggota->id,
                    'perum_id' => $perum->id,
                    'no_rumah' => $noRumah,
                    'alamat_lainnya' => trim("{$perumName} {$noRumah}"),
                    'village_id' => '13865',
                    'is_dummy' => 0,
                ]);

                // ------------------------------------------------------------------
                // OPENING BALANCE 2024
                // ------------------------------------------------------------------
                // IURAN PSEUDO UNTUK SALDO AWAL (diletakkan di Desember 2024 / periode 12)
                if ($saldo2024 > 0) {

                    // tanggal symbolic untuk saldo awal 2024 → akhir tahun 2024 (Desember)
                    $tanggalSaldoAwal = Carbon::create(2024, 12, 31)->toDateString();

                    // 1. Insert pseudo-Iuran untuk saldo awal
                    $iuranOpening = Iuran::create([
                        'company_code' => $this->companyCode,
                        'kode' => $kode.'-SALDO2024',
                        'anggota_id' => $anggota->id,
                        'ref_iuran_id' => $this->refIuranId,
                        'jumlah' => (int) $saldo2024,
                        'tanggal_bayar' => $tanggalSaldoAwal,
                        'periode_bulan' => 'DESEMBER', // ditempatkan sebagai periode bulan 12
                        'catatan' => 'Saldo awal liabilitas tahun 2024 (import)',
                        'is_dummy' => 0,
                    ]);

                    $summary['created_iurans']++;

                    // 2. Journal Entry
                    $journal = JournalEntry::create([
                        'company_code' => $this->companyCode,
                        'date' => $tanggalSaldoAwal,
                        'description' => "Saldo awal liabilitas 2024 - {$anggota->nama}",
                        'reference' => "SALDO#{$iuranOpening->id}",
                        'source_module' => 'iuran',
                    ]);

                    $summary['created_journals']++;

                    // 3. Journal Lines (kas 1101 debit, liabilitas 2101 kredit)
                    JournalLine::insert([
                        [
                            'journal_entry_id' => $journal->id,
                            'account_id' => $akunKas->id,
                            'account_code' => $akunKas->kode,
                            'subledger_type' => null,
                            'subledger_id' => null,
                            'debit' => $saldo2024,
                            'credit' => 0,
                            'notes' => "Saldo awal kas 2024 - anggota {$kode}",
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                        [
                            'journal_entry_id' => $journal->id,
                            'account_id' => $akun2101->id,
                            'account_code' => $akun2101->kode,
                            'subledger_type' => 'anggota',
                            'subledger_id' => $anggota->id,
                            'debit' => 0,
                            'credit' => $saldo2024,
                            'notes' => "Saldo awal liabilitas 2024 - anggota {$kode}",
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                    ]);

                    // 4. Ledger update (kas dan liabilitas)
                    // Kas 1101 (global, tanpa subledger)
                    $this->updateLedger(
                        $akunKas->id,
                        $akunKas->kode,
                        $saldo2024,
                        0,
                        $tanggalSaldoAwal,
                        null,
                        null
                    );

                    // Liabilitas 2101 per anggota
                    $this->updateLedger(
                        $akun2101->id,
                        $akun2101->kode,
                        0,
                        $saldo2024,
                        $tanggalSaldoAwal,
                        'anggota',
                        $anggota->id
                    );
                }

                // ------------------------------------------------------------------
                // IURAN JAN–DES (kolom 7–18)
                // ------------------------------------------------------------------
                for ($i = 0; $i < 12; $i++) {

                    $colIndex = 7 + $i;
                    $jumlah = floatval($row[$colIndex] ?? 0);

                    if ($jumlah <= 0) {
                        continue;
                    }

                    $bulanKe = $i + 1;
                    $periode = ucfirst(strtolower($this->bulanMap[$i]));
                    $tanggalBayar = Carbon::create(2025, $bulanKe, 28)->toDateString();

                    // 1. Insert Iuran
                    $iuran = Iuran::create([
                        'company_code' => $this->companyCode,
                        'kode' => $kode.'-2025-'.str_pad($bulanKe, 2, '0', STR_PAD_LEFT),
                        'anggota_id' => $anggota->id,
                        'ref_iuran_id' => $this->refIuranId,
                        'jumlah' => (int) $jumlah,
                        'tanggal_bayar' => $tanggalBayar,
                        'periode_bulan' => $periode,
                        'catatan' => "Import Excel Iuran Tanah 2025 ($periode)",
                        'is_dummy' => 0,
                    ]);

                    $summary['created_iurans']++;

                    // 2. Journal Entry
                    $journal = JournalEntry::create([
                        'company_code' => $this->companyCode,
                        'date' => $tanggalBayar,
                        'description' => "Iuran Tanah Makam Thp I - $periode - {$anggota->nama}",
                        'reference' => "IURAN#{$iuran->id}",
                        'source_module' => 'iuran',
                    ]);

                    $summary['created_journals']++;

                    // 3. Journal Lines (dengan account_code & subledger)
                    JournalLine::insert([
                        [
                            'journal_entry_id' => $journal->id,
                            'account_id' => $akunKas->id,
                            'account_code' => $akunKas->kode,
                            'subledger_type' => null,
                            'subledger_id' => null,
                            'debit' => $jumlah,
                            'credit' => 0,
                            'notes' => "Penerimaan kas iuran tanah - {$kode}",
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                        [
                            'journal_entry_id' => $journal->id,
                            'account_id' => $akun2101->id,
                            'account_code' => $akun2101->kode,
                            'subledger_type' => 'anggota',
                            'subledger_id' => $anggota->id,
                            'debit' => 0,
                            'credit' => $jumlah,
                            'notes' => "Kewajiban iuran tanah - anggota {$kode}",
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                    ]);

                    // Ledger — Kas
                    $this->updateLedger(
                        $akunKas->id,
                        $akunKas->kode,
                        $jumlah,
                        0,
                        $tanggalBayar,
                        null,
                        null
                    );

                    // Ledger — 2101 per anggota
                    $this->updateLedger(
                        $akun2101->id,
                        $akun2101->kode,
                        0,
                        $jumlah,
                        $tanggalBayar,
                        'anggota',
                        $anggota->id
                    );
                }
            }
        });

        // ----------------------------------------------------------------------
        // 6. RECALCULATE CARRYFORWARD (POST-IMPORT SWEEP)
        // ----------------------------------------------------------------------
        // Pastikan opening_balance tiap bulan mengambil closing bulan sebelumnya
        // untuk akun kas (1101) dan liabilitas per-anggota (2101)
        $this->recalculateCarryforward(['1101', '2101']);

        return $summary;
    }

    // =====================================================================
    // LEDGER
    // =====================================================================
    protected function updateLedger(
        int $accountId,
        string $accountCode,
        float $debit,
        float $credit,
        string $tanggal,
        ?string $subledgerType,
        ?int $subledgerId
    ): void {

        $year = intval(date('Y', strtotime($tanggal)));
        $month = intval(date('m', strtotime($tanggal)));

        $where = [
            'company_code' => $this->companyCode,
            'account_id' => $accountId,
            'account_code' => $accountCode,
            'year' => $year,
            'month' => $month,
            'subledger_type' => $subledgerType,
            'subledger_id' => $subledgerId,
        ];

        $balance = AccountBalance::firstOrCreate(
            $where,
            [
                'opening_balance' => 0,
                'debit_total' => 0,
                'credit_total' => 0,
                'closing_balance' => 0,
            ]
        );

        // Initialize opening balance from previous month's closing if not yet set
        if ($balance->opening_balance == 0) {
            $prevYear = $month === 1 ? $year - 1 : $year;
            $prevMonth = $month === 1 ? 12 : $month - 1;
            $prev = AccountBalance::where('company_code', $this->companyCode)
                ->where('account_id', $accountId)
                ->where('account_code', $accountCode)
                ->where('year', $prevYear)
                ->where('month', $prevMonth)
                ->where('subledger_type', $subledgerType)
                ->where('subledger_id', $subledgerId)
                ->first();
            if ($prev) {
                $balance->opening_balance = $prev->closing_balance;
                // DEBUG: Log the carryforward
                \Log::info("Carryforward: Year=$year Month=$month Account=$accountCode: Setting opening_balance={$prev->closing_balance}");
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

    // =====================================================================
    // RECALCULATE CARRYFORWARD (POST-IMPORT SWEEP)
    // =====================================================================
    /**
     * Recalculate opening_balance dan closing_balance untuk akun tertentu
     * setelah seluruh import selesai. Ini memastikan setiap bulan membawa
     * saldo dari bulan sebelumnya dengan benar.
     *
     * @param  array  $accountCodes  Kode akun yang perlu di-recalculate (contoh: ['1101'])
     */
    protected function recalculateCarryforward(array $accountCodes): void
    {
        foreach ($accountCodes as $accountCode) {
            // Ambil semua kombinasi unik (subledger_type, subledger_id) untuk akun ini
            $groups = AccountBalance::where('company_code', $this->companyCode)
                ->where('account_code', $accountCode)
                ->select('subledger_type', 'subledger_id')
                ->distinct()
                ->get();

            foreach ($groups as $group) {
                // Ambil semua balance untuk grup ini, urut berdasarkan tahun dan bulan
                $balances = AccountBalance::where('company_code', $this->companyCode)
                    ->where('account_code', $accountCode)
                    ->where('subledger_type', $group->subledger_type)
                    ->where('subledger_id', $group->subledger_id)
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();

                $prevClosing = 0;

                foreach ($balances as $balance) {
                    // Set opening_balance dari closing bulan sebelumnya
                    $balance->opening_balance = $prevClosing;

                    // Recalculate closing_balance
                    $balance->closing_balance =
                        $balance->opening_balance +
                        $balance->debit_total -
                        $balance->credit_total;

                    $balance->save();

                    // Simpan closing untuk bulan berikutnya
                    $prevClosing = $balance->closing_balance;
                }
            }
        }

        \Log::info('Carryforward recalculated for accounts: '.implode(', ', $accountCodes));
    }
}
