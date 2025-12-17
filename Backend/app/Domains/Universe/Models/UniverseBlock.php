<?php

namespace App\Domains\Universe\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UniverseBlock extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'universe_blocks';

    protected $fillable = [
        'instance_id',
        'template_id',
        'block_type',
        'config',
        'position',
        'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'position' => 'array',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function instance(): BelongsTo
    {
        return $this->belongsTo(UniverseInstance::class, 'instance_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(UniverseTemplate::class, 'template_id');
    }

    public function connections(): HasMany
    {
        return $this->hasMany(BlockConnection::class, 'source_block_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
