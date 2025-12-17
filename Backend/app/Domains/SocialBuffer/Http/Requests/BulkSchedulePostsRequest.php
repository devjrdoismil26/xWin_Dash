<?php

namespace App\Domains\SocialBuffer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkSchedulePostsRequest extends FormRequest
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

        // Verifica se o usuário é o proprietário de todas as social_account_ids fornecidas
        $socialAccountIds = $this->input('social_account_ids', []);
        if (empty($socialAccountIds)) {
            return false; // Ou true, dependendo se posts sem contas sociais são permitidos
        }

        $ownedAccountsCount = auth()->user()->socialAccounts()->whereIn('id', $socialAccountIds)->count();

        return $ownedAccountsCount === count($socialAccountIds);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'posts' => 'required|array',
            'posts.*.content' => 'required|string',
            'posts.*.post_type' => 'required|in:text,image,video,carousel',
            'posts.*.media_urls' => 'nullable|array',
            'social_account_ids' => 'required|array',
            'social_account_ids.*' => 'uuid|exists:socialbuffer_social_accounts,id',
            'schedule_times' => 'required|array',
            'schedule_times.*' => 'date|after:now',
        ];
    }
}
