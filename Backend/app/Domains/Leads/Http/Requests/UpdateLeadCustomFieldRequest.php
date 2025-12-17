<?php

namespace App\Domains\Leads\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateLeadCustomFieldRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255|unique:lead_custom_fields,name,' . $this->route('lead_custom_field'),
            'type' => 'sometimes|required|string|in:text,number,date,boolean',
            'description' => 'nullable|string|max:500',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
