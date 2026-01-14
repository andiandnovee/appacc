# 🔧 HTACCESS CONFIGURATION GUIDE - ROOT & PUBLIC

## ⚠️ CRITICAL INFO

Your hosting structure:
```
/home/wargacom/bskm.warga007.com/          ← Root document (public folder)
  ├── .htaccess                            ← ROOT .htaccess (MOST IMPORTANT)
  ├── public/
  │   ├── index.php                        ← Laravel entry point
  │   ├── .htaccess                        ← PUBLIC .htaccess (fallback)
  │   └── spa/
  │       ├── index.html                   ← SPA entry point
  │       └── assets/                      ← Static files (JS, CSS, etc)
```

⚠️ **IMPORTANT:** Root `.htaccess` must be correctly configured. If it's not working:
1. Check if `/public/spa/assets/` folder actually exists with files
2. Verify `RewriteBase /` is set in root `.htaccess`
3. Ensure `RewriteCond %{REQUEST_FILENAME} -f [OR] -d` is FIRST rule to skip existing files
4. Check Apache error logs for rewrite errors

## 📋 DEPLOYMENT STEPS

### Step 1: Root Level `.htaccess`
Location: `/home/wargacom/bskm.warga007.com/.htaccess`

This handles routing from the root:
- `/api/*` → `/public/index.php` (Laravel API)
- `/auth/*` → `/public/index.php` (Laravel Auth)
- `/assets/*` → `/public/spa/assets/` (Static files)
- Everything else → `/public/spa/index.html` (SPA)

**Copy content from `.htaccess.root` file:**
```bash
cat .htaccess.root > /home/wargacom/bskm.warga007.com/.htaccess
```

### Step 2: Public Level `.htaccess`
Location: `/home/wargacom/bskm.warga007.com/public/.htaccess`

This is backup/secondary routing if `/public` accessed directly.

**Copy content from `public/.htaccess.new` file:**
```bash
cat public/.htaccess.new > /home/wargacom/bskm.warga007.com/public/.htaccess
```

### Step 3: Verify Apache Modules
Make sure these modules are enabled on your hosting:
```bash
# Check with hosting provider if these are enabled:
- mod_rewrite (CRITICAL)
- mod_negotiation (optional)
- mod_headers (optional)
```

### Step 4: Clear Everything
```bash
cd /home/wargacom/bskm.warga007.com

# Clear Laravel cache
php artisan cache:clear
php artisan config:clear
rm -rf bootstrap/cache/routes-*.php

# Clear browser cache (hard refresh)
# Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

### Step 5: Test
```bash
# Test API endpoint (should return JSON, not HTML)
curl -I https://bskm.warga007.com/api/test
# Expected: 404 or application/json, NOT text/html

# Test SPA asset (should return JavaScript)
curl -I https://bskm.warga007.com/assets/index-Ck9eUAJl.js
# Expected: Content-Type: application/javascript, NOT text/html

# Test SPA page (should return HTML)
curl -I https://bskm.warga007.com/dashboard
# Expected: Content-Type: text/html
```

## 🔍 HTACCESS ROUTING LOGIC

### Root `.htaccess` (`/home/wargacom/bskm.warga007.com/.htaccess`)
```
Request: /api/users
  ↓ Matches: RewriteCond %{REQUEST_URI} ^/api(/|$)
  ↓ Rewrite: /api/users → /public/index.php
  ↓ Laravel handles API

Request: /auth/login
  ↓ Matches: RewriteCond %{REQUEST_URI} ^/auth(/|$)
  ↓ Rewrite: /auth/login → /public/index.php
  ↓ Laravel handles Auth

Request: /assets/bundle.js
  ↓ Matches: RewriteCond %{REQUEST_URI} ^/assets(/|$)
  ↓ Rewrite: /assets/bundle.js → /public/spa/assets/bundle.js
  ↓ File served from /public/spa/assets/

Request: /dashboard
  ↓ No match → Default rule
  ↓ Rewrite: /dashboard → /public/spa/index.html
  ↓ SPA serves index.html (frontend routing)
```

### Public `.htaccess` (`/home/wargacom/bskm.warga007.com/public/.htaccess`)
```
Request: /api/users (if accessed via /public/api/users)
  ↓ Matches: RewriteCond %{REQUEST_URI} ^/api
  ↓ Rewrite: /api/users → /public/index.php
  ↓ Laravel API

Request: /assets/bundle.js
  ↓ File exists in /spa/assets/
  ↓ Served directly (RewriteCond %{REQUEST_FILENAME} -f)

Request: /dashboard
  ↓ File doesn't exist
  ↓ Rewrite: /dashboard → /spa/index.html
  ↓ SPA serves page
```

## ⚠️ TROUBLESHOOTING

### Issue: Assets still return HTML (Content-Type: text/html)

**Solution 1: Check if .htaccess is active**
```bash
# Create test file
echo "Test" > /home/wargacom/bskm.warga007.com/test.txt

# Check if you can access it
curl https://bskm.warga007.com/test.txt
# If returns 403/404 → .htaccess is working
# If returns "Test" → .htaccess works

rm /home/wargacom/bskm.warga007.com/test.txt
```

**Solution 2: Check if mod_rewrite is enabled**
```bash
# Contact hosting provider to enable mod_rewrite
# Or create info.php to check:
# echo '<?php phpinfo(); ?>' > /home/wargacom/bskm.warga007.com/public/info.php
# Visit https://bskm.warga007.com/info.php and search "mod_rewrite"
```

**Solution 3: Check .htaccess syntax**
```bash
# Validate .htaccess with online validator
# https://htaccess.madewithlove.com/

# Or manually check:
cat /home/wargacom/bskm.warga007.com/.htaccess | grep -n "RewriteRule"
# Should show clean rules
```

### Issue: API returns 404 instead of JSON

**Solution: Check Laravel routes**
```bash
cd /home/wargacom/bskm.warga007.com

# Check if routes file has API routes
grep -r "Route::get" routes/api.php | head -5

# Clear route cache
php artisan route:cache --clear
```

### Issue: Page blank after fix

**Solution: Check if SPA is built**
```bash
ls -la /home/wargacom/bskm.warga007.com/public/spa/
# Should show: index.html and assets/ folder

# If empty, rebuild:
npm run build
```

## ✅ VALIDATION CHECKLIST

- [ ] `.htaccess` copied to root folder (`/home/wargacom/bskm.warga007.com/`)
- [ ] Root `.htaccess` has RewriteEngine On
- [ ] Root `.htaccess` routes /api/* and /auth/* to public/index.php
- [ ] Root `.htaccess` routes /assets/* to public/spa/assets/
- [ ] Root `.htaccess` defaults to public/spa/index.html
- [ ] `public/.htaccess` also updated (as fallback)
- [ ] Laravel cache cleared: `php artisan cache:clear`
- [ ] Route cache cleared: `php artisan route:cache --clear`
- [ ] `public/spa/` folder exists with `index.html` and `assets/`
- [ ] mod_rewrite enabled on hosting
- [ ] Browser cache cleared (Ctrl+Shift+R)

## 📞 SUPPORT

If issues persist after all steps:

1. **Check Apache error log** (ask hosting provider):
   ```
   /var/log/apache2/error.log
   or
   /home/wargacom/logs/error.log
   ```

2. **Check Apache access log**:
   ```
   Look for 404 errors for /assets/* requests
   ```

3. **Contact hosting provider with these details**:
   - mod_rewrite is enabled ✓
   - .htaccess files in place ✓
   - Need help with RewriteRule syntax

---

**Status:** `.htaccess` configuration ready for manual deployment
**Files:** `.htaccess.root` and `public/.htaccess.new` provided
**Next:** Copy content to production and test with curl
