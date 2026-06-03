<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleCostDetail extends Model
{
    use SoftDeletes;

    protected $table = 'vehicle_cost_details';

    protected $fillable = [
        'sap_id',
        'vehicle_cost_header_id',
        'start_date',
        'end_date',
        'start_km',
        'end_km',
        'cost_center',
        'customer_code',
        'description',
        'cost_amount',
        'source_detail_id',
        'is_carryover',
    ];

    protected $casts = [
        'start_date'   => 'date',
        'end_date'     => 'date',
        'is_carryover' => 'boolean',
        'cost_amount'  => 'integer',
    ];

    public function header()
    {
        return $this->belongsTo(VehicleCostHeader::class, 'vehicle_cost_header_id');
    }

    public function sourceDetail()
    {
        return $this->belongsTo(VehicleCostDetail::class, 'source_detail_id');
    }

    public function carriedOverTo()
    {
        return $this->hasMany(VehicleCostDetail::class, 'source_detail_id');
    }
}