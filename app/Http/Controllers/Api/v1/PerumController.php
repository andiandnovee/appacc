<?php

namespace App\Http\Controllers\Api\v1;;

use App\Models\Master\Perum;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PerumController extends Controller
{
    public function index()
    {
        $perum = Perum::all();
        return Inertia::render('Perum/Index', [
            'perum' => $perum,
        ]);
    }

    public function search(Request $request)
{
    $q = $request->get('q');
    return Perum::query()
        ->where('nama', 'like', "%{$q}%")
        ->limit(10)
        ->get(['id', 'nama']); 
}



     public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string',
            
        ]);

        Perum::create($data);
        return redirect()->route('perum.index');
    }

    public function destroy(Perum $perum)
    {
        $perum->delete();
        return redirect()->route('perum.index');
    }
    
}