<?php

namespace App\Domains\ADStool\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCreativeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $creative = $this->route('creative');
        return $creative && $this->user()->can('update', $creative);
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
            'content' => 'sometimes|required|string',
            'headline' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:255',
        ];
    }
}
