<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$balances = \Illuminate\Support\Facades\DB::table('account_balances')
    ->where('account_code', '1101')
    ->where('year', 2025)
    ->orderBy('month')
    ->get();

echo "Account 1101 (Kas) balances for 2025:\n";
foreach ($balances as $b) {
    echo sprintf("Month %d: opening=%.0f debit=%.0f closing=%.0f\n",
        $b->month, $b->opening_balance, $b->debit_total, $b->closing_balance);
}

echo "\n\nAccount 1101 Dec 2024:\n";
$dec2024 = \Illuminate\Support\Facades\DB::table('account_balances')
    ->where('account_code', '1101')
    ->where('year', 2024)
    ->where('month', 12)
    ->first();
if ($dec2024) {
    echo sprintf("Dec 2024: opening=%.0f debit=%.0f closing=%.0f\n",
        $dec2024->opening_balance, $dec2024->debit_total, $dec2024->closing_balance);
}
