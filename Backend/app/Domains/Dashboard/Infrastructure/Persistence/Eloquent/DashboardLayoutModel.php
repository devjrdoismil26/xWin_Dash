<?php

namespace App\Domains\Dashboard\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Dashboard Layout Model
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 *
 * @property string $id
 * @property string $user_id
 * @property array $layout
 * @property array $widgets
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class DashboardLayoutModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected $table = 'dashboard_layouts';

    protected $fillable = [
        'user_id',
        'project_id',
        'layout',
        'widgets',
    ];

    protected $casts = [
        'layout' => 'array',
        'widgets' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
