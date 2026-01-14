<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        \App\Console\Commands\ClearDummyData::class,
        \App\Console\Commands\KasSummary::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        // Jadwal task (kosongkan dulu kalau belum dipakai)
    }

    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');
        require base_path('routes/console.php');
    }
}
