<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel as Product;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Representa uma Landing Page no sistema.
 *
 * Este Model está associado à tabela `landing_pages` e define
 * as propriedades e relacionamentos da entidade.
 *
 * @property string                          $id
 * @property string                          $project_id
 * @property string|null                     $product_id
 * @property string|null                     $lead_capture_form_id
 * @property string                          $name
 * @property string                          $slug
 * @property array|null                      $content
 * @property string                          $status
 * @property int                             $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property LeadCaptureFormModel|null       $leadCaptureForm
 * @property Product|null                    $product
 * @property ProjectModel                    $project
 *
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel query()
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereLeadCaptureFormId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPageModel whereUserId($value)
 *
 * @mixin \Eloquent
 */
class LandingPageModel extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'landing_pages';

    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'project_id',
        'product_id',
        'lead_capture_form_id',
        'name',
        'slug',
        'content',
        'status',
        'user_id',
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'content' => 'array',
        'user_id' => 'integer',
    ];

    /**
     * Define o relacionamento de pertencimento a um Projeto.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectModel::class);
    }

    /**
     * Define o relacionamento de pertencimento a um Produto.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Define o relacionamento de pertencimento a um Formulário de Captação.
     */
    public function leadCaptureForm(): BelongsTo
    {
        return $this->belongsTo(LeadCaptureFormModel::class);
    }
}
