# Audit Fondasi Modul Keuangan BSKM

## Status: ✅ Fondasi Jurnal & Saldo SOLID

### Struktur Sudah Ada:

#### 1. **Models** (lengkap dengan relationships):

-   ✅ `JournalEntry` (journal_entries table)
    -   Columns: id, company_code, date, reference, description, source_module, created_by, is_canceled
    -   Relations: journal_lines(), user()
-   ✅ `JournalLine` (journal_lines table)
    -   Columns: id, journal_entry_id, account_id, debit, credit, subledger_type, subledger_id, notes
    -   Supports subledger (per-anggota, per-vendor, dll)
-   ✅ `AccountBalance` (account_balances table)
    -   Columns: id, company_code, account_id, subledger_type, subledger_id, year, month, opening_balance, debit_total, credit_total, closing_balance
    -   Supports multi-level balances (per akun / per akun+subledger)
-   ✅ `Account` (accounts table)
    -   Columns: id, company_code, kode, nama, parent_id
    -   Supports parent-child account hierarchy

#### 2. **Existing Service Pattern** (ImportIuranTanah2025Service):

-   ✅ Jelas membuat JournalEntry + JournalLines dengan pola:
    1. Debit: Akun Kas (1101)
    2. Credit: Akun Liabilitas per-anggota (2101) dengan subledger_type='anggota', subledger_id=anggota->id
-   ✅ UpdateLedger pattern:
    ```php
    $balance = AccountBalance::firstOrCreate(['company_code', 'account_id', 'year', 'month', 'subledger_type', 'subledger_id'], [...])
    $balance->debit_total += $debit;
    $balance->credit_total += $credit;
    $balance->closing_balance = opening + debit - credit;
    $balance->save();
    ```

#### 3. **Existing Transactions**:

-   ✅ Iuran (via ImportIuranTanah2025Service)
-   ⚠️ Collector Receipts (in progress - needs journal integration)

---

## Rencana Modul Keuangan (Fase 1-4)

### **Fase 1: Refactor & Extract JournalService** (PRIORITY)

**Tujuan:** Buat reusable service untuk penulisan jurnal di semua modul.

**Deliverable:**

-   `app/Services/JournalEntryService.php` dengan methods:
    -   `createJournalEntry($date, $description, $reference, $lines, $source_module, $company_code)`
    -   `createLine($account_id, $debit, $credit, $subledger_type=null, $subledger_id=null, $notes='')`
    -   `updateAccountBalances($account_id, $debit, $credit, $date, $subledger_type=null, $subledger_id=null)`

**Status:** 📋 Not Started
**Effort:** 2-3 jam

---

### **Fase 2: Kas Masuk / Kas Keluar (Cashbook)**

**Tujuan:** Form manual untuk input kas masuk/keluar yang langsung menulis ke jurnal.

**Deliverable:**

-   Controller: `CashbookController` (store kas masuk, kas keluar, show, list)
-   Vue Pages: `Kasir/KasMasuk.vue`, `Kasir/KasKeluar.vue`
-   Routes: `/kas-masuk`, `/kas-keluar`
-   Integration: Setiap input langsung create JournalEntry via JournalEntryService

**Status:** 📋 Not Started
**Effort:** 4-5 jam

---

### **Fase 3: Posisi Kas Dashboard**

**Tujuan:** Bendahara bisa melihat saldo kas realtime + drill-down ke jurnal.

**Deliverable:**

-   Controller: `KasPositionController` (getKasBalance, getKasDetails)
-   Vue Pages: `Bendahara/KasPosition.vue` (chart saldo kas per bulan, tabel detail)
-   Features: Filter periode, drill-down ke journal_entries per akun kas

**Status:** 📋 Not Started
**Effort:** 3-4 jam

---

### **Fase 4: Laporan Keuangan (P&L & Balance Sheet)**

**Tujuan:** Laporan laba-rugi dan neraca dari account_balances.

**Deliverable:**

-   Controller: `FinancialReportController` (getIncomeStatement, getBalanceSheet)
-   Vue Pages: `Bendahara/IncomeStatement.vue`, `Bendahara/BalanceSheet.vue`
-   Features: Grouping akun per jenis (revenue, expense, asset, liability, equity), comparison tahun/bulan

**Status:** 📋 Not Started
**Effort:** 5-6 jam

---

### **Fase 5: Jurnal Umum & Koreksi** (Advanced)

**Tujuan:** Form jurnal manual hanya untuk role Bendahara/Ketua (untuk koreksi & penyesuaian).

**Deliverable:**

-   Controller: `JournalManualController` (store, update, soft-delete, post/unpost)
-   Vue Page: `Bendahara/JournalManual.vue` (form multi-line journal, list, detail)
-   Features: Validation (debit=credit), audit trail (created_by, updated_by)

**Status:** 📋 Not Started
**Effort:** 4-5 jam

---

## Next Steps

1. **Integrate Collector Receipts dengan JournalService** (quick fix)

    - Update `KolektorReceiptController::store()` untuk call JournalEntryService
    - Debit: Kas (1101), Credit: Liabilitas Anggota (2101) + subledger

2. **Buat JournalEntryService** (Fase 1)

    - Extract logic dari ImportIuranTanah2025Service
    - Test dengan seeding data kecil

3. **Buat Kas Masuk/Keluar** (Fase 2)

    - Endpoint: POST `/api/v1/cashbook/kas-masuk` dan `/api/v1/cashbook/kas-keluar`
    - Integration: test dengan real journal creation

4. **Build Dashboard Kas Posisi** (Fase 3)
    - Query AccountBalance grouping by account_id, period
    - Vue component dengan chart sederhana

---

## Database State Check

Semua table yang dibutuhkan:

-   ✅ accounts (dengan chart_of_accounts)
-   ✅ journal_entries
-   ✅ journal_lines
-   ✅ account_balances
-   ✅ (linked) anggotas, iurans, collector_receipts

**Seed status:** Perlu check apakah Akun Kas (1101), Liabilitas (2101), dll sudah ada di accounts table.
