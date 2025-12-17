<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Leads\Models\Lead;
use App\Domains\Projects\Models\Project;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Representa um formulário de captura de leads no sistema.
 *
 * @property string                          $id
 * @property string                          $project_id
 * @property string                          $name
 * @property string|null                     $description
 * @property array                           $fields
 * @property string|null                     $redirect_url
 * @property string|null                     $webhook_url
 * @property int                             $is_active
 * @property string                          $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string                          $title
 * @property string                          $button_text
 * @property string                          $slug
 *
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm newQuery()
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
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LeadCaptureForm whereWebhookUrl($value)
 *
 * @property Project                                             $project
 * @property \Illuminate\Database\Eloquent\Collection<int, Lead> $leads
 * @property int|null                                            $leads_count
 *
 * @mixin \Eloquent
 */
class LeadCaptureFormModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'project_id',
        'name',
        'title',
        'description',
        'button_text',
        'fields',
        'slug',
        'status',
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fields' => 'array',
        'status' => 'string',
    ];

    /**
     * Obtém o projeto ao qual o formulário de captura de leads pertence.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the leads associated with the lead capture form.
     */
    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
}
