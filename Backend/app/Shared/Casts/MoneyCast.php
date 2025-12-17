<?php

namespace App\Shared\Casts;

use App\Shared\ValueObjects\Money;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model; // Supondo que o Value Object Money exista

class MoneyCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param Model                $model
     * @param string               $key
     * @param mixed                $value
     * @param array<string, mixed> $attributes
     *
     * @return Money|null
     */
    public function get($model, string $key, mixed $value, array $attributes): ?Money
    {
        if ($value === null) {
            return null;
        }
        // Assumindo que o valor no DB é um inteiro (centavos)
        return new Money($value / 100, $attributes['currency'] ?? 'BRL'); // Supondo que 'currency' está nos atributos
    }

    /**
     * Prepare the given value for storage.
     *
     * @param Model                $model
     * @param string               $key
     * @param mixed                $value
     * @param array<string, mixed> $attributes
     *
     * @return int|null
     */
    public function set($model, string $key, mixed $value, array $attributes): ?int
    {
        if ($value === null) {
            return null;
        }
        if ($value instanceof Money) {
            return (int) ($value->amount * 100);
        }
        // Se o valor não for uma instância de Money, tentar converter
        return (int) ($value * 100);
    }
}
