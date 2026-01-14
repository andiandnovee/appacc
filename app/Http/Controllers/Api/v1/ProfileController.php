<?php

namespace App\Http\Controllers\Api\v1;;

use App\Models\Keanggotaan\Anggota;
use App\Http\Requests\AnggotaRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Tampilkan profil anggota milik user yang login
     */
        public function show(Request $request)
        {
            $anggota = $request->user()->anggota;

            if (!$anggota) {
                abort(403, 'Anda belum terdaftar sebagai anggota.');
            }

            // Muat relasi yang diperlukan
            $anggota->load(['alamats.perum', 'alamats.village']);

            return Inertia::render('Profile/Show', [
                'anggota' => $anggota,
            ]);
        }

    /**
     * Update profil anggota milik user yang login
     */
    public function update(AnggotaRequest $request)
    {
        $anggota = $request->user()->anggota;
        $request->setAnggotaId($anggota->id);

        if (!$anggota) {
            abort(403, 'Anda belum terdaftar sebagai anggota.');
        }

        $data = $request->validated();

        // Bersihkan input sebelum update
        $data['no_hp']  = preg_replace('/\D/', '', $data['no_hp']);
        $data['no_ktp'] = preg_replace('/\D/', '', $data['no_ktp']);
        $data['no_kk']  = preg_replace('/\D/', '', $data['no_kk']);




        $anggota->update($data);

        return redirect()->route('self.profile.show')->with('success', 'Profil berhasil diperbarui.');
    }



public function addAlamat(Request $request)
{
    // Ambil anggota dari user yang sedang login
    $anggota = $request->user()->anggota;

    // Kalau user belum punya data anggota
    if (!$anggota) {
        abort(403, 'Anda belum terdaftar sebagai anggota.');
    }

    // Validasi input dari form
    $data = $request->validate([
        'perum_id' => 'nullable|exists:perums,id',
        'village_id' => 'nullable|exists:indonesia_villages,id',
        'blok' => 'nullable|string|max:255',
        'no_rumah' => 'nullable|string|max:255',
        'alamat_lainnya' => 'nullable|string',
    ]);

    // Tambahkan anggota_id ke data yang divalidasi
    $data['anggota_id'] = $anggota->id;

    // Simpan data alamat
    $anggota->alamats()->create($data);

    return back()->with('success', 'Alamat berhasil ditambahkan.');
}


public function updateAlamat(Request $request, $id)
{
    $anggota = $request->user()->anggota;
    if (!$anggota) {
        abort(403, 'Anda belum terdaftar sebagai anggota.');
    }

    $alamat = $anggota->alamats()->findOrFail($id);

    $data = $request->validate([
        'perum_id' => 'nullable|exists:perums,id',
        'village_id' => 'nullable|exists:indonesia_villages,id',
        'blok' => 'nullable|string|max:255',
        'no_rumah' => 'nullable|string|max:255',
        'alamat_lainnya' => 'nullable|string',
    ]);

    $alamat->update($data);

    return back()->with('success', 'Alamat berhasil diperbarui.');
}

    
}