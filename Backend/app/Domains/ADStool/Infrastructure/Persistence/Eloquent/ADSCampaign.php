<?php

namespace App\Domains\ADStool\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ADS Campaign Eloquent model.
 * 
 * SECURITY FIX (MODEL-009): Adicionado BelongsToProject trait para multi-tenancy
 *
 * @property int $id
 * @property int $user_id
 * @property int $project_id
 * @property string $name
 * @property string $objective
 * @property string $platform
 * @property float $daily_budget
 * @property string $status
 * @property string $sync_status
 * @property string|null $error_message
 * @property string|null $platform_campaign_id
 * @property string|null $platform_status
 * @property array|null $platform_specific_data
 * @property \Carbon\Carbon|null $start_date
 * @property \Carbon\Carbon|null $end_date
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 *
 * @property-read User $user
 * @property-read Project $project
 *
 * @method static \Illuminate\Database\Eloquent\Builder where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static static find($id, $columns = ['*'])
 * @method static static create(array $attributes)
 * @method static static updateOrCreate(array $attributes, array $values = [])
 * @method static \Illuminate\Database\Eloquent\Collection all($columns = ['*'])
 * @method static static destroy($ids)
 */
class ADSCampaign extends Model
{
    use HasFactory;
    use BelongsToProject;

    protected $table = 'adstool_campaigns';

    protected $fillable = [
        'user_id',
        'project_id',
        'name',
        'objective',
        'platform',
        'daily_budget',
        'status',
        'sync_status',
        'error_message',
        'platform_campaign_id',
        'platform_status',
        'platform_specific_data',
        'start_date',
        'end_date',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'daily_budget' => 'decimal:2',
        'platform_specific_data' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
