# APPACC — Pengetahuan Proyek

Dokumen ini menggambarkan implementasi yang ada di source code pada 16 September 2026. Source code, migration, konfigurasi, dan riwayat Git adalah sumber utama. Informasi yang tidak dapat dibuktikan ditandai **Belum terverifikasi**.

## Tujuan Proyek

APPACC adalah aplikasi internal akuntansi untuk mengelola penerimaan invoice dan data referensinya, membantu impor/rekonsiliasi data SAP, menyusun laporan PPh, serta mengelola kendaraan, logbook, biaya kendaraan, dan jurnal biaya STNK/KIR. Repositori berisi tiga aplikasi:

- REST API Laravel di `backend/`.
- SPA web React di `frontend/`.
- Aplikasi Android/iOS React Native berbasis Expo di `appacc-mobile/`, terutama untuk login, pemindaian PO/OCR, input receipt, dan riwayat.

Nama organisasi, lingkungan produksi, pemilik bisnis, dan arti resmi singkatan APPACC: **Belum terverifikasi**.

## Teknologi dan Versi

Versi berikut berasal dari manifest dan lock file, bukan perkiraan:

| Bagian | Teknologi | Versi terkunci/ketentuan |
|---|---|---|
| Backend | PHP | `^8.2` |
| Backend | Laravel | 11.48.0 |
| Backend | JWT Auth | `php-open-source-saver/jwt-auth` 2.8.3 |
| Backend | OAuth | Laravel Socialite 5.24.2 |
| Backend | Role/permission | Spatie Laravel Permission 6.24.1 |
| Backend | Spreadsheet | PhpSpreadsheet 5.5.0 |
| Web | React / React DOM | 19.2.4 |
| Web | React Router DOM | 7.13.1 |
| Web | Vite | 7.3.1 |
| Web | TypeScript | 6.0.2 |
| Web | Axios / Zustand | 1.13.6 / 5.0.12 |
| Web | Excel | ExcelJS 4.4.0 dan SheetJS `xlsx` 0.18.5 |
| Mobile | Expo | 54.0.34 |
| Mobile | React / React Native | 19.1.0 / 0.81.5 |
| Mobile | TypeScript | 5.9.3 |
| Mobile | Navigasi/state | React Navigation 7, Zustand 5.0.13 |

Driver database aktual sengaja tidak dicantumkan karena berasal dari `.env`. Template `backend/env.example` harus menjadi referensi konfigurasi; jangan menyalin rahasia dari `.env` ke dokumentasi.

## Arsitektur

```text
Browser React/Vite ─┐
                    ├─ HTTP JSON /api ─> Laravel 11 ─> Eloquent ─> database
Expo React Native ──┘                       │
                                           ├─ JWT + Socialite + Spatie Permission
                                           └─ layanan impor SAP/Excel dan ekspor data

Browser juga membuat file SAP/Excel/text secara lokal untuk beberapa alur F53,
logbook, PPh, dan jurnal STNK.
```

Backend mengikuti pola route → middleware → controller → form request/resource → model. Proses impor yang lebih kompleks dipisahkan ke service. Frontend web adalah SPA dengan halaman per domain, komponen UI reusable, Axios terpusat, dan store Zustand persisten. Mobile menggunakan native-stack navigation, Axios, SecureStore, dan store autentikasi Zustand.

## Struktur Direktori Penting

```text
backend/
  app/Http/Controllers/       endpoint API, auth, dan administrasi
  app/Http/Requests/          validasi payload
  app/Http/Resources/         bentuk respons resource
  app/Http/Middleware/        cookie JWT, permission, refresh token
  app/Models/                 model dan relasi Eloquent
  app/Services/               impor SAP/F53/PPh/ICAT dan helper auth
  database/migrations/        skema yang tersedia di repo
  database/seeders/           role, permission, user, purchasing group
  routes/api.php              seluruh route API
frontend/
  src/App.tsx                 router aplikasi yang aktif
  src/api/axios.ts            client API dan antrean refresh JWT
  src/components/ui/          design system/component reusable
  src/hooks/useAuth.tsx       konteks autentikasi web
  src/pages/                  halaman per domain
  src/stores/                 filter, draft, vendor STNK, preferensi tabel
  src/utils/                  parser file dan generator shortcut SAP
appacc-mobile/
  App.tsx                     navigation root
  src/api/                    client auth, receipt, dan PO
  src/screens/                login, home, scan/OCR, receipt, history
  src/store/                  state auth dan stage
salin/                        salinan file/contoh kerja; bukan source utama
frontend/dist/                artefak build web yang ikut dilacak Git
```

`production_backup.sql` dan `backend/database/database.sqlite` ada di repository. Perlakukan keduanya sebagai data sensitif; jangan menampilkan isinya atau menganggapnya sebagai sumber skema tanpa kebutuhan dan izin yang jelas.

## Backend

Semua route API mendapat prefix `/api`. Route publik menangani login, refresh, pertukaran kode OAuth, callback provider, dan Google login mobile. Route lain berada di middleware `auth:api`.

Kelompok API utama:

- Auth: `/auth/login`, `/auth/refresh`, `/auth/me`, `/auth/logout`, OAuth web dan Google mobile.
- Dashboard, user, role, permission, setting, dan profil SAP user.
- Master accounting: vendor, company, stage/periode, business area, cost center, dan purchasing group.
- Invoice receipt: CRUD, pencarian/filter, histori status, serta impor ICAT ID.
- SAP: impor PO, lookup PO, impor/data F53, impor/laporan PPh.
- Kendaraan: master kendaraan, lookup plat, impor biaya, detail logbook, carry-over, ringkasan, print, dan ekspor.

Sebagian besar domain accounting ditempatkan di group role `accounting`. Administrasi `/admin/*` dibatasi role `super-admin`. Sejumlah endpoint user/role/setting memakai middleware permission granular. Endpoint di dalam group role tidak semuanya memiliki policy atau permission granular tambahan.

Service penting:

- `SapImportService`: impor baris PO, menolak duplikat kombinasi PO + item, lalu menyinkronkan vendor dan purchasing group.
- `F53ImportService`: memvalidasi kolom wajib, menolak duplikat nomor dokumen + business area, mendeteksi company dari business area, mengambil PO dari 10 digit awal text bila diawali `45`, dan membalik tanda amount.
- `PphImportService`: proses dua tahap—data utama lalu pelengkapan vendor/PO—dengan batch per company + GL + periode.
- `IcatIdImportService`: mencocokkan ICAT ID ke receipt berdasarkan PO; bila PO ambigu, amount harus cocok dalam toleransi 0,01.

## Frontend Web

Entry point `src/main.tsx` merender `src/App.tsx`. Route aktif mencakup dashboard, user/settings, receipt, PPh, F53 helper, master referensi, kendaraan/logbook, dan jurnal STNK. `src/routers/index.tsx` adalah router alternatif yang tidak diimpor oleh entry point aktif.

Pola frontend:

- Halaman domain memanggil API melalui `src/api/axios.ts`.
- Respons 401 memicu satu proses refresh; request lain diantrikan agar tidak membuat refresh paralel.
- Dalam production, browser memakai cookie (`withCredentials`); dalam development, bearer token disimpan di local/session storage.
- Zustand `persist` menyimpan filter receipt/F53/logbook, draft STNK, vendor STNK lokal, dan preferensi tabel.
- `src/components/ui/` menyediakan Table, Pagination, Modal, Drawer, Select, Input, FileUpload, Toast, Tabs, dan komponen presentasional lain.
- Fitur SAP menghasilkan file/shortcut di client melalui ExcelJS, SheetJS, FileSaver, dan utilitas SAP.

Menu sidebar belum menyaring seluruh item berdasarkan izin; badge seperti `admin` bersifat presentasional. Proteksi route web hanya memeriksa autentikasi, sedangkan otorisasi efektif tetap harus ditegakkan backend.

## Aplikasi Mobile

Mobile memiliki alur login Google, home, scan nomor PO, OCR kamera, form receipt, dan history. Token disimpan melalui Expo SecureStore dan divalidasi ke server saat startup. Konfigurasi EAS menyediakan profile development, preview, APK, dan production Android App Bundle. Konfigurasi paket: `com.appacc.mobile`.

Distribusi iOS/Android yang benar-benar aktif dan pipeline store: **Belum terverifikasi**.

## Model Data dan Domain

Model utama dan relasi yang dapat diverifikasi:

- `User`: akun aktif, provider sosial, profil SAP, banyak role dan permission.
- `Company` memiliki banyak `BusinessArea` dan `InvoiceReceipt`.
- `BusinessArea` mengacu ke company, memiliki kode SAP/customer/vendor, dan flag `current_bus_area`; hanya satu current per company dijaga oleh `setAsCurrent()`.
- `Vendor` menyimpan identitas SAP, NPWP, tipe/rate PPh, status PKP, dan GL cost account.
- `Stage`: periode bernama dengan tanggal mulai dan tahun.
- `InvoiceReceipt`: receipt untuk vendor/company/stage/user, PO, invoice, amount, business area, attachment, ICAT ID; memiliki histori `ReceiptStatus`.
- `SapPoImport`: item PO SAP dan metadata vendor/purchasing group.
- `SapF53Upload`: hasil impor F53 per company/stage/business area/vendor.
- `ImportPph`: baris PPh, batch, vendor, GL, PO, dan amount desimal dua digit.
- `Vehicle`: master kendaraan, company/business area/cost center, identitas kendaraan, status dan masa berlaku STNK/PKB/KIR.
- `VehicleCostHeader` dan `VehicleCostDetail`: biaya/logbook per kendaraan dan periode, detail KM/beban serta carry-over.
- `CostCenter`, `Setting`, dan `JwtBlacklist` mendukung referensi/config/auth.

Catatan skema: migration repository membuat tabel dasar, master accounting, receipt, PO import, PPh, dan blacklist JWT, tetapi tidak ditemukan migration pembuat tabel `vehicles`, `vehicle_cost_headers`, `vehicle_cost_details`, atau `sap_f53_uploads`. Database produksi tampaknya memerlukan skema di luar rangkaian migration saat ini; asal skema lengkap **Belum terverifikasi**.

## Autentikasi dan Otorisasi

- Guard API memakai JWT (`php-open-source-saver/jwt-auth`).
- Login password menolak user yang tidak aktif.
- JWT menyertakan name, email, role, permission, dan status aktif sebagai custom claims.
- Browser production menerima JWT melalui cookie `appacc_token`; middleware `JwtFromCookie` menyalinnya ke header Authorization.
- Development web memakai token dari local/session storage. Mobile memakai SecureStore.
- OAuth web didukung melalui Socialite; provider ditentukan route. Google mobile menerima identitas/token Google melalui endpoint khusus.
- Role dan permission menggunakan Spatie. Seeder mendefinisikan baseline akses, tetapi data role aktual dapat berbeda.
- Logout/refresh dikelola controller JWT dan penyimpanan blacklist database khusus.

`AuthService::createToken()` masih memanggil API token Sanctum, sementara model tidak memakai `HasApiTokens` dan alur aktif memakai JWT. Service ini tampak sebagai sisa implementasi lama dan jangan digunakan tanpa verifikasi.

## Aturan Bisnis Penting

- Import PO unik berdasarkan `po_number + item_no`; hasil impor menyinkronkan vendor dan purchasing group master.
- PPh hanya menerima GL yang ada di `ImportPph::GL_PPH_MAP`; batch dibentuk dari company, GL, dan bulan posting; amount disimpan absolut dan presisi dua desimal.
- Vendor update PPh dicocokkan memakai document number, company, dan posting date.
- F53 mengubah sign amount, menentukan company dari business area, dan mendeteksi nomor PO hanya dari 10 digit awal text yang dimulai `45`.
- ICAT ID hanya dipasang ke receipt yang belum memiliki ICAT ID; collision PO diselesaikan dengan kecocokan amount.
- Business area current bersifat tunggal per company pada saat `setAsCurrent()` dijalankan.
- Logbook memeriksa kesinambungan KM, mencegah kalkulasi/ekspor tertentu saat belum balance, mendukung carry-over bulan sebelumnya, dan menyimpan flag `is_carry` pada detail.
- Jurnal STNK/KIR membedakan baris kendaraan dan RO. Kendaraan tanpa cost center, tidak ditemukan, atau cost center sama dengan current business area diarahkan ke RO. Vendor/draft STNK saat ini dipersist di browser, bukan tabel backend khusus.
- Ekspor jurnal STNK menghasilkan `.txt` atau `.xlsx` ZF0002; nama file terbaru memasukkan jenis vendor, company, bulan/tahun, dan nomor invoice bila ada.

## Perintah Pengembangan

Prasyarat: PHP 8.2+, Composer, Node/npm yang kompatibel dengan lock file, serta konfigurasi environment lokal. Nilai credential harus dibuat lokal dan tidak didokumentasikan.

```bash
# Backend
cd backend
composer install
cp env.example .env          # hanya bila .env lokal belum ada
php artisan key:generate
php artisan migrate --seed   # lihat catatan migration yang belum lengkap
php artisan serve

# Web
cd frontend
npm ci
npm run dev

# Mobile
cd appacc-mobile
npm ci
npm run start
# atau npm run android / npm run ios / npm run web
```

Vite development mem-proxy `/api` ke `http://localhost:8000`, tetapi Axios memakai `VITE_API_URL`; pastikan nilai lokal konsisten dengan cara menjalankan backend.

## Build, Test, dan Deployment

```bash
cd frontend
npm run lint
npm run build
npm run preview

cd backend
php artisan test
./vendor/bin/pint --test

cd appacc-mobile
npx tsc --noEmit
eas build --profile development   # atau preview/apk/production
```

- Artefak `frontend/dist/` dilacak dan riwayat menunjukkan build diperbarui bersama perubahan source. Mekanisme deploy artefak tersebut: **Belum terverifikasi**.
- Tidak ditemukan workflow CI di `.github/workflows`.
- Tidak ditemukan test aplikasi di `backend/tests`, dan manifest web/mobile tidak mendefinisikan script test.
- Dockerfile Laravel Sail tersedia di `backend/docker/`, tetapi tidak ditemukan compose file yang menunjukkan Sail sebagai workflow aktif.
- Perintah di atas adalah kemampuan yang disediakan toolchain; hasil green build/test pada environment baru belum otomatis terjamin.

## Keterbatasan dan Pekerjaan Lanjutan

- Migration tidak merepresentasikan seluruh tabel yang digunakan aplikasi, khususnya domain kendaraan dan F53.
- Cakupan automated test praktis belum ada dan CI tidak ditemukan.
- `frontend/src/routers/index.tsx` tidak sinkron dengan router aktif di `App.tsx`.
- `AuthService` masih memuat pola Sanctum yang tidak cocok dengan auth JWT aktif.
- Terdapat dua file model dengan perbedaan kapitalisasi, `CostCenter.php` dan `Costcenter.php`, yang mendeklarasikan class sama; ini berisiko pada filesystem case-insensitive/autoload.
- Route resource `stages` didaftarkan bersama route index/show eksplisit; ada duplikasi definisi route.
- Route `VehicleLogbookController::lastKm()` ada di controller tetapi tidak ditemukan pendaftarannya di `routes/api.php`.
- Beberapa komentar inline adalah catatan implementasi lama, bukan TODO yang terstruktur.
- Dokumen `INSTALLATION_COMPLETE.md` mengacu ke path `/var/www/html/musholla` dan frontend Vue/Pinia yang tidak cocok dengan implementasi React sekarang; dokumen itu historis/stale.
- `RECEIPT_REFACTOR_SUMMARY.md` menyatakan delete receipt permanen, sedangkan model saat ini memakai `SoftDeletes`; perilaku aktual controller/source harus selalu didahulukan.
- File contoh/salinan, database, backup SQL, `.env`, dan konfigurasi layanan pihak ketiga memerlukan audit keamanan repository terpisah. Tidak ada rahasia yang disalin ke dokumen ini.

## Aturan Pemeliharaan Dokumentasi

Selalu baca `AGENTS.md` sebelum mengubah kode. Perubahan lintas modul, schema, API, auth, business rule, dependency, atau konfigurasi harus dicatat ringkas di `CHANGE_MAP.md`. README hanya diperbarui jika pengetahuan tingkat proyek berubah.
