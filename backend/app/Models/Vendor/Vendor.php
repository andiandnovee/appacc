<?php

namespace App\Models\Vendor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Vendor extends Model
{
    protected $table = 'vendors';

    protected $fillable = [
        'vendor_code',
        'name',
        'npwp',
        'address',
        'service_type',
        'ref_pph_id',
        'bank_name',
        'bank_account_no',
        'bank_account_holder',
        'is_active',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'ref_pph_id' => 'integer',
    ];

    // ─── Relationships ────────────────────────────────────────────

    public function refPph()
    {
        return $this->belongsTo(\App\Models\RefPph::class, 'ref_pph_id');
    }

    // ─── Scopes ───────────────────────────────────────────────────

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch(Builder $query, string $keyword): Builder
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('name', 'like', "%{$keyword}%")
              ->orWhere('vendor_code', 'like', "%{$keyword}%")
              ->orWhere('npwp', 'like', "%{$keyword}%");
        });
    }

    // ─── Accessors ────────────────────────────────────────────────

    public function getDisplayNameAttribute(): string
    {
        return "{$this->vendor_code} - {$this->name}";
    }
}
