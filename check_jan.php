<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check Jan 2025 for account 1101
$jan = \Illuminate\Support\Facades\DB::table('account_balances')
    ->where('account_code', '1101')
    ->where('year', 2025)
    ->where('month', 1)
    ->first();

if ($jan) {
    echo "Jan 2025 account 1101:\n";
    echo '  opening_balance: '.$jan->opening_balance."\n";
    echo '  debit_total: '.$jan->debit_total."\n";
    echo '  credit_total: '.$jan->credit_total."\n";
    echo '  closing_balance: '.$jan->closing_balance."\n";

    echo "\nFormula: opening + debit - credit = closing\n";
    $calc = $jan->opening_balance + $jan->debit_total - $jan->credit_total;
    echo $calc.' = '.$jan->closing_balance."\n";
}

// Check account 2101 per-anggota entries
echo "\n\nAccount 2101 (Liability) in Jan 2025:\n";
$jan2101 = \Illuminate\Support\Facades\DB::table('account_balances')
    ->where('account_code', '2101')
    ->where('year', 2025)
    ->where('month', 1)
    ->get();
echo 'Total entries: '.count($jan2101)."\n";
echo 'Sum of opening_balance: '.$jan2101->sum('opening_balance')."\n";
echo 'Sum of credit_total: '.$jan2101->sum('credit_total')."\n";
echo 'Sum of closing_balance: '.$jan2101->sum('closing_balance')."\n";

// Dec 2024 liability
echo "\n\nAccount 2101 (Liability) in Dec 2024:\n";
$dec2101 = \Illuminate\Support\Facades\DB::table('account_balances')
    ->where('account_code', '2101')
    ->where('year', 2024)
    ->where('month', 12)
    ->get();
echo 'Total entries: '.count($dec2101)."\n";
echo 'Sum of closing_balance: '.$dec2101->sum('closing_balance')."\n";
