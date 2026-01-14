<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    /**
     * Kolom yang sebenarnya ADA di tabel accounts.
     */
    protected $fillable = [
        'company_code',
        'kode',
        'nama',
        'parent_id',
    ];

    /**
     * Relasi ke saldo bulanan (account_balances)
     */
    public function account_balances()
    {
        return $this->hasMany(AccountBalance::class);
    }

    /**
     * Relasi ke journal_lines
     */
    public function journal_lines()
    {
        return $this->hasMany(JournalLine::class);
    }

    /**
     * Relasi parent (akun induk)
     */
    public function parent()
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    /**
     * Relasi child (sub akun)
     */
    public function children()
    {
        return $this->hasMany(Account::class, 'parent_id');
    }
}