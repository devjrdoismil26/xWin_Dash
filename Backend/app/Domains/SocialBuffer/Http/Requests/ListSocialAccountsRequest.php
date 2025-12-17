<?php

namespace App\Domains\SocialBuffer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListSocialAccountsRequest extends FormRequest
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
            'platform' => 'nullable|string|in:facebook,instagram,twitter,linkedin,pinterest,tiktok',
            'is_active' => 'nullable|boolean',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}
