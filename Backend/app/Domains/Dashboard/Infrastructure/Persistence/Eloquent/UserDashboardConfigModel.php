<?php

namespace App\Domains\Dashboard\Infrastructure\Persistence\Eloquent;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * User Dashboard Config Model
 *
 * @property string $id
 * @property string $user_id
 * @property array $preferences
 * @property array $visible_widgets
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class UserDashboardConfigModel extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'user_dashboard_configs';

    protected $fillable = [
        'user_id',
        'preferences',
        'visible_widgets',
    ];

    protected $casts = [
        'preferences' => 'array',
        'visible_widgets' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
