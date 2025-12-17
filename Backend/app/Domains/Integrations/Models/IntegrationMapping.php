<?php

namespace App\Domains\Integrations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IntegrationMapping extends Model
{
    protected $table = 'integration_mappings';

    protected $fillable = [
        'integration_id',
        'entity_type',
        'local_field',
        'remote_field',
        'direction',
        'transformation',
        'is_required'
    ];

    protected $casts = [
        'transformation' => 'array',
        'is_required' => 'boolean'
    ];

    public function integration(): BelongsTo
    {
        return $this->belongsTo(Integration::class);
    }

    public function scopeForEntity($query, string $entityType)
    {
        return $query->where('entity_type', $entityType);
    }

    public function scopeBidirectional($query)
    {
        return $query->where('direction', 'bidirectional');
    }

    public function scopeInbound($query)
    {
        return $query->whereIn('direction', ['inbound', 'bidirectional']);
    }

    public function scopeOutbound($query)
    {
        return $query->whereIn('direction', ['outbound', 'bidirectional']);
    }

    public function transformValue($value)
    {
        if (!$this->transformation) {
            return $value;
        }

        $type = $this->transformation['type'] ?? null;

        return match($type) {
            'date_format' => $this->transformDate($value),
            'number_format' => $this->transformNumber($value),
            'boolean' => $this->transformBoolean($value),
            'lookup' => $this->transformLookup($value),
            default => $value
        };
    }

    private function transformDate($value)
    {
        $format = $this->transformation['format'] ?? 'Y-m-d H:i:s';
        return date($format, strtotime($value));
    }

    private function transformNumber($value)
    {
        $decimals = $this->transformation['decimals'] ?? 2;
        return number_format((float)$value, $decimals, '.', '');
    }

    private function transformBoolean($value)
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    private function transformLookup($value)
    {
        $map = $this->transformation['map'] ?? [];
        return $map[$value] ?? $value;
    }
}
