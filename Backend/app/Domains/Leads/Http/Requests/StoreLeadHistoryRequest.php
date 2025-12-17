<?php

namespace App\Domains\Leads\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreLeadHistoryRequest extends FormRequest
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
            'lead_id' => 'required|integer|exists:leads,id',
            'event_type' => 'required|string|max:255',
            'description' => 'required|string',
            'properties' => 'nullable|array',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
