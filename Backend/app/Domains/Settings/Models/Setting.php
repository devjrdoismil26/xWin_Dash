<?php

namespace App\Domains\Settings\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Model;

/**
 * Setting Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class Setting extends Model
{
    use BelongsToProject;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'is_public',
        'project_id',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function getValueAttribute($value)
    {
        return match($this->type) {
            'json' => json_decode($value, true),
            'boolean' => (bool) $value,
            'integer' => (int) $value,
            'float' => (float) $value,
            default => $value,
        };
    }

    public function setValueAttribute($value)
    {
        $this->attributes['value'] = match($this->type) {
            'json' => json_encode($value),
            'boolean' => $value ? '1' : '0',
            default => $value,
        };
    }
}
