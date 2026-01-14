# Cash Position Fix - Instructions

## Problem
Posisi kas (cash position) shows 0 or incorrect amount after importing iuran data.

## Root Cause
Journal entries were created but NOT posted. The `kasPosition` endpoint calculates totals from `AccountBalance` records which are only generated when journals are posted.

## Solution

### Option 1: Re-Import (Recommended)
If you haven't imported yet, pull latest code and import fresh:

```bash
# Pull latest fixes
git pull origin refactor/api-v1

# Run import - journals will now auto-post
php artisan import:iuran2025 /path/to/file.xlsx
# or
php artisan import:iuran /path/to/file.xlsx
```

### Option 2: Fix Existing Data
If you already imported data before fix was deployed:

```bash
# Pull latest code
git pull origin refactor/api-v1

# Post all pending journals
php artisan journal:post-pending --source_module=iuran

# Or post ALL pending journals (if applicable)
php artisan journal:post-pending
```

Then verify in UI:
- Navigate to "Posisi Kas" (Cash Position)
- Should show sum of kas utama (1101) + kas kolektor (1102)
- After 20M+ iuran import, should show at least 20M

## What Changed

**Import Services** (now auto-post journals):
- `ImportIuranTanah2025Service.php` - Auto-posts 2025 import
- `ImportIuranTanahService.php` - Auto-posts older imports

**New Command**:
- `journal:post-pending` - Fix existing un-posted journals

## Verification

Check cash position is calculating correctly:

```bash
# Via API
curl https://bskm.warga007.com/api/v1/kasPosition

# Expected response includes:
# "total_cash": 20000000 (or your imported amount)
```

## Files Modified
- `app/Services/Imports/ImportIuranTanah2025Service.php`
- `app/Services/Imports/ImportIuranTanahService.php`
- `app/Console/Commands/PostPendingJournals.php` (new)

## Questions?
Check commits:
- `9b47e9a`: ImportIuranTanah2025Service fix
- `c963840`: ImportIuranTanahService fix
- `494794c`: New PostPendingJournals command
