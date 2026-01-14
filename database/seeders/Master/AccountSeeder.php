<?php

namespace Database\Seeders\Master;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $companyCode = 'BSKM';

        // ===================== MASTER STRUCTURE =====================
        $accounts = [
            // ====== 1. ASET ======
            ['kode' => '1', 'nama' => 'Aset', 'parent_kode' => null],
            ['kode' => '11', 'nama' => 'Aset Lancar', 'parent_kode' => '1'],
            ['kode' => '12', 'nama' => 'Aset Tidak Lancar', 'parent_kode' => '1'],

            // Aset Lancar (detail)
            ['kode' => '1100', 'nama' => 'Kas dan Setara Kas', 'parent_kode' => '11'],
            ['kode' => '1101', 'nama' => 'Kas Bendahara Utama', 'parent_kode' => '1100'],
            ['kode' => '1102', 'nama' => 'Kas Kolektor', 'parent_kode' => '1100'],
            ['kode' => '1200', 'nama' => 'Investasi', 'parent_kode' => '11'],
            ['kode' => '1122', 'nama' => 'Piutang Usaha - Pihak Ketiga', 'parent_kode' => '11'],
            ['kode' => '1123', 'nama' => 'Piutang Usaha - Pihak Hubungan Istimewa', 'parent_kode' => '11'],
            ['kode' => '1124', 'nama' => 'Piutang Lainnya - Pihak Ketiga', 'parent_kode' => '11'],
            ['kode' => '1125', 'nama' => 'Piutang Lainnya - Pihak Hubungan Istimewa', 'parent_kode' => '11'],
            ['kode' => '1131', 'nama' => '(Dikurangi: Cadangan Piutang Tak Tertagih)', 'parent_kode' => '11'],
            ['kode' => '1401', 'nama' => 'Persediaan', 'parent_kode' => '11'],
            ['kode' => '1421', 'nama' => 'Beban Dibayar di Muka', 'parent_kode' => '11'],
            ['kode' => '1422', 'nama' => 'Uang Muka', 'parent_kode' => '11'],
            ['kode' => '1423', 'nama' => 'Pajak Dibayar di Muka', 'parent_kode' => '11'],
            ['kode' => '1499', 'nama' => 'Aset Lancar Lainnya', 'parent_kode' => '11'],

            // Aset Tidak Lancar (detail)
            ['kode' => '1501', 'nama' => 'Piutang Jangka Panjang', 'parent_kode' => '12'],
            ['kode' => '1523', 'nama' => 'Tanah dan Bangunan', 'parent_kode' => '12'],
            ['kode' => '1524', 'nama' => '(Dikurangi: Akumulasi Penyusutan)', 'parent_kode' => '12'],
            ['kode' => '1529', 'nama' => 'Aset Tetap Lainnya', 'parent_kode' => '12'],
            ['kode' => '1530', 'nama' => '(Dikurangi: Akumulasi Penyusutan)', 'parent_kode' => '12'],
            ['kode' => '1541', 'nama' => 'Investasi pada Perusahaan Asosiasi', 'parent_kode' => '12'],
            ['kode' => '1599', 'nama' => 'Investasi Jangka Panjang Lainnya', 'parent_kode' => '12'],
            ['kode' => '1600', 'nama' => 'Aset Tak Berwujud – Net', 'parent_kode' => '12'],
            ['kode' => '1611', 'nama' => 'Aset Pajak Tangguhan', 'parent_kode' => '12'],
            ['kode' => '1698', 'nama' => 'Aset Tidak Lancar Lainnya', 'parent_kode' => '12'],
            ['kode' => '1700', 'nama' => 'Jumlah Aset', 'parent_kode' => '1'],

            // ====== 2. KEWAJIBAN ======
            ['kode' => '2', 'nama' => 'Kewajiban', 'parent_kode' => null],
            ['kode' => '21', 'nama' => 'Liabilitas Jangka Pendek', 'parent_kode' => '2'],
            ['kode' => '23', 'nama' => 'Liabilitas Jangka Panjang', 'parent_kode' => '2'],

            // ★ Iuran Tanah (LIABILITAS)
            ['kode' => '2101', 'nama' => 'Dana Iuran Tanah Makam', 'parent_kode' => '21'],
            ['kode' => '2102', 'nama' => 'Dana Iuran Tanah Makam Tahap 1', 'parent_kode' => '21'],

            // Liabilitas Jangka Pendek (umum)
            // 2102 sengaja dipertahankan untuk Dana Iuran Tanah, sehingga
            // kode generic "Utang Usaha - Pihak Ketiga" tidak digunakan di sini.
            ['kode' => '2103', 'nama' => 'Utang Usaha - Pihak Hubungan Istimewa', 'parent_kode' => '21'],
            ['kode' => '2111', 'nama' => 'Utang Bunga', 'parent_kode' => '21'],
            ['kode' => '2191', 'nama' => 'Utang Pajak', 'parent_kode' => '21'],
            ['kode' => '2192', 'nama' => 'Utang Dividen', 'parent_kode' => '21'],
            ['kode' => '2195', 'nama' => 'Beban yang Masih Harus Dibayar', 'parent_kode' => '21'],
            ['kode' => '2201', 'nama' => 'Utang Bank Jangka Pendek', 'parent_kode' => '21'],
            ['kode' => '2202', 'nama' => 'Utang Jangka Panjang – Jatuh Tempo Dalam 1 Tahun', 'parent_kode' => '21'],
            ['kode' => '2203', 'nama' => 'Uang Muka', 'parent_kode' => '21'],
            ['kode' => '2228', 'nama' => 'Liabilitas Jangka Pendek Lainnya', 'parent_kode' => '21'],

            // Liabilitas Jangka Panjang (umum)
            ['kode' => '2301', 'nama' => 'Utang Bank Jangka Panjang', 'parent_kode' => '23'],
            ['kode' => '2303', 'nama' => 'Utang Jangka Panjang – Pihak Ketiga', 'parent_kode' => '23'],
            ['kode' => '2304', 'nama' => 'Utang Jangka Panjang – Hubungan Istimewa', 'parent_kode' => '23'],
            ['kode' => '2321', 'nama' => 'Liabilitas Pajak Tangguhan', 'parent_kode' => '23'],
            ['kode' => '2998', 'nama' => 'Liabilitas Jangka Panjang Lainnya', 'parent_kode' => '23'],
            ['kode' => '2999', 'nama' => 'Jumlah Liabilitas', 'parent_kode' => '2'],

            // ====== 3. EKUITAS ======
            ['kode' => '3', 'nama' => 'Ekuitas', 'parent_kode' => null],
            ['kode' => '31', 'nama' => 'Modal', 'parent_kode' => '3'],
            ['kode' => '32', 'nama' => 'Saldo Laba/Rugi', 'parent_kode' => '3'],
            ['kode' => '3102', 'nama' => 'Modal Saham', 'parent_kode' => '31'],
            ['kode' => '3120', 'nama' => 'Tambahan Modal Disetor', 'parent_kode' => '31'],
            ['kode' => '3200', 'nama' => 'Saldo Laba', 'parent_kode' => '32'],
            ['kode' => '3298', 'nama' => 'Ekuitas Lainnya', 'parent_kode' => '32'],
            ['kode' => '3299', 'nama' => 'Jumlah Ekuitas', 'parent_kode' => '3'],
            ['kode' => '3300', 'nama' => 'Jumlah Liabilitas dan Ekuitas', 'parent_kode' => '3'],

            // ====== 4. PENDAPATAN ======
            ['kode' => '4', 'nama' => 'Pendapatan', 'parent_kode' => null],
            ['kode' => '4100', 'nama' => 'Iuran', 'parent_kode' => '4'],
            ['kode' => '4101', 'nama' => 'Iuran Bulanan', 'parent_kode' => '4100'],
            ['kode' => '4102', 'nama' => 'Pendapatan Sumbangan', 'parent_kode' => '4'],
            ['kode' => '4103', 'nama' => 'Pendapatan Lain-lain', 'parent_kode' => '4'],

            // Penjualan & HPP (opsional, untuk aktivitas usaha lain)
            ['kode' => '4002', 'nama' => 'Penjualan Domestik', 'parent_kode' => '4'],
            ['kode' => '4003', 'nama' => 'Penjualan Ekspor', 'parent_kode' => '4'],
            ['kode' => '4004', 'nama' => 'Penjualan Bruto', 'parent_kode' => '4'],
            ['kode' => '4011', 'nama' => 'Retur', 'parent_kode' => '4'],
            ['kode' => '4012', 'nama' => 'Potongan Penjualan', 'parent_kode' => '4'],
            ['kode' => '4020', 'nama' => 'Penjualan Bersih', 'parent_kode' => '4'],
            ['kode' => '5001', 'nama' => 'Pembelian', 'parent_kode' => '5'],
            ['kode' => '5008', 'nama' => 'Persediaan - Awal', 'parent_kode' => '5'],
            ['kode' => '5009', 'nama' => '(Dikurangi: Persediaan Akhir)', 'parent_kode' => '5'],
            ['kode' => '5020', 'nama' => 'Jumlah HPP', 'parent_kode' => '5'],
            ['kode' => '4300', 'nama' => 'Laba Kotor', 'parent_kode' => '4'],

            // ====== 5. BEBAN ======
            ['kode' => '5', 'nama' => 'Beban', 'parent_kode' => null],
            ['kode' => '51', 'nama' => 'Beban Operasional', 'parent_kode' => '5'],
            ['kode' => '511', 'nama' => 'Beban Kegiatan Sosial', 'parent_kode' => '51'],
            ['kode' => '512', 'nama' => 'Beban Administrasi', 'parent_kode' => '51'],
            ['kode' => '52', 'nama' => 'Beban Non Operasional', 'parent_kode' => '5'],

            // Beban Usaha
            ['kode' => '5311', 'nama' => 'Gaji, Tunjangan, Bonus, Honorarium, THR, dsb', 'parent_kode' => '5'],
            ['kode' => '5313', 'nama' => 'Beban Transportasi', 'parent_kode' => '5'],
            ['kode' => '5314', 'nama' => 'Beban Penyusutan dan Amortisasi', 'parent_kode' => '5'],
            ['kode' => '5315', 'nama' => 'Beban Sewa', 'parent_kode' => '5'],
            ['kode' => '5316', 'nama' => 'Beban Bunga', 'parent_kode' => '5'],
            ['kode' => '5317', 'nama' => 'Beban Sehubungan dengan Jasa', 'parent_kode' => '5'],
            ['kode' => '5318', 'nama' => 'Beban Piutang Tidak Tertagih', 'parent_kode' => '5'],
            ['kode' => '5320', 'nama' => 'Beban Pemasaran atau Promosi', 'parent_kode' => '5'],
            ['kode' => '5321', 'nama' => 'Beban Entertainment', 'parent_kode' => '5'],
            ['kode' => '5322', 'nama' => 'Beban Umum dan Administrasi', 'parent_kode' => '5'],
            ['kode' => '5399', 'nama' => 'Beban Usaha Lainnya', 'parent_kode' => '5'],
            ['kode' => '5400', 'nama' => 'Jumlah Beban Usaha', 'parent_kode' => '5'],
            ['kode' => '4800', 'nama' => 'Laba (Rugi) Sebelum Pajak', 'parent_kode' => '5'],
        ];

        foreach ($accounts as $account) {
            $parentId = null;

            if (! empty($account['parent_kode'])) {
                $parentId = DB::table('accounts')->where('kode', $account['parent_kode'])->value('id');
            }

            DB::table('accounts')->updateOrInsert(
                ['kode' => $account['kode']],
                [
                    'company_code' => $companyCode,
                    'nama' => $account['nama'],
                    'parent_id' => $parentId,
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }
    }
}
