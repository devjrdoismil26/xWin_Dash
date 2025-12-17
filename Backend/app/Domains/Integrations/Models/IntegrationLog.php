<?php

namespace App\Domains\Integrations\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * IntegrationLog Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class IntegrationLog extends Model
{
    use BelongsToProject;

    protected $table = 'integration_logs';

    protected $fillable = [
        'integration_id',
        'action',
        'status',
        'request_data',
        'response_data',
        'error_message',
        'duration_ms',
        'records_processed',
        'project_id',
    ];

    protected $casts = [
        'request_data' => 'array',
        'response_data' => 'array',
        'duration_ms' => 'integer',
        'records_processed' => 'integer'
    ];

    public function integration(): BelongsTo
    {
        return $this->belongsTo(Integration::class);
    }

    public function scopeErrors($query)
    {
        return $query->where('status', 'error');
    }

    public function scopeSuccess($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function isSuccess(): bool
    {
        return $this->status === 'success';
    }

    public function isError(): bool
    {
        return $this->status === 'error';
    }
}
