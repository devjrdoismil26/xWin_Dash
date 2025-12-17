<?php

namespace App\Shared\Casts;

use App\Shared\ValueObjects\MimeType;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class MimeTypeCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string                              $key
     * @param mixed                               $value
     * @param array                               $attributes
     *
     * @return \App\Shared\ValueObjects\MimeType
     */
    public function get($model, string $key, mixed $value, array $attributes): MimeType
    {
        if (is_null($value)) {
            return new MimeType('application/octet-stream'); // Default ou null, dependendo da regra de negócio
        }

        return new MimeType($value);
    }

    /**
     * Prepare the given value for storage.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string                              $key
     * @param \App\Shared\ValueObjects\MimeType   $value
     * @param array                               $attributes
     *
     * @return string
     */
    public function set($model, string $key, MimeType|string $value, array $attributes): string
    {
        if ($value instanceof MimeType) {
            return $value->getValue();
        }

        return (new MimeType($value))->getValue();
    }
}
