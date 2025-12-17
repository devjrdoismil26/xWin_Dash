<?php

namespace App\Domains\Aura\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAuraConnectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'provider' => 'nullable|string|in:meta,twilio,evolution',
            'phone_number' => 'required|string|max:20',
            'config' => 'nullable|array',
            'config.api_key' => 'nullable|string',
            'config.api_secret' => 'nullable|string',
            'config.webhook_url' => 'nullable|url',
        ];
    }
}
