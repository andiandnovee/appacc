# Instruksi Wajib untuk Agen Coding

Instruksi ini berlaku untuk seluruh repository. Source code aktual tetap menjadi sumber kebenaran utama.

<!-- codebase-memory-mcp:start -->
## Knowledge Graph Codebase (`codebase-memory-mcp`)

Proyek ini menggunakan `codebase-memory-mcp` untuk memelihara knowledge graph codebase. **Selalu utamakan alat graph MCP daripada grep/glob/file-search untuk discovery kode.**

Urutan prioritas:

1. `search_graph` — mencari function, class, route, dan variable berdasarkan pola.
2. `trace_path` — menelusuri caller/callee dan dampak.
3. `get_code_snippet` — membaca source function/class spesifik.
4. `query_graph` — query Cypher untuk pola kompleks.
5. `get_architecture` — ringkasan arsitektur tingkat tinggi.

Gunakan grep/glob hanya untuk string literal, pesan error, config/non-code file, atau saat graph belum tersedia/tidak cukup. Jika graph belum diindeks, catat keadaan tersebut dan lanjutkan dengan inspeksi filesystem yang terarah.
<!-- codebase-memory-mcp:end -->

## Pemeriksaan Minimum Sebelum Mengubah Kode

Setiap agen **WAJIB**:

1. Membaca `AGENTS.md`.
2. Membaca `README.md`.
3. Membaca `CHANGE_MAP.md`.
4. Memeriksa `git status` dan menjaga perubahan milik pengguna.
5. Memeriksa riwayat Git/diff terbaru yang relevan bila tersedia.
6. Membaca source file aktual yang terkait dengan permintaan.
7. Memeriksa apakah perubahan beririsan dengan konteks aktif/recent di `CHANGE_MAP.md`.
8. Mengidentifikasi dependency dan kemungkinan dampak sebelum mengedit.

Jangan pernah hanya mengandalkan README atau CHANGE_MAP. Jika dokumentasi bertentangan dengan implementasi:

- percaya source code;
- telusuri penyebab perbedaannya;
- perbarui dokumentasi jika pengetahuan tingkat proyek atau konteks perubahan memang berubah.

## Pemeriksaan Dampak Sebelum Setiap Tugas

Sebelum implementasi, jawab secara internal atau dalam update kerja:

- Modul mana yang terdampak?
- Implementasi mana yang saat ini menangani perilaku tersebut?
- File apa saja yang kemungkinan berubah?
- Apakah ada perubahan aktif/terbaru yang berhubungan?
- Apakah kontrak API berubah?
- Apakah schema atau data database berubah?
- Apakah autentikasi/otorisasi berubah?
- Apakah shared component/service/utilitas berubah?
- Modul lain mana yang berpotensi rusak?

Ikuti alur dari UI/client ke route, middleware, request/controller/service/model/database bila relevan. Untuk perubahan backend, periksa consumer web dan mobile. Untuk perubahan data, periksa migration, model, validation, resource, import/export, dan compatibility data lama.

## Aturan Implementasi

- Jangan mengubah kode yang tidak terkait.
- Jangan menebak kontrak atau business rule; verifikasi di source dan riwayat.
- Jangan menampilkan atau menyalin rahasia dari `.env`, database, backup SQL, credential provider, atau file konfigurasi layanan.
- Pertahankan perubahan yang sudah ada di worktree kecuali pengguna secara eksplisit meminta sebaliknya.
- Jangan memakai artefak `frontend/dist` sebagai pengganti membaca source TypeScript.
- `frontend/src/App.tsx` adalah router web aktif saat ini; verifikasi entry point sebelum memakai router alternatif.
- Auth aktif menggunakan JWT/cookie atau bearer token menurut jenis client; jangan menghidupkan kembali pola Sanctum dari service lama tanpa keputusan eksplisit.
- Perhatikan bahwa rangkaian migration repository belum mencakup semua tabel domain kendaraan/F53. Jangan mengasumsikan database kosong dapat dibangun lengkap sampai gap tersebut diselesaikan.
- Perlakukan frontend web dan mobile sebagai consumer API yang terpisah.

## Setelah Setiap Perubahan Signifikan

1. Verifikasi implementasi secara proporsional: test, lint, type-check, build, atau pemeriksaan endpoint terkait.
2. Periksa `git diff` dan pastikan tidak ada perubahan tidak sengaja atau rahasia.
3. Perbarui `CHANGE_MAP.md` jika perubahan signifikan.
4. Perbarui `README.md` hanya bila dokumentasi tingkat proyek berubah.

Perubahan signifikan adalah perubahan pada:

- arsitektur;
- database/schema/data contract;
- kontrak API;
- autentikasi/otorisasi;
- business rule;
- komponen/service/utilitas shared;
- dependency utama;
- konfigurasi;
- perilaku lintas modul.

Jangan memenuhi `CHANGE_MAP.md` dengan formatting, typo, CSS minor, rename tidak penting, artefak debug, atau perubahan kecil tanpa dampak perilaku.

## Format Entri CHANGE_MAP

Untuk perubahan signifikan, catat tanggal jika diketahui, ringkasan, tujuan hanya bila dapat diverifikasi, file/modul terdampak, dampak API/database/dependency, status, dan follow-up yang benar-benar diketahui. Jangan mengarang alasan commit yang tidak tertulis di source, diff, issue, atau pesan commit.

## Verifikasi yang Disarankan

- Backend: test yang relevan, `php artisan test`, dan/atau `./vendor/bin/pint --test`.
- Frontend web: `npm run lint` dan `npm run build`.
- Mobile: `npx tsc --noEmit` dan smoke test screen terkait.
- Perubahan API: verifikasi route, validation, status code, resource shape, serta kedua consumer.
- Perubahan migration: uji migrate/rollback pada database disposable; jangan memakai database produksi atau backup sebagai target test.

Jika test tidak tersedia atau tidak dapat dijalankan, laporkan secara eksplisit—jangan menyatakan perubahan sudah teruji.
