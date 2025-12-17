<?php

namespace App\Domains\Workflows\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreWorkflowNodeRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'config' => 'nullable|array',
            'position_x' => 'required|numeric',
            'position_y' => 'required|numeric',
            'next_node_id' => 'nullable|integer|exists:workflow_nodes,id',
            'true_node_id' => 'nullable|integer|exists:workflow_nodes,id',
            'false_node_id' => 'nullable|integer|exists:workflow_nodes,id',
            // Adicione outras regras de validação conforme necessário
        ];
    }
}
