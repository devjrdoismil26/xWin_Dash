<?php

namespace App\Domains\Media\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreMediaRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,mp4,mov,avi,pdf|max:20480', // Max 20MB
            'folder_id' => 'nullable|integer|exists:media_folders,id',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
