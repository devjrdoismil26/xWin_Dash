<?php

namespace App\Domains\ADStool\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCampaignRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição.
     *
     * @return bool
     */
    public function authorize()
    {
        // Pega a campanha da rota (ex: /api/campaigns/{campaign})
        $campaign = $this->route('campaign');

        // Usa a CampaignPolicy para verificar se o usuário pode atualizar esta campanha
        return $campaign && $this->user()->can('update', $campaign);
    }

    /**
     * Obtém as regras de validação que se aplicam à requisição.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            // Na atualização, os campos geralmente são opcionais.
            'name' => 'sometimes|required|string|max:255',
            'objective' => 'sometimes|required|string|max:100',
            'daily_budget' => 'sometimes|required|numeric|min:1',
            'status' => 'sometimes|required|string|in:ACTIVE,PAUSED,ARCHIVED',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
    }
}
