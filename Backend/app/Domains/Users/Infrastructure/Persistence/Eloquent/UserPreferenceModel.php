<?php

namespace App\Domains\Users\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Domains\Users\Models\UserPreference.
 *
 * @property int                             $id
 * @property string                          $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string                          $key
 * @property string                          $value
 * @property string|null                     $theme
 * @property bool                            $notifications_enabled
 * @property string                          $locale
 * @property \App\Domains\Users\Models\User  $user
 *
 * @method static \Database\Factories\Core\UserPreferenceFactory       factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|UserPreference newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserPreference newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserPreference query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserPreference whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserPreference whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserPreference whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserPreference whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserPreference whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserPreference whereValue($value)
 *
 * @mixin \Illuminate\Database\Eloquent\Model
 */
class UserPreferenceModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'key',
        'value',
        'theme',
        'notifications_enabled',
        'locale',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'notifications_enabled' => 'boolean',
    ];

    /**
     * Get the user that owns the preferences.
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(UserModel::class);
    }

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory<static>
     */
    protected static function newFactory(): \Illuminate\Database\Eloquent\Factories\Factory
    {
        // Return a proper factory instance
        /** @var \Illuminate\Database\Eloquent\Factories\Factory<static> $factory */
        $factory = new class extends \Illuminate\Database\Eloquent\Factories\Factory {
            /** @var class-string<\Illuminate\Database\Eloquent\Model> */
            protected $model = UserPreferenceModel::class;

            /** @return array<string, mixed> */
            public function definition(): array
            {
                return [];
            }
        };

        return $factory;
    }
}
