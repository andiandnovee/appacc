<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GLAccount extends Model
{
    protected $table = 'gl_accounts';

    public $timestamps = false;

    protected $fillable = [
        'gl_acc',
        'gl_text',
        'gl_group',
        'group_src',
        'desc',
        'other_desc',
    ];
}
