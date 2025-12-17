<?php

namespace App\Domains\Aura\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAuraConnectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'config' => 'sometimes|array',
        ];
    }
}
