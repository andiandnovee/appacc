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
    private function recalculate(int $headerId): int
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

        $totalCost    = $header->total_cost;
        $allocated    = 0;
        $count        = $details->count();

        foreach ($details as $i => $d) {
            $km = $d->end_km - $d->start_km;
            $isLast = ($i === $count - 1);

            // Baris terakhir dapat sisa (anti selisih pembulatan)
            $amount = $isLast
                ? $totalCost - $allocated
                : (int) round(($km / $totalKm) * $totalCost);

            $d->update(['cost_amount' => $amount]);
            $allocated += $amount;
        }

        return $count;
    }
}