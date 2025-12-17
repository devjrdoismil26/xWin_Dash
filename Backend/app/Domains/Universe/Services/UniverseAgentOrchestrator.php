<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Exceptions\UniverseException;
use App\Domains\Universe\Models\UniverseAgent; // Supondo que o model exista
use Illuminate\Support\Facades\Log;

// Supondo que esta exceção exista

class UniverseAgentOrchestrator
{
    /**
     * Cria um novo agente do universo.
     *
     * @param int   $userId o ID do usuário criador
     * @param array<string, mixed> $data   dados do agente (name, type, configuration)
     *
     * @return UniverseAgent
     */
    public function createAgent(int $userId, array $data): UniverseAgent
    {
        $data['user_id'] = $userId;
        /** @var UniverseAgent $agent */
        $agent = UniverseAgent::create($data);
        Log::info("Agente do Universo criado: {$agent->name} (ID: {$agent->id}).");
        return $agent;
    }

    /**
     * Obtém um agente do universo pelo seu ID.
     *
     * @param int $id o ID do agente
     *
     * @return UniverseAgent|null
     */
    public function getAgentById(int $id): ?UniverseAgent
    {
        /** @var UniverseAgent|null $agent */
        $agent = UniverseAgent::find($id);
        return $agent;
    }

    /**
     * Atualiza um agente do universo existente.
     *
     * @param int   $id   o ID do agente
     * @param array<string, mixed> $data dados para atualização
     *
     * @return UniverseAgent|null
     *
     * @throws UniverseException se o agente não for encontrado
     */
    public function updateAgent(int $id, array $data): ?UniverseAgent
    {
        /** @var UniverseAgent|null $agent */
        $agent = UniverseAgent::find($id);
        if (!$agent) {
            return null;
        }
        $agent->update($data);
        Log::info("Agente do Universo atualizado: {$agent->name} (ID: {$agent->id}).");
        return $agent;
    }

    /**
     * Deleta um agente do universo pelo seu ID.
     *
     * @param int $id o ID do agente
     *
     * @return bool
     */
    public function deleteAgent(int $id): bool
    {
        /** @var UniverseAgent|null $agent */
        $agent = UniverseAgent::find($id);
        if (!$agent) {
            return false;
        }
        $success = $agent->delete();
        if ($success) {
            Log::info("Agente do Universo ID: {$id} deletado com sucesso.");
        }
        return (bool) $success;
    }

    /**
     * Retorna todos os agentes do universo paginados para um usuário.
     *
     * @param int $userId  o ID do usuário
     * @param int $perPage número de itens por página
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllAgents(int $userId, int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return UniverseAgent::where('user_id', $userId)->paginate($perPage);
    }

    /**
     * Envia uma mensagem para um agente específico.
     *
     * @param int    $agentId o ID do agente
     * @param string $message a mensagem a ser enviada
     * @param array<string, mixed>  $context contexto adicional para o agente
     *
     * @return array<string, mixed> a resposta do agente
     *
     * @throws UniverseException se o agente não for encontrado ou a comunicação falhar
     */
    public function sendMessageToAgent(int $agentId, string $message, array $context = []): array
    {
        $agent = $this->getAgentById($agentId);
        if (!$agent) {
            throw new UniverseException("Agente do Universo ID: {$agentId} não encontrado para enviar mensagem.");
        }

        Log::info("Enviando mensagem para o agente {$agent->name} (ID: {$agent->id}).");

        // Simulação de comunicação com o agente
        // Em um cenário real, isso chamaria um serviço específico para o tipo de agente (ex: ChatbotService)
        $response = ['status' => 'success', 'reply' => "Olá, eu sou o agente {$agent->name}. Você disse: {$message}"];

        Log::info("Resposta do agente {$agent->name}: " . json_encode($response));
        return $response;
    }
}
