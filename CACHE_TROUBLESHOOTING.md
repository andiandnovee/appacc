# Troubleshooting: Journal Page Not Loading Header & Sidebar

## Problem
1. Header tidak tampil
2. Sidebar tidak tampil  
3. Pencarian filter akun tidak berfungsi

## Root Causes

### 1. Browser Cache Issue
Setelah build dan deploy, browser cache lama masih digunakan. JavaScript assets baru belum di-load.

### 2. Service Worker Cache
Jika menggunakan PWA/Service Worker, cache lama mungkin masih aktif.

## Solutions

### Solution A: Hard Refresh Browser (User Side)

**Chrome/Edge:**
- `Ctrl + Shift + Delete` → Clear browsing data
- Pilih "Cached images and files" dan "Cookies and other site data"
- Clear Data

**Chrome/Edge (Alternative):**
- Press `Ctrl + Shift + R` (Hard refresh)

**Firefox:**
- `Ctrl + Shift + Delete` → Clear Recent History
- Pilih "Everything"
- Details: pilih "Cookies" dan "Cache"
- Clear Now

**Safari:**
- Menu → Preferences → Privacy
- Click "Manage Website Data"
- Cari domain dan delete
- Or: `Cmd + Option + E` (Empty Cache)

### Solution B: Server Side Cache Clear (Admin)

```bash
cd /var/www/html/bskmAPI

# Clear Laravel cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear

# Clear browser cache headers
php artisan config:cache

# Restart queue if needed
php artisan queue:restart
```

### Solution C: Unregister Service Worker (User Side)

1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Click "Unregister" untuk domain bskm.warga007.com
4. Hard refresh page

### Solution D: Manually Verify Assets Loaded

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check if files in `public/spa/assets/` are loading with status 200
5. Look for `index-*.js` (should be ~265KB gzipped)
6. If seeing old hash like `index-BShEHJte.js`, cache not cleared

## What Was Fixed

Latest build (commit deeba7f) includes:
- ✅ Journal Index component API response parsing
- ✅ Account dropdown setTimeout error
- ✅ Proper null checks

## Verification Steps

1. After clearing cache, reload: https://bskm.warga007.com/accounting/journal
2. Check DevTools Console (F12) for errors
3. Should see:
   - ✅ Header with logo and user menu
   - ✅ Sidebar with menu items
   - ✅ Search box and filters visible
   - ✅ Account dropdown filter functional

## If Still Not Working

1. Check Network tab - are assets loading?
   - Look for 404 errors on assets
   - Check Content-Type headers
   
2. Check Console for JS errors
   - Any red errors?
   - Check error message

3. Verify on different browser
   - Try Chrome, Firefox, Edge
   - Try Incognito/Private mode

4. Check server .htaccess
   - Make sure SPAs route to index.html correctly
   - Check `public/.htaccess` exists and configured

## Quick Checklist

- [ ] User cleared browser cache (Ctrl+Shift+Del or Cmd+Shift+Delete)
- [ ] User hard refreshed (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Checked DevTools Network tab for 200 status
- [ ] No JS errors in DevTools Console
- [ ] Tried different browser/incognito mode
- [ ] Assets hash in Network tab matches latest (index-CmzGYqfV.js)
