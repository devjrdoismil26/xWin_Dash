<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Domains\SocialBuffer\Models\ShortenedLink.
 *
 * @property int $id
 * @property string $user_id
 * @property string $project_id
 * @property string $long_url
 * @property string $short_code
 * @property int $clicks
 * @property string $short_url
 * @property \App\Domains\Projects\Models\Project|null $project
 *
 * @method static \Database\Factories\SocialBuffer\ShortenedLinkFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ShortenedLink newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShortenedLink newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShortenedLink query()
 *
 * @property \App\Domains\Users\Models\User|null $user
 *
 * @mixin \Eloquent
 */
class ShortenedLinkModel extends Model
{
    use HasFactory;
    use BelongsToProject;

    protected static function newFactory()
    {
        return \Database\Factories\SocialBuffer\ShortenedLinkFactory::new();
    }

    protected $fillable = [
        'user_id',
        'project_id',
        'long_url',
        'short_code',
        'clicks',
    ];

    protected $casts = [
        'clicks' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Domains\Users\Models\User::class);
    }

    public function project()
    {
        return $this->belongsTo(\App\Domains\Projects\Models\Project::class);
    }

    public function getShortUrlAttribute(): string
    {
        return config("app.url") . "/s/" . $this->short_code;
    }
}
