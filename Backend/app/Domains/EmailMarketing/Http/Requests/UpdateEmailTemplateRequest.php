<?php

namespace App\Domains\EmailMarketing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateEmailTemplateRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255|unique:email_templates,name,' . $this->route('email_template'),
            'subject' => 'sometimes|required|string|max:255',
            'body' => 'sometimes|required|string',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
