<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static \Illuminate\Database\Eloquent\Builder where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static static updateOrCreate(array $attributes, array $values = [])
 * @method static static first($columns = ['*'])
 * @method static static find($id, $columns = ['*'])
 * @method static static destroy($ids)
 */
class CacheEntryModel extends Model
{
    use HasFactory;
    
    protected static function newFactory()
    {
        return \Database\Factories\CacheEntryModelFactory::new();
    }
    protected $table = 'cache_entries';

    protected $fillable = [
        'user_id',
        'key',
        'value',
        'type',
        'ttl',
        'description',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expiration' => 'datetime',
    ];
}
