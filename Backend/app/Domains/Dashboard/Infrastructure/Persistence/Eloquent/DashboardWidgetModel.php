<?php

namespace App\Domains\Dashboard\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * DashboardWidgetModel
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 * 
 * @property \App\Domains\Users\Models\User|null $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|DashboardWidget newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DashboardWidget newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DashboardWidget onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DashboardWidget query()
 * @method static \Illuminate\Database\Eloquent\Builder|DashboardWidget withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DashboardWidget withoutTrashed()
 *
 * @mixin \Eloquent
 */
class DashboardWidgetModel extends Model
{
    use HasUuids;
    use SoftDeletes;
    use BelongsToProject;

    protected $fillable = ['user_id', 'type', 'config', 'project_id'];

    protected $casts = [
        'config' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Users\Models\User::class);
    }
}
