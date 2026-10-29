# Peta Perubahan Aktif

## 2026-10-28 — Audit Activity dan fondasi FCM web

- **Ringkasan:** menambahkan audit event backend untuk auth, receipt, impor, kendaraan, dan perubahan admin; Audit Activity khusus `super-admin`; inbox notifikasi; registrasi/nonaktifkan web device token; pengirim FCM HTTP v1; dan Firebase Messaging service worker web.
- **Role/permission:** nama role dan permission dinormalisasi lowercase saat disimpan dan oleh migration. Migration menggabungkan duplicate case variants beserta assignment pivot; jika nama sama dalam guard berbeda terdeteksi, migration berhenti sebelum perubahan.
- **Dampak API/database:** migration menambahkan `audit_events`, `audit_notification_rules`, `audit_notifications`, `user_devices`, dan `notification_logs`; endpoint perangkat/notifikasi dan admin audit baru berada di `/api`. Event dicatat tanpa mengubah payload API domain yang ada.
- **Keamanan/operasional:** event menyaring token, password, credential, email, serta key sensitif dari metadata/diff; token perangkat tidak diserialisasi; FCM dinonaktifkan secara default (`FIREBASE_PUSH_ENABLED=false`) dan semua rule/penerima mulai nonaktif/kosong. Tidak ada secret Firebase yang ditambahkan.
- **Client:** web push/inbox selesai di source; mobile tidak termasuk scope sesuai arahan pengguna. iOS belum dikonfigurasi untuk FCM/APNs.
- **Status/verifikasi:** frontend production build berhasil; ESLint selesai tanpa error (dengan warning yang sudah ada di file lain); tes fokus backend lulus (3 tes, 16 assertions); Pint lulus untuk seluruh file PHP terkait; route audit terdaftar; dan `migrate --pretend` berhasil. TypeScript check masih melaporkan error di sejumlah file lama yang tidak terkait. Migration hanya dipreview, belum diterapkan ke database aktual atau diuji terhadap salinan MySQL disposable. Push tetap default-off dan semua penerima/rule belum diaktifkan.

Dokumen ini diringkas dari source dan riwayat Git sampai commit `3ac176a9` (10 September 2026), diperiksa pada 16 September 2026. Ini bukan changelog lengkap. Source code tetap menjadi sumber kebenaran utama.

# Arah Pengembangan Saat Ini

Fokus terbaru adalah perluasan modul kendaraan dengan **Jurnal STNK/KIR** dan ekspor upload SAP ZF0002. Implementasi menggabungkan master kendaraan/business area dari backend dengan draft dan konfigurasi vendor STNK/KIR yang saat ini persisten di browser. Perubahan sesudah fitur awal berfokus pada klasifikasi transaksi RO, persistensi draft, format customer/baris export, dan penamaan file export.

Arah signifikan sebelumnya adalah pematangan logbook/biaya kendaraan, kesinambungan KM dan carry-over antarbulan, ekspor SAP, penyempurnaan F53 helper, tampilan receipt, serta presisi desimal PPh vendor.

# Perubahan Utama

## 2026-10-20 — Halaman web dimuat sesuai route

- **Ringkasan:** halaman route SPA menggunakan lazy loading dengan fallback saat halaman sedang dimuat. Bundle entry build turun dari sekitar 1,98 MB (603 kB gzip) menjadi 293 kB (98 kB gzip); chunk besar Excel tetap dimuat bersama fitur yang memerlukannya.
- **Modul/file:** `frontend/src/App.tsx` dan aset `frontend/dist/assets/*`.
- **Dampak API/database/dependency:** tidak ada perubahan API, database, atau dependency; kode halaman dan dependency-nya dimuat saat route terkait dibuka.
- **Status:** build frontend berhasil; Vite masih memperingatkan chunk ekspor Excel sekitar 939 kB.

## 2026-10-20 — Kredit jurnal BusArea Kendaraan memakai vendor RO

- **Ringkasan:** baris kredit jurnal BusArea Kendaraan memakai SAP vendor code dari current BusArea RO; vendor STNK/KIR terpilih tetap dipakai pada jurnal BusArea RO. Aturan lain pada builder ekspor tetap mengikuti implementasi aktif setelah `60c91464`.
- **Koreksi Assignment:** hanya item BusArea RO tanpa cost center memakai `DN`; item RO lain tetap memakai nama vendor STNK/KIR.
- **Koreksi PPh RO:** PPh dihitung dari seluruh jasa BusArea RO memakai tarif dan GL PPh pada header export, lalu hanya ditulis sebagai baris kredit GL di jurnal RO.
- **Modul/file:** `frontend/src/pages/invoice/StnkJournal/exportStnkZf0002.ts`.
- **Dampak API/database/dependency:** tidak ada perubahan API, database, atau dependency; business rule akun vendor kredit Kendaraan, Assignment RO, dan basis PPh RO diperbarui.
- **Status:** perubahan aturan jurnal kendaraan/RO selesai; build frontend berhasil.

## 2026-10-06 — Carryover logbook dapat disisipkan di awal atau akhir

- **Ringkasan:** pemilihan carryover menerima rantai KM yang tersambung ke KM awal atau KM akhir bulan berjalan, sehingga baris dapat disisipkan sebelum atau ditambahkan setelah data yang sudah ada.
- **Modul/file:** `CarryoverPicker.tsx`, halaman `VehicleLogBook/index.tsx`, dan `VehicleLogbookController.php`.
- **Dampak API/database/dependency:** endpoint carryover tetap memakai payload yang sama, tetapi validasinya menerima prepend sebelum KM pertama maupun append setelah KM terakhir; tidak ada perubahan database atau dependency.
- **Status:** implementasi selesai; lint/build frontend dan pemeriksaan sintaks controller backend berhasil.

## 2026-10-01 — Kalkulator pajak publik

- **Ringkasan:** halaman kalkulator pajak statis tersedia tanpa autentikasi pada `/pajak/calc` di host frontend dan backend.
- **Modul/file:** `backend/public/pajak.html`, `backend/routes/web.php`, `frontend/public/pajak/calc/index.html`, serta artefak build `frontend/dist/pajak/calc/index.html`.
- **Dampak API/database/dependency:** tidak ada perubahan database atau dependency; endpoint backend menggunakan route web publik karena route API otomatis memiliki prefix `/api`.
- **Status:** route backend dan aset frontend telah diverifikasi; build frontend berhasil.

## 2026-09-24 — CRUD master customer

- **Ringkasan:** menambahkan halaman manajemen customer dengan pencarian, sorting, pagination, export, tambah, edit, dan soft delete, beserta API resource Laravel.
- **Modul/file:** `frontend/src/pages/invoice/CustomerManagementPage/*`, router/sidebar frontend, `CustomerController`, `CustomerRequest`, `CustomerResource`, model `Customer`, dan route API.
- **Dampak API:** menambahkan resource endpoint `/api/customers`; field payload/response utama adalah `sap_id`, `name`, dan `short_name`.
- **Dampak database/dependency:** tidak ada migration atau dependency baru; memakai tabel `customers` yang sudah dikonsumsi pencarian beban logbook.
- **Status:** implementasi selesai; verifikasi build/lint/backend dicatat pada hasil pengerjaan.

## 2026-09-23 — Preview, penggabungan, dan validasi export logbook ZF0002

- **Ringkasan:** export ZF0002 logbook dapat menggabungkan baris dalam kendaraan yang sama berdasarkan jenis pemakai, kode cost center/customer, dan keterangan. Penggabungan aktif secara default tetapi dapat dimatikan user dari modal preview sebelum download.
- **Validasi:** preview membandingkan jumlah baris, total KM, dan total Rupiah sebelum/sesudah pemrosesan untuk setiap kendaraan. Export diblokir jika total KM atau Rupiah berubah.
- **Modul/file:** `frontend/src/pages/invoice/VehicleLogBook/ExportZF0002.tsx`, `LogbookSummarySection.tsx`, dan `LogbookSummarySection.module.css`.
- **Dampak API/database:** tidak ada; endpoint tetap mengirim detail asli dan agregasi hanya terjadi di browser saat export. Print logbook tetap memakai detail asli tanpa penggabungan.
- **Status:** aktif; build frontend berhasil dan lint file terkait tidak menghasilkan error.

## 2026-09-09–2026-09-10 — Jurnal biaya STNK/KIR dan ekspor ZF0002

- **Ringkasan:** menambahkan halaman `/vehicles/stnk-journal`, UI input biaya per kendaraan, pemisahan baris kendaraan vs RO, vendor STNK/KIR lokal, draft persisten, dan export `.txt`/`.xlsx`.
- **Tujuan terverifikasi:** pesan commit `biaya stnk/kier` dan implementasi page/export menunjukkan pembuatan jurnal upload SAP untuk biaya STNK/KIR.
- **Modul/file:** `frontend/src/pages/invoice/StnkJournal/*`, `frontend/src/stores/stnkVendors.ts`, `frontend/src/stores/stnkDraft.ts`, `frontend/src/App.tsx`, `frontend/src/components/ui/Sidebar.tsx`.
- **Dampak API:** memakai endpoint company select, business area, dan lookup plat; menambahkan `GET /api/vehicles/plate-lookup` dan `PATCH /api/busa/{businessArea}/set-current`.
- **Dampak database:** migration menambah boolean `business_areas.current_bus_area` default false. Tidak ada tabel backend khusus untuk draft/vendor STNK.
- **Dependency:** frontend menambah `uuid` dan type package terkait; export menggunakan ExcelJS/FileSaver yang sudah menjadi dependency frontend.
- **Status:** aktif dan terhubung ke navigasi utama.
- **Follow-up diketahui:** tidak ada TODO eksplisit. Persistensi vendor/draft hanya di browser dan gap migration tabel kendaraan tetap perlu keputusan manusia.

## 2026-09-10 — Koreksi RO, draft, dan nama file export

- **Ringkasan:** empat commit berurutan memperbaiki customer/row RO, kemudian menyimpan draft jurnal, dan mengubah nama file menjadi pola `upload_ZF0002_<jenis>_<company>_<bulan>_<tahun>[_invoice]`.
- **Modul/file:** `StnkJournal/index.tsx`, `exportStnkZf0002.ts`, `stores/stnkDraft.ts`, serta artefak `frontend/dist`.
- **Dampak API/database/dependency:** tidak ada perubahan baru setelah landasan tanggal 9 September; perubahan terutama perilaku frontend/export.
- **Status:** selesai menurut commit terakhir `3ac176a9`; belum ditemukan automated test.
- **Follow-up:** validasi output terhadap spesifikasi SAP resmi **Belum terverifikasi**.

## 2026-09-01 — Presisi rate PPh vendor menjadi dua desimal

- **Ringkasan:** form vendor dan validasi backend menerima rate PPh desimal dua digit.
- **Modul/file:** `frontend/src/pages/invoice/VendorManagement/VendorFormModal.tsx`, `backend/app/Http/Requests/UpdateVendorRequest.php`, dan build web.
- **Dampak API/database:** kontrak validasi update vendor berubah; migration schema tidak berubah pada rangkaian commit ini.
- **Status:** aktif.
- **Follow-up:** kesetaraan rule pada request create vs update perlu selalu diverifikasi bila form vendor diubah.

## 2026-06-26–2026-07-01 — Logbook kendaraan, carry-over KM, dan export

- **Ringkasan:** input logbook dipindahkan/dirapikan, double-save dicegah, KM awal diselaraskan dengan bulan lalu, kesinambungan KM diperiksa, dan export per departemen disesuaikan agar assignment tertentu tidak diwajibkan.
- **Modul/file:** `VehicleLogBook/index.tsx`, `LogbookDetailForm.tsx`, `ExportZF0002.tsx`, `VehicleLogbookController.php`, serta build web.
- **Dampak API/database:** perilaku payload dan kalkulasi logbook berubah; flag `is_carry` memiliki migration tanggal 9 Juni 2026. Tidak ada migration pembuat tabel kendaraan/header/detail di repo.
- **Status:** aktif; UI saat ini memblokir kalkulasi/ekspor tertentu jika KM tidak kontinu atau data tidak balance.
- **Follow-up:** automated regression test belum ditemukan.

## 2026-07-02–2026-07-16 — Penyempurnaan F53 Helper

- **Ringkasan:** shortcut SAP F53/PO disesuaikan dan posting date default diarahkan ke tanggal hari ini.
- **Modul/file:** `F53HelperPage/index.tsx`, `utils/sapShortcuts.ts`, dan build web.
- **Dampak API/database:** tidak ada perubahan schema yang terlihat; proses tetap menggunakan endpoint data/import F53 dan membentuk output/shortcut di frontend.
- **Status:** aktif.

## 2026-07-09 — Business area code pada monitor receipt

- **Ringkasan:** halaman receipt menampilkan kode business area secara lebih eksplisit.
- **Modul/file:** `frontend/src/pages/invoice/Receipt/index.tsx` dan build web.
- **Dampak API/database:** tidak ada perubahan kontrak pada commit tersebut; field sudah berasal dari resource/relasi receipt.
- **Status:** aktif.

## Fondasi domain yang masih relevan — Receipt, SAP PO/F53/PPh, dan auth JWT

- **Ringkasan:** backend memiliki CRUD receipt/status, impor ICAT, impor SAP PO/F53/PPh, JWT cookie/bearer, OAuth web/mobile, serta role/permission.
- **Modul/file:** `backend/routes/api.php`, controller API/Auth, service impor, model/request/resource, `frontend/src/api/axios.ts`, `frontend/src/hooks/useAuth.tsx`, dan API/store mobile.
- **Dampak:** ini adalah kontrak bersama web dan mobile; perubahan harus diaudit lintas client.
- **Status:** aktif, tetapi coverage test dan CI tidak ditemukan.
- **Follow-up:** `AuthService` lama masih mengandung pemanggilan token Sanctum meskipun flow aktif JWT; jangan gunakan tanpa klarifikasi/refactor terpisah.

# Perubahan Signifikan Terakhir

Urutan perubahan paling relevan dari Git:

| Tanggal | Commit | Ringkasan | Area |
|---|---|---|---|
| 2026-09-10 | `3ac176a9` | Nama file export STNK/KIR memasukkan jenis vendor dan metadata invoice | STNK export |
| 2026-09-10 | `7a4cf1aa` | Persistensi draft jurnal STNK | STNK UI/state |
| 2026-09-10 | `23eb069d`, `e3541e47` | Koreksi customer/baris RO | STNK UI/export |
| 2026-09-09 | `1cd4e6d4` | Fitur biaya STNK/KIR, current business area, lookup plat | Backend + frontend + schema |
| 2026-09-01 | `9555a16f`–`9ac14775` | Dukungan rate PPh dua desimal | Vendor UI/validation |
| 2026-07-24 | `dc25aca1` | Perbaikan tahun pada form stage/periode | Stage UI |
| 2026-07-16 | `03c94b51` | Default posting date F53 ke hari ini | F53 helper |
| 2026-07-09 | `3df3236f` | Menampilkan business area code pada receipt | Receipt UI |
| 2026-07-02 | `b8ecceb0` | Penyesuaian shortcut F53/PO | F53/SAP utility |
| 2026-06-29–07-01 | beberapa commit | Kontinuitas KM, carry-over, pencegahan double save, export departemen | Vehicle logbook |

## Risiko dan Konteks yang Harus Dibawa ke Perubahan Berikutnya

- **Migration tidak lengkap:** model/controller memakai `vehicles`, `vehicle_cost_headers`, `vehicle_cost_details`, dan `sap_f53_uploads`, tetapi migration pembuatnya tidak ada di repo.
- **State STNK lokal:** `stnk-vendors` dan `stnk-draft` menggunakan local storage Zustand; perubahan browser/perangkat tidak tersinkron ke server.
- **Dua router web:** `App.tsx` aktif; `src/routers/index.tsx` tampak stale dan memiliki daftar route berbeda.
- **Auth campuran berdasarkan client:** production browser memakai cookie, development web bearer storage, mobile SecureStore. Perubahan refresh/login harus diuji pada ketiganya.
- **Otorisasi UI bukan otorisasi:** sidebar tidak menyembunyikan semua menu berdasar permission; backend merupakan enforcement utama.
- **Model duplikat:** `CostCenter.php` dan `Costcenter.php` mendeklarasikan class yang sama.
- **Dokumentasi lama stale:** `INSTALLATION_COMPLETE.md` dan beberapa bagian `RECEIPT_REFACTOR_SUMMARY.md` tidak cocok dengan implementasi saat ini.
- **Build artefact dilacak:** perubahan frontend historis biasanya disertai update `frontend/dist`; pastikan workflow deployment sebelum memutuskan apakah artefak harus ikut berubah.
- **Tidak ada CI/test suite yang terdeteksi:** perubahan business rule membutuhkan verifikasi manual atau test baru yang terarah.
