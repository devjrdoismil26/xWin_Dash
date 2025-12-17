<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @method static \Illuminate\Database\Eloquent\Builder where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static static create(array $attributes)
 * @method static static find($id, $columns = ['*'])
 * @method static static first($columns = ['*'])
 * @method static static destroy($ids)
 * @method static \Illuminate\Database\Eloquent\Collection all($columns = ['*'])
 */
class IntegrationModel extends Model
{
    use HasFactory, HasUuids;
    
    protected static function newFactory()
    {
        return \Database\Factories\IntegrationModelFactory::new();
    }
    protected $table = 'integrations';

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'provider',
        'type',
        'config_schema',
        'icon',
        'documentation_url',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'config_schema' => 'array',
        'is_active' => 'boolean',
    ];
}
