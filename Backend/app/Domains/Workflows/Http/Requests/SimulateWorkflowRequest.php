<?php

namespace App\Domains\Workflows\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SimulateWorkflowRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->can('simulate', \App\Domains\Workflows\Models\Workflow::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nodes' => 'required|array',
            'nodes.*.id' => 'required|string|uuid',
            'nodes.*.type' => 'required|string',
            'nodes.*.config' => 'nullable|array',
            'nodes.*.position' => 'nullable|array',
            'nodes.*.position.x' => 'nullable|numeric',
            'nodes.*.position.y' => 'nullable|numeric',
            'edges' => 'required|array',
            'edges.*.id' => 'required|string',
            'edges.*.source' => 'required|string|uuid',
            'edges.*.target' => 'required|string|uuid',
            'edges.*.sourceHandle' => 'nullable|string',
            'edges.*.targetHandle' => 'nullable|string',
            'edges.*.condition' => 'nullable|string',
            'input' => 'nullable|array',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nodes.required' => 'A definição dos nós é obrigatória.',
            'nodes.array' => 'Os nós devem ser um array.',
            'nodes.*.id.required' => 'O ID do nó é obrigatório.',
            'nodes.*.id.uuid' => 'O ID do nó deve ser um UUID válido.',
            'nodes.*.type.required' => 'O tipo do nó é obrigatório.',
            'edges.required' => 'A definição das arestas é obrigatória.',
            'edges.array' => 'As arestas devem ser um array.',
            'edges.*.id.required' => 'O ID da aresta é obrigatório.',
            'edges.*.source.required' => 'O nó de origem da aresta é obrigatório.',
            'edges.*.source.uuid' => 'O nó de origem da aresta deve ser um UUID válido.',
            'edges.*.target.required' => 'O nó de destino da aresta é obrigatório.',
            'edges.*.target.uuid' => 'O nó de destino da aresta deve ser um UUID válido.',
        ];
    }
}
