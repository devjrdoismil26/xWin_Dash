<?php

namespace App\Domains\Workflows\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property int $workflow_id
 * @property string $status
 * @property \Illuminate\Support\Carbon $started_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon|null $failed_at
 * @property string|null $current_node
 * @property array<string, mixed> $payload
 * @property string|null $error_message
 * @property int $user_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class WorkflowExecutionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'workflow_id' => $this->workflow_id,
            'status' => $this->status,
            'started_at' => $this->started_at->toDateTimeString(),
            'completed_at' => $this->completed_at ? $this->completed_at->toDateTimeString() : null,
            'failed_at' => $this->failed_at ? $this->failed_at->toDateTimeString() : null,
            'current_node' => $this->current_node,
            'payload' => $this->payload,
            'error_message' => $this->error_message,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
