<?php

namespace App\Domains\EmailMarketing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class OptimizeCampaignRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'campaign_id' => 'required|integer|exists:email_campaigns,id',
            'optimization_type' => 'required|string|in:subject,content,sending_time',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
