# 🚀 HOTFIX DEPLOYMENT - SPA Blank Page Issue

## Problem
Halaman `bskm.warga007.com` blank setelah update mobile layout karena assets (JS/CSS) tidak serve dengan benar.

**Root Cause:** `.htaccess` rules tidak properly handling `/assets/*` requests

## Solution
Updated `.htaccess` untuk properly serve SPA assets dari folder `/spa/assets/`

## Deployment Steps

### Option 1: SSH into Production & Run Deploy Script (Recommended)
```bash
# SSH ke production server
ssh your-hosting-account@bskm.warga007.com

# Navigate to project
cd /home/wargacom/bskm.warga007.com

# Pull latest code
git pull origin refactor/api-v1

# Run full deploy
bash deploy.sh
```

### Option 2: Manual Deployment
```bash
# 1. SSH ke production
ssh your-hosting-account@bskm.warga007.com
cd /home/wargacom/bskm.warga007.com

# 2. Pull latest code (includes .htaccess fix)
git pull origin refactor/api-v1

# 3. Build Vue SPA if needed
npm ci
npm run build

# 4. Clear Laravel cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# 5. Fix permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Option 3: Quick .htaccess Only Fix
If you can't run full deploy, just copy `.htaccess` manually:

1. Download `/public/.htaccess` from this repo
2. Upload to production `/wargacom/home/bskm.warga007.com/public/.htaccess`
3. Clear browser cache and reload

## Verification

After deployment, verify assets are served correctly:

```bash
# Should return 200 OK with JavaScript content (not HTML)
curl -I https://bskm.warga007.com/assets/index-Ck9eUAJl.js

# Should show application/javascript content-type
curl -s https://bskm.warga007.com/assets/index-Ck9eUAJl.js | head -c 100
```

Expected: JavaScript code (not HTML), Content-Type: `application/javascript`

## Files Changed
- `public/.htaccess` - Added explicit asset serving rules
- `routes/web.php` - Reverted temporary change

## Commits Affected
- `f46ff86` - fix: improve .htaccess to properly serve SPA assets from /spa/assets folder
- `c446cfd` - build: regenerate spa assets from mobile layout fixes  
- `e32d321` - fix: ensure one-column mobile-first layout with proper text spacing

## What the Fix Does

The updated `.htaccess` now:
1. ✅ Explicitly allows `/spa/assets/` folder for static file serving
2. ✅ Rewrites `/assets/*` requests to `/spa/assets/*` location
3. ✅ Ensures asset files are served directly without routing to Laravel
4. ✅ Prevents catchall SPA rule from intercepting asset requests

## Troubleshooting

If assets still don't load after deployment:

1. **Check file permissions**
   ```bash
   ls -la /home/wargacom/bskm.warga007.com/public/spa/assets/
   # Should show files with readable permissions
   ```

2. **Check .htaccess is in place**
   ```bash
   cat /home/wargacom/bskm.warga007.com/public/.htaccess | grep "SPA asset requests"
   # Should show the new rule
   ```

3. **Check nginx/Apache configuration**
   - Some hosting providers require enabling mod_rewrite
   - Contact hosting support if rewrite rules don't work

4. **Clear CDN/Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

## Contact
If deployment issues persist, check:
- Git logs: `git log --oneline -5`
- .htaccess syntax: Use htaccess validator online
- Server error logs: Ask hosting provider for Apache/Nginx error logs
