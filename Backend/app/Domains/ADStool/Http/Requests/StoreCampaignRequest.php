<?php

namespace App\Domains\ADStool\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCampaignRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição.
     *
     * @return bool
     */
    public function authorize()
    {
        // Qualquer usuário autenticado pode tentar criar uma campanha.
        // A lógica de permissão mais granular fica na Policy.
        return Auth::check();
    }

    /**
     * Obtém as regras de validação que se aplicam à requisição.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'platform' => 'required|string|in:facebook,google', // Exemplo de plataformas válidas
            'objective' => 'required|string|max:100',
            'daily_budget' => 'required|numeric|min:1',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'targeting' => 'nullable|array',
            'creatives' => 'nullable|array',
        ];
    }

    /**
     * Mensagens de erro customizadas para as regras de validação.
     *
     * @return array<string, string>
     */
    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O nome da campanha é obrigatório.',
            'platform.in' => 'A plataforma selecionada não é válida.',
            'daily_budget.min' => 'O orçamento diário deve ser de pelo menos 1.',
        ];
    }
}
