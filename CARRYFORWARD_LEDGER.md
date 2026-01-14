# Carryforward Ledger Logic Documentation

## Overview
Semua transaksi yang mempengaruhi `account_balances` harus mengikuti logika **carryforward**: setiap bulan baru harus mewarisi `closing_balance` dari bulan sebelumnya sebagai `opening_balance` bulan baru.

## Architecture

### 1. Service Layer: JournalEntryService
**File**: `app/Services/JournalEntryService.php`

```php
public function save(): JournalEntry
{
    // Validasi double-entry
    // Create journal entry dan lines
    // Otomatis call updateAccountBalance() untuk setiap line
}

protected function updateAccountBalance(
    int $accountId,
    string $accountCode,
    float $debit,
    float $credit,
    string $date,
    ?string $subledgerType = null,
    ?int $subledgerId = null
): void
{
    // Logika carryforward:
    // 1. firstOrCreate dengan opening_balance = 0
    // 2. Jika opening_balance == 0 DAN debit/credit == 0 (record baru):
    //    - Query bulan sebelumnya
    //    - Set opening_balance = prev->closing_balance
    // 3. Tambahkan debit/credit
    // 4. Hitung ulang closing_balance = opening + debit - credit
    // 5. Save
}
```

**Digunakan oleh**:
- `CashbookController::kasMasuk()` - Kas masuk manual
- `CashbookController::kasKeluar()` - Kas keluar manual

**Kondisi carryforward**: SELALU, tanpa terkecuali

---

### 2. Controller Layer: Setoran Kolektor
**File**: `app/Http/Controllers/Api/v1/SetoranKolektorController.php`

```php
protected function updateLedger(
    string $companyCode,
    Account $account,
    float $debit,
    float $credit,
    Carbon $tanggal,
    ?string $subledgerType,
    ?int $subledgerId
): void
{
    // Logika carryforward:
    // 1. firstOrCreate dengan opening_balance = 0
    // 2. Jika opening_balance == 0 DAN debit_total == 0 DAN credit_total == 0:
    //    - Query bulan sebelumnya dengan kondisi yang sama
    //    - Set opening_balance = prev->closing_balance
    // 3. Tambahkan debit/credit
    // 4. Hitung ulang closing_balance
    // 5. Save
}
```

**Digunakan di**:
- `approve()` method → Bendahara terima setoran kolektor
- Update kas bendahara (debit) dan kas kolektor (credit)

**Kondisi carryforward**: SELALU

---

### 3. Controller Layer: Kolektor Receipt
**File**: `app/Http/Controllers/Api/v1/KolektorReceiptController.php`

```php
protected function updateLedger(
    string $companyCode,
    Account $account,
    float $debit,
    float $credit,
    Carbon $tanggal,
    ?string $subledgerType,
    ?int $subledgerId
): void
{
    // Same logic as SetoranKolektorController
    // Logika carryforward identik
}
```

**Digunakan di**:
- Kolektor terima penerimaan dari anggota
- Update kas kolektor

**Kondisi carryforward**: SELALU

---

### 4. Service Layer: Import Iuran Tanah
**File**: `app/Services/Imports/ImportIuranTanahService.php`

```php
protected function updateLedger(
    int $accountId,
    string $accountCode,
    float $debit,
    float $credit,
    string $tanggal,
    ?string $subledgerType,
    ?int $subledgerId
): void
{
    // Logika carryforward per-record saat import
    // Kemudian di-recalculate ulang di akhir import via sweep
}

protected function recalculateCarryforward(array $accountCodes): void
{
    // POST-IMPORT SWEEP (CRITICAL!)
    // Setelah seluruh import selesai, jalankan ulang carryforward
    // untuk akun tertentu agar opening_balance benar-benar akurat
    //
    // Alasan: Saat import data per-anggota, opening_balance bisa salah
    // karena masih ada transaksi anggota lain yang sedang diproses.
    // Sweep menghitung ulang dari awal untuk konsistensi.
    
    // Proses:
    // 1. Ambil semua kombinasi (subledger_type, subledger_id)
    // 2. Untuk setiap kombinasi, urut per (year, month)
    // 3. Set opening_balance = closing bulan sebelumnya
    // 4. Recalculate closing_balance
    // 5. Save
}
```

**Digunakan di**:
- `import()` method (command: `php artisan import:iuran-tanah`)
- Import dari sheet "iuran tanah" dengan saldo awal + data bulanan

**Akun yang memerlukan carryforward**:
- `1101` (Kas Bendahara) → Selalu
- `2101` (Liabilitas per anggota) → Selalu

**Akun yang TIDAK memerlukan carryforward**:
- Pendapatan (tidak disentuh oleh service ini)

**CATATAN PENTING**: Method `recalculateCarryforward()` HARUS dipanggil di akhir `import()` setelah transaction selesai, bukan during transaction, karena kita perlu data yang sudah final.

---

### 5. Service Layer: Import Iuran 2025
**File**: `app/Services/Imports/ImportIuranTanah2025Service.php`

```php
protected function updateLedger(
    int $accountId,
    string $accountCode,
    float $debit,
    float $credit,
    string $tanggal,
    ?string $subledgerType,
    ?int $subledgerId,
    bool $withCarryforward = true
): void
{
    // Parameter $withCarryforward memungkinkan selective carryforward
    // true = apply carryforward (untuk akun kas/liabilitas)
    // false = NO carryforward (untuk akun pendapatan)
}

protected function recalculateCarryforward(array $accountCodes): void
{
    // Same sweep logic sebagai ImportIuranTanahService
}
```

**Digunakan di**:
- `import()` method (command: `php artisan import:iuran2025`)
- Import dari sheet 2 dengan data bulanan saja (no opening balance)

**Akun yang memerlukan carryforward**:
- `1101` (Kas Bendahara) → Selalu

**Akun yang TIDAK memerlukan carryforward**:
- `4101` (Pendapatan Iuran Bulanan) → Pass `false` ke parameter

---

## Rules & Best Practices

### ✅ DO
1. **Selalu set `opening_balance` dari bulan sebelumnya** ketika record baru dibuat untuk bulan baru
2. **Cek kondisi**: Hanya set carryforward jika `opening_balance == 0` AND debit/credit == 0 (record baru)
3. **Hitung ulang closing** setelah menambahkan debit/credit
4. **Untuk import**: Panggil `recalculateCarryforward()` di akhir setelah semua data inserted
5. **Untuk controller**: Langsung apply carryforward saat `firstOrCreate` (tidak perlu sweep)
6. **Log carryforward** untuk debugging (optional tapi sangat membantu)

### ❌ DON'T
1. **Jangan langsung set opening_balance = 0** di setiap transaksi baru
2. **Jangan forget to recalculate closing_balance** setelah debit/credit ditambahkan
3. **Jangan lupa carryforward untuk account baru** yang ada di awal tahun atau bulan baru
4. **Jangan override opening_balance** jika record sudah memiliki transaksi
5. **Jangan panggil recalculateCarryforward() inside transaction** - harus after transaction committed

---

## When Adding New Transaction Entry Point

Jika menambah controller/service baru yang create transaksi:

```php
// Checklist:
// [ ] Apakah ada step untuk update account_balances?
// [ ] Apakah sudah set opening_balance dari bulan sebelumnya?
// [ ] Apakah sudah recalculate closing_balance?
// [ ] Apakah untuk import? Jika ya, apakah sudah panggil sweep after import?
// [ ] Apakah sudah tested untuk bulan berbeda (Jan, Feb, dll)?
// [ ] Apakah sudah tested untuk tahun berbeda (Des 2024 -> Jan 2025)?

// Gunakan salah satu approach:

// OPTION A: Use JournalEntryService (recommended untuk cashbook)
JournalEntryService::create($date, $description, $ref, 'source')
    ->addLine($accountCode1, $debit1, $credit1, $subledgerType1, $subledgerId1)
    ->addLine($accountCode2, $debit2, $credit2, $subledgerType2, $subledgerId2)
    ->save(); // Otomatis update account_balances dengan carryforward

// OPTION B: Direct updateLedger call (untuk non-journal-entry flow)
$this->updateLedger(
    $companyCode,
    $account,
    $debit,
    $credit,
    $tanggal,
    $subledgerType,
    $subledgerId
); // Pastikan method ini punya carryforward logic!

// OPTION C: Import dengan sweep (untuk bulk data)
// 1. Loop insert records
// 2. Call updateLedger($account, $debit, $credit, $date) setiap record
// 3. Setelah loop selesai, call recalculateCarryforward($accountCodes)
```

---

## Testing Checklist

Sebelum push ke production:

- [ ] Import iuran-tanah: Check Jan opening_balance = Des closing_balance
- [ ] Import iuran2025: Check Feb opening_balance = Jan closing_balance (carried forward dari iuran-tanah)
- [ ] Cashbook kas masuk: Check bulan baru punya opening_balance dari closing sebelumnya
- [ ] Cashbook kas keluar: Same as above
- [ ] Setoran kolektor: Check kas bendahara dan kas kolektor masing-masing punya carryforward
- [ ] Cross-year test: Simulasikan transaksi Des 2024 dan Jan 2025, verifikasi carry over benar

---

## Files Modified
- `app/Services/JournalEntryService.php` - `updateAccountBalance()`
- `app/Services/Imports/ImportIuranTanahService.php` - `updateLedger()` + `recalculateCarryforward()`
- `app/Services/Imports/ImportIuranTanah2025Service.php` - `updateLedger()` + `recalculateCarryforward()`
- `app/Http/Controllers/Api/v1/SetoranKolektorController.php` - `updateLedger()`
- `app/Http/Controllers/Api/v1/KolektorReceiptController.php` - `updateLedger()`
- `app/Http/Controllers/Api/v1/CashbookController.php` - Uses JournalEntryService

---

## Contact
Untuk pertanyaan lebih lanjut tentang implementasi carryforward, lihat commits:
- `823b02a` - Add recalculateCarryforward sweep to ImportIuranTanahService
- `5c68aaf` - Add recalculateCarryforward sweep to ImportIuranTanah2025Service
- `0e04b41` - Add carryforward logic to controllers
