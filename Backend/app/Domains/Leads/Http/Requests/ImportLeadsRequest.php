<?php

namespace App\Domains\Leads\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ImportLeadsRequest extends FormRequest
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
            'file' => 'required|file|mimes:csv,txt|max:10240', // Max 10MB
            'email_list_id' => 'nullable|integer|exists:email_lists,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
