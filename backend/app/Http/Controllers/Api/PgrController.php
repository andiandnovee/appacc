<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PgrController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('pr_group_tabel');

        if ($request->filled('search')) {
            $query->where('PGr', 'like', "%{$request->search}%")
                  ->orWhere('Description', 'like', "%{$request->search}%");
        }

        $results = $query->orderBy('PGr')->get();

        return response()->json(['data' => $results]);
    }
}