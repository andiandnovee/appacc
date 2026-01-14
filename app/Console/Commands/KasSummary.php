<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Keuangan\Account;
use App\Models\Keuangan\AccountBalance;

class KasSummary extends Command
{
    protected $signature = 'finance:kas-summary {--company=BSKM} {--kas=1101} {--kolektor=1102}';
    protected $description = 'Show kas bendahara, kas kolektor total, and grand total from account_balances';

    public function handle()
    {
        $company = $this->option('company');
        $kasCode = $this->option('kas');
        $kolektorCode = $this->option('kolektor');

        $kas = Account::where('kode', $kasCode)->first();
        $kolektor = Account::where('kode', $kolektorCode)->first();

        if (!$kas) {
            $this->error("Akun kas bendahara tidak ditemukan: {$kasCode}");
            return 1;
        }

        $kasSummary = AccountBalance::where('company_code', $company)
            ->where('account_id', $kas->id)
            ->whereNull('subledger_type')
            ->whereNull('subledger_id')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->first();

        $kasUtama = $kasSummary?->closing_balance ?? 0.0;

        $kasKolektor = 0.0;
        if ($kolektor) {
            $rows = AccountBalance::where('company_code', $company)
                ->where('account_id', $kolektor->id)
                ->where('subledger_type', 'kolektor')
                ->whereNotNull('subledger_id')
                ->orderByDesc('year')
                ->orderByDesc('month')
                ->get()
                ->groupBy(function ($row) {
                    return $row->year . '-' . $row->month;
                })
                ->first();
            if ($rows) {
                $kasKolektor = $rows->sum('closing_balance');
            }
        }

        $total = round($kasUtama + $kasKolektor, 2);

        $this->line('— Kas Bendahara (' . $kasCode . '): Rp ' . number_format($kasUtama, 0, ',', '.'));
        $this->line('— Kas Kolektor (' . $kolektorCode . ') total: Rp ' . number_format($kasKolektor, 0, ',', '.'));
        $this->info('= TOTAL KAS: Rp ' . number_format($total, 0, ',', '.'));

        return 0;
    }
}
