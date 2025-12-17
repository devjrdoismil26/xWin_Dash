<?php

namespace App\Domains\SocialBuffer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderPostsRequest extends FormRequest
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

        // Verifica se o usuário é o proprietário de todos os post_ids fornecidos
        $postIds = $this->input('post_ids', []);
        if (empty($postIds)) {
            return true; // Se nenhum post_id for fornecido, a autorização é permitida (ou ajuste conforme a regra de negócio)
        }

        $ownedPostsCount = auth()->user()->posts()->whereIn('id', $postIds)->count();

        return $ownedPostsCount === count($postIds);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'post_ids' => 'required|array',
            'post_ids.*' => 'uuid|exists:socialbuffer_posts,id',
        ];
    }
}
