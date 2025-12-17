<?php

namespace App\Domains\Core\Http\Requests;

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
            'theme' => 'nullable|string|in:light,dark,system',
            'language' => 'nullable|string|in:en,pt_BR',
            'notifications_enabled' => 'nullable|boolean',
            // Adicione outras regras de validação para preferências específicas
            'dashboard_layout' => 'nullable|array',
            'dashboard_layout.widgets' => 'nullable|array',
        ];
    }
}
