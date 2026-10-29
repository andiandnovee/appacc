<?php

namespace App\Jobs;

use App\Models\AuditEvent;
use App\Services\AuditNotificationDispatcher;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DispatchAuditNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    public function __construct(public string $eventId) {}

    public function handle(AuditNotificationDispatcher $dispatcher): void
    {
        $event = AuditEvent::find($this->eventId);
        if ($event) {
            $dispatcher->dispatch($event);
        }
    }
}
