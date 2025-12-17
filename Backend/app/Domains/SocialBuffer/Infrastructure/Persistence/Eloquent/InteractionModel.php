<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Domains\SocialBuffer\Models\Interaction.
 *
 * @property int $id
 * @property string $user_id
 * @property string $social_account_id
 * @property string $platform
 * @property string $platform_interaction_id
 * @property string $type
 * @property string $content
 * @property string $status
 * @property \Illuminate\Support\Carbon $received_at
 * @property \Illuminate\Support\Carbon|null $last_replied_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \App\Domains\SocialBuffer\Models\SocialAccount $socialAccount
 * @property User $user
 *
 * @method static \Database\Factories\SocialBuffer\InteractionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction query()
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereLastRepliedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction wherePlatformInteractionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereReceivedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereSocialAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereUserId($value)
 *
 * @mixin \Eloquent
 */
class InteractionModel extends Model
{
    use HasFactory;
    use BelongsToProject;

    protected static function newFactory()
    {
        return \Database\Factories\SocialBuffer\InteractionFactory::new();
    }

    protected $table = 'social_interactions';

    protected $fillable = [
        'user_id',
        'project_id',
        'social_account_id',
        'platform',
        'platform_interaction_id',
        'type',
        'content',
        'status',
        'received_at',
        'last_replied_at',
    ];

    protected $casts = [
        'received_at' => 'datetime',
        'last_replied_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function socialAccount()
    {
        return $this->belongsTo(SocialAccount::class, 'social_account_id');
    }
}
