<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static \Illuminate\Database\Eloquent\Builder where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static static create(array $attributes)
 * @method static static find($id, $columns = ['*'])
 * @method static static first($columns = ['*'])
 * @method static static latest($column = 'created_at')
 * @method static static limit($value)
 * @method static \Illuminate\Database\Eloquent\Collection get($columns = ['*'])
 */
class IntegrationSyncLogModel extends Model
{
    use HasFactory;
    
    protected static function newFactory()
    {
        return \Database\Factories\IntegrationSyncLogModelFactory::new();
    }
    protected $table = 'integration_sync_logs';

    protected $fillable = [
        'integration_id',
        'status',
        'message',
        'details',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'details' => 'array',
    ];

    // Relacionamento com a integração
    // public function integration()
    // {
    //     return $this->belongsTo(IntegrationModel::class);
    // }
}
