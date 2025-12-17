<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * ProjectIntegrationModel
 * 
 * SECURITY FIX (SCOPE-001): Adicionado BelongsToProject para multi-tenancy
 */
class ProjectIntegrationModel extends Model
{
    use HasFactory, HasUuids;
    use BelongsToProject;
    
    protected $table = 'project_integrations';

    protected $fillable = [
        'project_id',
        'integration_id',
        'name',
        'credentials',
        'config',
        'is_active',
        'connected_at',
        'last_sync_at',
        'sync_status',
        'created_by',
    ];

    protected $casts = [
        'credentials' => 'array',
        'config' => 'array',
        'sync_status' => 'array',
        'is_active' => 'boolean',
        'connected_at' => 'datetime',
        'last_sync_at' => 'datetime',
    ];
}
