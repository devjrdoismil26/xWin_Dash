<?php

namespace App\Domains\AI\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GenerateTextRequest extends FormRequest
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
            'prompt' => 'required|string|max:8000',
            'provider' => 'nullable|string|in:openai,gemini,claude',
            'model' => 'nullable|string',
            'max_tokens' => 'nullable|integer|min:10|max:4096',
            'temperature' => 'nullable|numeric|min:0|max:2',
        ];
    }
}
