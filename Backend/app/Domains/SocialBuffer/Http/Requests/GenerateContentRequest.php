<?php

namespace App\Domains\SocialBuffer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateContentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'prompt' => 'required|string',
            'platform' => 'nullable|in:facebook,instagram,twitter,linkedin',
            'tone' => 'nullable|in:professional,casual,friendly,promotional',
            'max_length' => 'nullable|integer|min:1',
        ];
    }
}
