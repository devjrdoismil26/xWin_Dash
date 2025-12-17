<?php

namespace App\Domains\Media\Infrastructure\Persistence\Eloquent;

use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Domains\Media\Models\Folder.
 *
 * @property string $id
 * @property string $project_id
 * @property string $user_id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $parent_id
 * @property \Illuminate\Database\Eloquent\Collection<int, Folder> $children
 * @property int|null $children_count
 * @property string $full_path
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Domains\Media\Models\Media> $media
 * @property int|null $media_count
 * @property Folder|null $parent
 * @property Project $project
 * @property User $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Folder newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Folder newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Folder onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Folder query()
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Folder withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Folder withoutTrashed()
 *
 * @mixin \Eloquent
 */
class FolderModel extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'user_id',
        'parent_id',
        'name',
    ];

    /**
     * Get the parent folder.
     */
    public function parent()
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    /**
     * Get the children folders.
     */
    public function children()
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }

    /**
     * Get the media files in this folder.
     */
    public function media()
    {
        return $this->hasMany(Media::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFullPathAttribute(): string
    {
        if ($this->parent_id === null) {
            return '/' . $this->name;
        }
        return $this->parent->full_path . '/' . $this->name;
    }
}
