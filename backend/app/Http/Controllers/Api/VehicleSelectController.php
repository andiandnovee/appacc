<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleSelectController extends Controller
{
    /**
     * GET /vehicles/select-options
     *
     * Dropdown kendaraan untuk filter logbook page.
     * Kompatibel dengan AsyncSelect — response: { data: [{ id, name }] }
     *
     * Query params:
     * - search : filter by plate_number atau description
     * - limit  : default 10
     * - offset : default 0
     */
    public function selectOptions(Request $request)
    {
        $search = $request->input('search', '');
        $limit  = (int) $request->input('limit', 10);
        $offset = (int) $request->input('offset', 0);

        $query = Vehicle::whereNull('deleted_at')
            ->where('is_active', 1);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('plate_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('cost_center', 'like', "%{$search}%");
            });
        }

        $vehicles = $query
            ->orderBy('plate_number')
            ->offset($offset)
            ->limit($limit)
            ->get(['id', 'plate_number', 'description', 'cost_center']);

        // Format sesuai AsyncSelect: id + name
        $data = $vehicles->map(fn($v) => [
            'id'   => $v->id,
            'name' => "{$v->plate_number} — {$v->description}",
        ]);

        return response()->json(['data' => $data]);
    }
}