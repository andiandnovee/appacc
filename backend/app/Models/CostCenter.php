<?php

// app/Models/CostCenter.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CostCenter extends Model
{
    use SoftDeletes;

    protected $table = 'cost_centers';

    protected $fillable = [
        'sap_id',
        'description',
        'short_name',
    ];

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function vehicleCostDetails()
    {
        return $this->hasMany(VehicleCostDetail::class, 'cost_center', 'sap_id');
    }
}
