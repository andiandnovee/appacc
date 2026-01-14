<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Http\Resources\AccountResource;
use App\Models\Keuangan\Account;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AccountsController extends Controller
{
    /**
     * GET /api/v1/accounts
     * List akun (sorted by kode)
     */
    public function index()
    {
        $accounts = Account::orderBy('kode', 'asc')->get();

        return ResponseFormatter::success(
            AccountResource::collection($accounts),
            'Daftar akun berhasil dimuat'
        );
    }

    /**
     * GET /api/v1/accounts/tree
     * Struktur COA (bertier parent-child)
     */
    public function tree()
    {
        $root = Account::with('children')
            ->whereNull('parent_id')
            ->orderBy('kode', 'asc')
            ->get();

        return ResponseFormatter::success(
            AccountResource::collection($root),
            'Struktur akun berhasil dimuat'
        );
    }

    /**
     * GET /api/v1/accounts/{id}
     */
    public function show($id, Request $request)
    {
        $account = Account::with('children', 'parent')->find($id);

        if (! $account) {
            return ResponseFormatter::error('Data akun tidak ditemukan', null, 404);
        }

        // Get journal entries untuk account ini dengan pagination
        $perPage = $request->query('per_page', 10);
        $journalEntries = $account->journal_lines()
            ->with('journalEntry')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Transform journal entries
        $entriesItems = $journalEntries->items();
        $journalEntriesData = array_map(function ($line) {
            return [
                'id' => $line->id,
                'journal_entry_id' => $line->journal_entry_id,
                'tanggal' => $line->journalEntry->tanggal ?? null,
                'deskripsi' => $line->journalEntry->deskripsi ?? null,
                'debit' => (float) $line->debit,
                'kredit' => (float) $line->kredit,
                'created_at' => $line->created_at,
            ];
        }, $entriesItems);

        return ResponseFormatter::success(
            [
                'account' => new AccountResource($account),
                'journal_entries' => $journalEntriesData,
                'pagination' => [
                    'current_page' => $journalEntries->currentPage(),
                    'per_page' => $journalEntries->perPage(),
                    'total' => $journalEntries->total(),
                    'last_page' => $journalEntries->lastPage(),
                ],
            ],
            'Detail akun berhasil dimuat'
        );
    }

    /**
     * POST /api/v1/accounts
     * Membuat akun baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_code' => ['required', 'string'],
            'kode' => ['required', 'string', 'max:20', 'unique:accounts,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'exists:accounts,id'],
        ]);

        $account = Account::create($validated);

        return ResponseFormatter::success($account, 'Akun berhasil dibuat', 201);
    }

    /**
     * PUT /api/v1/accounts/{id}
     */
    public function update(Request $request, $id)
    {
        $account = Account::find($id);
        if (! $account) {
            return ResponseFormatter::error('Data akun tidak ditemukan', null, 404);
        }

        $validated = $request->validate([
            'company_code' => ['required', 'string'],
            'kode' => [
                'required',
                'string',
                'max:20',
                Rule::unique('accounts', 'kode')->ignore($id),
            ],
            'nama' => ['required', 'string', 'max:255'],
            'parent_id' => [
                'nullable',
                'exists:accounts,id',
                function ($attr, $value, $fail) use ($id) {
                    if ($value == $id) {
                        $fail('Akun tidak boleh menjadi parent dirinya sendiri.');
                    }
                },
            ],
        ]);

        $account->update($validated);

        return ResponseFormatter::success($account, 'Akun berhasil diperbarui');
    }

    /**
     * DELETE /api/v1/accounts/{id}
     */
    public function destroy($id)
    {
        $account = Account::find($id);

        if (! $account) {
            return ResponseFormatter::error('Data akun tidak ditemukan', null, 404);
        }

        // Tidak boleh hapus jika pernah dipakai dalam jurnal
        if ($account->journal_lines()->exists()) {
            return ResponseFormatter::error(
                'Akun tidak dapat dihapus karena sudah dipakai di jurnal.',
                null,
                422
            );
        }

        // Tidak boleh hapus jika punya sub-akun
        if ($account->children()->exists()) {
            return ResponseFormatter::error(
                'Akun tidak dapat dihapus karena memiliki sub-akun.',
                null,
                422
            );
        }

        $account->delete();

        return ResponseFormatter::success(null, 'Akun berhasil dihapus');
    }
}
