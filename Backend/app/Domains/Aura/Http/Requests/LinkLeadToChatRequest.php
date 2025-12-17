<?php

namespace App\Domains\Aura\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LinkLeadToChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lead_id' => 'required|uuid|exists:leads,id',
        ];
    }
}
