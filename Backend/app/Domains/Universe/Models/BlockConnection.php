<?php

namespace App\Domains\Universe\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlockConnection extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'block_connections';

    protected $fillable = [
        'source_block_id',
        'target_block_id',
        'connection_type',
        'config',
    ];

    protected $casts = [
        'config' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function sourceBlock(): BelongsTo
    {
        return $this->belongsTo(UniverseBlock::class, 'source_block_id');
    }

    public function targetBlock(): BelongsTo
    {
        return $this->belongsTo(UniverseBlock::class, 'target_block_id');
    }
}
