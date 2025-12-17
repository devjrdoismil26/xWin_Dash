<?php

namespace App\Domains\Aura\Casts;

use App\Domains\Aura\ValueObjects\FlowStructure;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

/**
 * @implements CastsAttributes<FlowStructure, string>
 */
class FlowStructureCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string                              $key
     * @param mixed                               $value
     * @param array<string, mixed>                $attributes
     *
     * @return \App\Domains\Aura\ValueObjects\FlowStructure
     */
    public function get($model, string $key, mixed $value, array $attributes): FlowStructure
    {
        $data = json_decode($value, true);

        return new FlowStructure($data['nodes'] ?? [], $data['edges'] ?? []);
    }

    /**
     * Prepare the given value for storage.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string                              $key
     * @param mixed                               $value
     * @param array<string, mixed>                $attributes
     *
     * @return string|false
     */
    public function set($model, string $key, mixed $value, array $attributes): string|false
    {
        if (!$value instanceof FlowStructure) {
            throw new \InvalidArgumentException('The given value is not a FlowStructure instance.');
        }

        return json_encode($value->toArray());
    }
}
