<?php

namespace App\Domains\Users\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class DeleteUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Apenas administradores ou o próprio usuário podem deletar
        if (!Auth::check()) {
            return false;
        }
        $user = Auth::user();
        return (bool) ($user && ($user->isAdmin() || Auth::id() == $this->route('user')));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'password' => ['required', 'current_password'], // Requer confirmação de senha
        ];
    }
}
