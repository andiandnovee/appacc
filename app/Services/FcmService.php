<?php

namespace App\Services;

use App\Models\Core\NotificationLog;
use App\Models\Core\User;
use App\Models\Core\UserDevice;
use App\Models\Keanggotaan\Anggota;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Google\Auth\HttpHandler\HttpHandlerFactory;
use Illuminate\Support\Facades\Http;

class FcmService
{
    protected ?string $projectId;
    protected ?string $credentialsPath;

    public function __construct()
    {
        $this->projectId = config('services.fcm.project_id');
        $path = config('services.fcm.credentials');

        // Jika path relatif, jadikan absolut berdasarkan base_path()
        if (is_string($path) && $path !== '' && ! str_starts_with($path, DIRECTORY_SEPARATOR)) {
            $path = base_path($path);
        }

        $this->credentialsPath = $path;
    }

    public function isConfigured(): bool
    {
        return ! empty($this->projectId) && ! empty($this->credentialsPath) && file_exists($this->credentialsPath);
    }

    /**
     * Kirim notifikasi FCM ke satu device token dengan HTTP v1.
     *
     * @param  string       $deviceToken
     * @param  array        $payload   ['title' => ..., 'body' => ..., 'data' => [...], 'type' => ...]
     * @param  User|null    $user
     * @param  Anggota|null $anggota
     */
    public function sendToDevice(
        string $deviceToken,
        array $payload,
        ?User $user = null,
        ?Anggota $anggota = null
    ): NotificationLog {
        $title = $payload['title'] ?? null;
        $body = $payload['body'] ?? null;
        $data = $payload['data'] ?? [];
        $type = $payload['type'] ?? null;

        if (! $this->isConfigured()) {
            return NotificationLog::create([
                'user_id' => $user?->id,
                'anggota_id' => $anggota?->id,
                'device_token' => $deviceToken,
                'channel' => 'fcm',
                'type' => $type,
                'title' => $title,
                'body' => $body,
                'data_payload' => $data,
                'status' => 'failed',
                'error_message' => 'FCM HTTP v1 credentials not configured',
            ]);
        }

        $accessToken = null;

        try {
            $scopes = ['https://www.googleapis.com/auth/firebase.messaging'];
            $credentials = new ServiceAccountCredentials($scopes, $this->credentialsPath);
            $httpHandler = HttpHandlerFactory::build();
            $tokenData = $credentials->fetchAuthToken($httpHandler);
            $accessToken = $tokenData['access_token'] ?? null;
        } catch (\Throwable $e) {
            return NotificationLog::create([
                'user_id' => $user?->id,
                'anggota_id' => $anggota?->id,
                'device_token' => $deviceToken,
                'channel' => 'fcm',
                'type' => $type,
                'title' => $title,
                'body' => $body,
                'data_payload' => $data,
                'status' => 'failed',
                'error_message' => 'Failed to obtain FCM access token: '.$e->getMessage(),
            ]);
        }

        if (! $accessToken) {
            return NotificationLog::create([
                'user_id' => $user?->id,
                'anggota_id' => $anggota?->id,
                'device_token' => $deviceToken,
                'channel' => 'fcm',
                'type' => $type,
                'title' => $title,
                'body' => $body,
                'data_payload' => $data,
                'status' => 'failed',
                'error_message' => 'Empty FCM access token',
            ]);
        }

        $url = sprintf(
            'https://fcm.googleapis.com/v1/projects/%s/messages:send',
            $this->projectId
        );

        // FCM HTTP v1 mensyaratkan data berupa map<string, string>
        $stringData = [];
        foreach ($data as $key => $value) {
            if ($value === null) {
                continue;
            }
            $stringData[$key] = (string) $value;
        }

        $requestBody = [
            'message' => [
                'token' => $deviceToken,
                'notification' => array_filter([
                    'title' => $title,
                    'body' => $body,
                ]),
                'data' => $stringData,
            ],
        ];

        $response = null;
        $status = 'pending';
        $errorMessage = null;

        try {
            $response = Http::withToken($accessToken)
                ->acceptJson()
                ->post($url, $requestBody);

            if ($response->successful()) {
                $status = 'sent';
            } else {
                $status = 'failed';
                $errorMessage = 'HTTP '.$response->status();
            }
        } catch (\Throwable $e) {
            $status = 'failed';
            $errorMessage = $e->getMessage();
        }

        return NotificationLog::create([
            'user_id' => $user?->id,
            'anggota_id' => $anggota?->id,
            'device_token' => $deviceToken,
            'channel' => 'fcm',
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data_payload' => $data,
            'status' => $status,
            'sent_at' => $status === 'sent' ? now() : null,
            'fcm_response' => $response ? $response->body() : null,
            'error_message' => $errorMessage,
        ]);
    }

    /**
     * Kirim notifikasi ke banyak device milik banyak user.
     *
     * @param  \Illuminate\Support\Collection<int,UserDevice>|\Traversable|array  $devices
     * @param  array  $payload
     * @param  Anggota|null  $anggota
     * @return array<int,NotificationLog>
     */
    public function sendToUserDevices($devices, array $payload, ?Anggota $anggota = null): array
    {
        $logs = [];

        foreach ($devices as $device) {
            $logs[] = $this->sendToDevice(
                $device->device_token,
                $payload,
                $device->user ?? null,
                $anggota
            );
        }

        return $logs;
    }
}
