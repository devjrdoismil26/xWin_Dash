<?php

namespace App\Domains\Core\Services;

use Illuminate\Support\Facades\Log;

class TriggerService
{
    /**
     * Define e armazena um novo gatilho.
     *
     * @param string $name       o nome do gatilho
     * @param array  $conditions as condições para o gatilho ser disparado
     * @param array  $actions    as ações a serem executadas quando o gatilho for disparado
     *
     * @return bool
     */
    public function defineTrigger(string $name, array $conditions, array $actions): bool
    {
        // Em um cenário real, isso persistiria o gatilho em um banco de dados.
        Log::info("Gatilho '{$name}' definido com as condições e ações.");
        return true; // Simulação de sucesso
    }

    /**
     * Avalia as condições de um gatilho e executa as ações se as condições forem atendidas.
     *
     * @param string $name o nome do gatilho a ser avaliado
     * @param array  $data os dados para avaliar as condições
     *
     * @return bool true se o gatilho foi disparado e as ações executadas
     */
    public function evaluateAndExecute(string $name, array $data): bool
    {
        // Em um cenário real, buscaria o gatilho do banco de dados.
        // Simulação de um gatilho simples
        $trigger = [
            'name' => 'example_trigger',
            'conditions' => [
                ['field' => 'value', 'operator' => '>', 'threshold' => 100],
            ],
            'actions' => [
                ['type' => 'log', 'message' => 'Gatilho disparado!'],
            ],
        ];

        if ($trigger['name'] !== $name) {
            Log::info("Gatilho '{$name}' não encontrado.");
            return false;
        }

        $conditionsMet = true;
        foreach ($trigger['conditions'] as $condition) {
            $fieldValue = $data[$condition['field']] ?? null;
            switch ($condition['operator']) {
                case '>':
                    if (!($fieldValue > $condition['threshold'])) {
                        $conditionsMet = false;
                    }
                    break;
                    // Adicionar outros operadores
            }
            if (!$conditionsMet) {
                break;
            }
        }

        if ($conditionsMet) {
            Log::info("Condições para o gatilho '{$name}' atendidas. Executando ações.");
            foreach ($trigger['actions'] as $action) {
                switch ($action['type']) {
                    case 'log':
                        Log::info($action['message']);
                        break;
                        // Adicionar outras ações (ex: chamar um serviço, disparar um evento)
                }
            }
            return true;
        }

        return false;
    }
}
