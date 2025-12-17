<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Integrations\Services\Providers\GoogleProvider;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class GoogleSheetsNodeExecutor implements WorkflowNodeExecutor
{
    protected GoogleProvider $googleProvider;

    public function __construct(GoogleProvider $googleProvider)
    {
        $this->googleProvider = $googleProvider;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após a execução da ação
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a ação falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando GoogleSheetsNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $action = $config['action'] ?? null;
        $spreadsheetId = $config['spreadsheet_id'] ?? null;
        $sheetName = $config['sheet_name'] ?? 'Sheet1';
        $range = $config['range'] ?? null;
        $data = $config['data'] ?? [];

        if (!$action || !$spreadsheetId) {
            throw new WorkflowExecutionException("Nó do Google Sheets inválido: 'action' e 'spreadsheet_id' são obrigatórios.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders
            $finalSpreadsheetId = $this->replacePlaceholder($spreadsheetId, $payload);
            $finalSheetName = $this->replacePlaceholder($sheetName, $payload);
            $finalRange = $range ? $this->replacePlaceholder($range, $payload) : null;

            $result = null;
            switch ($action) {
                case 'read_range':
                    if (!$finalRange) {
                        throw new WorkflowExecutionException("Para 'read_range', 'range' é obrigatório.");
                    }
                    $result = $this->readSheetRange($finalSpreadsheetId, "{$finalSheetName}!{$finalRange}");
                    Log::info("Dados lidos do Google Sheets: " . json_encode($result));
                    break;
                case 'write_range':
                    if (!$finalRange || empty($data)) {
                        throw new WorkflowExecutionException("Para 'write_range', 'range' e 'data' são obrigatórios.");
                    }
                    $result = $this->writeSheetRange($finalSpreadsheetId, "{$finalSheetName}!{$finalRange}", $data);
                    Log::info("Dados escritos no Google Sheets.");
                    break;
                case 'append_row':
                    if (empty($data) || !is_array($data)) {
                        throw new WorkflowExecutionException("Para 'append_row', 'data' deve ser um array.");
                    }
                    $result = $this->appendSheetRow($finalSpreadsheetId, $finalSheetName, $data);
                    Log::info("Linha anexada ao Google Sheets.");
                    break;
                default:
                    throw new WorkflowExecutionException("Ação do Google Sheets desconhecida: {$action}");
            }

            // Adicionar resultado ao contexto
            $context->setData('google_sheets_action_result', [
                'action' => $action,
                'status' => 'success',
                'spreadsheet_id' => $finalSpreadsheetId,
                'sheet_name' => $finalSheetName,
                'result' => $result
            ]);

            if ($action === 'read_range') {
                $context->setData('google_sheets_read_data', $result);
            }

        } catch (\Exception $e) {
            Log::error("Falha na execução do nó do Google Sheets: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na execução do nó do Google Sheets: " . $e->getMessage());
        }

        return $context->getData();
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $result = $context->getData('google_sheets_action_result');

        // Se ação foi bem-sucedida, seguir para próximo nó
        if ($result && isset($result['status']) && $result['status'] === 'success') {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Lê um range do Google Sheets.
     */
    protected function readSheetRange(string $spreadsheetId, string $range): array
    {
        // Implementação mockada - em produção usar Google Sheets API
        Log::info("Google Sheets Mock: Lendo range {$range} da planilha {$spreadsheetId}");
        return [
            ['Nome', 'Email', 'Telefone'],
            ['João Silva', 'joao@example.com', '11999999999']
        ];
    }

    /**
     * Escreve dados em um range do Google Sheets.
     */
    protected function writeSheetRange(string $spreadsheetId, string $range, array $data): bool
    {
        // Implementação mockada - em produção usar Google Sheets API
        Log::info("Google Sheets Mock: Escrevendo dados no range {$range} da planilha {$spreadsheetId}");
        return true;
    }

    /**
     * Adiciona uma linha ao Google Sheets.
     */
    protected function appendSheetRow(string $spreadsheetId, string $sheetName, array $rowData): bool
    {
        // Implementação mockada - em produção usar Google Sheets API
        Log::info("Google Sheets Mock: Adicionando linha à planilha {$spreadsheetId}, sheet {$sheetName}");
        return true;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ spreadsheet_id }}")
     * @param array       $payload o payload do workflow
     *
     * @return string|null o texto com placeholder substituído ou null
     */
    protected function replacePlaceholder(?string $text, array $payload): ?string
    {
        if ($text === null) {
            return null;
        }
        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
            $key = $matches[1];
            return $payload[$key] ?? $matches[0];
        }, $text);
    }
}
