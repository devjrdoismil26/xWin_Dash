<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuraFlowExecutionModel extends Model
{
    use HasUuids;

    protected $table = 'aura_flow_executions';

    protected $fillable = [
        'flow_id',
        'chat_id',
        'phone_number',
        'status',
        'context',
        'current_node_id',
        'execution_history',
        'error_message',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'context' => 'array',
        'execution_history' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function flow(): BelongsTo
    {
        return $this->belongsTo(AuraFlowModel::class, 'flow_id');
    }

    public function chat(): BelongsTo
    {
        return $this->belongsTo(AuraChatModel::class, 'chat_id');
    }
}
