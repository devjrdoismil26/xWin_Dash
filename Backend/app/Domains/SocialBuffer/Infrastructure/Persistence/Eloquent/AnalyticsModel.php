<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Domains\SocialBuffer\Models\Analytics.
 *
 * @property int $id
 * @property string|null $post_id
 * @property string|null $schedule_id
 * @property string $platform
 * @property string $metric_type
 * @property int $metric_value
 * @property string $metric_date
 * @property string|null $additional_data
 * @property string $collected_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \App\Domains\SocialBuffer\Models\Post|null $post
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics query()
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics whereAdditionalData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics whereCollectedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics whereMetricDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics whereMetricType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics whereMetricValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics wherePostId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics whereScheduleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Analytics whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class AnalyticsModel extends Model
{
    use HasFactory;
    use BelongsToProject;

    protected $table = 'social_analytics';

    protected $fillable = [
        'post_id',
        'project_id',
        'metric_type',
        'metric_value',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'metric_value' => 'integer',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
