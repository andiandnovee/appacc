<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleCostHeader extends Model
{
    use SoftDeletes;

    protected $table = 'vehicle_cost_headers';

    protected $fillable = [
        'sap_id',
        'vehicle_id',
        'company_code',
        'business_area_code',
        'year',
        'month',
        'total_cost',
        'start_date',
        'end_date',
        'start_km',
        'end_km',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'total_cost' => 'float',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function details()
    {
        return $this->hasMany(VehicleCostDetail::class)->orderBy('start_km');
    }
}