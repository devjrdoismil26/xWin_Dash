<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * PostModel - Infrastructure Layer Model
 * 
 * SECURITY FIX (SCOPE-003): Adicionado BelongsToProject para multi-tenancy
 */
class PostModel extends Model
{
    use HasFactory;
    use BelongsToProject;

    protected $table = 'social_posts';

    protected $fillable = [
        'user_id',
        'project_id',
        'content',
        'status',
        'scheduled_at',
        'published_at',
        'platform_post_id',
        'platform',
        'post_url',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public static function newFactory()
    {
        return \Database\Factories\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\PostModelFactory::new();
    }

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }

    // Relacionamento com as contas sociais (muitos para muitos)
    // public function socialAccounts()
    // {
    //     return $this->belongsToMany(SocialAccountModel::class, 'post_social_account', 'post_id', 'social_account_id');
    // }

    // Relacionamento com as mídias (muitos para muitos)
    // public function media()
    // {
    //     return $this->belongsToMany(MediaFile::class, 'post_media', 'post_id', 'media_id');
    // }
}
