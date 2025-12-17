<?php

namespace App\Domains\Projects\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProjectMemberRequest extends FormRequest
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
            'role' => 'sometimes|required|string|in:member,admin,viewer',
            'status' => 'sometimes|required|string|in:active,inactive,pending',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
