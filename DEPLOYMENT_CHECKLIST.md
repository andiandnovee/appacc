# Production Deployment Checklist

## After `git pull origin refactor/api-v1`

### 1. Create .htaccess from template
```bash
cd /home/wargacom/bskm.warga007.com/public
cp .htaccess.example .htaccess
```

### 2. Verify .htaccess created
```bash
ls -la .htaccess
# Should show: -rw-r--r-- 1 user www-data
```

### 3. Clear browser cache (on client)
- Desktop: `Ctrl+Shift+Delete` → Clear all data
- Or use private/incognito window

### 4. Hard refresh browser
- `Ctrl+Shift+R` (Windows/Linux)
- `Cmd+Shift+R` (Mac)

### 5. Test on mobile (if needed)
- Open `https://bskm.warga007.com` on Android device
- Should show mobile-responsive layout (single column on small screens)

## What's Fixed

✅ **Mobile Responsiveness**: Added viewport meta tag
✅ **Asset Serving**: .htaccess rewrite rules for /assets/ → /spa/assets/
✅ **SPA Routing**: Laravel fallback for frontend routes

## Files to Know About

| File | Status | Purpose |
|------|--------|---------|
| `public/.htaccess` | ❌ Not tracked | Production-specific config |
| `public/.htaccess.example` | ✅ Tracked | Template for .htaccess |
| `public/.htaccess.new` | ✅ Tracked | Alternative template |
| `.htaccess.root` | ✅ Tracked | Root-level template (if needed) |

## Troubleshooting

**Assets returning HTML instead of JavaScript?**
- Verify `.htaccess` exists and is readable
- Check Apache `mod_rewrite` is enabled
- See `EMERGENCY_RECOVERY.md` for detailed solutions

**Mobile still showing desktop layout?**
- Clear browser cache completely
- Hard refresh (Ctrl+Shift+R)
- Try incognito/private window
- Check viewport meta tag exists (should be in HTML head)

**API endpoints 404?**
- API routes should work normally
- If returning SPA, might need authentication
- Check `.htaccess` has `/api` route enabled

## Questions?

See these files for detailed info:
- `EMERGENCY_RECOVERY.md` - Complete troubleshooting guide
- `HTACCESS_GUIDE.md` - Detailed .htaccess explanation
- `DEPLOYMENT_HOTFIX.md` - Other deployment info
