<?php

namespace App\Domains\Core\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Apenas administradores ou usuários com permissão podem criar configurações
        $user = auth()->user();
        return $user instanceof \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel && $user->isAdmin(); // Supondo um método isAdmin()
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'key' => 'required|string|max:255|unique:settings,key',
            'value' => 'required|string',
            'description' => 'nullable|string|max:500',
        ];
    }
}
