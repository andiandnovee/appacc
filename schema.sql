-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: appacc
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_balances`
--

DROP TABLE IF EXISTS `account_balances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_balances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` bigint unsigned NOT NULL,
  `account_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kode akun seperti 1101 atau 2101',
  `subledger_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subledger_id` bigint unsigned DEFAULT NULL,
  `year` int NOT NULL,
  `month` int NOT NULL,
  `opening_balance` decimal(15,2) DEFAULT '0.00',
  `debit_total` decimal(15,2) DEFAULT '0.00',
  `credit_total` decimal(15,2) DEFAULT '0.00',
  `closing_balance` decimal(15,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_balances_account_id_foreign` (`account_id`),
  CONSTRAINT `account_balances_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_kode_unique` (`kode`),
  KEY `accounts_parent_id_index` (`parent_id`),
  CONSTRAINT `accounts_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alamats`
--

DROP TABLE IF EXISTS `alamats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alamats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `anggota_id` bigint unsigned NOT NULL,
  `perum_id` bigint unsigned DEFAULT NULL,
  `no_rumah` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat_lainnya` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  CONSTRAINT `alamats_village_id_foreign` FOREIGN KEY (`village_id`) REFERENCES `indonesia_villages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `anggotas`
--

DROP TABLE IF EXISTS `anggotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anggotas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_kelamin` enum('L','P') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_hp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_kk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_ktp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('aktif','nonaktif','meninggal') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'aktif',
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `anggotas_no_hp_unique` (`no_hp`),
  UNIQUE KEY `anggotas_no_kk_unique` (`no_kk`),
  UNIQUE KEY `anggotas_no_ktp_unique` (`no_ktp`),
  UNIQUE KEY `anggotas_email_unique` (`email`),
  UNIQUE KEY `anggotas_kode_unique` (`kode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `auth_logs`
--

DROP TABLE IF EXISTS `auth_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logged_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `collector_receipts`
--

DROP TABLE IF EXISTS `collector_receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collector_receipts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kolektor_user_id` bigint unsigned NOT NULL COMMENT 'User ID of the collector',
  `anggota_id` bigint unsigned NOT NULL COMMENT 'Member ID (anggota)',
  `ref_iuran_id` bigint unsigned NOT NULL COMMENT 'Reference Iuran (master iuran)',
  `iuran_id` bigint unsigned DEFAULT NULL COMMENT 'Iuran record created for this receipt',
  `journal_entry_id` bigint unsigned DEFAULT NULL COMMENT 'Journal entry created for this receipt',
  `jumlah` decimal(15,2) NOT NULL COMMENT 'Amount received',
  `tanggal_bayar` datetime NOT NULL COMMENT 'Payment date recorded by collector',
  `tgl_setor` datetime DEFAULT NULL COMMENT 'Deposit date to treasury',
  `catatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Collector notes',
  `is_canceled` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Whether this receipt is canceled',
  `canceled_at` datetime DEFAULT NULL COMMENT 'Cancellation timestamp',
  `canceled_by` bigint unsigned DEFAULT NULL COMMENT 'User ID who canceled',
  `cancel_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Reason for cancellation',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `collector_receipts_iuran_id_foreign` (`iuran_id`),
  KEY `collector_receipts_journal_entry_id_foreign` (`journal_entry_id`),
  KEY `collector_receipts_kolektor_user_id_index` (`kolektor_user_id`),
  KEY `collector_receipts_anggota_id_index` (`anggota_id`),
  KEY `collector_receipts_ref_iuran_id_index` (`ref_iuran_id`),
  KEY `collector_receipts_tanggal_bayar_index` (`tanggal_bayar`),
  KEY `collector_receipts_kolektor_user_id_tanggal_bayar_index` (`kolektor_user_id`,`tanggal_bayar`),
  KEY `collector_receipts_is_canceled_index` (`is_canceled`),
  CONSTRAINT `collector_receipts_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `collector_receipts_iuran_id_foreign` FOREIGN KEY (`iuran_id`) REFERENCES `iurans` (`id`) ON DELETE SET NULL,
  CONSTRAINT `collector_receipts_journal_entry_id_foreign` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE SET NULL,
  CONSTRAINT `collector_receipts_kolektor_user_id_foreign` FOREIGN KEY (`kolektor_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `collector_receipts_ref_iuran_id_foreign` FOREIGN KEY (`ref_iuran_id`) REFERENCES `ref_iurans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `collector_users`
--

DROP TABLE IF EXISTS `collector_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collector_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `collector_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `identity_meta` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `collector_users_collector_id_unique` (`collector_id`),
  KEY `collector_users_user_id_foreign` (`user_id`),
  CONSTRAINT `collector_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telepon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `penanggung_jawab` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('aktif','nonaktif') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_code` (`company_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `indonesia_cities`
--

DROP TABLE IF EXISTS `indonesia_cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indonesia_cities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `province_code` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `indonesia_cities_code_unique` (`code`),
  KEY `indonesia_cities_province_code_foreign` (`province_code`),
  CONSTRAINT `indonesia_cities_province_code_foreign` FOREIGN KEY (`province_code`) REFERENCES `indonesia_provinces` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `indonesia_districts`
--

DROP TABLE IF EXISTS `indonesia_districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indonesia_districts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` char(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_code` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `indonesia_districts_code_unique` (`code`),
  KEY `indonesia_districts_city_code_foreign` (`city_code`),
  CONSTRAINT `indonesia_districts_city_code_foreign` FOREIGN KEY (`city_code`) REFERENCES `indonesia_cities` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `indonesia_provinces`
--

DROP TABLE IF EXISTS `indonesia_provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indonesia_provinces` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `indonesia_provinces_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `indonesia_villages`
--

DROP TABLE IF EXISTS `indonesia_villages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indonesia_villages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_code` char(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `indonesia_villages_code_unique` (`code`),
  KEY `indonesia_villages_district_code_foreign` (`district_code`),
  CONSTRAINT `indonesia_villages_district_code_foreign` FOREIGN KEY (`district_code`) REFERENCES `indonesia_districts` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `iuran_setorans`
--

DROP TABLE IF EXISTS `iuran_setorans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `iurans`
--

DROP TABLE IF EXISTS `iurans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iurans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `anggota_id` bigint unsigned NOT NULL,
  `ref_iuran_id` bigint unsigned NOT NULL,
  `jumlah` int NOT NULL,
  `tanggal_bayar` date NOT NULL,
  `periode_bulan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `is_canceled` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `iurans_kode_unique` (`kode`),
  KEY `iurans_anggota_id_foreign` (`anggota_id`),
  KEY `iurans_ref_iuran_id_foreign` (`ref_iuran_id`),
  CONSTRAINT `iurans_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `iurans_ref_iuran_id_foreign` FOREIGN KEY (`ref_iuran_id`) REFERENCES `ref_iurans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `journal_entries`
--

DROP TABLE IF EXISTS `journal_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `reference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('parked','posted') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'parked',
  `source_module` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_canceled` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `journal_entries_kode_unique` (`kode`),
  KEY `journal_entries_created_by_foreign` (`created_by`),
  CONSTRAINT `journal_entries_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `journal_lines`
--

DROP TABLE IF EXISTS `journal_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_lines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `journal_entry_id` bigint unsigned NOT NULL,
  `account_id` bigint unsigned NOT NULL,
  `account_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kode akun seperti 1101 atau 2101',
  `debit` decimal(15,2) DEFAULT '0.00',
  `credit` decimal(15,2) DEFAULT '0.00',
  `subledger_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subledger_id` bigint unsigned DEFAULT NULL,
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `journal_lines_journal_entry_id_foreign` (`journal_entry_id`),
  KEY `journal_lines_account_id_foreign` (`account_id`),
  CONSTRAINT `journal_lines_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `journal_lines_journal_entry_id_foreign` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `keluargas`
--

DROP TABLE IF EXISTS `keluargas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keluargas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anggota_id` bigint unsigned NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_ktp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_hp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_kk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hubungan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keluargas_no_ktp_unique` (`no_ktp`),
  UNIQUE KEY `keluargas_no_hp_unique` (`no_hp`),
  UNIQUE KEY `keluargas_no_kk_unique` (`no_kk`),
  UNIQUE KEY `keluargas_kode_unique` (`kode`),
  KEY `keluargas_anggota_id_foreign` (`anggota_id`),
  CONSTRAINT `keluargas_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_logs`
--

DROP TABLE IF EXISTS `notification_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `anggota_id` bigint unsigned DEFAULT NULL,
  `device_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'fcm',
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `data_payload` json DEFAULT NULL,
  `status` enum('pending','sent','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT NULL,
  `fcm_response` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_logs_user_id_foreign` (`user_id`),
  KEY `notification_logs_anggota_id_foreign` (`anggota_id`),
  KEY `notification_logs_status_index` (`status`),
  KEY `notification_logs_channel_index` (`channel`),
  KEY `notification_logs_sent_at_index` (`sent_at`),
  CONSTRAINT `notification_logs_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE SET NULL,
  CONSTRAINT `notification_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_access_tokens`
--

DROP TABLE IF EXISTS `oauth_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_access_tokens` (
  `id` char(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_auth_codes`
--

DROP TABLE IF EXISTS `oauth_auth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_auth_codes` (
  `id` char(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `scopes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_auth_codes_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_clients`
--

DROP TABLE IF EXISTS `oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_clients` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirect_uris` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grant_types` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_owner_type_owner_id_index` (`owner_type`,`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_device_codes`
--

DROP TABLE IF EXISTS `oauth_device_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_device_codes` (
  `id` char(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_code` char(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `scopes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `user_approved_at` datetime DEFAULT NULL,
  `last_polled_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth_device_codes_user_code_unique` (`user_code`),
  KEY `oauth_device_codes_user_id_index` (`user_id`),
  KEY `oauth_device_codes_client_id_index` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_refresh_tokens`
--

DROP TABLE IF EXISTS `oauth_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_refresh_tokens` (
  `id` char(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` char(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pengeluarans`
--

DROP TABLE IF EXISTS `pengeluarans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengeluarans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `jumlah` int NOT NULL,
  `jenis_pengeluaran` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `perums`
--

DROP TABLE IF EXISTS `perums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perums` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ref_iurans`
--

DROP TABLE IF EXISTS `ref_iurans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ref_iurans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_iuran` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `jumlah` decimal(15,2) NOT NULL,
  `account_id` bigint unsigned DEFAULT NULL,
  `entry_type` enum('pendapatan','liabilitas') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendapatan',
  `periode` enum('bulanan','tahunan','sekali') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sekali',
  `tgl_awal_periode` date DEFAULT NULL,
  `tgl_akhir_periode` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ref_iurans_account_id_foreign` (`account_id`),
  CONSTRAINT `ref_iurans_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setoran_kolektors`
--

DROP TABLE IF EXISTS `setoran_kolektors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setoran_kolektors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kolektor_id` bigint unsigned NOT NULL,
  `bendahara_id` bigint unsigned NOT NULL,
  `tanggal` date NOT NULL,
  `nominal_total` decimal(15,2) NOT NULL,
  `journal_entry_id_setoran` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setoran_kolektors_kode_unique` (`kode`),
  KEY `setoran_kolektors_kolektor_id_foreign` (`kolektor_id`),
  KEY `setoran_kolektors_bendahara_id_foreign` (`bendahara_id`),
  CONSTRAINT `setoran_kolektors_bendahara_id_foreign` FOREIGN KEY (`bendahara_id`) REFERENCES `users` (`id`),
  CONSTRAINT `setoran_kolektors_kolektor_id_foreign` FOREIGN KEY (`kolektor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subledgers`
--

DROP TABLE IF EXISTS `subledgers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subledgers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sumbangans`
--

DROP TABLE IF EXISTS `sumbangans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sumbangans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `nama_penyumbang` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jumlah` int NOT NULL,
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_accbank`
--

DROP TABLE IF EXISTS `tbl_m_accbank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_accbank` (
  `Perusahaan_kode` int DEFAULT NULL,
  `AccountBank` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_account`
--

DROP TABLE IF EXISTS `tbl_m_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_account` (
  `Account` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Account_Desc` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Account_long_desc` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Account_type` varchar(4) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`Account`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_amaame`
--

DROP TABLE IF EXISTS `tbl_m_amaame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_amaame` (
  `AMAAME_kode` int NOT NULL AUTO_INCREMENT,
  `AMAAME_Nama` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `AMAAME_EMAIL` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `AMAAME_EMAIL_STAFF` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`AMAAME_kode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_ba`
--

DROP TABLE IF EXISTS `tbl_m_ba`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_ba` (
  `BA_Kode` int NOT NULL,
  `BA_NAME` varchar(100) DEFAULT NULL,
  `BA_NAME_LONG` varchar(255) DEFAULT NULL,
  `Perusahaan_Kode` int NOT NULL,
  `BA_CUST` int DEFAULT NULL,
  `BA_VEND` int DEFAULT NULL,
  `Email_Manager_site` varchar(255) DEFAULT NULL,
  `Email_KTU_KASIE1` varchar(255) DEFAULT NULL,
  `Email_KTU_KASIE2` varchar(255) DEFAULT NULL,
  `Email_Operator` varchar(255) DEFAULT NULL,
  `Email_Traksi` varchar(255) DEFAULT NULL,
  `Email_Gudang` varchar(255) DEFAULT NULL,
  `BA_kode_AMA` varchar(255) DEFAULT NULL,
  `BA_Manager` varchar(255) DEFAULT NULL,
  `BA_KTU_KASIE1` varchar(255) DEFAULT NULL,
  `BA_KTU_KASIE2` varchar(255) DEFAULT NULL,
  `BA_Manager_contact` varchar(255) DEFAULT NULL,
  `Ba_KTU_KASIE1_contact` varchar(255) DEFAULT NULL,
  `Ba_KTU_KASIE2_contact` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`BA_Kode`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_bank_keys`
--

DROP TABLE IF EXISTS `tbl_m_bank_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_bank_keys` (
  `bankkey_id` int NOT NULL AUTO_INCREMENT,
  `Country Code` varchar(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Bank Code` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Bank Name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Region` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Street Address` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `City` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Bank Group` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Bank Number` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Bank Branch` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`bankkey_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11880 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_costcenter`
--

DROP TABLE IF EXISTS `tbl_m_costcenter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_costcenter` (
  `CostCenter` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Description` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `ShortCC` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`CostCenter`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_customer`
--

DROP TABLE IF EXISTS `tbl_m_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_customer` (
  `CustomerID` varchar(10) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `NamaCustomer` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT '',
  `ShortCustomer` varchar(30) CHARACTER SET ascii COLLATE ascii_bin DEFAULT '',
  `CityCustomer` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT '',
  PRIMARY KEY (`CustomerID`)
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_group`
--

DROP TABLE IF EXISTS `tbl_m_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_group` (
  `GID` int NOT NULL AUTO_INCREMENT,
  `Group_Name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Group_Description` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`GID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_kend`
--

DROP TABLE IF EXISTS `tbl_m_kend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_kend` (
  `KID` int NOT NULL AUTO_INCREMENT,
  `K_TYPE` varchar(6) DEFAULT '',
  `k_CocD` varchar(4) DEFAULT '',
  `K_BusA` varchar(6) DEFAULT '',
  `K_DESC` varchar(255) DEFAULT NULL,
  `K_TNKB` varchar(50) DEFAULT '',
  `K_CC` varchar(20) DEFAULT NULL,
  `K_TNKB_OLD` varchar(50) DEFAULT '',
  `K_RANGKA` varchar(255) DEFAULT NULL,
  `K_MESIN` varchar(255) DEFAULT NULL,
  `K_ACTIVE` varchar(255) DEFAULT NULL,
  `K_Comment` varchar(255) DEFAULT NULL,
  `K_Tgl_valid_STNKB` date DEFAULT NULL,
  `K_tgl_valid_PKB` date DEFAULT NULL,
  `K_tgl_valid_KIER` date DEFAULT NULL,
  PRIMARY KEY (`KID`)
) ENGINE=InnoDB AUTO_INCREMENT=563 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_modul`
--

DROP TABLE IF EXISTS `tbl_m_modul`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_modul` (
  `MID` int NOT NULL AUTO_INCREMENT,
  `Modul_Name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Modul_description` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`MID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_payto`
--

DROP TABLE IF EXISTS `tbl_m_payto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_payto` (
  `payto_id` int NOT NULL AUTO_INCREMENT,
  `payto` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `payto_bankkey` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `payto_norek` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `payto_account_holder` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`payto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=343 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_pengguna`
--

DROP TABLE IF EXISTS `tbl_m_pengguna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_pengguna` (
  `Pengguna_kode` int NOT NULL AUTO_INCREMENT,
  `Pengguna_nama` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Pengguna_login_nama` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `pengguna_login_pass` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `pengguna_sap` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `pengguna_email` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `pengguna_email_user` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `pengguna_email_pass` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `pengguna_ext` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Pengguna_serversap` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`Pengguna_kode`),
  KEY `Pengguna_login_nama` (`Pengguna_login_nama`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_perusahaan`
--

DROP TABLE IF EXISTS `tbl_m_perusahaan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_perusahaan` (
  `Perusahaan_Kode` int NOT NULL,
  `Perusahaan_Nama` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Perusahaan_NPWP` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Perusahaan_Alamat` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`Perusahaan_Kode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_pk`
--

DROP TABLE IF EXISTS `tbl_m_pk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_pk` (
  `PK` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `AccTy` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `DC` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `PKName` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`PK`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_tahap`
--

DROP TABLE IF EXISTS `tbl_m_tahap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_tahap` (
  `Tahap_Kode` int NOT NULL AUTO_INCREMENT,
  `Tahap_Nama` varchar(50) DEFAULT NULL,
  `Tahap_Tanggal_Awal` date DEFAULT NULL,
  `Tahap_Tahun` int DEFAULT NULL,
  PRIMARY KEY (`Tahap_Kode`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_m_vendor`
--

DROP TABLE IF EXISTS `tbl_m_vendor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_m_vendor` (
  `Vendor_Kode` int NOT NULL,
  `Vendor_Nama` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Vendor_NPWP` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Vendor_Alamat` varchar(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Vendor_Jasa` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Vendor_PPH` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `vendor_PPH_tarif` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`Vendor_Kode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_menu`
--

DROP TABLE IF EXISTS `tbl_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_menu` (
  `Menu_id` int NOT NULL AUTO_INCREMENT,
  `Menu_Parent` int DEFAULT NULL,
  `Menu_order` int DEFAULT NULL,
  `Menu_label` varchar(255) DEFAULT '',
  `Menu_link` varchar(255) DEFAULT NULL,
  `Menu_fa_icon` varchar(255) DEFAULT NULL,
  `Menu_Action` varchar(255) DEFAULT NULL,
  `Menu_page_path` varchar(255) DEFAULT NULL,
  `MID` int DEFAULT NULL,
  PRIMARY KEY (`Menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_auth`
--

DROP TABLE IF EXISTS `tbl_t_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_auth` (
  `Auth_Num` int NOT NULL AUTO_INCREMENT,
  `Auth_Modul_No` int DEFAULT NULL,
  `Auth_Add` smallint DEFAULT NULL,
  `Auth_Edit` smallint DEFAULT NULL,
  `Auth_delete` smallint DEFAULT NULL,
  `Pengguna_kode` int DEFAULT NULL,
  PRIMARY KEY (`Auth_Num`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_dnuploaddetail`
--

DROP TABLE IF EXISTS `tbl_t_dnuploaddetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_dnuploaddetail` (
  `headerId` int NOT NULL,
  `lineItem` int NOT NULL,
  `BaOrigin` varchar(255) DEFAULT NULL,
  `baDestination` varchar(255) DEFAULT NULL,
  `postingDate` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `account` varchar(255) DEFAULT NULL,
  `costcenter` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`headerId`,`lineItem`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_dnuploadheader`
--

DROP TABLE IF EXISTS `tbl_t_dnuploadheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_dnuploadheader` (
  `headerId` int NOT NULL AUTO_INCREMENT,
  `BaOrigin` varchar(4) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `BaDestination` varchar(4) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`headerId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_kend_beban_detail`
--

DROP TABLE IF EXISTS `tbl_t_kend_beban_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_kend_beban_detail` (
  `kend_detail_id` int NOT NULL AUTO_INCREMENT,
  `kend_header_id` int NOT NULL,
  `tgl_awal_detail` date DEFAULT NULL,
  `tgl_akhir_detail` date DEFAULT NULL,
  `km_awal_detail` int DEFAULT NULL,
  `km_akhir_detail` int DEFAULT NULL,
  `costcenter_beban` varchar(255) DEFAULT NULL,
  `customer_beban` varchar(255) DEFAULT NULL,
  `deskripsi_beban` varchar(255) DEFAULT NULL,
  `biaya_beban` int DEFAULT NULL,
  PRIMARY KEY (`kend_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3391 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_kend_beban_header`
--

DROP TABLE IF EXISTS `tbl_t_kend_beban_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_kend_beban_header` (
  `kend_header_id` int NOT NULL AUTO_INCREMENT,
  `Cocd` varchar(4) DEFAULT NULL,
  `BusA` varchar(4) DEFAULT NULL,
  `kend_id` int DEFAULT NULL,
  `tahun_header` int DEFAULT NULL,
  `bulan_header` int DEFAULT NULL,
  `total_biaya_header` double DEFAULT NULL,
  `tgl_awal_header` date DEFAULT NULL,
  `tgl_akhir_header` date DEFAULT NULL,
  `km_awal_header` int DEFAULT NULL,
  `km_akhir_header` int DEFAULT NULL,
  PRIMARY KEY (`kend_header_id`),
  UNIQUE KEY `kendaraan_per_bulan` (`BusA`,`kend_id`,`tahun_header`,`bulan_header`)
) ENGINE=InnoDB AUTO_INCREMENT=2715 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_penerimaan`
--

DROP TABLE IF EXISTS `tbl_t_penerimaan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_penerimaan` (
  `Penerimaan_Kode` int NOT NULL AUTO_INCREMENT,
  `Penerimaan_Tanggal` date DEFAULT NULL,
  `Penerimaan_Tempat_Bayar` int DEFAULT NULL,
  `Vendor_kode` int DEFAULT NULL,
  `Penerimaan_PO` varchar(50) DEFAULT NULL,
  `Penerimaan_Nilai` double DEFAULT NULL,
  `Perusahaan_Kode` int DEFAULT NULL,
  `Tahap_Kode` int DEFAULT NULL,
  `Pengguna_kode` int NOT NULL,
  `icat` smallint DEFAULT NULL,
  `Penerimaan_BA` varchar(6) DEFAULT '',
  `Penerimaan_Attachment1` varchar(255) DEFAULT '',
  `Penerimaan_Attachment2` varchar(255) DEFAULT NULL,
  `Penerimaan_Attachment3` varchar(255) DEFAULT NULL,
  `penerimaan_invoice` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`Penerimaan_Kode`,`Pengguna_kode`)
) ENGINE=InnoDB AUTO_INCREMENT=77630 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_pengguna_group`
--

DROP TABLE IF EXISTS `tbl_t_pengguna_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_pengguna_group` (
  `PGID` int NOT NULL AUTO_INCREMENT,
  `GID` int DEFAULT NULL,
  `Pengguna_kode` int DEFAULT NULL,
  PRIMARY KEY (`PGID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_permission`
--

DROP TABLE IF EXISTS `tbl_t_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_permission` (
  `PID` int NOT NULL AUTO_INCREMENT COMMENT 'Permission ID',
  `GID` int DEFAULT NULL COMMENT 'Group ID',
  `MID` int DEFAULT NULL COMMENT 'Modul ID',
  `PVal` int DEFAULT NULL,
  PRIMARY KEY (`PID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_perpj_head`
--

DROP TABLE IF EXISTS `tbl_t_perpj_head`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_perpj_head` (
  `perpj_head_id` int NOT NULL AUTO_INCREMENT,
  `Perpj_head_cocd` int DEFAULT NULL,
  `Perpj_head_vendor_acc` varchar(10) DEFAULT NULL,
  `Perpj_head_vendor_nama` varchar(50) DEFAULT NULL,
  `Perpj_head_ref` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`perpj_head_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_perpj_item`
--

DROP TABLE IF EXISTS `tbl_t_perpj_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_perpj_item` (
  `perpj_head_id` int DEFAULT NULL,
  `perpj_item_id` int DEFAULT NULL,
  `perpj_item_nopol` varchar(255) DEFAULT '',
  `perpj_item_cc` varchar(255) DEFAULT NULL,
  `perpj_item_busa` varchar(4) DEFAULT NULL,
  `perpj_item_biaya` int DEFAULT NULL,
  `perpj_item_jasa` int DEFAULT NULL,
  `perpj_item_denda` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_status`
--

DROP TABLE IF EXISTS `tbl_t_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_status` (
  `status_kode` int NOT NULL AUTO_INCREMENT,
  `status_tanggal` date NOT NULL,
  `penerimaan_kode` int DEFAULT NULL,
  `status_value` int NOT NULL,
  `status_reason` varchar(255) NOT NULL,
  `status_action` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`status_kode`)
) ENGINE=InnoDB AUTO_INCREMENT=87809 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_template_beban_kend_detail`
--

DROP TABLE IF EXISTS `tbl_t_template_beban_kend_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_template_beban_kend_detail` (
  `tmp_detail_id` int NOT NULL AUTO_INCREMENT,
  `tmp_header_id` int DEFAULT NULL,
  `costcenter_beban` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT '',
  `customer_beban` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT '',
  `deskripsi_beban` varchar(255) CHARACTER SET ascii COLLATE ascii_bin DEFAULT '',
  PRIMARY KEY (`tmp_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=ascii COLLATE=ascii_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_t_template_beban_kend_header`
--

DROP TABLE IF EXISTS `tbl_t_template_beban_kend_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_t_template_beban_kend_header` (
  `tmp_header_id` int NOT NULL AUTO_INCREMENT,
  `tmp_header_nama` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT '',
  PRIMARY KEY (`tmp_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=ascii COLLATE=ascii_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_upload_f53`
--

DROP TABLE IF EXISTS `tbl_upload_f53`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_upload_f53` (
  `kode_upload` int NOT NULL AUTO_INCREMENT,
  `Perusahaan_kode` int DEFAULT NULL,
  `Tahap_kode` int DEFAULT NULL,
  `Doc_Date` varchar(255) DEFAULT NULL,
  `Assign` varchar(255) DEFAULT NULL,
  `BA_kode` int DEFAULT NULL,
  `Vendor_kode` int DEFAULT NULL,
  `Amount` double DEFAULT NULL,
  `PO_number` varchar(255) DEFAULT NULL,
  `PO_Text` varchar(500) DEFAULT NULL,
  `doc_num` varchar(50) DEFAULT NULL,
  `ref` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`kode_upload`)
) ENGINE=InnoDB AUTO_INCREMENT=68927 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_upload_pph23`
--

DROP TABLE IF EXISTS `tbl_upload_pph23`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_upload_pph23` (
  `Cocd` int NOT NULL,
  `Bulan` int NOT NULL,
  `tahun` int NOT NULL,
  `count` int NOT NULL,
  `PostingDate` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `DocRef` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `Reference` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `BusArea` varchar(4) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `amount` double DEFAULT '0',
  `vendor_kode` varchar(11) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `Po_text` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `PO` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `pph` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `GLAccount` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  `DocDate` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '',
  PRIMARY KEY (`Cocd`,`Bulan`,`count`,`tahun`,`PostingDate`,`DocRef`,`Reference`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_upload_zf`
--

DROP TABLE IF EXISTS `tbl_upload_zf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_upload_zf` (
  `JurnalRef` int NOT NULL DEFAULT '0',
  `No` int NOT NULL,
  `CompanyCode` varchar(255) NOT NULL,
  `PostingDate` varchar(255) NOT NULL,
  `Period` varchar(255) NOT NULL,
  `DocumentDate` varchar(255) NOT NULL,
  `DocumentType` varchar(255) DEFAULT NULL,
  `IDR` varchar(255) DEFAULT NULL,
  `ExchangeRate` varchar(255) DEFAULT NULL,
  `Reference` varchar(20) DEFAULT NULL,
  `DocumentHeaderText` varchar(255) DEFAULT NULL,
  `DebetCredit` varchar(255) DEFAULT NULL,
  `GLAccount` varchar(255) DEFAULT NULL,
  `VendorAccount` varchar(255) DEFAULT NULL,
  `CustomerAccount` varchar(255) DEFAULT NULL,
  `SPGLInd` varchar(255) DEFAULT NULL,
  `AmountInDoc` varchar(255) DEFAULT NULL,
  `BusArea` varchar(255) DEFAULT NULL,
  `CostCenter` varchar(255) DEFAULT NULL,
  `ProfitCenter` varchar(255) DEFAULT NULL,
  `WBS` varchar(255) DEFAULT NULL,
  `Assignment` varchar(18) DEFAULT NULL,
  `Text` varchar(50) DEFAULT NULL,
  `TaxCode` varchar(255) DEFAULT NULL,
  `TradingPartner` varchar(255) DEFAULT NULL,
  `TermofPayment` varchar(255) DEFAULT NULL,
  `BaseLineDate` varchar(255) DEFAULT NULL,
  `NumberofDays` varchar(255) DEFAULT NULL,
  `ValueDate` varchar(15) DEFAULT '',
  `TransactionType` varchar(255) DEFAULT NULL,
  `Refkey1` varchar(10) DEFAULT NULL,
  `AuFnR` varchar(20) DEFAULT NULL,
  `Refkey2` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`JurnalRef`,`No`,`CompanyCode`,`PostingDate`,`Period`,`DocumentDate`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_anggota_requests`
--

DROP TABLE IF EXISTS `user_anggota_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_anggota_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `anggota_id` bigint unsigned NOT NULL,
  `no_hp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perum_id` bigint unsigned DEFAULT NULL,
  `no_rumah` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat_lainnya` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `village_id` bigint unsigned DEFAULT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_anggota_requests_user_id_foreign` (`user_id`),
  KEY `user_anggota_requests_anggota_id_foreign` (`anggota_id`),
  KEY `user_anggota_requests_perum_id_foreign` (`perum_id`),
  KEY `user_anggota_requests_village_id_foreign` (`village_id`),
  CONSTRAINT `user_anggota_requests_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_anggota_requests_perum_id_foreign` FOREIGN KEY (`perum_id`) REFERENCES `perums` (`id`) ON DELETE SET NULL,
  CONSTRAINT `user_anggota_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_anggota_requests_village_id_foreign` FOREIGN KEY (`village_id`) REFERENCES `indonesia_villages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_devices`
--

DROP TABLE IF EXISTS `user_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_devices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `device_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_devices_user_id_device_token_unique` (`user_id`,`device_token`),
  KEY `user_devices_device_token_index` (`device_token`),
  CONSTRAINT `user_devices_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `two_factor_secret` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_team_id` bigint unsigned DEFAULT NULL,
  `profile_photo_path` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `anggota_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_google_id_unique` (`google_id`),
  KEY `users_anggota_id_foreign` (`anggota_id`),
  CONSTRAINT `users_anggota_id_foreign` FOREIGN KEY (`anggota_id`) REFERENCES `anggotas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `view_ba_search`
--

DROP TABLE IF EXISTS `view_ba_search`;
/*!50001 DROP VIEW IF EXISTS `view_ba_search`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_ba_search` AS SELECT 
 1 AS `BA_Kode`,
 1 AS `BA_NAME`,
 1 AS `BA_NAME_LONG`,
 1 AS `Perusahaan_Kode`,
 1 AS `BA_CUST`,
 1 AS `BA_VEND`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_beban_kend_detail`
--

DROP TABLE IF EXISTS `view_beban_kend_detail`;
/*!50001 DROP VIEW IF EXISTS `view_beban_kend_detail`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_beban_kend_detail` AS SELECT 
 1 AS `kend_detail_id`,
 1 AS `kend_header_id`,
 1 AS `tgl_awal_detail`,
 1 AS `tgl_akhir_detail`,
 1 AS `km_awal_detail`,
 1 AS `km_akhir_detail`,
 1 AS `costcenter_beban`,
 1 AS `customer_beban`,
 1 AS `deskripsi_beban`,
 1 AS `kend_id`,
 1 AS `K_DESC`,
 1 AS `K_CC`,
 1 AS `Cocd`,
 1 AS `BusA`,
 1 AS `Total_KM_Header`,
 1 AS `Total_KM`,
 1 AS `total_biaya_header`,
 1 AS `total_biaya`,
 1 AS `bulan_header`,
 1 AS `tahun_header`,
 1 AS `K_TNKB`,
 1 AS `km_awal_header`,
 1 AS `km_akhir_header`,
 1 AS `tgl_awal_header`,
 1 AS `tgl_akhir_header`,
 1 AS `NamaCustomer`,
 1 AS `Description`,
 1 AS `rate_KM`,
 1 AS `biaya_beban`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_beban_kend_header`
--

DROP TABLE IF EXISTS `view_beban_kend_header`;
/*!50001 DROP VIEW IF EXISTS `view_beban_kend_header`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_beban_kend_header` AS SELECT 
 1 AS `kend_header_id`,
 1 AS `Cocd`,
 1 AS `BusA`,
 1 AS `tahun_header`,
 1 AS `bulan_header`,
 1 AS `kend_id`,
 1 AS `K_DESC`,
 1 AS `K_TNKB`,
 1 AS `K_CC`,
 1 AS `total_biaya_header`,
 1 AS `km_awal_header`,
 1 AS `km_akhir_header`,
 1 AS `tgl_awal_header`,
 1 AS `tgl_akhir_header`,
 1 AS `pencarian`,
 1 AS `rate_KM`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_cari_beban`
--

DROP TABLE IF EXISTS `view_cari_beban`;
/*!50001 DROP VIEW IF EXISTS `view_cari_beban`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_cari_beban` AS SELECT 
 1 AS `AccBeban`,
 1 AS `NamaBeban`,
 1 AS `short`,
 1 AS `pencarian`,
 1 AS `typebeban`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_cc_kend`
--

DROP TABLE IF EXISTS `view_cc_kend`;
/*!50001 DROP VIEW IF EXISTS `view_cc_kend`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_cc_kend` AS SELECT 
 1 AS `CostCenter`,
 1 AS `descriptions`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_company_nama`
--

DROP TABLE IF EXISTS `view_company_nama`;
/*!50001 DROP VIEW IF EXISTS `view_company_nama`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_company_nama` AS SELECT 
 1 AS `company`,
 1 AS `kode`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_count_penerimaan_by_pt`
--

DROP TABLE IF EXISTS `view_count_penerimaan_by_pt`;
/*!50001 DROP VIEW IF EXISTS `view_count_penerimaan_by_pt`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_count_penerimaan_by_pt` AS SELECT 
 1 AS `jumlah`,
 1 AS `Perusahaan_Nama`,
 1 AS `Tahap_Nama`,
 1 AS `Penerimaan_Tempat_Bayar`,
 1 AS `Jenis_PO`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_count_penerimaan_by_pt_tahap_tempat`
--

DROP TABLE IF EXISTS `view_count_penerimaan_by_pt_tahap_tempat`;
/*!50001 DROP VIEW IF EXISTS `view_count_penerimaan_by_pt_tahap_tempat`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_count_penerimaan_by_pt_tahap_tempat` AS SELECT 
 1 AS `jumlah`,
 1 AS `Perusahaan_Nama`,
 1 AS `Tahap_Nama`,
 1 AS `Penerimaan_Tempat_Bayar`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_count_penerimaan_by_pt_tahap_tempat_jenis`
--

DROP TABLE IF EXISTS `view_count_penerimaan_by_pt_tahap_tempat_jenis`;
/*!50001 DROP VIEW IF EXISTS `view_count_penerimaan_by_pt_tahap_tempat_jenis`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_count_penerimaan_by_pt_tahap_tempat_jenis` AS SELECT 
 1 AS `jumlah`,
 1 AS `Perusahaan_Nama`,
 1 AS `Tahap_Nama`,
 1 AS `Penerimaan_Tempat_Bayar`,
 1 AS `Jenis_PO`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_detail_ba`
--

DROP TABLE IF EXISTS `view_detail_ba`;
/*!50001 DROP VIEW IF EXISTS `view_detail_ba`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_detail_ba` AS SELECT 
 1 AS `BA_Kode`,
 1 AS `BA_NAME`,
 1 AS `Perusahaan_Kode`,
 1 AS `BA_CUST`,
 1 AS `BA_VEND`,
 1 AS `Email_Manager_site`,
 1 AS `Email_KTU_KASIE1`,
 1 AS `Email_KTU_KASIE2`,
 1 AS `Email_Operator`,
 1 AS `Email_Traksi`,
 1 AS `BA_kode_AMA`,
 1 AS `Perusahaan_Nama`,
 1 AS `BA_NAME_LONG`,
 1 AS `BA_Manager`,
 1 AS `BA_KTU_KASIE1`,
 1 AS `BA_KTU_KASIE2`,
 1 AS `BA_Manager_contact`,
 1 AS `Ba_KTU_KASIE1_contact`,
 1 AS `Ba_KTU_KASIE2_contact`,
 1 AS `Email_Gudang`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_email_ba`
--

DROP TABLE IF EXISTS `view_email_ba`;
/*!50001 DROP VIEW IF EXISTS `view_email_ba`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_email_ba` AS SELECT 
 1 AS `BA_Kode`,
 1 AS `BA_NAME`,
 1 AS `email`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_email_ba_2`
--

DROP TABLE IF EXISTS `view_email_ba_2`;
/*!50001 DROP VIEW IF EXISTS `view_email_ba_2`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_email_ba_2` AS SELECT 
 1 AS `BA_Kode`,
 1 AS `Email_Manager_site`,
 1 AS `Email_KTU_KASIE1`,
 1 AS `Email_KTU_KASIE2`,
 1 AS `Email_Operator`,
 1 AS `Email_Traksi`,
 1 AS `Email_Gudang`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_gp`
--

DROP TABLE IF EXISTS `view_gp`;
/*!50001 DROP VIEW IF EXISTS `view_gp`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_gp` AS SELECT 
 1 AS `PID`,
 1 AS `GID`,
 1 AS `MID`,
 1 AS `PVal`,
 1 AS `Modul_Name`,
 1 AS `Modul_description`,
 1 AS `Pengguna_kode`,
 1 AS `Pengguna_nama`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_group_user`
--

DROP TABLE IF EXISTS `view_group_user`;
/*!50001 DROP VIEW IF EXISTS `view_group_user`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_group_user` AS SELECT 
 1 AS `PGID`,
 1 AS `GID`,
 1 AS `Pengguna_kode`,
 1 AS `Pengguna_nama`,
 1 AS `Group_Name`,
 1 AS `Group_Description`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_lap_by_company`
--

DROP TABLE IF EXISTS `view_lap_by_company`;
/*!50001 DROP VIEW IF EXISTS `view_lap_by_company`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_lap_by_company` AS SELECT 
 1 AS `Perusahaan_Kode`,
 1 AS `Perusahaan_Nama`,
 1 AS `Tahap_Kode`,
 1 AS `Tahap_Nama`,
 1 AS `icat`,
 1 AS `Penerimaan_Tempat_Bayar`,
 1 AS `jumlah`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_list_beban_simple`
--

DROP TABLE IF EXISTS `view_list_beban_simple`;
/*!50001 DROP VIEW IF EXISTS `view_list_beban_simple`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_list_beban_simple` AS SELECT 
 1 AS `kend_header_id`,
 1 AS `kend_detail_id`,
 1 AS `costcenter_beban`,
 1 AS `Description`,
 1 AS `customer_beban`,
 1 AS `NamaCustomer`,
 1 AS `deskripsi_beban`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_list_kendaraan`
--

DROP TABLE IF EXISTS `view_list_kendaraan`;
/*!50001 DROP VIEW IF EXISTS `view_list_kendaraan`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_list_kendaraan` AS SELECT 
 1 AS `KID`,
 1 AS `type_kend`,
 1 AS `COcd`,
 1 AS `BusA`,
 1 AS `desk`,
 1 AS `TNKB`,
 1 AS `CC`,
 1 AS `TNKB_OLD`,
 1 AS `Rangka`,
 1 AS `Mesin`,
 1 AS `Aktive`,
 1 AS `keterangan`,
 1 AS `pencarian`,
 1 AS `tgl_STNKB`,
 1 AS `tgl_PKB`,
 1 AS `tgl_KIER`,
 1 AS `hari_perpj_STNKB`,
 1 AS `hari_perpj_PKB`,
 1 AS `hari_perpj_KIER`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_maxstat`
--

DROP TABLE IF EXISTS `view_maxstat`;
/*!50001 DROP VIEW IF EXISTS `view_maxstat`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_maxstat` AS SELECT 
 1 AS `maxkode`,
 1 AS `status_tanggal`,
 1 AS `penerimaan_kode`,
 1 AS `status_value`,
 1 AS `status_reason`,
 1 AS `status_action`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_maxstat_2`
--

DROP TABLE IF EXISTS `view_maxstat_2`;
/*!50001 DROP VIEW IF EXISTS `view_maxstat_2`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_maxstat_2` AS SELECT 
 1 AS `maxkode`,
 1 AS `status_tanggal`,
 1 AS `penerimaan_kode`,
 1 AS `status_value`,
 1 AS `status_reason`,
 1 AS `status_action`,
 1 AS `maxid`,
 1 AS `maxtg`,
 1 AS `kode_Terima`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_menu`
--

DROP TABLE IF EXISTS `view_menu`;
/*!50001 DROP VIEW IF EXISTS `view_menu`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_menu` AS SELECT 
 1 AS `Menu_id`,
 1 AS `Menu_Parent`,
 1 AS `Menu_order`,
 1 AS `Menu_label`,
 1 AS `Menu_link`,
 1 AS `Menu_fa_icon`,
 1 AS `Menu_Action`,
 1 AS `jumlahchild`,
 1 AS `Menu_page_path`,
 1 AS `MID`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_menu_by_group_permission`
--

DROP TABLE IF EXISTS `view_menu_by_group_permission`;
/*!50001 DROP VIEW IF EXISTS `view_menu_by_group_permission`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_menu_by_group_permission` AS SELECT 
 1 AS `Menu_id`,
 1 AS `Menu_Parent`,
 1 AS `Menu_order`,
 1 AS `Menu_label`,
 1 AS `Menu_link`,
 1 AS `Menu_fa_icon`,
 1 AS `Menu_Action`,
 1 AS `Menu_page_path`,
 1 AS `MID`,
 1 AS `Pengguna_kode`,
 1 AS `Pengguna_nama`,
 1 AS `GID`,
 1 AS `Group_Name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_menu_by_pengguna`
--

DROP TABLE IF EXISTS `view_menu_by_pengguna`;
/*!50001 DROP VIEW IF EXISTS `view_menu_by_pengguna`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_menu_by_pengguna` AS SELECT 
 1 AS `Menu_id`,
 1 AS `Menu_Parent`,
 1 AS `Menu_order`,
 1 AS `Menu_label`,
 1 AS `Menu_link`,
 1 AS `Menu_fa_icon`,
 1 AS `Menu_Action`,
 1 AS `jumlahchild`,
 1 AS `Menu_page_path`,
 1 AS `MID`,
 1 AS `Modul_Name`,
 1 AS `PVal`,
 1 AS `Modul_description`,
 1 AS `Pengguna_kode`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_payto`
--

DROP TABLE IF EXISTS `view_payto`;
/*!50001 DROP VIEW IF EXISTS `view_payto`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_payto` AS SELECT 
 1 AS `id_rek`,
 1 AS `nama_rek`,
 1 AS `bank_rek`,
 1 AS `no_rek`,
 1 AS `acchold_rek`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_penerimaan`
--

DROP TABLE IF EXISTS `view_penerimaan`;
/*!50001 DROP VIEW IF EXISTS `view_penerimaan`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_penerimaan` AS SELECT 
 1 AS `Penerimaan_Kode`,
 1 AS `Penerimaan_Tanggal`,
 1 AS `Penerimaan_Tempat_Bayar`,
 1 AS `Vendor_kode`,
 1 AS `Vendor_Nama`,
 1 AS `Penerimaan_PO`,
 1 AS `Penerimaan_Nilai`,
 1 AS `Perusahaan_Kode`,
 1 AS `Perusahaan_Nama`,
 1 AS `Tahap_Kode`,
 1 AS `Tahap_Nama`,
 1 AS `Pengguna_kode`,
 1 AS `Pengguna_nama`,
 1 AS `shortcut`,
 1 AS `vendor`,
 1 AS `icat`,
 1 AS `Penerimaan_BA`,
 1 AS `Tahap_Tahun`,
 1 AS `Perusahaan_NPWP`,
 1 AS `Perusahaan_Alamat`,
 1 AS `Vendor_NPWP`,
 1 AS `Vendor_Alamat`,
 1 AS `status_value`,
 1 AS `status_reason`,
 1 AS `Penerimaan_Attachment1`,
 1 AS `Penerimaan_Attachment2`,
 1 AS `Penerimaan_Attachment3`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_penerimaan_2`
--

DROP TABLE IF EXISTS `view_penerimaan_2`;
/*!50001 DROP VIEW IF EXISTS `view_penerimaan_2`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_penerimaan_2` AS SELECT 
 1 AS `Penerimaan_Kode`,
 1 AS `Penerimaan_Tanggal`,
 1 AS `Penerimaan_Tempat_Bayar`,
 1 AS `Vendor_kode`,
 1 AS `Vendor_Nama`,
 1 AS `Penerimaan_PO`,
 1 AS `Penerimaan_Nilai`,
 1 AS `Perusahaan_Kode`,
 1 AS `Perusahaan_Nama`,
 1 AS `Tahap_Kode`,
 1 AS `Tahap_Nama`,
 1 AS `Pengguna_kode`,
 1 AS `Pengguna_nama`,
 1 AS `shortcut`,
 1 AS `vendor`,
 1 AS `icat`,
 1 AS `Penerimaan_BA`,
 1 AS `Tahap_Tahun`,
 1 AS `Perusahaan_NPWP`,
 1 AS `Perusahaan_Alamat`,
 1 AS `Vendor_NPWP`,
 1 AS `Vendor_Alamat`,
 1 AS `status_value`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_permision_modul_grupuser`
--

DROP TABLE IF EXISTS `view_permision_modul_grupuser`;
/*!50001 DROP VIEW IF EXISTS `view_permision_modul_grupuser`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_permision_modul_grupuser` AS SELECT 
 1 AS `PID`,
 1 AS `GID`,
 1 AS `MID`,
 1 AS `PVal`,
 1 AS `Modul_Name`,
 1 AS `Modul_description`,
 1 AS `Group_Name`,
 1 AS `Group_Description`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_pilih_template`
--

DROP TABLE IF EXISTS `view_pilih_template`;
/*!50001 DROP VIEW IF EXISTS `view_pilih_template`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_pilih_template` AS SELECT 
 1 AS `tmp_detail_id`,
 1 AS `tmp_header_id`,
 1 AS `costcenter_beban`,
 1 AS `customer_beban`,
 1 AS `deskripsi_beban`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_stat_max`
--

DROP TABLE IF EXISTS `view_stat_max`;
/*!50001 DROP VIEW IF EXISTS `view_stat_max`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_stat_max` AS SELECT 
 1 AS `maxid`,
 1 AS `maxtg`,
 1 AS `kode_Terima`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_status`
--

DROP TABLE IF EXISTS `view_status`;
/*!50001 DROP VIEW IF EXISTS `view_status`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_status` AS SELECT 
 1 AS `Penerimaan_Kode`,
 1 AS `Penerimaan_Tanggal`,
 1 AS `Penerimaan_Tempat_Bayar`,
 1 AS `Vendor_kode`,
 1 AS `Vendor_Nama`,
 1 AS `Penerimaan_PO`,
 1 AS `Penerimaan_Nilai`,
 1 AS `Perusahaan_Kode`,
 1 AS `Perusahaan_Nama`,
 1 AS `Tahap_Kode`,
 1 AS `Tahap_Nama`,
 1 AS `Pengguna_kode`,
 1 AS `Pengguna_nama`,
 1 AS `shortcut`,
 1 AS `status_kode`,
 1 AS `status_value`,
 1 AS `status_reason`,
 1 AS `status_action`,
 1 AS `status_tanggal`,
 1 AS `icat`,
 1 AS `Penerimaan_BA`,
 1 AS `Tahap_Tahun`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_status_max`
--

DROP TABLE IF EXISTS `view_status_max`;
/*!50001 DROP VIEW IF EXISTS `view_status_max`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_status_max` AS SELECT 
 1 AS `Penerimaan_Kode`,
 1 AS `Penerimaan_Tanggal`,
 1 AS `Penerimaan_Tempat_Bayar`,
 1 AS `Vendor_kode`,
 1 AS `Vendor_Nama`,
 1 AS `Penerimaan_PO`,
 1 AS `Penerimaan_Nilai`,
 1 AS `Perusahaan_Kode`,
 1 AS `Perusahaan_Nama`,
 1 AS `Tahap_Kode`,
 1 AS `Tahap_Nama`,
 1 AS `Pengguna_kode`,
 1 AS `Pengguna_nama`,
 1 AS `shortcut`,
 1 AS `status_kode`,
 1 AS `status_value`,
 1 AS `status_reason`,
 1 AS `status_action`,
 1 AS `status_tanggal`,
 1 AS `kode`,
 1 AS `icat`,
 1 AS `Penerimaan_BA`,
 1 AS `Tahap_Tahun`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_tahap`
--

DROP TABLE IF EXISTS `view_tahap`;
/*!50001 DROP VIEW IF EXISTS `view_tahap`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_tahap` AS SELECT 
 1 AS `Tahap_Kode`,
 1 AS `Tahap_Nama`,
 1 AS `Tahap_Tanggal_Awal`,
 1 AS `Tahap_Tahun`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_upload53`
--

DROP TABLE IF EXISTS `view_upload53`;
/*!50001 DROP VIEW IF EXISTS `view_upload53`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_upload53` AS SELECT 
 1 AS `kode_upload`,
 1 AS `Perusahaan_kode`,
 1 AS `Tahap_kode`,
 1 AS `Doc_Date`,
 1 AS `BA_kode`,
 1 AS `Vendor_kode`,
 1 AS `Vendor_Nama`,
 1 AS `Amount`,
 1 AS `PO_number`,
 1 AS `Assign`,
 1 AS `PO_Text`,
 1 AS `Doc_num`,
 1 AS `ref`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_upload_pph23`
--

DROP TABLE IF EXISTS `view_upload_pph23`;
/*!50001 DROP VIEW IF EXISTS `view_upload_pph23`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_upload_pph23` AS SELECT 
 1 AS `Cocd`,
 1 AS `Bulan`,
 1 AS `tahun`,
 1 AS `count`,
 1 AS `PostingDate`,
 1 AS `DocRef`,
 1 AS `Reference`,
 1 AS `BusArea`,
 1 AS `Amount`,
 1 AS `vendor_kode`,
 1 AS `Po_text`,
 1 AS `Vendor_Nama`,
 1 AS `Vendor_NPWP`,
 1 AS `Vendor_Alamat`,
 1 AS `Vendor_Jasa`,
 1 AS `PO`,
 1 AS `Vendor_PPH`,
 1 AS `vendor_PPH_tarif`,
 1 AS `pph`,
 1 AS `GLAccount`,
 1 AS `Perusahaan_Nama`,
 1 AS `Perusahaan_NPWP`,
 1 AS `Perusahaan_Alamat`,
 1 AS `DocDate`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_vendor_nama`
--

DROP TABLE IF EXISTS `view_vendor_nama`;
/*!50001 DROP VIEW IF EXISTS `view_vendor_nama`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_vendor_nama` AS SELECT 
 1 AS `vendor`,
 1 AS `kode`,
 1 AS `Vendor_NPWP`,
 1 AS `Vendor_Alamat`,
 1 AS `Vendor_Jasa`,
 1 AS `Vendor_PPH`,
 1 AS `vendor_PPH_tarif`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_ba_search`
--

/*!50001 DROP VIEW IF EXISTS `view_ba_search`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_ba_search` AS select `tbl_m_ba`.`BA_Kode` AS `BA_Kode`,`tbl_m_ba`.`BA_NAME` AS `BA_NAME`,`tbl_m_ba`.`BA_NAME_LONG` AS `BA_NAME_LONG`,`tbl_m_ba`.`Perusahaan_Kode` AS `Perusahaan_Kode`,`tbl_m_ba`.`BA_CUST` AS `BA_CUST`,`tbl_m_ba`.`BA_VEND` AS `BA_VEND` from `tbl_m_ba` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_beban_kend_detail`
--

/*!50001 DROP VIEW IF EXISTS `view_beban_kend_detail`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_beban_kend_detail` AS select `tbl_t_kend_beban_detail`.`kend_detail_id` AS `kend_detail_id`,`tbl_t_kend_beban_detail`.`kend_header_id` AS `kend_header_id`,`tbl_t_kend_beban_detail`.`tgl_awal_detail` AS `tgl_awal_detail`,`tbl_t_kend_beban_detail`.`tgl_akhir_detail` AS `tgl_akhir_detail`,`tbl_t_kend_beban_detail`.`km_awal_detail` AS `km_awal_detail`,`tbl_t_kend_beban_detail`.`km_akhir_detail` AS `km_akhir_detail`,`tbl_t_kend_beban_detail`.`costcenter_beban` AS `costcenter_beban`,`tbl_t_kend_beban_detail`.`customer_beban` AS `customer_beban`,`tbl_t_kend_beban_detail`.`deskripsi_beban` AS `deskripsi_beban`,`view_beban_kend_header`.`kend_id` AS `kend_id`,`view_beban_kend_header`.`K_DESC` AS `K_DESC`,`view_beban_kend_header`.`K_CC` AS `K_CC`,`view_beban_kend_header`.`Cocd` AS `Cocd`,`view_beban_kend_header`.`BusA` AS `BusA`,(`view_beban_kend_header`.`km_akhir_header` - `view_beban_kend_header`.`km_awal_header`) AS `Total_KM_Header`,(`tbl_t_kend_beban_detail`.`km_akhir_detail` - `tbl_t_kend_beban_detail`.`km_awal_detail`) AS `Total_KM`,`view_beban_kend_header`.`total_biaya_header` AS `total_biaya_header`,((`tbl_t_kend_beban_detail`.`km_akhir_detail` - `tbl_t_kend_beban_detail`.`km_awal_detail`) * `view_beban_kend_header`.`rate_KM`) AS `total_biaya`,`view_beban_kend_header`.`bulan_header` AS `bulan_header`,`view_beban_kend_header`.`tahun_header` AS `tahun_header`,`view_beban_kend_header`.`K_TNKB` AS `K_TNKB`,`view_beban_kend_header`.`km_awal_header` AS `km_awal_header`,`view_beban_kend_header`.`km_akhir_header` AS `km_akhir_header`,`view_beban_kend_header`.`tgl_awal_header` AS `tgl_awal_header`,`view_beban_kend_header`.`tgl_akhir_header` AS `tgl_akhir_header`,`tbl_m_customer`.`NamaCustomer` AS `NamaCustomer`,`tbl_m_costcenter`.`Description` AS `Description`,`view_beban_kend_header`.`rate_KM` AS `rate_KM`,`tbl_t_kend_beban_detail`.`biaya_beban` AS `biaya_beban` from (((`tbl_t_kend_beban_detail` left join `view_beban_kend_header` on((`tbl_t_kend_beban_detail`.`kend_header_id` = `view_beban_kend_header`.`kend_header_id`))) left join `tbl_m_costcenter` on((`tbl_m_costcenter`.`CostCenter` = `tbl_t_kend_beban_detail`.`costcenter_beban`))) left join `tbl_m_customer` on((`tbl_m_customer`.`CustomerID` = `tbl_t_kend_beban_detail`.`customer_beban`))) order by `tbl_t_kend_beban_detail`.`kend_header_id`,`tbl_t_kend_beban_detail`.`km_awal_detail` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_beban_kend_header`
--

/*!50001 DROP VIEW IF EXISTS `view_beban_kend_header`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_beban_kend_header` AS select `tbl_t_kend_beban_header`.`kend_header_id` AS `kend_header_id`,`tbl_t_kend_beban_header`.`Cocd` AS `Cocd`,`tbl_t_kend_beban_header`.`BusA` AS `BusA`,`tbl_t_kend_beban_header`.`tahun_header` AS `tahun_header`,`tbl_t_kend_beban_header`.`bulan_header` AS `bulan_header`,`tbl_t_kend_beban_header`.`kend_id` AS `kend_id`,`tbl_m_kend`.`K_DESC` AS `K_DESC`,`tbl_m_kend`.`K_TNKB` AS `K_TNKB`,`tbl_m_kend`.`K_CC` AS `K_CC`,`tbl_t_kend_beban_header`.`total_biaya_header` AS `total_biaya_header`,`tbl_t_kend_beban_header`.`km_awal_header` AS `km_awal_header`,`tbl_t_kend_beban_header`.`km_akhir_header` AS `km_akhir_header`,`tbl_t_kend_beban_header`.`tgl_awal_header` AS `tgl_awal_header`,`tbl_t_kend_beban_header`.`tgl_akhir_header` AS `tgl_akhir_header`,concat_ws(' ',`tbl_m_kend`.`K_DESC`,`tbl_m_kend`.`K_TNKB`,`tbl_m_kend`.`K_TNKB_OLD`,`tbl_m_kend`.`K_CC`) AS `pencarian`,floor((`tbl_t_kend_beban_header`.`total_biaya_header` / (`tbl_t_kend_beban_header`.`km_akhir_header` - `tbl_t_kend_beban_header`.`km_awal_header`))) AS `rate_KM` from (`tbl_t_kend_beban_header` left join `tbl_m_kend` on((`tbl_m_kend`.`KID` = `tbl_t_kend_beban_header`.`kend_id`))) order by `tbl_m_kend`.`K_CC` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_cari_beban`
--

/*!50001 DROP VIEW IF EXISTS `view_cari_beban`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_cari_beban` AS select `tbl_m_costcenter`.`CostCenter` AS `AccBeban`,`tbl_m_costcenter`.`Description` AS `NamaBeban`,`tbl_m_costcenter`.`ShortCC` AS `short`,concat_ws(' ',`tbl_m_costcenter`.`CostCenter`,`tbl_m_costcenter`.`Description`,`tbl_m_costcenter`.`ShortCC`) AS `pencarian`,'CC' AS `typebeban` from `tbl_m_costcenter` union all select `tbl_m_customer`.`CustomerID` AS `AccBeban`,`tbl_m_customer`.`NamaCustomer` AS `NamaBeban`,`tbl_m_customer`.`ShortCustomer` AS `short`,concat_ws(' ',`tbl_m_customer`.`CustomerID`,`tbl_m_customer`.`NamaCustomer`,`tbl_m_customer`.`ShortCustomer`) AS `pencarian`,'CU' AS `typebeban` from `tbl_m_customer` order by `AccBeban` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_cc_kend`
--

/*!50001 DROP VIEW IF EXISTS `view_cc_kend`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_cc_kend` AS select `tbl_m_costcenter`.`CostCenter` AS `CostCenter`,concat_ws(' - ',`tbl_m_costcenter`.`Description`,`tbl_m_costcenter`.`CostCenter`) AS `descriptions` from `tbl_m_costcenter` where (`tbl_m_costcenter`.`CostCenter` like '%147%') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_company_nama`
--

/*!50001 DROP VIEW IF EXISTS `view_company_nama`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_company_nama` AS select concat(`tbl_m_perusahaan`.`Perusahaan_Kode`,'  ',`tbl_m_perusahaan`.`Perusahaan_Nama`) AS `company`,`tbl_m_perusahaan`.`Perusahaan_Kode` AS `kode` from `tbl_m_perusahaan` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_count_penerimaan_by_pt`
--

/*!50001 DROP VIEW IF EXISTS `view_count_penerimaan_by_pt`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_count_penerimaan_by_pt` AS select count(`view_penerimaan`.`Penerimaan_Kode`) AS `jumlah`,`view_penerimaan`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`view_penerimaan`.`Tahap_Nama` AS `Tahap_Nama`,`view_penerimaan`.`Penerimaan_Tempat_Bayar` AS `Penerimaan_Tempat_Bayar`,`view_penerimaan`.`icat` AS `Jenis_PO` from `view_penerimaan` group by `view_penerimaan`.`Perusahaan_Kode` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_count_penerimaan_by_pt_tahap_tempat`
--

/*!50001 DROP VIEW IF EXISTS `view_count_penerimaan_by_pt_tahap_tempat`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_count_penerimaan_by_pt_tahap_tempat` AS select count(`view_penerimaan`.`Penerimaan_Kode`) AS `jumlah`,`view_penerimaan`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`view_penerimaan`.`Tahap_Nama` AS `Tahap_Nama`,`view_penerimaan`.`Penerimaan_Tempat_Bayar` AS `Penerimaan_Tempat_Bayar` from `view_penerimaan` group by `view_penerimaan`.`Perusahaan_Kode`,`view_penerimaan`.`Tahap_Kode`,`view_penerimaan`.`Penerimaan_Tempat_Bayar` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_count_penerimaan_by_pt_tahap_tempat_jenis`
--

/*!50001 DROP VIEW IF EXISTS `view_count_penerimaan_by_pt_tahap_tempat_jenis`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_count_penerimaan_by_pt_tahap_tempat_jenis` AS select count(`view_penerimaan`.`Penerimaan_Kode`) AS `jumlah`,`view_penerimaan`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`view_penerimaan`.`Tahap_Nama` AS `Tahap_Nama`,`view_penerimaan`.`Penerimaan_Tempat_Bayar` AS `Penerimaan_Tempat_Bayar`,`view_penerimaan`.`icat` AS `Jenis_PO` from `view_penerimaan` group by `view_penerimaan`.`Perusahaan_Kode`,`view_penerimaan`.`Tahap_Kode`,`view_penerimaan`.`Penerimaan_Tempat_Bayar`,`view_penerimaan`.`icat` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_detail_ba`
--

/*!50001 DROP VIEW IF EXISTS `view_detail_ba`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_detail_ba` AS select `tbl_m_ba`.`BA_Kode` AS `BA_Kode`,`tbl_m_ba`.`BA_NAME` AS `BA_NAME`,`tbl_m_ba`.`Perusahaan_Kode` AS `Perusahaan_Kode`,`tbl_m_ba`.`BA_CUST` AS `BA_CUST`,`tbl_m_ba`.`BA_VEND` AS `BA_VEND`,`tbl_m_ba`.`Email_Manager_site` AS `Email_Manager_site`,`tbl_m_ba`.`Email_KTU_KASIE1` AS `Email_KTU_KASIE1`,`tbl_m_ba`.`Email_KTU_KASIE2` AS `Email_KTU_KASIE2`,`tbl_m_ba`.`Email_Operator` AS `Email_Operator`,`tbl_m_ba`.`Email_Traksi` AS `Email_Traksi`,`tbl_m_ba`.`BA_kode_AMA` AS `BA_kode_AMA`,`tbl_m_perusahaan`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`tbl_m_ba`.`BA_NAME_LONG` AS `BA_NAME_LONG`,`tbl_m_ba`.`BA_Manager` AS `BA_Manager`,`tbl_m_ba`.`BA_KTU_KASIE1` AS `BA_KTU_KASIE1`,`tbl_m_ba`.`BA_KTU_KASIE2` AS `BA_KTU_KASIE2`,`tbl_m_ba`.`BA_Manager_contact` AS `BA_Manager_contact`,`tbl_m_ba`.`Ba_KTU_KASIE1_contact` AS `Ba_KTU_KASIE1_contact`,`tbl_m_ba`.`Ba_KTU_KASIE2_contact` AS `Ba_KTU_KASIE2_contact`,`tbl_m_ba`.`Email_Gudang` AS `Email_Gudang` from (`tbl_m_ba` join `tbl_m_perusahaan` on((`tbl_m_perusahaan`.`Perusahaan_Kode` = `tbl_m_ba`.`Perusahaan_Kode`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_email_ba`
--

/*!50001 DROP VIEW IF EXISTS `view_email_ba`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_email_ba` AS select `tbl_m_ba`.`BA_Kode` AS `BA_Kode`,`tbl_m_ba`.`BA_NAME` AS `BA_NAME`,concat_ws(', ',nullif(`tbl_m_ba`.`Email_Manager_site`,''),nullif(`tbl_m_ba`.`Email_KTU_KASIE1`,''),nullif(`tbl_m_ba`.`Email_KTU_KASIE2`,''),nullif(`tbl_m_ba`.`Email_Operator`,''),nullif(`tbl_m_ba`.`Email_Traksi`,'')) AS `email` from `tbl_m_ba` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_email_ba_2`
--

/*!50001 DROP VIEW IF EXISTS `view_email_ba_2`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_email_ba_2` AS select `tbl_m_ba`.`BA_Kode` AS `BA_Kode`,`tbl_m_ba`.`Email_Manager_site` AS `Email_Manager_site`,`tbl_m_ba`.`Email_KTU_KASIE1` AS `Email_KTU_KASIE1`,`tbl_m_ba`.`Email_KTU_KASIE2` AS `Email_KTU_KASIE2`,`tbl_m_ba`.`Email_Operator` AS `Email_Operator`,`tbl_m_ba`.`Email_Traksi` AS `Email_Traksi`,`tbl_m_ba`.`Email_Gudang` AS `Email_Gudang` from `tbl_m_ba` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_gp`
--

/*!50001 DROP VIEW IF EXISTS `view_gp`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_gp` AS select `tbl_t_permission`.`PID` AS `PID`,`tbl_t_permission`.`GID` AS `GID`,`tbl_t_permission`.`MID` AS `MID`,`tbl_t_permission`.`PVal` AS `PVal`,`tbl_m_modul`.`Modul_Name` AS `Modul_Name`,`tbl_m_modul`.`Modul_description` AS `Modul_description`,`tbl_t_pengguna_group`.`Pengguna_kode` AS `Pengguna_kode`,`tbl_m_pengguna`.`Pengguna_nama` AS `Pengguna_nama` from (((`tbl_t_permission` left join `tbl_m_modul` on((`tbl_m_modul`.`MID` = `tbl_t_permission`.`MID`))) left join `tbl_t_pengguna_group` on((`tbl_t_pengguna_group`.`GID` = `tbl_t_permission`.`GID`))) left join `tbl_m_pengguna` on((`tbl_m_pengguna`.`Pengguna_kode` = `tbl_t_pengguna_group`.`Pengguna_kode`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_group_user`
--

/*!50001 DROP VIEW IF EXISTS `view_group_user`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_group_user` AS select `tbl_t_pengguna_group`.`PGID` AS `PGID`,`tbl_t_pengguna_group`.`GID` AS `GID`,`tbl_t_pengguna_group`.`Pengguna_kode` AS `Pengguna_kode`,`tbl_m_pengguna`.`Pengguna_nama` AS `Pengguna_nama`,`tbl_m_group`.`Group_Name` AS `Group_Name`,`tbl_m_group`.`Group_Description` AS `Group_Description` from ((`tbl_t_pengguna_group` left join `tbl_m_pengguna` on((`tbl_m_pengguna`.`Pengguna_kode` = `tbl_t_pengguna_group`.`Pengguna_kode`))) left join `tbl_m_group` on((`tbl_m_group`.`GID` = `tbl_t_pengguna_group`.`GID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_lap_by_company`
--

/*!50001 DROP VIEW IF EXISTS `view_lap_by_company`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_lap_by_company` AS select `tbl_t_penerimaan`.`Perusahaan_Kode` AS `Perusahaan_Kode`,`tbl_m_perusahaan`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`tbl_t_penerimaan`.`Tahap_Kode` AS `Tahap_Kode`,`tbl_m_tahap`.`Tahap_Nama` AS `Tahap_Nama`,`tbl_t_penerimaan`.`icat` AS `icat`,`tbl_t_penerimaan`.`Penerimaan_Tempat_Bayar` AS `Penerimaan_Tempat_Bayar`,count(`tbl_t_penerimaan`.`Penerimaan_Kode`) AS `jumlah` from ((`tbl_t_penerimaan` left join `tbl_m_perusahaan` on((`tbl_m_perusahaan`.`Perusahaan_Kode` = `tbl_t_penerimaan`.`Perusahaan_Kode`))) left join `tbl_m_tahap` on((`tbl_m_tahap`.`Tahap_Kode` = `tbl_t_penerimaan`.`Tahap_Kode`))) group by `tbl_t_penerimaan`.`Perusahaan_Kode`,`tbl_t_penerimaan`.`Tahap_Kode`,`tbl_t_penerimaan`.`Penerimaan_Tempat_Bayar`,`tbl_t_penerimaan`.`icat` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_list_beban_simple`
--

/*!50001 DROP VIEW IF EXISTS `view_list_beban_simple`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_list_beban_simple` AS select `view_beban_kend_detail`.`kend_header_id` AS `kend_header_id`,`view_beban_kend_detail`.`kend_detail_id` AS `kend_detail_id`,`view_beban_kend_detail`.`costcenter_beban` AS `costcenter_beban`,`view_beban_kend_detail`.`Description` AS `Description`,`view_beban_kend_detail`.`customer_beban` AS `customer_beban`,`view_beban_kend_detail`.`NamaCustomer` AS `NamaCustomer`,`view_beban_kend_detail`.`deskripsi_beban` AS `deskripsi_beban` from `view_beban_kend_detail` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_list_kendaraan`
--

/*!50001 DROP VIEW IF EXISTS `view_list_kendaraan`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_list_kendaraan` AS select `tbl_m_kend`.`KID` AS `KID`,`tbl_m_kend`.`K_TYPE` AS `type_kend`,`tbl_m_kend`.`k_CocD` AS `COcd`,`tbl_m_kend`.`K_BusA` AS `BusA`,`tbl_m_kend`.`K_DESC` AS `desk`,`tbl_m_kend`.`K_TNKB` AS `TNKB`,`tbl_m_kend`.`K_CC` AS `CC`,`tbl_m_kend`.`K_TNKB_OLD` AS `TNKB_OLD`,`tbl_m_kend`.`K_RANGKA` AS `Rangka`,`tbl_m_kend`.`K_MESIN` AS `Mesin`,`tbl_m_kend`.`K_ACTIVE` AS `Aktive`,`tbl_m_kend`.`K_Comment` AS `keterangan`,concat_ws(' ',`tbl_m_kend`.`K_DESC`,`tbl_m_kend`.`K_TNKB`,`tbl_m_kend`.`K_TNKB_OLD`,`tbl_m_kend`.`K_CC`,`tbl_m_kend`.`K_RANGKA`,`tbl_m_kend`.`K_MESIN`,`tbl_m_kend`.`k_CocD`,`tbl_m_kend`.`K_tgl_valid_PKB`,`tbl_m_kend`.`K_Tgl_valid_STNKB`) AS `pencarian`,`tbl_m_kend`.`K_Tgl_valid_STNKB` AS `tgl_STNKB`,`tbl_m_kend`.`K_tgl_valid_PKB` AS `tgl_PKB`,`tbl_m_kend`.`K_tgl_valid_KIER` AS `tgl_KIER`,(to_days(`tbl_m_kend`.`K_Tgl_valid_STNKB`) - to_days(curdate())) AS `hari_perpj_STNKB`,(to_days(`tbl_m_kend`.`K_tgl_valid_PKB`) - to_days(curdate())) AS `hari_perpj_PKB`,(to_days(`tbl_m_kend`.`K_tgl_valid_KIER`) - to_days(curdate())) AS `hari_perpj_KIER` from `tbl_m_kend` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_maxstat`
--

/*!50001 DROP VIEW IF EXISTS `view_maxstat`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_maxstat` AS select `a`.`status_kode` AS `maxkode`,`a`.`status_tanggal` AS `status_tanggal`,`a`.`penerimaan_kode` AS `penerimaan_kode`,`a`.`status_value` AS `status_value`,`a`.`status_reason` AS `status_reason`,`a`.`status_action` AS `status_action` from (`tbl_t_status` `a` join (select `tbl_t_status`.`penerimaan_kode` AS `penerimaan_kode`,max(`tbl_t_status`.`status_kode`) AS `maxkode` from `tbl_t_status` group by `tbl_t_status`.`penerimaan_kode`) `b` on((`a`.`status_kode` = `b`.`maxkode`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_maxstat_2`
--

/*!50001 DROP VIEW IF EXISTS `view_maxstat_2`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_maxstat_2` AS select `a`.`status_kode` AS `maxkode`,`a`.`status_tanggal` AS `status_tanggal`,`a`.`penerimaan_kode` AS `penerimaan_kode`,`a`.`status_value` AS `status_value`,`a`.`status_reason` AS `status_reason`,`a`.`status_action` AS `status_action`,`b`.`maxid` AS `maxid`,`b`.`maxtg` AS `maxtg`,`b`.`kode_Terima` AS `kode_Terima` from (`tbl_t_status` `a` join `view_stat_max` `b` on((`a`.`status_kode` = `b`.`maxid`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_menu`
--

/*!50001 DROP VIEW IF EXISTS `view_menu`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_menu` AS select `a`.`Menu_id` AS `Menu_id`,`a`.`Menu_Parent` AS `Menu_Parent`,`a`.`Menu_order` AS `Menu_order`,`a`.`Menu_label` AS `Menu_label`,`a`.`Menu_link` AS `Menu_link`,`a`.`Menu_fa_icon` AS `Menu_fa_icon`,`a`.`Menu_Action` AS `Menu_Action`,(select count(`b`.`Menu_id`) from `tbl_menu` `b` where (`b`.`Menu_Parent` = `a`.`Menu_id`)) AS `jumlahchild`,`a`.`Menu_page_path` AS `Menu_page_path`,`a`.`MID` AS `MID` from `tbl_menu` `a` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_menu_by_group_permission`
--

/*!50001 DROP VIEW IF EXISTS `view_menu_by_group_permission`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_menu_by_group_permission` AS select distinct `tbl_menu`.`Menu_id` AS `Menu_id`,`tbl_menu`.`Menu_Parent` AS `Menu_Parent`,`tbl_menu`.`Menu_order` AS `Menu_order`,`tbl_menu`.`Menu_label` AS `Menu_label`,`tbl_menu`.`Menu_link` AS `Menu_link`,`tbl_menu`.`Menu_fa_icon` AS `Menu_fa_icon`,`tbl_menu`.`Menu_Action` AS `Menu_Action`,`tbl_menu`.`Menu_page_path` AS `Menu_page_path`,`tbl_menu`.`MID` AS `MID`,`view_group_user`.`Pengguna_kode` AS `Pengguna_kode`,`view_group_user`.`Pengguna_nama` AS `Pengguna_nama`,`view_permision_modul_grupuser`.`GID` AS `GID`,`view_permision_modul_grupuser`.`Group_Name` AS `Group_Name` from ((`tbl_menu` join `view_permision_modul_grupuser` on((`view_permision_modul_grupuser`.`MID` = `tbl_menu`.`MID`))) join `view_group_user` on((`view_group_user`.`GID` = `view_permision_modul_grupuser`.`GID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_menu_by_pengguna`
--

/*!50001 DROP VIEW IF EXISTS `view_menu_by_pengguna`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_menu_by_pengguna` AS select `view_menu`.`Menu_id` AS `Menu_id`,`view_menu`.`Menu_Parent` AS `Menu_Parent`,`view_menu`.`Menu_order` AS `Menu_order`,`view_menu`.`Menu_label` AS `Menu_label`,`view_menu`.`Menu_link` AS `Menu_link`,`view_menu`.`Menu_fa_icon` AS `Menu_fa_icon`,`view_menu`.`Menu_Action` AS `Menu_Action`,`view_menu`.`jumlahchild` AS `jumlahchild`,`view_menu`.`Menu_page_path` AS `Menu_page_path`,`view_menu`.`MID` AS `MID`,`view_gp`.`Modul_Name` AS `Modul_Name`,`view_gp`.`PVal` AS `PVal`,`view_gp`.`Modul_description` AS `Modul_description`,`view_gp`.`Pengguna_kode` AS `Pengguna_kode` from (`view_gp` straight_join `view_menu` on((`view_gp`.`MID` = `view_menu`.`MID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_payto`
--

/*!50001 DROP VIEW IF EXISTS `view_payto`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_payto` AS select `tbl_m_payto`.`payto_id` AS `id_rek`,`tbl_m_payto`.`payto` AS `nama_rek`,`tbl_m_payto`.`payto_bankkey` AS `bank_rek`,`tbl_m_payto`.`payto_norek` AS `no_rek`,`tbl_m_payto`.`payto_account_holder` AS `acchold_rek` from `tbl_m_payto` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_penerimaan`
--

/*!50001 DROP VIEW IF EXISTS `view_penerimaan`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_penerimaan` AS select `tbl_t_penerimaan`.`Penerimaan_Kode` AS `Penerimaan_Kode`,`tbl_t_penerimaan`.`Penerimaan_Tanggal` AS `Penerimaan_Tanggal`,`tbl_t_penerimaan`.`Penerimaan_Tempat_Bayar` AS `Penerimaan_Tempat_Bayar`,`tbl_t_penerimaan`.`Vendor_kode` AS `Vendor_kode`,`tbl_m_vendor`.`Vendor_Nama` AS `Vendor_Nama`,`tbl_t_penerimaan`.`Penerimaan_PO` AS `Penerimaan_PO`,`tbl_t_penerimaan`.`Penerimaan_Nilai` AS `Penerimaan_Nilai`,`tbl_t_penerimaan`.`Perusahaan_Kode` AS `Perusahaan_Kode`,`tbl_m_perusahaan`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`tbl_t_penerimaan`.`Tahap_Kode` AS `Tahap_Kode`,`tbl_m_tahap`.`Tahap_Nama` AS `Tahap_Nama`,`tbl_t_penerimaan`.`Pengguna_kode` AS `Pengguna_kode`,`tbl_m_pengguna`.`Pengguna_nama` AS `Pengguna_nama`,concat(`tbl_t_penerimaan`.`Penerimaan_PO`,'-',`tbl_m_vendor`.`Vendor_Nama`) AS `shortcut`,concat(`tbl_t_penerimaan`.`Vendor_kode`,'-',`tbl_m_vendor`.`Vendor_Nama`) AS `vendor`,`tbl_t_penerimaan`.`icat` AS `icat`,`tbl_t_penerimaan`.`Penerimaan_BA` AS `Penerimaan_BA`,`tbl_m_tahap`.`Tahap_Tahun` AS `Tahap_Tahun`,`tbl_m_perusahaan`.`Perusahaan_NPWP` AS `Perusahaan_NPWP`,`tbl_m_perusahaan`.`Perusahaan_Alamat` AS `Perusahaan_Alamat`,`tbl_m_vendor`.`Vendor_NPWP` AS `Vendor_NPWP`,`tbl_m_vendor`.`Vendor_Alamat` AS `Vendor_Alamat`,`view_maxstat`.`status_value` AS `status_value`,`view_maxstat`.`status_reason` AS `status_reason`,`tbl_t_penerimaan`.`Penerimaan_Attachment1` AS `Penerimaan_Attachment1`,`tbl_t_penerimaan`.`Penerimaan_Attachment2` AS `Penerimaan_Attachment2`,`tbl_t_penerimaan`.`Penerimaan_Attachment3` AS `Penerimaan_Attachment3` from (`view_maxstat` left join ((((`tbl_t_penerimaan` left join `tbl_m_vendor` on((`tbl_m_vendor`.`Vendor_Kode` = `tbl_t_penerimaan`.`Vendor_kode`))) left join `tbl_m_tahap` on((`tbl_m_tahap`.`Tahap_Kode` = `tbl_t_penerimaan`.`Tahap_Kode`))) left join `tbl_m_perusahaan` on((`tbl_m_perusahaan`.`Perusahaan_Kode` = `tbl_t_penerimaan`.`Perusahaan_Kode`))) left join `tbl_m_pengguna` on((`tbl_m_pengguna`.`Pengguna_kode` = `tbl_t_penerimaan`.`Pengguna_kode`))) on((`view_maxstat`.`penerimaan_kode` = `tbl_t_penerimaan`.`Penerimaan_Kode`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_penerimaan_2`
--

/*!50001 DROP VIEW IF EXISTS `view_penerimaan_2`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_penerimaan_2` AS select `tbl_t_penerimaan`.`Penerimaan_Kode` AS `Penerimaan_Kode`,`tbl_t_penerimaan`.`Penerimaan_Tanggal` AS `Penerimaan_Tanggal`,`tbl_t_penerimaan`.`Penerimaan_Tempat_Bayar` AS `Penerimaan_Tempat_Bayar`,`tbl_t_penerimaan`.`Vendor_kode` AS `Vendor_kode`,`tbl_m_vendor`.`Vendor_Nama` AS `Vendor_Nama`,`tbl_t_penerimaan`.`Penerimaan_PO` AS `Penerimaan_PO`,`tbl_t_penerimaan`.`Penerimaan_Nilai` AS `Penerimaan_Nilai`,`tbl_t_penerimaan`.`Perusahaan_Kode` AS `Perusahaan_Kode`,`tbl_m_perusahaan`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`tbl_t_penerimaan`.`Tahap_Kode` AS `Tahap_Kode`,`tbl_m_tahap`.`Tahap_Nama` AS `Tahap_Nama`,`tbl_t_penerimaan`.`Pengguna_kode` AS `Pengguna_kode`,`tbl_m_pengguna`.`Pengguna_nama` AS `Pengguna_nama`,concat(`tbl_t_penerimaan`.`Penerimaan_PO`,'-',`tbl_m_vendor`.`Vendor_Nama`) AS `shortcut`,concat(`tbl_t_penerimaan`.`Vendor_kode`,'-',`tbl_m_vendor`.`Vendor_Nama`) AS `vendor`,`tbl_t_penerimaan`.`icat` AS `icat`,`tbl_t_penerimaan`.`Penerimaan_BA` AS `Penerimaan_BA`,`tbl_m_tahap`.`Tahap_Tahun` AS `Tahap_Tahun`,`tbl_m_perusahaan`.`Perusahaan_NPWP` AS `Perusahaan_NPWP`,`tbl_m_perusahaan`.`Perusahaan_Alamat` AS `Perusahaan_Alamat`,`tbl_m_vendor`.`Vendor_NPWP` AS `Vendor_NPWP`,`tbl_m_vendor`.`Vendor_Alamat` AS `Vendor_Alamat`,`view_maxstat`.`status_value` AS `status_value` from (((((`tbl_t_penerimaan` left join `tbl_m_vendor` on((`tbl_m_vendor`.`Vendor_Kode` = `tbl_t_penerimaan`.`Vendor_kode`))) left join `tbl_m_tahap` on((`tbl_m_tahap`.`Tahap_Kode` = `tbl_t_penerimaan`.`Tahap_Kode`))) left join `tbl_m_perusahaan` on((`tbl_m_perusahaan`.`Perusahaan_Kode` = `tbl_t_penerimaan`.`Perusahaan_Kode`))) left join `tbl_m_pengguna` on((`tbl_m_pengguna`.`Pengguna_kode` = `tbl_t_penerimaan`.`Pengguna_kode`))) left join `view_maxstat` on((`view_maxstat`.`penerimaan_kode` = `tbl_t_penerimaan`.`Penerimaan_Kode`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_permision_modul_grupuser`
--

/*!50001 DROP VIEW IF EXISTS `view_permision_modul_grupuser`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_permision_modul_grupuser` AS select `tbl_t_permission`.`PID` AS `PID`,`tbl_t_permission`.`GID` AS `GID`,`tbl_t_permission`.`MID` AS `MID`,`tbl_t_permission`.`PVal` AS `PVal`,`tbl_m_modul`.`Modul_Name` AS `Modul_Name`,`tbl_m_modul`.`Modul_description` AS `Modul_description`,`tbl_m_group`.`Group_Name` AS `Group_Name`,`tbl_m_group`.`Group_Description` AS `Group_Description` from ((`tbl_t_permission` left join `tbl_m_modul` on((`tbl_m_modul`.`MID` = `tbl_t_permission`.`MID`))) left join `tbl_m_group` on((`tbl_m_group`.`GID` = `tbl_t_permission`.`GID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_pilih_template`
--

/*!50001 DROP VIEW IF EXISTS `view_pilih_template`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_pilih_template` AS select `tbl_t_template_beban_kend_detail`.`tmp_detail_id` AS `tmp_detail_id`,`tbl_t_template_beban_kend_detail`.`tmp_header_id` AS `tmp_header_id`,`tbl_t_template_beban_kend_detail`.`costcenter_beban` AS `costcenter_beban`,`tbl_t_template_beban_kend_detail`.`customer_beban` AS `customer_beban`,`tbl_t_template_beban_kend_detail`.`deskripsi_beban` AS `deskripsi_beban` from `tbl_t_template_beban_kend_detail` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_stat_max`
--

/*!50001 DROP VIEW IF EXISTS `view_stat_max`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_stat_max` AS select max(`tbl_t_status`.`status_kode`) AS `maxid`,max(`tbl_t_status`.`status_tanggal`) AS `maxtg`,`tbl_t_status`.`penerimaan_kode` AS `kode_Terima` from `tbl_t_status` group by `tbl_t_status`.`penerimaan_kode` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_status`
--

/*!50001 DROP VIEW IF EXISTS `view_status`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_status` AS select `view_penerimaan`.`Penerimaan_Kode` AS `Penerimaan_Kode`,`view_penerimaan`.`Penerimaan_Tanggal` AS `Penerimaan_Tanggal`,`view_penerimaan`.`Penerimaan_Tempat_Bayar` AS `Penerimaan_Tempat_Bayar`,`view_penerimaan`.`Vendor_kode` AS `Vendor_kode`,`view_penerimaan`.`Vendor_Nama` AS `Vendor_Nama`,`view_penerimaan`.`Penerimaan_PO` AS `Penerimaan_PO`,`view_penerimaan`.`Penerimaan_Nilai` AS `Penerimaan_Nilai`,`view_penerimaan`.`Perusahaan_Kode` AS `Perusahaan_Kode`,`view_penerimaan`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`view_penerimaan`.`Tahap_Kode` AS `Tahap_Kode`,`view_penerimaan`.`Tahap_Nama` AS `Tahap_Nama`,`view_penerimaan`.`Pengguna_kode` AS `Pengguna_kode`,`view_penerimaan`.`Pengguna_nama` AS `Pengguna_nama`,`view_penerimaan`.`shortcut` AS `shortcut`,`tbl_t_status`.`status_kode` AS `status_kode`,`tbl_t_status`.`status_value` AS `status_value`,`tbl_t_status`.`status_reason` AS `status_reason`,`tbl_t_status`.`status_action` AS `status_action`,`tbl_t_status`.`status_tanggal` AS `status_tanggal`,`view_penerimaan`.`icat` AS `icat`,`view_penerimaan`.`Penerimaan_BA` AS `Penerimaan_BA`,`view_penerimaan`.`Tahap_Tahun` AS `Tahap_Tahun` from (`view_penerimaan` left join `tbl_t_status` on((`tbl_t_status`.`penerimaan_kode` = `view_penerimaan`.`Penerimaan_Kode`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_status_max`
--

/*!50001 DROP VIEW IF EXISTS `view_status_max`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_status_max` AS select `view_status`.`Penerimaan_Kode` AS `Penerimaan_Kode`,`view_status`.`Penerimaan_Tanggal` AS `Penerimaan_Tanggal`,`view_status`.`Penerimaan_Tempat_Bayar` AS `Penerimaan_Tempat_Bayar`,`view_status`.`Vendor_kode` AS `Vendor_kode`,`view_status`.`Vendor_Nama` AS `Vendor_Nama`,`view_status`.`Penerimaan_PO` AS `Penerimaan_PO`,`view_status`.`Penerimaan_Nilai` AS `Penerimaan_Nilai`,`view_status`.`Perusahaan_Kode` AS `Perusahaan_Kode`,`view_status`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`view_status`.`Tahap_Kode` AS `Tahap_Kode`,`view_status`.`Tahap_Nama` AS `Tahap_Nama`,`view_status`.`Pengguna_kode` AS `Pengguna_kode`,`view_status`.`Pengguna_nama` AS `Pengguna_nama`,`view_status`.`shortcut` AS `shortcut`,`view_status`.`status_kode` AS `status_kode`,`view_status`.`status_value` AS `status_value`,`view_status`.`status_reason` AS `status_reason`,`view_status`.`status_action` AS `status_action`,`view_status`.`status_tanggal` AS `status_tanggal`,`view_maxstat`.`penerimaan_kode` AS `kode`,`view_status`.`icat` AS `icat`,`view_status`.`Penerimaan_BA` AS `Penerimaan_BA`,`view_status`.`Tahap_Tahun` AS `Tahap_Tahun` from (`view_status` join `view_maxstat` on(((`view_maxstat`.`penerimaan_kode` = `view_status`.`Penerimaan_Kode`) and (`view_maxstat`.`maxkode` = `view_status`.`status_kode`)))) order by `view_status`.`Penerimaan_Kode` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_tahap`
--

/*!50001 DROP VIEW IF EXISTS `view_tahap`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_tahap` AS select `tbl_m_tahap`.`Tahap_Kode` AS `Tahap_Kode`,`tbl_m_tahap`.`Tahap_Nama` AS `Tahap_Nama`,`tbl_m_tahap`.`Tahap_Tanggal_Awal` AS `Tahap_Tanggal_Awal`,`tbl_m_tahap`.`Tahap_Tahun` AS `Tahap_Tahun` from `tbl_m_tahap` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_upload53`
--

/*!50001 DROP VIEW IF EXISTS `view_upload53`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_upload53` AS select `tbl_upload_f53`.`kode_upload` AS `kode_upload`,`tbl_upload_f53`.`Perusahaan_kode` AS `Perusahaan_kode`,`tbl_upload_f53`.`Tahap_kode` AS `Tahap_kode`,`tbl_upload_f53`.`Doc_Date` AS `Doc_Date`,`tbl_upload_f53`.`BA_kode` AS `BA_kode`,`tbl_upload_f53`.`Vendor_kode` AS `Vendor_kode`,`tbl_m_vendor`.`Vendor_Nama` AS `Vendor_Nama`,`tbl_upload_f53`.`Amount` AS `Amount`,`tbl_upload_f53`.`PO_number` AS `PO_number`,`tbl_upload_f53`.`Assign` AS `Assign`,`tbl_upload_f53`.`PO_Text` AS `PO_Text`,`tbl_upload_f53`.`doc_num` AS `Doc_num`,`tbl_upload_f53`.`ref` AS `ref` from (`tbl_m_vendor` left join `tbl_upload_f53` on((`tbl_m_vendor`.`Vendor_Kode` = `tbl_upload_f53`.`Vendor_kode`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_upload_pph23`
--

/*!50001 DROP VIEW IF EXISTS `view_upload_pph23`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_upload_pph23` AS select `tbl_upload_pph23`.`Cocd` AS `Cocd`,`tbl_upload_pph23`.`Bulan` AS `Bulan`,`tbl_upload_pph23`.`tahun` AS `tahun`,`tbl_upload_pph23`.`count` AS `count`,`tbl_upload_pph23`.`PostingDate` AS `PostingDate`,`tbl_upload_pph23`.`DocRef` AS `DocRef`,`tbl_upload_pph23`.`Reference` AS `Reference`,`tbl_upload_pph23`.`BusArea` AS `BusArea`,`tbl_upload_pph23`.`amount` AS `Amount`,`tbl_upload_pph23`.`vendor_kode` AS `vendor_kode`,`tbl_upload_pph23`.`Po_text` AS `Po_text`,`tbl_m_vendor`.`Vendor_Nama` AS `Vendor_Nama`,`tbl_m_vendor`.`Vendor_NPWP` AS `Vendor_NPWP`,`tbl_m_vendor`.`Vendor_Alamat` AS `Vendor_Alamat`,`tbl_m_vendor`.`Vendor_Jasa` AS `Vendor_Jasa`,`tbl_upload_pph23`.`PO` AS `PO`,`tbl_m_vendor`.`Vendor_PPH` AS `Vendor_PPH`,`tbl_m_vendor`.`vendor_PPH_tarif` AS `vendor_PPH_tarif`,`tbl_upload_pph23`.`pph` AS `pph`,`tbl_upload_pph23`.`GLAccount` AS `GLAccount`,`tbl_m_perusahaan`.`Perusahaan_Nama` AS `Perusahaan_Nama`,`tbl_m_perusahaan`.`Perusahaan_NPWP` AS `Perusahaan_NPWP`,`tbl_m_perusahaan`.`Perusahaan_Alamat` AS `Perusahaan_Alamat`,`tbl_upload_pph23`.`DocDate` AS `DocDate` from ((`tbl_upload_pph23` left join `tbl_m_vendor` on((`tbl_m_vendor`.`Vendor_Kode` = `tbl_upload_pph23`.`vendor_kode`))) left join `tbl_m_perusahaan` on((`tbl_m_perusahaan`.`Perusahaan_Kode` = `tbl_upload_pph23`.`Cocd`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_vendor_nama`
--

/*!50001 DROP VIEW IF EXISTS `view_vendor_nama`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_vendor_nama` AS select concat(`tbl_m_vendor`.`Vendor_Nama`,' - ',`tbl_m_vendor`.`Vendor_Kode`) AS `vendor`,`tbl_m_vendor`.`Vendor_Kode` AS `kode`,`tbl_m_vendor`.`Vendor_NPWP` AS `Vendor_NPWP`,`tbl_m_vendor`.`Vendor_Alamat` AS `Vendor_Alamat`,`tbl_m_vendor`.`Vendor_Jasa` AS `Vendor_Jasa`,`tbl_m_vendor`.`Vendor_PPH` AS `Vendor_PPH`,`tbl_m_vendor`.`vendor_PPH_tarif` AS `vendor_PPH_tarif` from `tbl_m_vendor` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-18 13:52:50
