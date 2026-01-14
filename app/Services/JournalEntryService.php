<?php

namespace App\Services;

use App\Models\Keuangan\Account;
use App\Models\Keuangan\AccountBalance;
use App\Models\Keuangan\JournalEntry;
use App\Models\Keuangan\JournalLine;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * JournalEntryService
 *
 * Centralized service for creating journal entries with double-entry accounting.
 * Handles:
 * - Journal entry creation with automatic transaction support
 * - Journal lines (debit/credit) with subledger support (anggota, vendor, etc.)
 * - Account balance updates (monthly closing balances)
 * 
 * Pattern: Debit/Credit with optional subledger_type and subledger_id for:
 *   - subledger_type='anggota', subledger_id=anggota_id (per-member tracking)
 *   - subledger_type='vendor', subledger_id=vendor_id (per-vendor tracking)
 *   - null subledger (main account only)
 */
class JournalEntryService
{
    protected string $companyCode = 'BSKM';
    protected array $lines = [];
    protected ?string $sourceModule = null;
    protected array $entryData = [];

    /**
     * Create a new journal entry builder
     * 
     * @param string $date          Transaction date (Y-m-d format)
     * @param string $description   Journal description
     * @param string $reference     Reference (e.g., "IURAN#123", "RECEIPT#456")
     * @param string|null $sourceModule Source module ('iuran', 'kolektor', 'cashbook', etc.)
     * @return self
     */
    public function createEntry(
        string $date,
        string $description,
        string $reference,
        ?string $sourceModule = null
    ): self {
        $this->sourceModule = $sourceModule;
        $this->lines = [];

        // Validate date format
        if (!Carbon::createFromFormat('Y-m-d', $date)) {
            throw new \InvalidArgumentException("Invalid date format. Expected Y-m-d, got: {$date}");
        }

        // Store entry metadata for later creation
        $this->entryData = [
            'company_code' => $this->companyCode,
            'date' => $date,
            'description' => $description,
            'reference' => $reference,
            'source_module' => $sourceModule,
            'created_by' => null,
        ];

        return $this;
    }

    /**
     * Add a journal line (debit or credit)
     * 
     * @param string|int $accountCodeOrId Account code (e.g., '1101') or account ID
     * @param float $debit                Debit amount (0 if credit)
     * @param float $credit               Credit amount (0 if debit)
     * @param string|null $subledgerType  Subledger type ('anggota', 'vendor', etc.)
     * @param int|null $subledgerId       Subledger ID (anggota_id, vendor_id, etc.)
     * @param string|null $notes          Optional notes for the line
     * @return self
     */
    public function addLine(
        $accountCodeOrId,
        float $debit = 0,
        float $credit = 0,
        ?string $subledgerType = null,
        ?int $subledgerId = null,
        ?string $notes = null
    ): self {
        // Resolve account
        $account = $this->resolveAccount($accountCodeOrId);

        // Validate debit/credit
        if ($debit > 0 && $credit > 0) {
            throw new \InvalidArgumentException(
                "Account {$account->kode}: Cannot have both debit ({$debit}) and credit ({$credit}) > 0"
            );
        }

        if ($debit < 0 || $credit < 0) {
            throw new \InvalidArgumentException(
                "Account {$account->kode}: Debit and credit must be >= 0"
            );
        }

        $this->lines[] = [
            'account_id' => $account->id,
            'account_code' => $account->kode,
            'debit' => round($debit, 2),
            'credit' => round($credit, 2),
            'subledger_type' => $subledgerType,
            'subledger_id' => $subledgerId,
            'notes' => $notes,
        ];

        return $this;
    }

    /**
     * Save the journal entry and all lines to database
     * Automatically updates account balances and validates double-entry principle
     * 
     * @return JournalEntry The created journal entry
     * @throws \Exception If validation fails
     */
    public function save(): JournalEntry
    {
        if (empty($this->lines)) {
            throw new \Exception("Cannot save journal entry without any lines");
        }

        // Validate double-entry (debit total == credit total)
        $totalDebit = collect($this->lines)->sum('debit');
        $totalCredit = collect($this->lines)->sum('credit');

        if (abs($totalDebit - $totalCredit) > 0.01) {
            throw new \Exception(
                "Journal entry does not balance. Total debit: {$totalDebit}, Total credit: {$totalCredit}"
            );
        }

        return DB::transaction(function () {
            // 1. Create journal entry
            $journal = JournalEntry::create($this->entryData);

            // 2. Create journal lines and update balances
            foreach ($this->lines as $line) {
                JournalLine::create([
                    'journal_entry_id' => $journal->id,
                    'account_id' => $line['account_id'],
                    'debit' => $line['debit'],
                    'credit' => $line['credit'],
                    'subledger_type' => $line['subledger_type'],
                    'subledger_id' => $line['subledger_id'],
                    'notes' => $line['notes'],
                ]);

                // 3. Update account balance (monthly)
                $this->updateAccountBalance(
                    $line['account_id'],
                    $line['account_code'],
                    $line['debit'],
                    $line['credit'],
                    $this->entryData['date'],
                    $line['subledger_type'],
                    $line['subledger_id']
                );
            }

            return $journal;
        });
    }

    /**
     * Update the monthly account balance for a specific account
     * Formula: closing_balance = opening_balance + debit_total - credit_total
     * 
     * @param int $accountId         Account ID
     * @param string $accountCode    Account code for reference
     * @param float $debit          Debit amount to add
     * @param float $credit         Credit amount to add
     * @param string $date          Transaction date (Y-m-d)
     * @param string|null $subledgerType  Subledger type
     * @param int|null $subledgerId       Subledger ID
     */
    protected function updateAccountBalance(
        int $accountId,
        string $accountCode,
        float $debit,
        float $credit,
        string $date,
        ?string $subledgerType = null,
        ?int $subledgerId = null
    ): void {
        $year = intval(date('Y', strtotime($date)));
        $month = intval(date('m', strtotime($date)));

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
        if ($balance->opening_balance == 0 && $balance->debit_total == 0 && $balance->credit_total == 0) {
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

        // Add to totals
        $balance->debit_total += $debit;
        $balance->credit_total += $credit;

        // Recalculate closing balance
        $balance->closing_balance = round(
            ($balance->opening_balance ?? 0) + $balance->debit_total - $balance->credit_total,
            2
        );

        $balance->save();
    }

    /**
     * Resolve account by code or ID
     * 
     * @param string|int $codeOrId Account code or ID
     * @return Account
     * @throws \Exception
     */
    protected function resolveAccount($codeOrId): Account
    {
        if (is_numeric($codeOrId)) {
            $account = Account::find($codeOrId);
        } else {
            $account = Account::where('kode', $codeOrId)->first();
        }

        if (!$account) {
            throw new \Exception("Account not found: {$codeOrId}");
        }

        return $account;
    }

    /**
     * Static helper to create entry quickly
     * 
     * Usage:
     *   JournalEntryService::create('2025-01-15', 'Penerimaan kas iuran', 'IURAN#123', 'iuran')
     *       ->addLine('1101', 100000)  // Debit Kas
     *       ->addLine('2101', 0, 100000, 'anggota', 5)  // Credit Liabilitas (anggota #5)
     *       ->save();
     */
    public static function create(
        string $date,
        string $description,
        ?string $reference = null,
        ?string $sourceModule = null
    ): self {
        return (new self())->createEntry($date, $description, $reference, $sourceModule);
    }
}
