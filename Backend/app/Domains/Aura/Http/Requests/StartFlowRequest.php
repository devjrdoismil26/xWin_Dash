<?php

namespace App\Domains\Aura\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartFlowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'flow_id' => 'required|uuid|exists:aura_flows,id',
            'phone_number' => 'required|string|max:20',
            'variables' => 'nullable|array',
        ];
    }
}
