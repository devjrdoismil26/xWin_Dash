<?php

namespace App\Domains\ADStool\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Domains\Users\Models\User;

/**
 * App\Domains\ADStool\Models\ApiSetting.
 *
 * @property string $id
 * @property string $user_id
 * @property string $platform
 * @property string $setting_key
 * @property string|null $setting_value
 * @property array|null $metadata
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property User $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting query()
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting whereSettingKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting whereSettingValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApiSetting whereUserId($value)
 *
 * @mixin \Illuminate\Database\Eloquent\Model
 */
class ApiSettingModel extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'ads_api_settings';

    protected $fillable = [
        'user_id',
        'platform',
        'setting_key',
        'setting_value',
        'metadata',
        'is_active',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the API setting.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
