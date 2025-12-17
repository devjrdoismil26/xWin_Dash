<?php

namespace App\Domains\Products\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateLandingPageWithAIRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // A autorização para gerar conteúdo com IA pode ser mais complexa;
        // dependendo se é uma funcionalidade premium, etc.
        // Por enquanto, vamos permitir se o usuário estiver autenticado.
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'prompt' => 'required|string|min:20',
            'product_info' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'prompt.required' => 'O prompt é obrigatório para gerar conteúdo com IA.',
            'prompt.min' => 'O prompt deve ter pelo menos :min caracteres.',
            'product_info.max' => 'As informações do produto não podem exceder :max caracteres.',
        ];
    }
}
