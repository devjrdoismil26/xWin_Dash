<?php

namespace App\Domains\SocialBuffer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncAcrossPlatformsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Verifica se o usuário está autenticado
        if (!auth()->check()) {
            return false;
        }

        // Verifica se o usuário é o proprietário do post
        $post = $this->route('post');
        if ($post->user_id !== auth()->id()) {
            return false;
        }

        // Verifica se o usuário tem acesso às plataformas alvo (implícito via social accounts)
        // Para uma verificação mais granular, poderíamos verificar se o usuário tem pelo menos uma conta ativa para cada plataforma alvo.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'target_platforms' => 'required|array',
            'target_platforms.*' => 'in:facebook,instagram,twitter,linkedin',
            'adapt_content' => 'boolean',
        ];
    }
}
