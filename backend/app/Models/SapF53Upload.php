<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SapF53Upload extends Model
{
    use SoftDeletes;

    protected $table = 'sap_f53_uploads';

    protected $fillable = [
        'company_sap_id',
        'stage_sap_id',
        'doc_date',
        'assignment',
        'business_area',
        'vendor_sap_id',
        'amount',
        'po_number',
        'po_text',
        'doc_number',
        'reference',
    ];

    protected $casts = [
        'amount'         => 'float',
        'business_area'  => 'integer',
        'vendor_sap_id'  => 'integer',
        'company_sap_id' => 'integer',
        'stage_sap_id'   => 'integer',
    ];
}
