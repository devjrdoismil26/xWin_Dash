<?php

namespace App\Domains\SocialBuffer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetOptimalSchedulingRequest extends FormRequest
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
            return true; // Se nenhuma conta social for fornecida, a autorização é permitida (ou ajuste conforme a regra de negócio)
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
            'social_account_ids' => 'required|array',
            'social_account_ids.*' => 'uuid|exists:socialbuffer_social_accounts,id',
            'timezone' => 'nullable|string',
        ];
    }
}
