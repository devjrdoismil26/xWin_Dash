<?php

namespace App\Domains\AI\Http\Requests;

use App\Domains\AI\Enums\ImageSizeEnum;
use App\Domains\AI\Enums\ImageStyleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class GenerateImageRequest extends FormRequest
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
            'prompt' => 'required|string|max:4000',
            'provider' => 'nullable|string|in:openai,gemini,stabilityai',
            'n' => 'nullable|integer|min:1|max:4', // Número de imagens a gerar
            'size' => ['nullable', new Enum(ImageSizeEnum::class)],
            'style' => ['nullable', new Enum(ImageStyleEnum::class)],
        ];
    }
}
