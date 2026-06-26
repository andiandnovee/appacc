<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleCostHeader;
use App\Models\VehicleCostDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehicleLogbookController extends Controller
{
    /**
     * GET /vehicles/logbook
     * Ambil header + details untuk satu kendaraan satu periode.
     */
    public function index(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|integer|exists:vehicles,id',
            'month'      => 'required|integer|min:1|max:12',
            'year'       => 'required|integer|min:2000|max:2099',
        ]);

        $header = VehicleCostHeader::where('vehicle_id', $request->vehicle_id)
            ->where('month', $request->month)
            ->where('year', $request->year)
            ->whereNull('deleted_at')
            ->first();

        if (!$header) {
            return response()->json(['header' => null, 'details' => []]);
        }

        $details = VehicleCostDetail::where('vehicle_cost_header_id', $header->id)
            ->whereNull('deleted_at')
            ->orderBy('start_km')
            ->get()
            ->map(function ($d) {
                // Resolve nama CC
                $ccName = null;
                if ($d->cost_center) {
                    $cc = DB::table('cost_centers')->where('sap_id', $d->cost_center)->first();
                    $ccName = $cc?->description;
                }
                // Resolve nama customer
                $custName = null;
                if ($d->customer_code) {
                    $cust = DB::table('customers')->where('sap_id', $d->customer_code)->first();
                    $custName = $cust?->name;
                }
                // Resolve source periode (carryover)
                $sourceMonth = null;
                $sourceYear  = null;
                if ($d->source_detail_id) {
                    $src = VehicleCostDetail::find($d->source_detail_id);
                    if ($src) {
                        $srcHeader = VehicleCostHeader::find($src->vehicle_cost_header_id);
                        $sourceMonth = $srcHeader?->month;
                        $sourceYear  = $srcHeader?->year;
                    }
                }

                return array_merge($d->toArray(), [
                    'km'               => $d->end_km - $d->start_km,
                    'cost_center_name' => $ccName,
                    'customer_name'    => $custName,
                    'source_month'     => $sourceMonth,
                    'source_year'      => $sourceYear,
                ]);
            });

        return response()->json([
            'header'  => $header,
            'details' => $details,
        ]);
        }

        // VehicleLogbookController.php — tambah method baru

/**
 * GET /vehicles/logbook/beban-search?q=text
 * Unified search: cost_centers + customers
 */
public function bebanSearch(Request $request)
{
    $q = trim($request->query('q', ''));

    if (strlen($q) < 1) {
        return response()->json([]);
    }

    // Pecah kata kunci berdasarkan spasi (bisa multiple spasi)
    $keywords = preg_split('/\s+/', $q);
    $keywords = array_filter($keywords); // buang empty string
    $keywords = array_values($keywords);

    $bindings = [];

    // Fungsi untuk membuat WHERE clause dengan AND per kata dan OR antar field
    $buildWhereClause = function($fields) use ($keywords, &$bindings) {
        $fieldConditions = [];
        foreach ($fields as $field) {
            $keywordConditions = [];
            foreach ($keywords as $kw) {
                $keywordConditions[] = "$field LIKE ?";
                $bindings[] = '%' . $kw . '%';
            }
            $fieldConditions[] = '(' . implode(' AND ', $keywordConditions) . ')';
        }
        return '(' . implode(' OR ', $fieldConditions) . ')';
    };

    // Field yang dicari di masing-masing tabel
    $costCenterFields = ['description', 'short_name', 'sap_id'];
    $customerFields   = ['name', 'short_name', 'sap_id'];

    $costWhere = $buildWhereClause($costCenterFields);
    $customerWhere = $buildWhereClause($customerFields);

    $sql = "
        SELECT 'cost_center' AS type, sap_id, description AS name, short_name
        FROM cost_centers
        WHERE deleted_at IS NULL
          AND $costWhere

        UNION ALL

        SELECT 'customer' AS type, sap_id, name, short_name
        FROM customers
        WHERE deleted_at IS NULL
          AND $customerWhere

        ORDER BY name ASC
        LIMIT 30
    ";

    $results = DB::select($sql, $bindings);
    return response()->json($results);
}


    /**
     * POST /vehicles/logbook/detail
     * Tambah satu baris logbook.
     */
    public function storeDetail(Request $request)
    {
        $request->validate([
            'vehicle_cost_header_id' => 'required|integer|exists:vehicle_cost_headers,id',
            'start_km'               => 'required|integer|min:0',
            'end_km'                 => 'required|integer|gt:start_km',
            'description'            => 'required|string|max:255',
            'cost_center'            => 'nullable|string',
            'customer_code'          => 'nullable|string',
        ]);

        // Validasi kontinuitas KM
        $this->validateKmContinuity(
            $request->vehicle_cost_header_id,
            $request->start_km,
        );

        // Pastikan hanya satu dari cost_center / customer_code
        if ($request->cost_center && $request->customer_code) {
            return response()->json([
                'message' => 'Hanya boleh satu: cost_center ATAU customer_code.',
            ], 422);
        }
        if (!$request->cost_center && !$request->customer_code) {
            return response()->json([
                'message' => 'Wajib mengisi salah satu: cost_center atau customer_code.',
            ], 422);
        }

        $detail = VehicleCostDetail::create([
            'vehicle_cost_header_id' => $request->vehicle_cost_header_id,
            'start_km'               => $request->start_km,
            'end_km'                 => $request->end_km,
            'description'            => $request->description,
            'cost_center'            => $request->cost_center,
            'customer_code'          => $request->customer_code,
            'is_carryover'           => false,
        ]);

        // Auto-recalculate setelah insert
        $this->recalculate($request->vehicle_cost_header_id);

        return response()->json($detail, 201);
    }

    /**
     * PUT /vehicles/logbook/detail/{id}
     * Update satu baris logbook.
     */
    public function updateDetail(Request $request, VehicleCostDetail $detail)
    {
        $request->validate([
            'start_km'     => 'required|integer|min:0',
            'end_km'       => 'required|integer|gt:start_km',
            'description'  => 'required|string|max:255',
            'cost_center'  => 'nullable|string',
            'customer_code'=> 'nullable|string',
        ]);

        $detail->update([
            'start_km'     => $request->start_km,
            'end_km'       => $request->end_km,
            'description'  => $request->description,
            'cost_center'  => $request->cost_center,
            'customer_code'=> $request->customer_code,
        ]);

        $this->recalculate($detail->vehicle_cost_header_id);

        return response()->json($detail);
    }

    /**
     * DELETE /vehicles/logbook/detail/{id}
     */
    public function destroyDetail(VehicleCostDetail $detail)
    {
        $headerId = $detail->vehicle_cost_header_id;
        $detail->delete();
        $this->recalculate($headerId);

        return response()->json(['message' => 'Baris dihapus.']);
    }

    /**
     * POST /vehicles/logbook/{headerId}/recalculate
     * Recalculate cost_amount semua details berdasarkan total_cost header.
     */
    public function recalculate_endpoint(Request $request, int $headerId)
    {
        $header = VehicleCostHeader::findOrFail($headerId);
        $count  = $this->recalculate($headerId);

        return response()->json([
            'message'       => "Kalkulasi selesai untuk {$count} baris.",
            'total_cost'    => $header->total_cost,
            'rows_updated'  => $count,
        ]);
    }

    /**
     * POST /vehicles/logbook/{headerId}/carryover
     * Salin baris dari bulan lalu ke bulan ini.
     *
     * Request: { source_detail_ids: [1, 2, 3] }
     */
    public function carryover(Request $request, int $headerId)
    {
        $request->validate([
            'source_detail_ids'   => 'required|array|min:1',
            'source_detail_ids.*' => 'required|integer|exists:vehicle_cost_details,id',
        ]);

        $header = VehicleCostHeader::findOrFail($headerId);

        // Ambil km akhir terakhir di bulan ini
        $lastDetail = VehicleCostDetail::where('vehicle_cost_header_id', $headerId)
            ->whereNull('deleted_at')
            ->orderByDesc('end_km')
            ->first();

        $expectedKm = $lastDetail?->end_km ?? $header->start_km;

        // Ambil source details, ordered by start_km
        $sources = VehicleCostDetail::whereIn('id', $request->source_detail_ids)
            ->orderBy('start_km')
            ->get();

        DB::beginTransaction();
        try {
            $created = 0;
            foreach ($sources as $src) {
                // Validasi kontinuitas — km harus menyambung
                if ($expectedKm !== null && $src->start_km !== $expectedKm) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "KM tidak menyambung: expected {$expectedKm}, got {$src->start_km} (baris ID {$src->id}).",
                    ], 422);
                }

                VehicleCostDetail::create([
                    'vehicle_cost_header_id' => $headerId,
                    'start_km'               => $src->start_km,
                    'end_km'                 => $src->end_km,
                    'description'            => $src->description,
                    'cost_center'            => $src->cost_center,
                    'customer_code'          => $src->customer_code,
                    'is_carryover'           => true,
                    'source_detail_id'       => $src->id,
                ]);

                $expectedKm = $src->end_km;
                $created++;
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        // Recalculate setelah carryover
        $this->recalculate($headerId);

        return response()->json([
            'message' => "{$created} baris berhasil disalin dari bulan lalu.",
            'created' => $created,
        ]);
    }

    // ─────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────

    /**
     * Validasi KM awal row baru harus = KM akhir row terakhir.
     */
    private function validateKmContinuity(int $headerId, int $startKm): void
    {
        $last = VehicleCostDetail::where('vehicle_cost_header_id', $headerId)
            ->whereNull('deleted_at')
            ->orderByDesc('end_km')
            ->first();

        if ($last && $last->end_km !== $startKm) {
            abort(422, "KM tidak menyambung: KM awal harus {$last->end_km}, bukan {$startKm}.");
        }
    }

    /**
     * Recalculate cost_amount semua details.
     * Formula: cost_amount = (km_detail / total_km) × total_cost
     * Baris terakhir mendapat sisa (hindari selisih pembulatan).
     */
    public static function recalculate(int $headerId): int
{
    $header = VehicleCostHeader::find($headerId);
    if (!$header || !$header->total_cost) return 0;

    $details = VehicleCostDetail::where('vehicle_cost_header_id', $headerId)
        ->whereNull('deleted_at')
        ->orderBy('start_km')
        ->get();

    if ($details->isEmpty()) return 0;

    $totalKm = $details->sum(fn($d) => $d->end_km - $d->start_km);
    if ($totalKm <= 0) return 0;

    $totalCost = $header->total_cost;
    $allocated = 0;
    $count     = $details->count();

    foreach ($details as $i => $d) {
        $km     = $d->end_km - $d->start_km;
        $isLast = ($i === $count - 1);
        $amount = $isLast
            ? $totalCost - $allocated
            : (int) round(($km / $totalKm) * $totalCost);

        $d->update(['cost_amount' => $amount]);
        $allocated += $amount;
    }

    // ✅ Sync end_km header dari detail terakhir
    $lastDetail = $details->last();
    if ($lastDetail) {
        $header->update(['end_km' => $lastDetail->end_km]);
    }

       $header->update([
        'start_km' => $details->first()->start_km,
        'end_km'   => $details->last()->end_km,
    ]);

    return $count;
}

    // Tambahkan dua method ini ke VehicleLogbookController.php
// Letakkan setelah method carryover(), sebelum private helpers

    /**
     * GET /vehicles/logbook/summary
     * Ringkasan per business area per periode:
     *  - Kendaraan yang sudah punya header biaya (with_cost)
     *  - Kendaraan yang belum punya header biaya (no_cost)
     *
     * Query params:
     *   bus_area_sap_id  : string (sap_id di tabel business_areas)
     *   company_code     : string
     *   month            : int
     *   year             : int
     */
    // Tambahkan dua method ini ke VehicleLogbookController.php
// Letakkan setelah method carryover(), sebelum private helpers

    /**
     * GET /vehicles/logbook/summary
     * Ringkasan per business area per periode:
     *  - Kendaraan yang sudah punya header biaya (with_cost)
     *  - Kendaraan yang belum punya header biaya (no_cost)
     *
     * Query params:
     *   bus_area_sap_id  : string (sap_id di tabel business_areas)
     *   company_code     : string
     *   month            : int
     *   year             : int
     */
    public function summary(Request $request)
    {
        $request->validate([
            'bus_area_sap_id' => 'required|string',
            'company_code'    => 'required|string',
            'month'           => 'required|integer|min:1|max:12',
            'year'            => 'required|integer|min:2000|max:2099',
        ]);

        $busAreaSapId = $request->bus_area_sap_id;
        $companyCode  = $request->company_code;
        $month        = (int) $request->month;
        $year         = (int) $request->year;

        // Semua kendaraan aktif di bus area + company ini
        $vehicles = DB::table('vehicles')
            ->where('business_area_code', $busAreaSapId)
            ->where('company_code', $companyCode)
            ->where('is_active', 1)
            ->whereNull('deleted_at')
            ->select('id', 'plate_number', 'description', 'cost_center')
            ->orderBy('plate_number')
            ->get();

        $vehicleIds = $vehicles->pluck('id');

        // Header yang ada untuk periode ini
        // Ambil juga end_km untuk kolom "KM Akhir Periode"
        $headers = DB::table('vehicle_cost_headers')
            ->whereIn('vehicle_id', $vehicleIds)
            ->where('month', $month)
            ->where('year', $year)
            ->whereNull('deleted_at')
            ->select('id', 'vehicle_id', 'total_cost', 'end_km')
            ->get()
            ->keyBy('vehicle_id');

        // Detail summary per header
        $headerIds = $headers->pluck('id');

        $detailStats = DB::table('vehicle_cost_details')
            ->whereIn('vehicle_cost_header_id', $headerIds)
            ->whereNull('deleted_at')
            ->selectRaw('
                vehicle_cost_header_id,
                COUNT(*) as detail_count,
                SUM(end_km - start_km) as total_km,
                SUM(COALESCE(cost_amount, 0)) as total_allocated
            ')
            ->groupBy('vehicle_cost_header_id')
            ->get()
            ->keyBy('vehicle_cost_header_id');

        // ── Last KM per cost_center (lintas waktu, end_km tertinggi) ─────────
        // 1. Kumpulkan semua cost_center unik dari kendaraan di bus area ini
        $allCostCenters = $vehicles
            ->pluck('cost_center')
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        $lastKmByCc = [];

        if (!empty($allCostCenters)) {
            // 2. Cari semua sibling vehicle (seluruh perusahaan) per cost_center
            $allSiblings = DB::table('vehicles')
                ->whereIn('cost_center', $allCostCenters)
                ->whereNull('deleted_at')
                ->select('id', 'cost_center')
                ->get();

            // Kelompokkan sibling ids per cost_center
            $siblingIdsByCc = [];
            foreach ($allSiblings as $s) {
                $siblingIdsByCc[$s->cost_center][] = $s->id;
            }

            // 3. Untuk tiap cost_center, ambil header dengan end_km tertinggi
            foreach ($siblingIdsByCc as $cc => $ids) {
                $row = DB::table('vehicle_cost_headers')
                    ->whereIn('vehicle_id', $ids)
                    ->whereNotNull('end_km')
                    ->whereNull('deleted_at')
                    ->orderByDesc('end_km')
                    ->select('end_km', 'month', 'year')
                    ->first();

                $lastKmByCc[$cc] = $row
                    ? ['last_km' => $row->end_km, 'month' => $row->month, 'year' => $row->year]
                    : ['last_km' => null, 'month' => null, 'year' => null];
            }
        }
        // ─────────────────────────────────────────────────────────────────────

        $withCost = [];
        $noCost   = [];

        foreach ($vehicles as $v) {
            $header     = $headers->get($v->id);
            $lastKmInfo = $lastKmByCc[$v->cost_center ?? '']
                ?? ['last_km' => null, 'month' => null, 'year' => null];

            if ($header) {
                $stats          = $detailStats->get($header->id);
                $totalAllocated = (float) ($stats?->total_allocated ?? 0);
                $isBalanced     = abs($totalAllocated - (float) $header->total_cost) < 1;

                $withCost[] = [
                    'vehicle_id'     => $v->id,
                    'plate_number'   => $v->plate_number,
                    'description'    => $v->description,
                    'header_id'      => $header->id,
                    'total_cost'     => (float) $header->total_cost,
                    'total_km'       => $stats ? (int) $stats->total_km : null,
                    'detail_count'   => $stats ? (int) $stats->detail_count : 0,
                    'is_balanced'    => $isBalanced,
                    'current_end_km' => $header->end_km,          // KM akhir periode ini
                    'last_km'        => $lastKmInfo['last_km'],    // KM tertinggi all-time per CC
                    'last_km_month'  => $lastKmInfo['month'],
                    'last_km_year'   => $lastKmInfo['year'],
                ];
            } else {
                $noCost[] = [
                    'vehicle_id'    => $v->id,
                    'plate_number'  => $v->plate_number,
                    'description'   => $v->description,
                    'cost_center'   => $v->cost_center,
                    'last_km'       => $lastKmInfo['last_km'],
                    'last_km_month' => $lastKmInfo['month'],
                    'last_km_year'  => $lastKmInfo['year'],
                ];
            }
        }

        return response()->json([
            'with_cost'      => $withCost,
            'no_cost'        => $noCost,
            'period_label'   => $month . '/' . $year,
            'bus_area_label' => $busAreaSapId,
            'total_cost_all' => array_sum(array_column($withCost, 'total_cost')),
            'total_km_all'   => array_sum(array_map(fn($v) => $v['total_km'] ?? 0, $withCost)),
        ]);
    }

    /**
     * DELETE /vehicles/logbook/bulk
     * Hard delete semua vehicle_cost_headers (beserta details-nya)
     * untuk satu business area + periode tertentu.
     *
     * Hanya boleh diakses role accounting (enforce di route middleware).
     *
     * Query params:
     *   bus_area_sap_id  : string
     *   company_code     : string
     *   month            : int
     *   year             : int
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'bus_area_sap_id' => 'required|string',
            'company_code'    => 'required|string',
            'month'           => 'required|integer|min:1|max:12',
            'year'            => 'required|integer|min:2000|max:2099',
        ]);

        $busAreaSapId = $request->bus_area_sap_id;
        $companyCode  = $request->company_code;
        $month        = (int) $request->month;
        $year         = (int) $request->year;

        // Ambil vehicle_ids di bus area + company ini
        $vehicleIds = DB::table('vehicles')
            ->where('business_area_code', $busAreaSapId)
            ->where('company_code', $companyCode)
            ->whereNull('deleted_at')
            ->pluck('id');

        if ($vehicleIds->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada kendaraan ditemukan untuk area ini.',
                'deleted' => 0,
            ]);
        }

        // Ambil header IDs yang akan dihapus
        $headerIds = DB::table('vehicle_cost_headers')
            ->whereIn('vehicle_id', $vehicleIds)
            ->where('month', $month)
            ->where('year', $year)
            ->pluck('id');

        if ($headerIds->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada data biaya di periode ini.',
                'deleted' => 0,
            ]);
        }

        DB::beginTransaction();
        try {
            // Hard delete details dulu (FK constraint)
            $detailsDeleted = DB::table('vehicle_cost_details')
                ->whereIn('vehicle_cost_header_id', $headerIds)
                ->delete();

            // Hard delete headers
            $headersDeleted = DB::table('vehicle_cost_headers')
                ->whereIn('id', $headerIds)
                ->delete();

            DB::commit();

            return response()->json([
                'message'         => "{$headersDeleted} header biaya dan {$detailsDeleted} baris logbook dihapus.",
                'deleted'         => $headersDeleted,
                'details_deleted' => $detailsDeleted,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal menghapus: ' . $e->getMessage(),
            ], 500);
        }
    }


// Tambahkan dua method ini ke VehicleLogbookController.php
// Letakkan setelah method bulkDelete(), sebelum private helpers

    /**
     * GET /vehicles/logbook/print
     * Data lengkap satu kendaraan satu periode untuk keperluan print.
     *
     * Query params:
     *   vehicle_id : int
     *   month      : int
     *   year       : int
     */
    public function printData(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|integer|exists:vehicles,id',
            'month'      => 'required|integer|min:1|max:12',
            'year'       => 'required|integer|min:2000|max:2099',
        ]);

        $data = $this->buildPrintPayload(
            (int) $request->vehicle_id,
            (int) $request->month,
            (int) $request->year,
        );

        if (!$data) {
            return response()->json([
                'message' => 'Data tidak ditemukan untuk periode ini.',
            ], 404);
        }

        return response()->json($data);
    }

    /**
     * GET /vehicles/logbook/print-all
     * Data print untuk SEMUA kendaraan yang sudah balance
     * di satu business area + periode tertentu.
     *
     * Query params:
     *   bus_area_sap_id : string
     *   company_code    : string
     *   month           : int
     *   year            : int
     */
    public function printAll(Request $request)
    {
        $request->validate([
            'bus_area_sap_id' => 'required|string',
            'company_code'    => 'required|string',
            'month'           => 'required|integer|min:1|max:12',
            'year'            => 'required|integer|min:2000|max:2099',
        ]);

        $busAreaSapId = $request->bus_area_sap_id;
        $companyCode  = $request->company_code;
        $month        = (int) $request->month;
        $year         = (int) $request->year;

        $vehicleIds = DB::table('vehicles')
            ->where('business_area_code', $busAreaSapId)
            ->where('company_code', $companyCode)
            ->where('is_active', 1)
            ->whereNull('deleted_at')
            ->orderBy('plate_number')
            ->pluck('id');

        $results = [];
        foreach ($vehicleIds as $vehicleId) {
            $payload = $this->buildPrintPayload($vehicleId, $month, $year);
            if (!$payload) continue;

            // Hanya sertakan yang balance
            $totalAllocated = collect($payload['details'])->sum('cost_amount');
            $isBalanced = abs($totalAllocated - $payload['header']['total_cost']) < 1;

            if ($isBalanced) {
                $results[] = $payload;
            }
        }

        return response()->json(['vehicles' => $results]);
    }

    /**
     * Helper: build payload print untuk satu kendaraan + periode.
     * Dipakai oleh printData() dan printAll().
     */
    private function buildPrintPayload(int $vehicleId, int $month, int $year): ?array
    {
        $vehicle = DB::table('vehicles')
            ->where('id', $vehicleId)
            ->whereNull('deleted_at')
            ->first(['id', 'plate_number', 'description', 'cost_center', 'company_code', 'business_area_code']);

        if (!$vehicle) return null;

        $header = VehicleCostHeader::where('vehicle_id', $vehicleId)
            ->where('month', $month)
            ->where('year', $year)
            ->whereNull('deleted_at')
            ->first();

        if (!$header) return null;

        $details = VehicleCostDetail::where('vehicle_cost_header_id', $header->id)
            ->whereNull('deleted_at')
            ->orderBy('start_km')
            ->get()
            ->map(function ($d) {
                $ccName = null;
                if ($d->cost_center) {
                    $cc = DB::table('cost_centers')->where('sap_id', $d->cost_center)->first();
                    $ccName = $cc?->description;
                }
                $custName = null;
                if ($d->customer_code) {
                    $cust = DB::table('customers')->where('sap_id', $d->customer_code)->first();
                    $custName = $cust?->name;
                }

                return [
                    'start_km'         => $d->start_km,
                    'end_km'           => $d->end_km,
                    'km'               => $d->end_km - $d->start_km,
                    'cost_center'      => $d->cost_center,
                    'cost_center_name' => $ccName,
                    'customer_code'    => $d->customer_code,
                    'customer_name'    => $custName,
                    'description'      => $d->description,
                    'cost_amount'      => (float) ($d->cost_amount ?? 0),
                ];
            })
            ->values()
            ->toArray();

        // Tgl awal/akhir periode otomatis dari month+year
        $startDate = sprintf('%04d-%02d-01', $year, $month);
        $endDate   = date('Y-m-t', strtotime($startDate)); // hari terakhir bulan itu

        $totalKm = collect($details)->sum('km');
        $totalCost = (float) $header->total_cost;
        $rate = $totalKm > 0 ? (int) round($totalCost / $totalKm) : 0;

        // No Voucher: MMYYYY-{cost_center kendaraan}
        $noVoucher = sprintf('%02d%04d-%s', $month, $year, $vehicle->cost_center);

        return [
            'vehicle' => [
                'plate_number' => $vehicle->plate_number,
                'description'  => $vehicle->description,
                'cost_center'  => $vehicle->cost_center,
            ],
            'header' => [
                'periode'    => sprintf('%d-%d', $month, $year),
                'tgl_awal'   => $startDate,
                'tgl_akhir'  => $endDate,
                'start_km'   => $header->start_km,
                'end_km'     => $header->end_km,
                'total_km'   => $totalKm,
                'total_cost' => $totalCost,
                'rate'       => $rate,
                'alokasi'    => '73730001',
                'no_voucher' => $noVoucher,
            ],
            'details' => $details,
        ];
    }

    // Tambahkan method ini ke VehicleLogbookController.php
// Letakkan setelah printAll(), sebelum buildPrintPayload()

    /**
     * GET /vehicles/logbook/export-zf0002
     * Data untuk export ZF0002_AGRI — biaya ke CUSTOMER.
     * Hanya kendaraan yang sudah balance di periode ini yang disertakan.
     *
     * Query params:
     *   bus_area_sap_id : string
     *   company_code    : string
     *   month           : int
     *   year            : int
     *
     * Response: { vehicles: [...], all_balanced: bool, vehicle_count: int }
     * Setiap item vehicles[] = payload dari buildPrintPayload(), tapi
     * hanya berisi details dengan customer_code (bukan cost_center).
     */
    public function exportZf0002(Request $request)
    {
        $request->validate([
            'bus_area_sap_id' => 'required|string',
            'company_code'    => 'required|string',
            'month'           => 'required|integer|min:1|max:12',
            'year'            => 'required|integer|min:2000|max:2099',
        ]);

        $busAreaSapId = $request->bus_area_sap_id;
        $companyCode  = $request->company_code;
        $month        = (int) $request->month;
        $year         = (int) $request->year;

        $vehicleIds = DB::table('vehicles')
            ->where('business_area_code', $busAreaSapId)
            ->where('company_code', $companyCode)
            ->where('is_active', 1)
            ->whereNull('deleted_at')
            ->orderBy('plate_number')
            ->pluck('id');

        $vehiclesWithCustomer = [];
        $totalVehicles = 0;
        $balancedVehicles = 0;

        foreach ($vehicleIds as $vehicleId) {
            $payload = $this->buildPrintPayload($vehicleId, $month, $year);
            if (!$payload) continue;

            $totalVehicles++;

            $totalAllocated = collect($payload['details'])->sum('cost_amount');
            $isBalanced = abs($totalAllocated - $payload['header']['total_cost']) < 1;
            if ($isBalanced) $balancedVehicles++;

            $payload['is_balanced'] = $isBalanced;
if (!empty($payload['details'])) {
    $vehiclesWithCustomer[] = $payload;
}
           
        }

        return response()->json([
            'vehicles'        => $vehiclesWithCustomer,
            'all_balanced'    => $totalVehicles > 0 && $totalVehicles === $balancedVehicles,
            'vehicle_count'   => $totalVehicles,
            'balanced_count'  => $balancedVehicles,
            'company_code'    => $companyCode,
            'business_area'   => $busAreaSapId,
            'month'           => $month,
            'year'            => $year,
        ]);
    }

    /**
 * GET /vehicles/logbook/last-km
 * KM akhir tertinggi dari semua header kendaraan yang memiliki
 * cost_center yang sama dengan kendaraan terpilih (lintas waktu).
 *
 * Query params:
 *   vehicle_id : int
 */
public function lastKm(Request $request)
{
    $request->validate([
        'vehicle_id' => 'required|integer|exists:vehicles,id',
    ]);

    $vehicle = DB::table('vehicles')
        ->where('id', $request->vehicle_id)
        ->whereNull('deleted_at')
        ->first(['cost_center']);

    if (!$vehicle || !$vehicle->cost_center) {
        return response()->json(['last_km' => null, 'month' => null, 'year' => null]);
    }

    // Semua vehicle_id yang punya cost_center sama
    $siblingIds = DB::table('vehicles')
        ->where('cost_center', $vehicle->cost_center)
        ->whereNull('deleted_at')
        ->pluck('id');

    // Header dengan end_km tertinggi di antara sibling
    $row = DB::table('vehicle_cost_headers')
        ->whereIn('vehicle_id', $siblingIds)
        ->whereNotNull('end_km')
        ->whereNull('deleted_at')
        ->orderByDesc('end_km')
        ->select('end_km', 'month', 'year', 'vehicle_id')
        ->first();

    if (!$row) {
        return response()->json(['last_km' => null, 'month' => null, 'year' => null]);
    }

    return response()->json([
        'last_km'    => $row->end_km,
        'month'      => $row->month,
        'year'       => $row->year,
        'vehicle_id' => $row->vehicle_id,
    ]);
}

    /**
     * GET /vehicles/logbook/export-skf
     * Data untuk export SKF (Statistical Key Figures) — alokasi internal
     * berdasarkan cost center penerima. Beda dengan exportZf0002:
     *  - tidak ada konsep debet/kredit, cuma data mentah alokasi
     *  - filter details yang punya cost_center (bukan customer_code)
     *  - tidak butuh status balance, semua kendaraan yg punya baris
     *    cost_center disertakan
     *
     * Query params:
     *   bus_area_sap_id : string
     *   company_code    : string
     *   month           : int
     *   year            : int
     *
     * Response: { vehicles: [...], vehicle_count: int }
     * Setiap item vehicles[] = payload dari buildPrintPayload(), tapi
     * hanya berisi details dengan cost_center (bukan customer_code).
     */
    public function exportSkf(Request $request)
    {
        $request->validate([
            'bus_area_sap_id' => 'required|string',
            'company_code'    => 'required|string',
            'month'           => 'required|integer|min:1|max:12',
            'year'            => 'required|integer|min:2000|max:2099',
        ]);

        $busAreaSapId = $request->bus_area_sap_id;
        $companyCode  = $request->company_code;
        $month        = (int) $request->month;
        $year         = (int) $request->year;

        $vehicleIds = DB::table('vehicles')
            ->where('business_area_code', $busAreaSapId)
            ->where('company_code', $companyCode)
            ->where('is_active', 1)
            ->whereNull('deleted_at')
            ->orderBy('plate_number')
            ->pluck('id');

        $vehiclesWithCc = [];

        foreach ($vehicleIds as $vehicleId) {
            $payload = $this->buildPrintPayload($vehicleId, $month, $year);
            if (!$payload) continue;

            // Filter hanya baris dengan cost_center (alokasi SKF)
            $ccDetails = array_values(array_filter(
                $payload['details'],
                fn($d) => !empty($d['cost_center'])
            ));

            if (empty($ccDetails)) continue;

            $payload['details'] = $ccDetails;
            $vehiclesWithCc[] = $payload;
        }

        return response()->json([
            'vehicles'      => $vehiclesWithCc,
            'vehicle_count' => count($vehiclesWithCc),
            'company_code'  => $companyCode,
            'business_area' => $busAreaSapId,
            'month'         => $month,
            'year'          => $year,
        ]);
    }


}