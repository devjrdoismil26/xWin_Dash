<?php

namespace App\Shared\Rules;

use App\Shared\ValueObjects\Email;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class EmailRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            new Email($value);
        } catch (\InvalidArgumentException $e) {
            $fail('O campo :attribute não é um endereço de e-mail válido.');
        }
    }
}
