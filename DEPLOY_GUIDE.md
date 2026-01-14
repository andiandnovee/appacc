# Auto Deploy Guide untuk BSKM

## Opsi 1: Manual Deploy (Paling Sederhana)

### Setup sekali saja:

1. **Login ke production server:**
   ```bash
   ssh wargacom@bskm.warga007.com
   ```

2. **Copy deploy script:**
   ```bash
   cp /home/wargacom/bskm.warga007.com/deploy.sh /home/wargacom/deploy-bskm.sh
   chmod +x /home/wargacom/deploy-bskm.sh
   ```

### Setiap kali deploy:

```bash
bash /home/wargacom/deploy-bskm.sh
```

---

## Opsi 2: Auto Deploy dengan Git Webhook (via Gitea/GitHub)

Jika hosting Anda support webhook, bisa auto-trigger deploy.

### Setup:

1. **Create deploy secret:**
   ```bash
   cd /home/wargacom/bskm.warga007.com
   echo "$(openssl rand -hex 16)" > .deploy-secret
   ```

2. **Create webhook receiver script:**
   ```bash
   mkdir -p /home/wargacom/webhook
   nano /home/wargacom/webhook/deploy.php
   ```

   Paste kode ini:
   ```php
   <?php
   $secret = file_get_contents('/home/wargacom/bskm.warga007.com/.deploy-secret');
   
   // Verify webhook signature
   $payload = file_get_contents('php://input');
   $hash = hash_hmac('sha256', $payload, $secret);
   
   if ($_SERVER['HTTP_X_HUB_SIGNATURE_256'] !== 'sha256=' . $hash) {
       http_response_code(401);
       exit('Unauthorized');
   }
   
   // Run deploy script
   shell_exec('bash /home/wargacom/deploy-bskm.sh > /tmp/deploy.log 2>&1 &');
   
   echo "Deploy started...";
   ?>
   ```

3. **Setup webhook di GitHub:**
   - Settings → Webhooks → Add webhook
   - Payload URL: `https://bskm.warga007.com/webhook/deploy.php`
   - Secret: (paste dari `.deploy-secret`)
   - Content type: `application/json`
   - Trigger on: `push`

---

## Opsi 3: Scheduled Deploy (Auto pull setiap jam)

Edit crontab:
```bash
crontab -e
```

Tambahkan:
```bash
0 * * * * bash /home/wargacom/deploy-bskm.sh >> /tmp/bskm-deploy.log 2>&1
```

Ini akan auto-deploy setiap jam.

---

## Troubleshooting

### Cek log deploy:
```bash
tail -f /tmp/deploy.log
tail -f /tmp/bskm-deploy.log
```

### Test git pull manual:
```bash
cd /home/wargacom/bskm.warga007.com
git pull origin refactor/api-v1
git status
```

### Clear cache:
```bash
cd /home/wargacom/bskm.warga007.com
php artisan cache:clear
php artisan config:clear
```

---

## Tips

- Deploy script otomatis juga **build Vue SPA**, jadi tidak perlu npm manual
- Pastikan git user sudah authenticate atau pakai SSH key
- Pastikan folder `storage` dan `bootstrap/cache` punya write permission
