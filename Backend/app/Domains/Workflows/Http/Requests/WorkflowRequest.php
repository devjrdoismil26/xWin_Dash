<?php

namespace App\Domains\Workflows\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkflowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'nodes' => 'required|array',
            'nodes.*.id' => 'required|string',
            'nodes.*.type' => 'required|string|in:condition,email,webhook',
            'nodes.*.config' => 'required|array',
            'connections' => 'required|array',
            'connections.*.source' => 'required|string',
            'connections.*.target' => 'required|string',
            'connections.*.condition' => 'nullable|boolean',
            'is_active' => 'boolean',
            'project_id' => 'required|exists:projects,id',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O nome do workflow é obrigatório',
            'nodes.required' => 'O workflow deve ter pelo menos um nó',
            'nodes.*.type.in' => 'Tipo de nó inválido. Tipos permitidos: condition, email, webhook',
            'connections.*.source.required' => 'O nó de origem da conexão é obrigatório',
            'connections.*.target.required' => 'O nó de destino da conexão é obrigatório',
        ];
    }
}
