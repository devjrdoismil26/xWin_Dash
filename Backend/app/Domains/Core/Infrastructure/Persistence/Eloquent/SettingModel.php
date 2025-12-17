<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @method static \Illuminate\Database\Eloquent\Builder where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static static updateOrCreate(array $attributes, array $values = [])
 * @method static static first($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Collection all($columns = ['*'])
 */
class SettingModel extends Model
{
    use HasUuids;
    use BelongsToProject;
    
    protected $table = 'settings';

    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
        'group',
        'is_public',
        'is_encrypted',
        'project_id',
    ];

    // Se o valor for JSON, pode ser útil:
    // protected $casts = [
    //     'value' => 'array',
    // ];
}
