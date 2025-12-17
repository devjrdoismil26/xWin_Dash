<?php

namespace App\Domains\ADStool\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdjustBudgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $campaign = $this->route('campaign');
        return $campaign && $this->user()->can('update', $campaign);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            // Pelo menos um dos dois orçamentos deve ser fornecido.
            'daily_budget' => 'nullable|numeric|min:1|required_without:lifetime_budget',
            'lifetime_budget' => 'nullable|numeric|min:1|required_without:daily_budget',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'daily_budget.required_without' => 'É necessário fornecer um orçamento diário ou vitalício.',
            'lifetime_budget.required_without' => 'É necessário fornecer um orçamento diário ou vitalício.',
        ];
    }
}
