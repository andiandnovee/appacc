<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Keuangan\JournalEntry;
use Illuminate\Http\Request;

class JournalController extends Controller
{
    /**
     * GET /api/v1/journal
     * List jurnal entries dengan pagination dan filters
     */
    public function index(Request $request)
    {
        $this->authorize('view', JournalEntry::class);

        $query = JournalEntry::with('lines')
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc');

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('date', '>=', $request->query('start_date'));
        }
        if ($request->has('end_date')) {
            $query->whereDate('date', '<=', $request->query('end_date'));
        }

        // Filter by description
        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where('description', 'like', "%{$search}%");
        }

        // Filter by status (parked/posted)
        if ($request->has('status')) {
            $status = $request->query('status');
            if ($status && $status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Filter by accounts (multiple)
        if ($request->has('account_ids')) {
            $accountIds = $request->query('account_ids');
            if (is_string($accountIds)) {
                $accountIds = explode(',', $accountIds);
            }
            if (! empty($accountIds)) {
                $query->whereHas('lines', function ($q) use ($accountIds) {
                    $q->whereIn('account_id', $accountIds);
                });
            }
        }

        $perPage = $request->query('per_page', 15);
        $entries = $query->paginate($perPage);

        // Transform entries
        $data = $entries->items();
        $entriesData = array_map(function ($entry) {
            $totalDebit = $entry->lines->sum('debit');
            $totalKredit = $entry->lines->sum('credit');

            return [
                'id' => $entry->id,
                'date' => $entry->date,
                'description' => $entry->description,
                'status' => $entry->status ?? 'parked',
                'total_debit' => (float) $totalDebit,
                'total_kredit' => (float) $totalKredit,
                'lines_count' => count($entry->lines),
                'created_at' => $entry->created_at,
                'updated_at' => $entry->updated_at,
            ];
        }, $data);

        return ResponseFormatter::success(
            [
                'entries' => $entriesData,
                'pagination' => [
                    'current_page' => $entries->currentPage(),
                    'per_page' => $entries->perPage(),
                    'total' => $entries->total(),
                    'last_page' => $entries->lastPage(),
                ],
            ],
            'Daftar jurnal berhasil dimuat'
        );
    }

    /**
     * GET /api/v1/journal/{id}
     * Detail jurnal entry dengan journal lines dan account balances
     */
    public function show($id)
    {
        $this->authorize('view', JournalEntry::class);

        $entry = JournalEntry::with('lines.account')->find($id);

        if (! $entry) {
            return ResponseFormatter::error('Jurnal tidak ditemukan', null, 404);
        }

        // Transform journal lines dengan keterangan akun
        $linesData = $entry->lines->map(function ($line) {
            return [
                'id' => $line->id,
                'account_id' => $line->account_id,
                'account_code' => $line->account->kode,
                'account_name' => $line->account->nama,
                'debit' => (float) $line->debit,
                'kredit' => (float) $line->credit,
            ];
        });

        $totalDebit = $entry->lines->sum('debit');
        $totalKredit = $entry->lines->sum('credit');

        return ResponseFormatter::success(
            [
                'entry' => [
                    'id' => $entry->id,
                    'date' => $entry->date,
                    'description' => $entry->description,
                    'status' => $entry->status ?? 'parked',
                    'created_at' => $entry->created_at,
                    'updated_at' => $entry->updated_at,
                ],
                'lines' => $linesData,
                'totals' => [
                    'debit' => (float) $totalDebit,
                    'kredit' => (float) $totalKredit,
                    'balance' => (float) ($totalDebit - $totalKredit),
                ],
            ],
            'Detail jurnal berhasil dimuat'
        );
    }
}
