<?php

namespace App\Domains\Workflows\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ExecuteWorkflowRequest extends FormRequest
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
            'workflow_id' => 'required|integer|exists:workflows,id',
            'initial_payload' => 'nullable|array',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
