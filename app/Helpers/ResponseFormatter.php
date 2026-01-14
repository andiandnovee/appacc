<?php

namespace App\Helpers;

use Illuminate\Pagination\LengthAwarePaginator;

class ResponseFormatter
{
    /**
     * Format response sukses
     */
    public static function success($data = null, string $message = 'OK', int $code = 200)
    {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        // Kalau datanya pagination, ambil metadata-nya
        if ($data instanceof LengthAwarePaginator) {
            $response['data'] = $data->items();
            $response['meta'] = [
                'total' => $data->total(),
                'per_page' => $data->perPage(),
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
            ];
        } else {
            $response['data'] = $data;
        }

        return response()->json($response, $code);
    }

    /**
     * Format response gagal
     */
    public static function error($message = 'Terjadi kesalahan', $errors = null, $code = 400)
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    public static function paginate($resourceCollection, $message = 'Success')
{
    // Jika yang dikirim adalah Resource Collection (Laravel API Resource),
    // maka $resourceCollection->resource adalah paginator aslinya.
    $paginator = method_exists($resourceCollection, 'resource')
        ? $resourceCollection->resource
        : $resourceCollection;

    return response()->json([
        'success' => true,
        'message' => $message,
        'data' => $resourceCollection,
        'meta' => [
            'current_page' => $paginator->currentPage(),
            'last_page'    => $paginator->lastPage(),
            'per_page'     => $paginator->perPage(),
            'total'        => $paginator->total(),
        ]
    ], 200);
}

}