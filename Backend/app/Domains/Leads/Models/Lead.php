<?php

namespace App\Domains\Leads\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Lead Model
 * 
 * SECURITY FIX (MODEL-004): Adicionado BelongsToProject trait para multi-tenancy
 */
class Lead extends Model
{
    use HasFactory;
    use BelongsToProject;

    protected $table = 'leads';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'position',
        'website',
        'notes',
        'source',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'address',
        'status',
        'score',
        'last_activity_at',
        'converted_at',
        'value',
        'assigned_to',
        'project_id',
    ];

    protected $casts = [
        'last_activity_at' => 'datetime',
        'converted_at' => 'datetime',
        'value' => 'decimal:2',
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
        return \Database\Factories\Domains\Leads\Models\LeadFactory::new();
    }

    // Relacionamento com o histórico do Lead
    // public function history()
    // {
    //     return $this->hasMany(LeadHistoryModel::class, 'lead_id');
    // }

    // Relacionamento com os valores de campos personalizados
    // public function customValues()
    // {
    //     return $this->hasMany(LeadCustomValueModel::class, 'lead_id');
    // }
}
