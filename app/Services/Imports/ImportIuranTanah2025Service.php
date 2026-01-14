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

class ImportIuranTanah2025Service
{
    protected string $companyCode = 'BSKM';

    // ref_iuran_id untuk iuran pendapatan 2025
    protected int $refIuranId = 1;

    // Akun pendapatan (bukan liabilitas)
    protected string $akunPendapatanCode = '4101'; // Or whatever income account code

    protected array $bulanMap = [
        'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
        'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER',
    ];

    public function import(string $filePath, bool $dryRun = false): array
    {
        $summary = [
            'found_anggotas' => 0,
            'created_anggotas' => 0,
            'created_iurans' => 0,
            'created_journals' => 0,
            'skipped_rows' => 0,
            'errors' => [],
            'rows_total' => 0,
        ];

        // -------------------------------------------------------------
        // 1. Read Excel (sheet ke-2)
        // -------------------------------------------------------------
        $collections = Excel::toCollection(null, $filePath);
        if ($collections->count() < 2) {
            throw new \Exception('Sheet ke-2 tidak ditemukan dalam file Excel.');
        }

        $sheet = $collections[1]; // sheet index 1 = sheet ke-2
        $rows = $sheet->slice(1); // skip header
        $summary['rows_total'] = $rows->count();

        // -------------------------------------------------------------
        // 2. Validate accounts
        // -------------------------------------------------------------
        $akunKas = Account::where('kode', '1101')->first();
        $akunPendapatan = Account::where('kode', '4101')->first();

        if (! $akunKas || ! $akunPendapatan) {
            throw new \Exception('Akun 1101 (Kas) atau 4101 (Pendapatan Iuran) tidak ditemukan.');
        }

        // ---------
        // 3. Dry-run simulation
        // ---------
        if ($dryRun) {
            foreach ($rows as $row) {
                $kode = trim((string) ($row[0] ?? ''));

                if ($kode === '') {
                    $summary['skipped_rows']++;

                    continue;
                }

                $anggota = Anggota::where('kode', $kode)->first();
                if ($anggota) {
                    $summary['found_anggotas']++;
                } else {
                    $summary['created_anggotas']++;
                }

                // hitung bulan yang > 0 (2025) - kolom F-Q (index 5-16)
                for ($i = 0; $i < 12; $i++) {
                    $jumlah = floatval($row[5 + $i] ?? 0);
                    if ($jumlah > 0) {
                        $summary['created_iurans']++;
                        $summary['created_journals']++;
                    }
                }
            }

            return $summary;
        }

        // -------------------------------------------------------------
        // 4. IMPORT REAL (transaction)
        // -------------------------------------------------------------
        DB::transaction(function () use ($rows, &$summary, $akunKas, $akunPendapatan) {

            foreach ($rows as $row) {

                $kode = trim((string) ($row[0] ?? ''));
                $nama = trim((string) ($row[1] ?? ''));
                $perumName = trim((string) ($row[2] ?? ''));
                $blok = trim((string) ($row[3] ?? ''));
                $noHp = trim((string) ($row[4] ?? ''));

                if ($kode === '') {
                    $summary['skipped_rows']++;

                    continue;
                }

                // ---------------------------------------------------------
                // ANGGOTA
                // ---------------------------------------------------------
                $anggota = Anggota::where('kode', $kode)->first();

                $anggotaBaru = false;

                if (! $anggota) {
                    if ($noHp === '') {
                        $noHp = 'NOHP-'.uniqid();
                    }

                    $anggota = Anggota::create([
                        'kode' => $kode,
                        'company_code' => $this->companyCode,
                        'nama' => $nama ?: $kode,
                        'no_hp' => $noHp,
                        'status' => 'aktif',
                        'is_dummy' => 0,
                    ]);

                    $summary['created_anggotas']++;
                    $anggotaBaru = true;

                } else {
                    $summary['found_anggotas']++;
                }

                // ---------------------------------------------------------
                // PERUM & ALAMAT (hanya untuk anggota baru)
                // ---------------------------------------------------------
                $perum = Perum::firstOrCreate(
                    ['nama' => $perumName ?: 'UNKNOWN'],
                    ['is_dummy' => 0]
                );

                if ($anggotaBaru) {
                    Alamat::create([
                        'anggota_id' => $anggota->id,
                        'perum_id' => $perum->id,
                        'no_rumah' => $blok,
                        'alamat_lainnya' => "{$perumName} {$blok}",
                        'village_id' => 13865, // default seperti import lama
                        'is_dummy' => 0,
                    ]);
                }

                // ---------------------------------------------------------
                // IURAN JAN - DES 2025 (index 5 sampai 16 = Kolom F-Q)
                // ---------------------------------------------------------
                for ($i = 0; $i < 12; $i++) {

                    $jumlah = floatval($row[5 + $i] ?? 0);
                    if ($jumlah <= 0) {
                        continue;
                    }

                    $bulanKe = $i + 1;
                    $periode = $this->bulanMap[$i];
                    $tanggalBayar = Carbon::create(2025, $bulanKe, 28)->toDateString();

                    // 1. Insert Iuran (prefix IBL = Iuran BuLanan)
                    $iuran = Iuran::create([
                        'company_code' => $this->companyCode,
                        'kode' => 'IBL-'.$kode.'-2025-'.str_pad($bulanKe, 2, '0', STR_PAD_LEFT),
                        'anggota_id' => $anggota->id,
                        'ref_iuran_id' => $this->refIuranId,
                        'jumlah' => $jumlah,
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
                        'description' => "Iuran Tanah 2025 - {$periode} - {$anggota->nama}",
                        'reference' => "IURAN#{$iuran->id}",
                        'source_module' => 'iuran',
                    ]);

                    $summary['created_journals']++;

                    // 3. Journal Lines: Kas (debit), 2101 per anggota (kredit)
                    JournalLine::insert([
                        [
                            'journal_entry_id' => $journal->id,
                            'account_id' => $akunKas->id,
                            'debit' => $jumlah,
                            'credit' => 0,
                            'subledger_type' => null,
                            'subledger_id' => null,
                            'notes' => "Penerimaan kas iuran 2025 - {$kode}",
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                        [
                            'journal_entry_id' => $journal->id,
                            'account_id' => $akunPendapatan->id,
                            'debit' => 0,
                            'credit' => $jumlah,
                            'subledger_type' => null,
                            'subledger_id' => null,
                            'notes' => "Pendapatan iuran bulanan - {$kode}",
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                    ]);

                    // 4. Ledger – kas
                    $this->updateLedger(
                        $akunKas->id,
                        $akunKas->kode,
                        $jumlah,
                        0,
                        $tanggalBayar,
                        null,
                        null
                    );

                    // 4. Ledger – pendapatan iuran (NO opening_balance for income accounts)
                    $this->updateLedger(
                        $akunPendapatan->id,
                        $akunPendapatan->kode,
                        0,
                        $jumlah,
                        $tanggalBayar,
                        null,
                        null,
                        false // Income account - no carryforward
                    );
                }
            }
        });

        // ----------------------------------------------------------------------
        // 6. RECALCULATE CARRYFORWARD (POST-IMPORT SWEEP)
        // ----------------------------------------------------------------------
        // Pastikan opening_balance tiap bulan mengambil closing bulan sebelumnya
        // untuk akun kas (1101) - akun pendapatan (4101) tidak perlu carryforward
        $this->recalculateCarryforward(['1101']);

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
        ?int $subledgerId,
        bool $withCarryforward = true  // Income accounts don't carry forward
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
        // ONLY for balance sheet accounts (assets, liabilities) - NOT for income/expense accounts
        if ($withCarryforward && $balance->opening_balance == 0) {
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
