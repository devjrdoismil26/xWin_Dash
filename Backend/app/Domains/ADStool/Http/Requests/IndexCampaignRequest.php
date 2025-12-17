<?php

namespace App\Domains\ADStool\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class IndexCampaignRequest extends FormRequest
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
            // Valida o formato dos filtros, mas não os torna obrigatórios.
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:ACTIVE,PAUSED,ARCHIVED,DRAFT,FAILED',
            'platform' => 'nullable|string|in:facebook,google',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ];
    }
}
