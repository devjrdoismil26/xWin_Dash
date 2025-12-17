<?php

namespace App\Domains\ADStool\Infrastructure\Persistence\Eloquent;

use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Domains\ADStool\Models\Account.
 *
 * @property string                          $id
 * @property string                          $user_id
 * @property string                          $platform
 * @property string                          $account_id
 * @property string|null                     $account_name
 * @property string|null                     $access_token
 * @property string|null                     $refresh_token
 * @property string|null                     $token_expires_at
 * @property string|null                     $account_settings
 * @property bool                            $is_active
 * @property string|null                     $last_sync_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property Project|null                    $project
 * @property User                            $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Account newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Account newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Account query()
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereAccessToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereAccountName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereAccountSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereLastSyncAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereRefreshToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereTokenExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereUserId($value)
 *
 * @mixin \Illuminate\Database\Eloquent\Model
 */
class AccountModel extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'adstool_accounts';

    protected $fillable = [
        'user_id',
        'project_id',
        'platform',
        'access_token',
        'refresh_token',
        'expires_at',
        'account_id_on_platform',
        'account_name_on_platform',
        'is_active',
        'last_synced_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'access_token' => 'encrypted',
        'refresh_token' => 'encrypted',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'last_synced_at' => 'datetime',
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
