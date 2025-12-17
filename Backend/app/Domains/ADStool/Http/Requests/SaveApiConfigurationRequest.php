<?php

namespace App\Domains\ADStool\Http\Requests;

use App\Domains\ADStool\Rules\CanConnectToGoogleAds;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class SaveApiConfigurationRequest extends FormRequest
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
        $rules = [
            'platform' => 'required|string|in:facebook,google',
            'credentials' => 'required|array',
        ];

        // Adiciona regras específicas para cada plataforma
        if ($this->input('platform') === 'facebook') {
            $rules['credentials.access_token'] = 'required|string';
            $rules['credentials.ad_account_id'] = 'required|string';
        } elseif ($this->input('platform') === 'google') {
            $rules['credentials.developer_token'] = 'required|string';
            $rules['credentials.login_customer_id'] = 'required|string';
            // Exemplo de como usar a nossa Rule customizada
            // $rules['credentials'][] = new CanConnectToGoogleAds($this->input('credentials'));
        }

        return $rules;
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
            'platform.required' => 'É necessário especificar a plataforma.',
            'credentials.required' => 'As credenciais são obrigatórias.',
            'credentials.access_token.required' => 'O token de acesso do Facebook é obrigatório.',
            'credentials.developer_token.required' => 'O token de desenvolvedor do Google é obrigatório.',
        ];
    }
}
