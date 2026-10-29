<?php

namespace App\Services;

use App\Models\AuditEvent;
use App\Models\AuditNotification;
use App\Models\NotificationLog;
use App\Models\UserDevice;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Google\Auth\HttpHandler\HttpHandlerFactory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class FcmService
{
    private ?string $projectId;

    private ?string $credentialsPath;

    public function __construct()
    {
        $this->projectId = config('services.fcm.project_id');
        $path = config('services.fcm.credentials');
        $this->credentialsPath = is_string($path) && $path !== '' && ! str_starts_with($path, DIRECTORY_SEPARATOR)
            ? base_path($path)
            : $path;
    }

    public function isConfigured(): bool
    {
        return (bool) config('services.fcm.enabled')
            && ! empty($this->projectId)
            && ! empty($this->credentialsPath)
            && is_file($this->credentialsPath);
    }

    public function sendToDevice(
        UserDevice $device,
        AuditEvent $event,
        ?AuditNotification $notification,
        string $title,
        string $body
    ): NotificationLog {
        $base = [
            'user_id' => $device->user_id,
            'user_device_id' => $device->id,
            'audit_event_id' => $event->id,
            'audit_notification_id' => $notification?->id,
            'channel' => 'fcm',
        ];

        if (! $this->isConfigured()) {
            return NotificationLog::create($base + [
                'status' => 'failed',
                'error_message' => 'FCM HTTP v1 credentials are not configured.',
            ]);
        }

        try {
            $accessToken = $this->accessToken();
        } catch (\Throwable $exception) {
            report($exception);

            return NotificationLog::create($base + [
                'status' => 'failed',
                'error_message' => 'Unable to obtain FCM access token.',
            ]);
        }

        if (! $accessToken) {
            return NotificationLog::create($base + [
                'status' => 'failed',
                'error_message' => 'FCM returned an empty access token.',
            ]);
        }

        $route = '/notifications';
        $url = sprintf('https://fcm.googleapis.com/v1/projects/%s/messages:send', $this->projectId);
        $message = [
            'token' => $device->device_token,
            'notification' => ['title' => $title, 'body' => $body],
            'data' => [
                'route' => $route,
                'event_id' => $event->id,
                'event_code' => $event->event_code,
                'notification_id' => $notification?->id ?? '',
            ],
        ];

        $webLinkBase = rtrim((string) config('services.fcm.web_link_base'), '/');
        if ($device->platform === 'web' && $webLinkBase !== '') {
            $message['webpush'] = [
                'fcm_options' => ['link' => $webLinkBase.$route],
            ];
        }

        try {
            $response = Http::withToken($accessToken)
                ->acceptJson()
                ->timeout(10)
                ->post($url, ['message' => $message]);

            $errorCode = data_get($response->json(), 'error.details.0.errorCode');
            if (in_array($errorCode, ['UNREGISTERED', 'SENDER_ID_MISMATCH'], true)) {
                $device->update(['is_active' => false]);
            }

            return NotificationLog::create($base + [
                'status' => $response->successful() ? 'sent' : 'failed',
                'http_status' => $response->status(),
                'response_body' => Str::limit($response->body(), 4000, ''),
                'error_message' => $response->successful()
                    ? null
                    : trim('FCM request failed: HTTP '.$response->status().' '.$errorCode),
                'sent_at' => $response->successful() ? now() : null,
            ]);
        } catch (\Throwable $exception) {
            report($exception);

            return NotificationLog::create($base + [
                'status' => 'failed',
                'error_message' => 'FCM request could not be completed.',
            ]);
        }
    }

    private function accessToken(): ?string
    {
        return Cache::remember('fcm.access_token.'.$this->projectId, 3000, function () {
            $credentials = new ServiceAccountCredentials(
                ['https://www.googleapis.com/auth/firebase.messaging'],
                $this->credentialsPath
            );

            return $credentials->fetchAuthToken(HttpHandlerFactory::build())['access_token'] ?? null;
        });
    }
}
