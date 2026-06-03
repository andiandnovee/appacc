<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use SoftDeletes;

    protected $table = 'vehicles';

    protected $fillable = [
        'sap_id',
        'vehicle_type',
        'company_code',
        'business_area_code',
        'description',
        'plate_number',
        'plate_number_old',
        'cost_center',
        'chassis_number',
        'engine_number',
        'is_active',
        'notes',
        'stnkb_valid_until',
        'pkb_valid_until',
        'kier_valid_until',
    ];

    protected $casts = [
        'stnkb_valid_until' => 'date',
        'pkb_valid_until'   => 'date',
        'kier_valid_until'  => 'date',
    ];

    public function costHeaders()
    {
        return $this->hasMany(VehicleCostHeader::class);
    }
}