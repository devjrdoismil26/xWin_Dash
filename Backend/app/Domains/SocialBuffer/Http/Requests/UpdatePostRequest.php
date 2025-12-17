<?php

namespace App\Domains\SocialBuffer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'content' => 'sometimes|required|string|max:2000',
            'scheduled_at' => 'nullable|date|after_or_equal:now',
            'social_account_ids' => 'sometimes|required|array',
            'social_account_ids.*' => 'integer|exists:social_accounts,id',
            'media_ids' => 'nullable|array',
            'media_ids.*' => 'integer|exists:media_files,id',
            'hashtags' => 'nullable|array',
            'hashtags.*' => 'string|max:255',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
