<?php

namespace App\Domains\Projects\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ToggleProjectStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $project = $this->route('project');

        return $this->user()->can('toggle status', $project);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // No specific rules needed for a toggle, authorization handles access.
        ];
    }
}
