<?php

namespace App\Http\Controllers\Api\v1;
use App\Models\Alamat;
use Illuminate\Http\Request;

class AlamatsController extends Controller
{
    //
    public function index()
    {
        $alamats = Alamat::with(['perum', 'village'])->get();
        return inertia('Alamat/Index', [
            'alamats' => $alamats,
        ]);
    }
}
