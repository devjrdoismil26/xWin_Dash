<?php

namespace App\Domains\Users\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Apenas administradores ou o próprio usuário podem atualizar
        return Auth::check() && ((bool) Auth::user()?->isAdmin() || Auth::id() == $this->route('user'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($this->route('user'))],
            'status' => ['sometimes', 'required', 'string', 'in:active,inactive,suspended'],
            'role' => ['sometimes', 'required', 'string', 'in:admin,editor,member'],
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
