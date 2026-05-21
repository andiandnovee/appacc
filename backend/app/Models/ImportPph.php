<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImportPph extends Model
{
    protected $table = 'importpphs';

    protected $fillable = [
        'posting_date',
        'document_number',
        'reference',
        'company_code',
        'amount_in_local_currency',
        'text',
        'vendor_code',
        'gl_account_code',
        'batch_id',
        'po_number', // <-- new field untuk nomor PO
    ];

    protected $casts = [
        'posting_date'             => 'date',
        'amount_in_local_currency' => 'decimal:2',
    ];

    // ── Helpers ──────────────────────────────────────────────

    /**
     * Generate batch_id dari company_code + gl_account_code + posting_date
     * Format: company_code-gl_account_code-YYYY-MM
     * Contoh: 1000-154100-2026-05
     */

    // ── GL → PPh Type Mapping ─────────────────────────────────

const GL_PPH_MAP = [
    '21520002' => 'PPh Ps. 4 (2)',
    '21540001' => 'PPh Ps. 26',
    '21520001' => 'PPh Ps. 23',
    '21520003' => 'PPh Ps. 22',
    '21510001' => 'PPh Ps. 21',
    '21580001' => 'PPh Ps. 15',
];

public static function getPphType(string $glAccountCode): ?string
{
    return self::GL_PPH_MAP[$glAccountCode] ?? null;
}

public static function isValidGl(string $glAccountCode): bool
{
    return array_key_exists($glAccountCode, self::GL_PPH_MAP);
}
    public static function generateBatchId(
        string $companyCode,
        string $glAccountCode,
        string $postingDate
    ): string {
        $period = \Carbon\Carbon::parse($postingDate)->format('Y-m');
        return "{$companyCode}-{$glAccountCode}-{$period}";
    }

    /**
     * Cek duplikat berdasar composite unique key
     */
    public static function isDuplicate(
        string $documentNumber,
        string $companyCode,
        string $postingDate
    ): bool {
        return static::where('document_number', $documentNumber)
            ->where('company_code', $companyCode)
            ->where('posting_date', $postingDate)
            ->exists();
    }

    // ── Scopes ───────────────────────────────────────────────

    public function scopeByCompanyCode($query, string $companyCode)
    {
        return $query->where('company_code', $companyCode);
    }

    public function scopeByVendor($query, string $vendorCode)
    {
        return $query->where('vendor_code', $vendorCode);
    }

    public function scopeByPostingDate($query, string $from, string $to = null)
    {
        $query->where('posting_date', '>=', $from);

        if ($to) {
            $query->where('posting_date', '<=', $to);
        }

        return $query;
    }

    public function scopeByBatch($query, string $batchId)
    {
        return $query->where('batch_id', $batchId);
    }

    /**
     * Batch yang masih incomplete (ada vendor_code NULL)
     */
    public function scopeIncompleteBatches($query)
    {
        return $query->select('batch_id', 'company_code', 'gl_account_code')
            ->selectRaw('MIN(posting_date) as periode')
            ->selectRaw('COUNT(*) as total_rows')
            ->selectRaw('SUM(CASE WHEN vendor_code IS NULL THEN 1 ELSE 0 END) as missing_vendor')
            ->whereNull('vendor_code')
            ->groupBy('batch_id', 'company_code', 'gl_account_code')
            ->orderBy('periode', 'desc');
    }


// tambah di model ImportPph

public function vendor(): \Illuminate\Database\Eloquent\Relations\BelongsTo
{
    return $this->belongsTo(Vendor::class, 'vendor_code', 'sap_id');
}

public function company(): \Illuminate\Database\Eloquent\Relations\BelongsTo
{
    return $this->belongsTo(Company::class, 'company_code', 'sap_id');
}
    
}