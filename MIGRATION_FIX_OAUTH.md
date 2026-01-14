# OAuth Migration Fix - Deployment Instructions

## Problem
Server remote mengalami error `Base table or view already exists: 1050 table 'oauth_auth_codes'` saat menjalankan migrasi.

## Root Cause
1. Ada "orphaned" migration records di tabel `migrations` (2025_12_10_0307 dan 2025_11_07) 
2. File migrasi untuk record-record ini sudah dihapus, tapi database record masih ada
3. Saat Laravel jalankan `php artisan migrate`, cari file tapi tidak ketemu → ERROR

## Solution Applied
- ✅ Hapus semua migrasi OAuth duplikat 2025_12_10_0307
- ✅ Buat migration baru `2025_12_10_100000_ensure_oauth_tables_exist.php` yang:
  - Check table existence sebelum create (idempotent/aman)
  - Semua 5 tabel OAuth dalam 1 file
  - Tidak drop pada rollback
- ✅ Commit: `558ef42`

## Quick Fix untuk Remote (Pilih Salah Satu)

### OPTION A: Gunakan Auto-Fix Script (RECOMMENDED)
```bash
cd /var/www/html/bskmAPI
git pull origin refactor/api-v1
bash fix-orphaned-migrations.sh
```

### OPTION B: Manual Fix
```bash
cd /var/www/html/bskmAPI
git pull origin refactor/api-v1

# Step 1: Clear caches
php artisan cache:clear
php artisan config:clear
php artisan optimize:clear

# Step 2: Delete orphaned migration records using Tinker
php artisan tinker --execute="DB::table('migrations')->where('migration', 'like', '%oauth%')->delete(); echo 'OAuth migrations deleted';"

# Step 3: Run migrations
php artisan migrate --force

# Step 4: Verify
php artisan migrate:status
```

### OPTION C: Using Tinker
```bash
php artisan tinker
# Hapus semua oauth migration records
DB::table('migrations')->where('migration', 'like', '%oauth%')->delete();
exit()

# Jalankan migrate
php artisan migrate

# Verify
php artisan migrate:status
```

## Verification Steps

```bash
# 1. Check tabel oauth ada
php artisan tinker
Schema::hasTable('oauth_auth_codes')  # harus true
Schema::hasTable('oauth_access_tokens')  # harus true
exit()

# 2. Check migration status clean
php artisan migrate:status | grep oauth  # seharusnya empty (tidak ada yang error)

# 3. Clear cache terakhir
php artisan optimize:clear
```

## Jika Masih Error
1. Cek migration file:
   ```bash
   ls -la database/migrations/2025_*oauth*
   # Harusnya hanya ada: 2025_12_10_100000_ensure_oauth_tables_exist.php
   ```

2. Cek database record:
   ```bash
   php artisan tinker
   DB::table('migrations')->where('migration', 'like', '%oauth%')->get()
   # Seharusnya empty
   exit()
   ```

3. Jika masih ada record 2025_11_07 atau 2025_12_10_0307:
   ```bash
   php artisan tinker
   DB::table('migrations')->where('migration', 'like', '2025_11_07%')->delete()
   DB::table('migrations')->where('migration', 'like', '2025_12_10_0307%')->delete()
   exit()
   ```

## Files Changed
- ❌ Deleted: `2025_12_10_030712_create_oauth_auth_codes_table.php` (dan 4 file lain)
- ✅ Created: `2025_12_10_100000_ensure_oauth_tables_exist.php` (single consolidated file)
- ✅ Created: `fix-orphaned-migrations.sh` (automated fix script)
