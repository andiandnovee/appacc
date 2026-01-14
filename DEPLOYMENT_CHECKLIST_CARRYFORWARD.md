# Production Deployment Checklist

## Branch: refactor/api-v1
**Last Commit**: `2d0d5e3` - docs: add carryforward ledger logic documentation

## Changes Summary

### Bug Fixes
1. **Added `recalculateCarryforward()` sweep to ImportIuranTanahService** (commit `823b02a`)
   - Fixes incorrect opening_balance for account 1101 (kas) and 2101 (liability)
   - Post-import sweep ensures all months have correct carryforward

2. **Added `recalculateCarryforward()` sweep to ImportIuranTanah2025Service** (commit `5c68aaf`)
   - Consistency with ImportIuranTanahService
   - Ensures account 1101 carryforward works correctly

3. **Added carryforward logic to SetoranKolektorController & KolektorReceiptController** (commit `0e04b41`)
   - Both controllers now properly initialize opening_balance from previous month
   - Consistent with JournalEntryService behavior

### Documentation
4. **Created CARRYFORWARD_LEDGER.md** (commit `2d0d5e3`)
   - Comprehensive guide for carryforward implementation
   - Reference for future code modifications

---

## Pre-Deployment Testing (LOCAL)

```bash
# 1. Test import iuran-tanah
php artisan import:iuran-tanah "IURAN_TANAH_2025_SYNC_FINAL_MATCHED_IMPORT2.xlsx"
php check_balances.php
# Expected: Jan 2025 opening = 23,224,000

# 2. Test import iuran2025
php artisan import:iuran2025 "IURAN_TANAH_2025_SYNC_FINAL_MATCHED_IMPORT2.xlsx"
php check_balances.php
# Expected: Total kas ~ 27,134,000 (cumulative with carryforward)

# 3. Test API endpoints
curl -X POST http://localhost:8000/api/v1/cashbook/kas-masuk \
  -H "Content-Type: application/json" \
  -d '{"tanggal":"2025-01-15","jumlah":100000,"kas_account_code":"1101","credit_account_code":"4103"}'
# Expected: Account balance updated with carryforward

# 4. Verify syntax
php artisan route:list | grep -E "(cashbook|iuran|setoran)"
```

---

## Production Deployment Steps

### On bskm.warga007.com (or target server)

```bash
cd /var/www/html/bskmAPI

# 1. Backup current branch
git branch backup/before-carryforward
git stash

# 2. Update to latest
git fetch origin
git checkout refactor/api-v1
git pull origin refactor/api-v1

# 3. Verify files changed
git diff HEAD~5 --name-only
# Should show:
#   app/Services/Imports/ImportIuranTanahService.php
#   app/Services/Imports/ImportIuranTanah2025Service.php
#   app/Http/Controllers/Api/v1/SetoranKolektorController.php
#   app/Http/Controllers/Api/v1/KolektorReceiptController.php
#   CARRYFORWARD_LEDGER.md

# 4. Clear caches
php artisan route:clear
php artisan config:clear
php artisan cache:clear

# 5. Run tests (if available)
php artisan test

# 6. Verify endpoints are working
curl -s http://bskm.warga007.com/api/v1/kas-position | jq .

# 7. Monitor logs
tail -f storage/logs/laravel.log
```

---

## Risk Assessment

### Low Risk Changes
- ✅ Bug fix in import services (data consistency)
- ✅ Controller updates (business logic improvement)
- ✅ Documentation additions (non-breaking)

### What Could Go Wrong
- ❌ If carryforward logic fails silently, opening_balance could be 0
  - **Mitigation**: Check `check_balances.php` output before declaring success
- ❌ If multiple imports run simultaneously, carryforward sweep could conflict
  - **Mitigation**: Only run imports one at a time via command

### Rollback Plan
```bash
git checkout backup/before-carryforward
php artisan config:clear
# Redeploy previous version
```

---

## Post-Deployment Verification

1. **Check kas position endpoint** (should show cumulative total)
   ```
   GET /api/v1/kas-position
   Expected: total_kas ≈ 27,134,000 (or latest from last import)
   ```

2. **Verify account balances table**
   ```sql
   SELECT month, opening_balance, debit_total, closing_balance
   FROM account_balances
   WHERE account_code = '1101' AND year = 2025
   ORDER BY month;
   -- Jan opening should equal Dec 2024 closing
   ```

3. **Test manual kas masuk/keluar**
   - Create kas masuk for Jan 2025
   - Check opening_balance is carried from Dec 2024

4. **Monitor error logs** for 24 hours
   ```bash
   grep -i "carryforward\|account_balance\|error" storage/logs/laravel.log
   ```

---

## Documentation Files
- `CARRYFORWARD_LEDGER.md` - Implementation guide
- `DEPLOYMENT_CHECKLIST.md` - This file

---

## Deployment By
Date: 2025-12-09
Branch: `refactor/api-v1`
Commits: 4 code fixes + 1 documentation
