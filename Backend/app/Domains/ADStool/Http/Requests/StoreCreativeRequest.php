<?php

namespace App\Domains\ADStool\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCreativeRequest extends FormRequest
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
            'campaign_id' => 'required|integer|exists:adstool_campaigns,id',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:image,video,text',
            'content' => 'required|string', // Para texto ou URL da imagem/vídeo
            'headline' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:255',
        ];
    }
}
