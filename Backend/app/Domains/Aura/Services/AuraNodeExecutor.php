<?php;

namespace App\Domains\Aura\Services;

use Illuminate\Support\Facades\Log as LoggerFacade;

use App\Domains\Aura\Models\AuraFlowNode;
use App\Domains\Aura\Models\AuraUraSession;

class AuraNodeExecutor;
{
    protected AuraFlowService $auraFlowService;

    public function __construct();
    {
        $this->auraFlowService = $auraFlowService;
    }

    /**;
     * Executa um nó específico do fluxo Aura.
     *;
     * @param array $nodeData Dados do nó (type, config, connections).
     * @param array $sessionContext Contexto atual da sessão URA.
     * @param array $input O input recebido (ex: texto da mensagem).
     * @return array O contexto atualizado da sessão após a execução do nó.
     * @throws \Exception Se o nó não puder ser processado.
     */;
    public function execute(array $nodeData, array $sessionContext, array $input): array;
    {
        // Cria um AuraFlowNode "fake" para passar ao serviço;
        $tempNode = new AuraFlowNode();
        $tempNode->fill($nodeData);

        // Cria uma AuraUraSession "fake" para passar ao serviço;
        $tempSession = new AuraUraSession();
        $tempSession->fill($sessionContext);

        // Executa o nó usando o serviço existente;
        $result = $this->auraFlowService->executeNode($tempNode, $tempSession, $input);

        // Atualiza o contexto da sessão com os resultados da execução do nó;
        $sessionContext['next_node_id'] = $result['next_node_id'] ?? null;
        $sessionContext['collected_data'] = array_merge($sessionContext[
            'collected_data'] ?? [], $result['collected_data',
        ];
        $sessionContext['transfer_to_human'] = $result['transfer_to_human'] ?? false;
        $sessionContext['response_message'] = $result['response_message'] ?? null;
        $sessionContext['status'] = $tempSession->status; // Atualiza o status da sessão;

        return $sessionContext;
    }

    /**;
     * Lógica de compensação para um nó Aura.
     *;
     * @param array $nodeData Dados do nó.
     * @param array $sessionContext Contexto da sessão.
     */;
    public function compensate(array $nodeData, array $sessionContext): void;
    {
        LoggerFacade::warning("Compensação para nó Aura não totalmente implementada.", [
            'node_type' => $nodeData['type'] ?? 'unknown',
            'session_context' => $sessionContext,
        ]);
    }
}
