<?php

namespace App\Domains\Workflows\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class SaveDefinitionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $workflow = $this->route('workflow');

        return $workflow && Auth::user()->can('saveDefinition', $workflow);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'definition' => 'required|array',
            'definition.nodes' => 'required|array',
            'definition.nodes.*.id' => 'required|string|uuid',
            'definition.nodes.*.type' => 'required|string',
            'definition.nodes.*.config' => 'nullable|array',
            'definition.nodes.*.position' => 'nullable|array',
            'definition.nodes.*.position.x' => 'nullable|numeric',
            'definition.nodes.*.position.y' => 'nullable|numeric',
            'definition.edges' => 'required|array',
            'definition.edges.*.id' => 'required|string',
            'definition.edges.*.source' => 'required|string|uuid',
            'definition.edges.*.target' => 'required|string|uuid',
            'definition.edges.*.sourceHandle' => 'nullable|string',
            'definition.edges.*.targetHandle' => 'nullable|string',
            'definition.edges.*.condition' => 'nullable|string',
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
            'definition.required' => 'A definição do workflow é obrigatória.',
            'definition.array' => 'A definição do workflow deve ser um array.',
            'definition.nodes.required' => 'Os nós da definição são obrigatórios.',
            'definition.nodes.array' => 'Os nós da definição devem ser um array.',
            'definition.nodes.*.id.required' => 'O ID do nó é obrigatório.',
            'definition.nodes.*.id.uuid' => 'O ID do nó deve ser um UUID válido.',
            'definition.nodes.*.type.required' => 'O tipo do nó é obrigatório.',
            'definition.edges.required' => 'As arestas da definição são obrigatórias.',
            'definition.edges.array' => 'As arestas da definição devem ser um array.',
            'definition.edges.*.id.required' => 'O ID da aresta é obrigatório.',
            'definition.edges.*.source.required' => 'O nó de origem da aresta é obrigatório.',
            'definition.edges.*.source.uuid' => 'O nó de origem da aresta deve ser um UUID válido.',
            'definition.edges.*.target.required' => 'O nó de destino da aresta é obrigatório.',
            'definition.edges.*.target.uuid' => 'O nó de destino da aresta deve ser um UUID válido.',
        ];
    }
}
