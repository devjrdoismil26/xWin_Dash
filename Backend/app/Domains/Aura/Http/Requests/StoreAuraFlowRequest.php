<?php

namespace App\Domains\Aura\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAuraFlowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'connection_id' => 'required|uuid|exists:aura_connections,id',
            'triggers' => 'nullable|array',
            'structure' => 'required|array',
            'structure.nodes' => 'required|array',
            'structure.edges' => 'nullable|array',
            'variables' => 'nullable|array',
        ];
    }
}
