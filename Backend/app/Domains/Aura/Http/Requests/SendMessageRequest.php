<?php

namespace App\Domains\Aura\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'chat_id' => 'required|uuid|exists:aura_chats,id',
            'content' => 'required|string|max:4096',
            'type' => 'nullable|string|in:text,image,video,audio,document',
            'metadata' => 'nullable|array',
        ];
    }
}
