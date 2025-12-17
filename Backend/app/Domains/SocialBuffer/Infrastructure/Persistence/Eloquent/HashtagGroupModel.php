<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Domains\SocialBuffer\Models\HashtagGroup.
 *
 * @property string $id
 * @property string $user_id
 * @property string $project_id
 * @property string $name
 * @property array $hashtags
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property User $user
 *
 * @method static \Database\Factories\SocialBuffer\HashtagGroupFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|HashtagGroup newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|HashtagGroup newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|HashtagGroup query()
 * @method static \Illuminate\Database\Eloquent\Builder|HashtagGroup whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HashtagGroup whereHashtags($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HashtagGroup whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HashtagGroup whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HashtagGroup whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HashtagGroup whereUserId($value)
 *
 * @mixin \Eloquent
 */
class HashtagGroupModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected static function newFactory()
    {
        return \Database\Factories\SocialBuffer\HashtagGroupFactory::new();
    }

    protected $table = 'hashtag_groups';

    protected $fillable = [
        'user_id',
        'project_id',
        'name',
        'hashtags',
    ];

    protected $casts = [
        'hashtags' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
