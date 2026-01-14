<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find anggota with Jan iurans
$janIurans = DB::table('iurans')
    ->join('anggotas', 'iurans.anggota_id', '=', 'anggotas.id')
    ->where('iurans.periode_bulan', 'JANUARI')
    ->select('anggotas.kode', 'iurans.jumlah')
    ->get();

echo "Anggota with JANUARI iurans:\n";
$total = 0;
foreach ($janIurans as $i) {
    echo "  {$i->kode}: {$i->jumlah}\n";
    $total += $i->jumlah;
}
echo "Total: {$total}\n";

// Check account 2101 opening balances in Jan per anggota
echo "\n\nAccount 2101 opening_balance in Jan 2025 (per anggota):\n";
$jan2101perAggt = DB::table('account_balances')
    ->where('account_code', '2101')
    ->where('year', 2025)
    ->where('month', 1)
    ->where('subledger_type', 'anggota')
    ->get();

echo 'Count: '.count($jan2101perAggt)."\n";
$openingTotal = 0;
foreach ($jan2101perAggt as $b) {
    $openingTotal += $b->opening_balance;
}
echo "Sum of opening_balance: {$openingTotal}\n";

// Show a few examples
echo "\nFirst 5 examples:\n";
$i = 0;
foreach ($jan2101perAggt as $b) {
    if ($i++ >= 5) {
        break;
    }
    echo "  Subledger ID {$b->subledger_id}: opening={$b->opening_balance}, credit={$b->credit_total}, closing={$b->closing_balance}\n";
}

// Now let's check Dec 2024 liability opening
echo "\n\nAccount 2101 in Dec 2024:\n";
$dec2101 = DB::table('account_balances')
    ->where('account_code', '2101')
    ->where('year', 2024)
    ->where('month', 12)
    ->get();
echo 'Count: '.count($dec2101)."\n";
$decOpening = $dec2101->sum('opening_balance');
$decClosing = $dec2101->sum('closing_balance');
echo "Sum of opening_balance: {$decOpening}\n";
echo "Sum of closing_balance: {$decClosing}\n";

// Check what the Jan opening_balance should be
echo "\n\nWhat SHOULD Jan opening_balance be?\n";
echo "Sum of Dec 2024 closing_balance: {$decClosing}\n";
echo "But actual Sum of Jan 2025 opening_balance: {$openingTotal}\n";
