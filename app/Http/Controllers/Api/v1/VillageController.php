<?php

namespace App\Http\Controllers\Api\v1;;

use Illuminate\Http\Request;
use Laravolt\Indonesia\Models\Village;


class VillageController extends Controller
{
    // // Pencarian Village/Desa
    public function search(Request $request)
    {
        $q = $request->get('q', '');

        $villages = Village::query()
            ->where('name', 'like', "%{$q}%")
            ->limit(20)
            ->get(['id', 'name', 'code']);

        return response()->json($villages);
    }
}