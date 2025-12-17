<?php

namespace App\Domains\AI\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GenerateRequest extends FormRequest
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
            'provider' => 'required|string|in:openai,gemini,claude',
            'model' => 'required|string',
            'type' => 'required|string|in:text,image,video,audio',
            'parameters' => 'nullable|array',
        ];
    }
}
