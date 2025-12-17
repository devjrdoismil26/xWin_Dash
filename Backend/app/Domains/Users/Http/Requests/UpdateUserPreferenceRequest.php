<?php

namespace App\Domains\Users\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateUserPreferenceRequest extends FormRequest
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
            'theme' => 'sometimes|required|string|in:light,dark,system',
            'notifications_enabled' => 'sometimes|required|boolean',
            'language' => 'sometimes|required|string|in:en,pt_BR',
            // Adicione outras regras de validação para preferências
        ];
    }
}
