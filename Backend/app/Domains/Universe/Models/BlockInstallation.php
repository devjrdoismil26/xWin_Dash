<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlockInstallation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'universe_block_installations';

    protected $fillable = [
        'user_id',
        'block_id',
        'instance_id',
        'version',
        'configuration',
        'is_active',
        'installed_at',
        'last_used_at',
        'usage_count',
        'status',
        'error_message',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'configuration' => 'array',
        'is_active' => 'boolean',
        'installed_at' => 'datetime',
        'last_used_at' => 'datetime',
        'usage_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(BlockMarketplace::class, 'block_id');
    }

    public function instance(): BelongsTo
    {
        return $this->belongsTo(UniverseInstance::class, 'instance_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByBlock($query, $blockId)
    {
        return $query->where('block_id', $blockId);
    }

    public function scopeByInstance($query, $instanceId)
    {
        return $query->where('instance_id', $instanceId);
    }

    // Methods
    public function activate(): void
    {
        $this->update([
            'is_active' => true,
            'status' => 'active'
        ]);
    }

    public function deactivate(): void
    {
        $this->update([
            'is_active' => false,
            'status' => 'inactive'
        ]);
    }

    public function incrementUsage(): void
    {
        $this->increment('usage_count');
        $this->update(['last_used_at' => now()]);
    }

    public function updateConfiguration(array $config): void
    {
        $this->update(['configuration' => $config]);
    }

    public function markAsError(string $message): void
    {
        $this->update([
            'status' => 'error',
            'error_message' => $message
        ]);
    }

    public function getStatusColor(): string
    {
        return match ($this->status) {
            'active' => 'green',
            'inactive' => 'yellow',
            'error' => 'red',
            'installing' => 'blue',
            default => 'gray'
        };
    }

    public function getStatusText(): string
    {
        return match ($this->status) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            'error' => 'Error',
            'installing' => 'Installing',
            default => 'Unknown'
        };
    }
}
