<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check Dec 2024 for those specific anggota IDs
$anggotaIds = [5, 6, 9, 10, 12];

echo "Account 2101 Dec 2024 closing_balance for specific anggota:\n";
$dec2101 = DB::table('account_balances')
    ->where('account_code', '2101')
    ->where('year', 2024)
    ->where('month', 12)
    ->where('subledger_type', 'anggota')
    ->whereIn('subledger_id', $anggotaIds)
    ->get();

foreach ($dec2101 as $b) {
    echo "  Anggota ID {$b->subledger_id}: opening={$b->opening_balance}, closing={$b->closing_balance}\n";
}

// Now check Jan 2025 for the same
echo "\n\nAccount 2101 Jan 2025 for the same anggota:\n";
$jan2101 = DB::table('account_balances')
    ->where('account_code', '2101')
    ->where('year', 2025)
    ->where('month', 1)
    ->where('subledger_type', 'anggota')
    ->whereIn('subledger_id', $anggotaIds)
    ->get();

foreach ($jan2101 as $b) {
    echo "  Anggota ID {$b->subledger_id}: opening={$b->opening_balance}, should be={$dec2101->where('subledger_id', $b->subledger_id)->first()?->closing_balance}\n";
}
