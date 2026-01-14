<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "All iurans (by ref_iuran_id):\n";
$byRef = DB::table('iurans')->select('ref_iuran_id')->distinct()->get();
foreach ($byRef as $r) {
    $count = DB::table('iurans')->where('ref_iuran_id', $r->ref_iuran_id)->count();
    echo "  ref_iuran_id={$r->ref_iuran_id}: {$count} iurans\n";
}

echo "\n\nJournal entries (by source_module):\n";
$byModule = DB::table('journal_entries')->select('source_module')->distinct()->get();
foreach ($byModule as $m) {
    $count = DB::table('journal_entries')->where('source_module', $m->source_module)->count();
    echo "  {$m->source_module}: {$count} journals\n";
}

echo "\n\nAccount balances entries:\n";
$balCount = DB::table('account_balances')->count();
echo "Total account_balances records: {$balCount}\n";
