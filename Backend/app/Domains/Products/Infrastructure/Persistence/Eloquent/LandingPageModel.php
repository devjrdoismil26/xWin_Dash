<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel as LeadCaptureForm; // Ajustado para o domínio de Projetos
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel as Product; // Ajustado para o domínio de Produtos
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project; // Ajustado para o domínio de Produtos
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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property LeadCaptureForm|null            $leadCaptureForm
 * @property Product|null                    $product
 * @property Project                         $project
 *
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage query()
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereLeadCaptureFormId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LandingPage whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class LandingPageModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * Para proteger contra vulnerabilidades de atribuição em massa;
     * apenas os campos listados aqui podem ser preenchidos usando
     * métodos como `create()` ou `update()`.
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
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * O campo 'content' é armazenado como JSON no banco de dados;
     * mas ao acessá-lo no Laravel, ele será automaticamente
     * convertido para um array PHP, facilitando a manipulação.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'content' => 'array',
    ];

    /**
     * Define o relacionamento de pertencimento a um Projeto.
     * Uma Landing Page sempre pertence a um Projeto.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Define o relacionamento de pertencimento a um Produto.
     * Uma Landing Page pode, opcionalmente, pertencer a um Produto.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Define o relacionamento de pertencimento a um Formulário de Captação.
     * Uma Landing Page pode, opcionalmente, ter um Formulário de Captação associado.
     */
    public function leadCaptureForm(): BelongsTo
    {
        return $this->belongsTo(LeadCaptureForm::class);
    }
}
