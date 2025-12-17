<?php

namespace App\Domains\EmailMarketing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateEmailCampaignRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'subject' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'email_list_id' => 'sometimes|required|integer|exists:email_lists,id',
            'scheduled_at' => 'nullable|date|after_or_equal:now',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
