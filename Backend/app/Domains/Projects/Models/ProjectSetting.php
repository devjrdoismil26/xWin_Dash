<?php

namespace App\Domains\Projects\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectSetting extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'project_settings';

    protected $fillable = [
        'project_id',
        'key',
        'value',
        'type',
        'description',
        'is_public',
        'is_encrypted',
        'created_by',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_encrypted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'type' => 'string',
        'is_public' => false,
        'is_encrypted' => false,
    ];

    // Relationships
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\User::class, 'created_by');
    }

    // Scopes
    public function scopeByProject($query, string $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeByKey($query, string $key)
    {
        return $query->where('key', $key);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopePrivate($query)
    {
        return $query->where('is_public', false);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeEncrypted($query)
    {
        return $query->where('is_encrypted', true);
    }

    public function scopeNotEncrypted($query)
    {
        return $query->where('is_encrypted', false);
    }

    // Accessors & Mutators
    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'string' => 'Texto',
            'integer' => 'Número Inteiro',
            'boolean' => 'Verdadeiro/Falso',
            'json' => 'JSON',
            'array' => 'Array',
            'float' => 'Número Decimal',
            default => 'Desconhecido',
        };
    }

    public function getFormattedValueAttribute(): string
    {
        return match ($this->type) {
            'boolean' => $this->value ? 'Sim' : 'Não',
            'json', 'array' => json_encode($this->value, JSON_PRETTY_PRINT),
            default => (string) $this->value,
        };
    }

    public function getDecryptedValueAttribute()
    {
        if ($this->is_encrypted && $this->value) {
            try {
                return decrypt($this->value);
            } catch (\Exception $e) {
                return $this->value;
            }
        }
        return $this->value;
    }

    // Methods
    public function setValue($value): bool
    {
        $processedValue = $this->processValue($value);
        
        if ($this->is_encrypted && $processedValue !== null) {
            $processedValue = encrypt($processedValue);
        }

        $this->value = $processedValue;
        return $this->save();
    }

    public function getValue()
    {
        if ($this->is_encrypted && $this->value) {
            try {
                return decrypt($this->value);
            } catch (\Exception $e) {
                return $this->value;
            }
        }

        return $this->processValue($this->value);
    }

    protected function processValue($value)
    {
        if ($value === null) {
            return null;
        }

        return match ($this->type) {
            'integer' => (int) $value,
            'float' => (float) $value,
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'json' => is_string($value) ? json_decode($value, true) : $value,
            'array' => is_string($value) ? json_decode($value, true) : $value,
            default => (string) $value,
        };
    }

    public function makePublic(): bool
    {
        $this->is_public = true;
        return $this->save();
    }

    public function makePrivate(): bool
    {
        $this->is_public = false;
        return $this->save();
    }

    public function encrypt(): bool
    {
        if (!$this->is_encrypted && $this->value) {
            $this->value = encrypt($this->value);
            $this->is_encrypted = true;
            return $this->save();
        }
        return true;
    }

    public function decrypt(): bool
    {
        if ($this->is_encrypted && $this->value) {
            try {
                $this->value = decrypt($this->value);
                $this->is_encrypted = false;
                return $this->save();
            } catch (\Exception $e) {
                return false;
            }
        }
        return true;
    }

    public function isEncrypted(): bool
    {
        return $this->is_encrypted;
    }

    public function isPublic(): bool
    {
        return $this->is_public;
    }

    public function isPrivate(): bool
    {
        return !$this->is_public;
    }

    public function isString(): bool
    {
        return $this->type === 'string';
    }

    public function isInteger(): bool
    {
        return $this->type === 'integer';
    }

    public function isBoolean(): bool
    {
        return $this->type === 'boolean';
    }

    public function isJson(): bool
    {
        return $this->type === 'json';
    }

    public function isArray(): bool
    {
        return $this->type === 'array';
    }

    public function isFloat(): bool
    {
        return $this->type === 'float';
    }

    // Static methods
    public static function getByProjectAndKey(string $projectId, string $key): ?self
    {
        return static::where('project_id', $projectId)
                    ->where('key', $key)
                    ->first();
    }

    public static function getValueByProjectAndKey(string $projectId, string $key, $default = null)
    {
        $setting = static::getByProjectAndKey($projectId, $key);
        return $setting ? $setting->getValue() : $default;
    }

    public static function setValueByProjectAndKey(string $projectId, string $key, $value, string $type = 'string', string $createdBy = null): self
    {
        $setting = static::getByProjectAndKey($projectId, $key);
        
        if (!$setting) {
            $setting = static::create([
                'project_id' => $projectId,
                'key' => $key,
                'type' => $type,
                'created_by' => $createdBy,
            ]);
        }

        $setting->setValue($value);
        return $setting;
    }

    public static function getPublicSettingsByProject(string $projectId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('project_id', $projectId)
                    ->where('is_public', true)
                    ->get();
    }

    public static function getPrivateSettingsByProject(string $projectId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('project_id', $projectId)
                    ->where('is_public', false)
                    ->get();
    }

    public static function getSettingsByType(string $projectId, string $type): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('project_id', $projectId)
                    ->where('type', $type)
                    ->get();
    }
}