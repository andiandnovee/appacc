<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
-- =====================================================
-- 1. TABLE: accounts
-- =====================================================
CREATE TABLE `accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
   `company_code` varchar(50) NOT NULL,
  `kode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_kode_unique` (`kode`),
  KEY `accounts_parent_id_index` (`parent_id`),
  CONSTRAINT `accounts_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `companies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_code` varchar(50) NOT NULL UNIQUE,
  `nama` varchar(255) NOT NULL,
  `alamat` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telepon` varchar(50) DEFAULT NULL,
  `penanggung_jawab` varchar(255) DEFAULT NULL,
  `status` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 2. TABLE: indonesia_provinces
-- -- =====================================================
-- CREATE TABLE `indonesia_provinces` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `code` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `meta` text COLLATE utf8mb4_unicode_ci,
--   `created_at` timestamp NULL DEFAULT NULL,
--   `updated_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `indonesia_provinces_code_unique` (`code`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 3. TABLE: indonesia_cities
-- -- =====================================================
-- CREATE TABLE `indonesia_cities` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `province_code` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `meta` text COLLATE utf8mb4_unicode_ci,
--   `created_at` timestamp NULL DEFAULT NULL,
--   `updated_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `indonesia_cities_code_unique` (`code`),
--   KEY `indonesia_cities_province_code_foreign` (`province_code`),
--   CONSTRAINT `indonesia_cities_province_code_foreign` FOREIGN KEY (`province_code`) REFERENCES `indonesia_provinces` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 4. TABLE: indonesia_districts
-- -- =====================================================
-- CREATE TABLE `indonesia_districts` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `code` char(7) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `city_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `meta` text COLLATE utf8mb4_unicode_ci,
--   `created_at` timestamp NULL DEFAULT NULL,
--   `updated_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `indonesia_districts_code_unique` (`code`),
--   KEY `indonesia_districts_city_code_foreign` (`city_code`),
--   CONSTRAINT `indonesia_districts_city_code_foreign` FOREIGN KEY (`city_code`) REFERENCES `indonesia_cities` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 5. TABLE: indonesia_villages
-- -- =====================================================
-- CREATE TABLE `indonesia_villages` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `code` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `district_code` char(7) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `meta` text COLLATE utf8mb4_unicode_ci,
--   `created_at` timestamp NULL DEFAULT NULL,
--   `updated_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `indonesia_villages_code_unique` (`code`),
--   KEY `indonesia_villages_district_code_foreign` (`district_code`),
--   CONSTRAINT `indonesia_villages_district_code_foreign` FOREIGN KEY (`district_code`) REFERENCES `indonesia_districts` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. TABLE: anggotas
-- =====================================================
CREATE TABLE `anggotas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
   `company_code` varchar(50) NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_kelamin` enum('L','P') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_hp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_kk` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_ktp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('aktif','nonaktif','meninggal') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'aktif',
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `anggotas_no_hp_unique` (`no_hp`),
  UNIQUE KEY `anggotas_no_kk_unique` (`no_kk`),
  UNIQUE KEY `anggotas_no_ktp_unique` (`no_ktp`),
  UNIQUE KEY `anggotas_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. TABLE: keluargas
-- =====================================================
CREATE TABLE `keluargas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `anggota_id` bigint unsigned NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_ktp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_hp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_kk` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hubungan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keluargas_no_ktp_unique` (`no_ktp`),
  UNIQUE KEY `keluargas_no_hp_unique` (`no_hp`),
  UNIQUE KEY `keluargas_no_kk_unique` (`no_kk`),
  KEY `keluargas_anggota_id_foreign` (`anggota_id`),
  CONSTRAINT `keluargas_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. TABLE: ref_iurans
-- =====================================================
CREATE TABLE `ref_iurans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
   `company_code` varchar(50) NOT NULL,
  `nama_iuran` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `jumlah` decimal(15,2) NOT NULL,
  `periode` enum('bulanan','tahunan','sekali') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sekali',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. TABLE: perums
-- =====================================================
CREATE TABLE `perums` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. TABLE: users
-- =====================================================
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_team_id` bigint unsigned DEFAULT NULL,
  `profile_photo_path` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `anggota_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_google_id_unique` (`google_id`),
  KEY `users_anggota_id_foreign` (`anggota_id`),
  CONSTRAINT `users_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. TABLE: setoran_kolektors
-- =====================================================
CREATE TABLE `setoran_kolektors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kolektor_id` bigint unsigned NOT NULL,
  `bendahara_id` bigint unsigned NOT NULL,
  `tanggal` date NOT NULL,
  `nominal_total` decimal(15,2) NOT NULL,
  `journal_entry_id_setoran` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `setoran_kolektors_kolektor_id_foreign` (`kolektor_id`),
  KEY `setoran_kolektors_bendahara_id_foreign` (`bendahara_id`),
  CONSTRAINT `setoran_kolektors_bendahara_id_foreign` FOREIGN KEY (`bendahara_id`) REFERENCES `users` (`id`),
  CONSTRAINT `setoran_kolektors_kolektor_id_foreign` FOREIGN KEY (`kolektor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 12. TABLE: iurans
-- =====================================================
CREATE TABLE `iurans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
   `company_code` varchar(50) NOT NULL,
  `anggota_id` bigint unsigned NOT NULL,
  `ref_iuran_id` bigint unsigned NOT NULL,
  `jumlah` int NOT NULL,
  `tanggal_bayar` date NOT NULL,
  `periode_bulan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `iurans_anggota_id_foreign` (`anggota_id`),
  KEY `iurans_ref_iuran_id_foreign` (`ref_iuran_id`),
  CONSTRAINT `iurans_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `iurans_ref_iuran_id_foreign` FOREIGN KEY (`ref_iuran_id`) REFERENCES `ref_iurans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. TABLE: iuran_setorans
-- =====================================================
CREATE TABLE `iuran_setorans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `iuran_id` bigint unsigned NOT NULL,
  `setoran_kolektor_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `iuran_setorans_iuran_id_foreign` (`iuran_id`),
  KEY `iuran_setorans_setoran_kolektor_id_foreign` (`setoran_kolektor_id`),
  CONSTRAINT `iuran_setorans_iuran_id_foreign` FOREIGN KEY (`iuran_id`) REFERENCES `iurans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `iuran_setorans_setoran_kolektor_id_foreign` FOREIGN KEY (`setoran_kolektor_id`) REFERENCES `setoran_kolektors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 14. TABLE: alamats
-- =====================================================
CREATE TABLE `alamats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `anggota_id` bigint unsigned NOT NULL,
  `perum_id` bigint unsigned DEFAULT NULL,
  
  `no_rumah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat_lainnya` text COLLATE utf8mb4_unicode_ci,
  `village_id` bigint unsigned DEFAULT NULL,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alamats_anggota_id_foreign` (`anggota_id`),
  KEY `alamats_perum_id_foreign` (`perum_id`),
  KEY `alamats_village_id_foreign` (`village_id`),
  CONSTRAINT `alamats_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `alamats_perum_id_foreign` FOREIGN KEY (`perum_id`) REFERENCES `perums` (`id`) ON DELETE SET NULL,
  CONSTRAINT `alamats_village_id_foreign`
  FOREIGN KEY (`village_id`) REFERENCES `indonesia_villages` (`id`) ON DELETE SET NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 15. TABLE: roles
-- -- =====================================================
-- CREATE TABLE `roles` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `created_at` timestamp NULL DEFAULT NULL,
--   `updated_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 16. TABLE: permissions
-- -- =====================================================
-- CREATE TABLE `permissions` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `created_at` timestamp NULL DEFAULT NULL,
--   `updated_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 17. TABLE: model_has_roles
-- -- =====================================================
-- CREATE TABLE `model_has_roles` (
--   `role_id` bigint unsigned NOT NULL,
--   `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `model_id` bigint unsigned NOT NULL,
--   PRIMARY KEY (`role_id`,`model_id`,`model_type`),
--   KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
--   CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 18. TABLE: model_has_permissions
-- -- =====================================================
-- CREATE TABLE `model_has_permissions` (
--   `permission_id` bigint unsigned NOT NULL,
--   `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `model_id` bigint unsigned NOT NULL,
--   PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
--   KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
--   CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -- =====================================================
-- -- 19. TABLE: role_has_permissions
-- -- =====================================================
-- CREATE TABLE `role_has_permissions` (
--   `permission_id` bigint unsigned NOT NULL,
--   `role_id` bigint unsigned NOT NULL,
--   PRIMARY KEY (`permission_id`,`role_id`),
--   KEY `role_has_permissions_role_id_foreign` (`role_id`),
--   CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 20. TABLE: jobs, job_batches, cache, cache_locks, failed_jobs, sessions, pengeluarans, sumbangans, password_reset_tokens, migrations
-- =====================================================
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pengeluarans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
   `company_code` varchar(50) NOT NULL,
  `tanggal` date NOT NULL,
  `jumlah` int NOT NULL,
  `jenis_pengeluaran` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sumbangans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
   `company_code` varchar(50) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_penyumbang` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jumlah` int NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `journal_entries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_code` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `source_module` varchar(255) DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `journal_entries_created_by_foreign` (`created_by`),
  CONSTRAINT `journal_entries_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `journal_lines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `journal_entry_id` bigint unsigned NOT NULL,
  `account_id` bigint unsigned NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `credit` decimal(15,2) DEFAULT 0.00,
  `subledger_type` varchar(255) DEFAULT NULL,
  `subledger_id` bigint unsigned DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `journal_lines_journal_entry_id_foreign` (`journal_entry_id`),
  KEY `journal_lines_account_id_foreign` (`account_id`),
  CONSTRAINT `journal_lines_journal_entry_id_foreign` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `journal_lines_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `account_balances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_code` varchar(50) NOT NULL,
  `account_id` bigint unsigned NOT NULL,
  `subledger_type` varchar(255) DEFAULT NULL,
  `subledger_id` bigint unsigned DEFAULT NULL,
  `year` int NOT NULL,
  `month` int NOT NULL,
  `opening_balance` decimal(15,2) DEFAULT 0.00,
  `debit_total` decimal(15,2) DEFAULT 0.00,
  `credit_total` decimal(15,2) DEFAULT 0.00,
  `closing_balance` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_balances_account_id_foreign` (`account_id`),
  CONSTRAINT `account_balances_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `subledgers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `entity_id` bigint unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SQL
        );

        // Tambahkan kolom kode ke tabel target jika belum ada
        $targets = ['anggotas', 'keluargas', 'iurans', 'setoran_kolektors', 'journal_entries'];
        foreach ($targets as $tbl) {
            if (!Schema::hasColumn($tbl, 'kode')) {
                Schema::table($tbl, function (Blueprint $table) {
                    $table->string('kode', 20)->nullable()->unique()->after('id');
                });
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'migrations','password_reset_tokens','sumbangans','pengeluarans','sessions',
            'failed_jobs','cache_locks','cache','job_batches','jobs',
           // 'role_has_permissions','model_has_permissions','model_has_roles','permissions','roles',
            'alamats','iuran_setorans','iurans','setoran_kolektors','users','perums','ref_iurans',
            'keluargas','anggotas',
           // 'indonesia_villages','indonesia_districts','indonesia_cities','indonesia_provinces',
            'accounts'
        ];

        foreach ($tables as $t) {
            if (Schema::hasTable($t)) {
                Schema::dropIfExists($t);
            }
        }
    }
};