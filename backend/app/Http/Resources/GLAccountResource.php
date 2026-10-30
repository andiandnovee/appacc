<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GLAccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'gl_acc' => $this->gl_acc,
            'gl_text' => $this->gl_text,
            'gl_group' => $this->gl_group,
            'group_src' => $this->group_src,
            'desc' => $this->desc,
            'other_desc' => $this->other_desc,
        ];
    }
}
