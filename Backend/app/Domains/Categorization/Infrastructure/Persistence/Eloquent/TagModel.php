<?php

namespace App\Domains\Categorization\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Leads\Models\Lead;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Domains\Categorization\Models\Tag.
 *
 * @property string                          $id
 * @property string                          $name
 * @property string|null                     $color
 * @property string|null                     $description
 * @property string                          $project_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @method static \Database\Factories\Core\TagFactory       factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Tag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tag newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tag onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Tag popular($limit = 10)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag query()
 * @method static \Illuminate\Database\Eloquent\Builder|Tag search($term)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tag withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Tag withoutTrashed()
 *
 * @property \Illuminate\Database\Eloquent\Collection<int, Lead> $leads
 * @property int|null                                            $leads_count
 *
 * @mixin \Eloquent
 */
/**
 * SECURITY FIX (SCOPE-003): Adicionado BelongsToProject trait para multi-tenancy
 */
class TagModel extends Model
{
    use HasFactory;
    use SoftDeletes;
    use HasUuids;
    use BelongsToProject;

    protected $fillable = [
        'name',
        'color',
        'description',
        'project_id',
    ];

    protected $casts = [
        'color' => 'string',
        'description' => 'string',
    ];

    // Relacionamentos
    public function leads()
    {
        return $this->belongsToMany(Lead::class, 'lead_tags')
            ->withTimestamps();
    }

    // Scopes
    public function scopePopular($query, $limit = 10)
    {
        return $query->withCount('leads')
            ->orderBy('leads_count', 'desc')
            ->limit($limit);
    }

    public function scopeSearch($query, $term)
    {
        return $query->where('name', 'like', "%{$term}%")
            ->orWhere('description', 'like', "%{$term}%");
    }

    public function getLeadCount()
    {
        return $this->leads()->count();
    }

    public function getRandomColor()
    {
        $colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
            '#E67E22', '#2ECC71',
        ];

        return $colors[array_rand($colors)];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tag) {
            if (empty($tag->color)) {
                $tag->color = $tag->getRandomColor();
            }
        });

        static::saving(function (Tag $tag) {
            $existing = Tag::where('project_id', $tag->project_id)
                ->where('name', $tag->name)
                ->when($tag->id, function ($query) use ($tag) {
                    $query->where('id', '!=', $tag->id);
                })
                ->exists();

            if ($existing) {
                throw new \Exception('Já existe uma tag com este nome neste projeto.');
            }
        });
    }

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return \Database\Factories\Core\TagFactory::new();
    }
}
