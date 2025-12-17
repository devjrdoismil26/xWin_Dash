<?php

namespace App\Domains\Core\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static \Illuminate\Database\Eloquent\Builder where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static static create(array $attributes)
 * @method static static find($id, $columns = ['*'])
 * @method static static first($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Collection get($columns = ['*'])
 */
class UserApiConfiguration extends Model
{
    protected $table = 'user_api_configurations';

    protected $fillable = [
        'user_id',
        'service_name',
        'api_key',
        'is_active',
        'settings',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
}
