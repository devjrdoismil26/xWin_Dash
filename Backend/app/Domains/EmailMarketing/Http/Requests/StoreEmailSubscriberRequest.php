<?php

namespace App\Domains\EmailMarketing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmailSubscriberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Pode ser true se for um formulário público de inscrição, ou Auth::check() se for interno
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'email' => 'required|string|email|max:255|unique:email_subscribers,email',
            'name' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:subscribed,unsubscribed,bounced,pending',
            'custom_fields' => 'nullable|array',
            // Adicione outras regras de validação para campos personalizados
        ];
    }
}
