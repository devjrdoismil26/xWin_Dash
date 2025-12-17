<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel as Lead;
use App\Shared\Traits\OptimizedQueries;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Domains\Projects\Models\LeadCaptureForm.
 *
 * @property string                               $id
 * @property string                               $project_id
 * @property string                               $name
 * @property string|null                          $description
 * @property array                                $fields
 * @property string|null                          $redirect_url
 * @property string|null                          $webhook_url
 * @property bool                                 $is_active
 * @property \Illuminate\Support\Carbon|null      $created_at
 * @property \Illuminate\Support\Carbon|null      $updated_at
 * @property string                               $title
 * @property string                               $button_text
 * @property \App\Domains\Projects\Models\Project $project
 *
 * @method static \Database\Factories\Projects\LeadCaptureFormFactory   factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm query()
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereButtonText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereFields($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereRedirectUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereWebhookUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm withoutTrashed()
 *
 * @mixin \Eloquent
 */
class LeadCaptureFormModel extends Model
{
    use HasUuids;
    use SoftDeletes;
    use HasFactory;
    use OptimizedQueries;

    protected static function newFactory()
    {
        return \Database\Factories\Projects\LeadCaptureFormFactory::new();
    }

    protected $table = 'lead_capture_forms';

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'fields',
        'redirect_url',
        'webhook_url',
        'is_active',
        'user_id',
        'title',
        'button_text',
        'slug',
        'status',
    ];

    protected $casts = [
        'fields' => 'array',
        'is_active' => 'boolean',
        'user_id' => 'integer',
    ];

    protected array $defaultEagerLoad = [
        'project:id,name',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectModel::class, 'project_id');
    }

    public function leads(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Lead::class);
    }
}
