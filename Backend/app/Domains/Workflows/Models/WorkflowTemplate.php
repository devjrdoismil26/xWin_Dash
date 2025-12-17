<?php

namespace App\Domains\Workflows\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowTemplate extends Model
{
    use HasUuids;

    protected $table = 'workflow_templates';

    protected $fillable = [
        'name',
        'description',
        'category',
        'definition',
        'preview_image',
        'usage_count',
        'is_public',
        'created_by',
    ];

    protected $casts = [
        'definition' => 'array',
        'usage_count' => 'integer',
        'is_public' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }
}
