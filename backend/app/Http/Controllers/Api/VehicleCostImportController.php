<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleCostHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehicleCostImportController extends Controller
{
    /**
     * POST /vehicles/cost-center-lookup
     *
     * Terima array costcenter, kembalikan mapping ke vehicle.
     * Dipakai frontend untuk preview sebelum import.
     *
     * Request:  { cost_centers: ["3512147024", "3512147003", ...] }
     * Response: { "3512147024": { vehicle_id, plate_number, description }, ... }
     */
    public function lookup(Request $request)
    {
        $request->validate([
            'cost_centers'   => 'required|array|min:1',
            'cost_centers.*' => 'required|string',
        ]);

        $costCenters = $request->input('cost_centers');

        $vehicles = Vehicle::whereIn('cost_center', $costCenters)
            ->whereNull('deleted_at')
            ->get(['id', 'cost_center', 'plate_number', 'description']);

        // Map: costcenter => vehicle info
        $result = [];
        foreach ($vehicles as $v) {
            $result[$v->cost_center] = [
                'vehicle_id'  => $v->id,
                'plate_number' => $v->plate_number,
                'description' => $v->description,
            ];
        }

        // Costcenter yg tidak ditemukan tetap ada di result sebagai null
        foreach ($costCenters as $cc) {
            if (!isset($result[$cc])) {
                $result[$cc] = null;
            }
        }

        return response()->json($result);
    }

    /**
     * POST /vehicles/cost-import
     *
     * Simpan biaya per kendaraan per periode ke vehicle_cost_headers.
     * Kalau header bulan itu sudah ada → update total_cost.
     * Kalau belum ada → insert baru.
     *
     * Request:
     * {
     *   year: 2026,
     *   month: 5,
     *   rows: [
     *     { vehicle_id: 24, cost_center: "3512147024", total_cost: 12658150 },
     *     ...
     *   ]
     * }
     *
     * Response:
     * { inserted: N, updated: N, skipped: N, errors: [...] }
     */
    public function import(Request $request)
    {
        $request->validate([
            'year'              => 'required|integer|min:2000|max:2099',
            'month'             => 'required|integer|min:1|max:12',
            'rows'              => 'required|array|min:1',
            'rows.*.vehicle_id' => 'required|integer|exists:vehicles,id',
            'rows.*.cost_center'=> 'required|string',
            'rows.*.total_cost' => 'required|numeric|min:0',
        ]);

        $year  = $request->integer('year');
        $month = $request->integer('month');
        $rows  = $request->input('rows');

        $inserted = 0;
        $updated  = 0;
        $skipped  = 0;
        $errors   = [];

        DB::beginTransaction();
        try {
            foreach ($rows as $row) {
                try {
                    $vehicle = Vehicle::find($row['vehicle_id']);
                    if (!$vehicle) {
                        $skipped++;
                        continue;
                    }

                    $existing = VehicleCostHeader::where('vehicle_id', $row['vehicle_id'])
                        ->where('year', $year)
                        ->where('month', $month)
                        ->whereNull('deleted_at')
                        ->first();

                    if ($existing) {
                        $existing->update([
                            'total_cost'         => $row['total_cost'],
                            'company_code'       => $vehicle->company_code,
                            'business_area_code' => $vehicle->business_area_code,
                        ]);
                        $updated++;
                    } else {
                        VehicleCostHeader::create([
                            'vehicle_id'         => $row['vehicle_id'],
                            'company_code'       => $vehicle->company_code,
                            'business_area_code' => $vehicle->business_area_code,
                            'year'               => $year,
                            'month'              => $month,
                            'total_cost'         => $row['total_cost'],
                        ]);
                        $inserted++;
                    }
                } catch (\Exception $e) {
                    $errors[] = [
                        'cost_center' => $row['cost_center'],
                        'message'     => $e->getMessage(),
                    ];
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Import gagal: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'inserted' => $inserted,
            'updated'  => $updated,
            'skipped'  => $skipped,
            'errors'   => $errors,
        ]);
    }
}