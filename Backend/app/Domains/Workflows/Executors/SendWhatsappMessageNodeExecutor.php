<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Aura\Services\AuraChatServiceReal;
use App\Domains\Aura\Services\WhatsAppService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class SendWhatsappMessageNodeExecutor implements WorkflowNodeExecutor
{
    protected AuraChatServiceReal $auraChatService;
    protected WhatsAppService $whatsAppService;

    public function __construct(
        AuraChatServiceReal $auraChatService,
        WhatsAppService $whatsAppService
    ) {
        $this->auraChatService = $auraChatService;
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após o envio da mensagem
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o envio falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando SendWhatsappMessageNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $connectionId = $config['connection_id'] ?? null;
        $to = $config['to'] ?? $config['phone'] ?? $lead->phone ?? null;
        $message = $config['message'] ?? $config['text'] ?? null;
        $messageType = $config['message_type'] ?? 'text';
        $templateName = $config['template_name'] ?? null;
        $templateParams = $config['template_params'] ?? [];

        if (!$to || !$message) {
            throw new WorkflowExecutionException("Nó de mensagem WhatsApp inválido: 'to' e 'message' são obrigatórios.");
        }

        if (!$connectionId) {
            throw new WorkflowExecutionException("Nó de mensagem WhatsApp inválido: 'connection_id' é obrigatório.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                'lead_phone' => $lead->phone ?? '',
                'lead_company' => $lead->company ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders na mensagem e destinatário
            $finalMessage = $this->replacePlaceholders($message, $payload);
            $finalTo = $this->replacePlaceholders($to, $payload);

            // Enviar mensagem baseado no tipo
            $sendResult = match ($messageType) {
                'template' => $this->sendTemplateMessage($connectionId, $finalTo, $templateName, $templateParams, $payload),
                'text' => $this->sendTextMessage($connectionId, $finalTo, $finalMessage),
                default => $this->sendTextMessage($connectionId, $finalTo, $finalMessage)
            };

            Log::info("Mensagem WhatsApp enviada para {$finalTo}. Resultado: " . json_encode($sendResult));

            $context->setData('whatsapp_send_result', $sendResult);
            $context->setData('message_sent_to', $finalTo);
            $context->setData('message_content', $finalMessage);
            $context->setData('message_id', $sendResult['message_id'] ?? null);
        } catch (\Exception $e) {
            Log::error("Falha ao enviar mensagem WhatsApp para {$to}: " . $e->getMessage(), [
                'connection_id' => $connectionId,
                'to' => $to,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new WorkflowExecutionException("Falha ao enviar mensagem WhatsApp: " . $e->getMessage());
        }

        return $context->getData();
    }

    /**
     * Substitui placeholders no texto com valores do payload.
     *
     * @param string $text    o texto com placeholders (ex: "Olá, {{ name }}")
     * @param array<string, mixed> $payload o payload do workflow
     *
     * @return string o texto com placeholders substituídos
     */
    protected function replacePlaceholders(string $text, array $payload): string
    {
        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
            $key = $matches[1];
            return (string) ($payload[$key] ?? $matches[0]); // Retorna o placeholder original se a chave não existir
        }, $text) ?? $text;
    }

    /**
     * Send text message
     */
    protected function sendTextMessage(string $connectionId, string $to, string $message): array
    {
        try {
            // Usar AuraChatServiceReal para envio real
            $result = $this->auraChatService->sendMessage($connectionId, $to, $message, [
                'message_type' => 'text'
            ]);

            if (!$result['success']) {
                throw new \Exception($result['message'] ?? 'Falha ao enviar mensagem');
            }

            return [
                'success' => true,
                'message_id' => $result['message_id'] ?? null,
                'whatsapp_message_id' => $result['whatsapp_message_id'] ?? null,
                'chat_id' => $result['chat_id'] ?? null
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao enviar mensagem de texto via AuraChatServiceReal: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Send template message
     */
    protected function sendTemplateMessage(string $connectionId, string $to, ?string $templateName, array $templateParams, array $payload): array
    {
        try {
            if (!$templateName) {
                throw new \Exception('Template name é obrigatório para mensagens de template');
            }

            // Substituir placeholders nos parâmetros do template
            $finalParams = [];
            foreach ($templateParams as $param) {
                $finalParams[] = $this->replacePlaceholders($param, $payload);
            }

            // Usar WhatsAppService para enviar template
            $result = $this->whatsAppService->sendTemplateMessage(
                $connectionId,
                $to,
                $templateName,
                $finalParams
            );

            return [
                'success' => $result['success'] ?? false,
                'message_id' => $result['message_id'] ?? null,
                'template_name' => $templateName
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao enviar mensagem de template: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context, including the result of the current node's execution
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        // Verificar se há condição de sucesso/falha para roteamento
        $config = $node->configuration ?? [];
        $successPath = $config['success_path'] ?? $config['on_success'] ?? null;
        $failurePath = $config['failure_path'] ?? $config['on_failure'] ?? null;

        $sendResult = $context->getData()['whatsapp_send_result'] ?? null;
        $isSuccess = $sendResult && ($sendResult['success'] ?? false);

        if ($isSuccess && $successPath) {
            return (string) $successPath;
        }

        if (!$isSuccess && $failurePath) {
            return (string) $failurePath;
        }

        return $node->next_node_id ? (string) $node->next_node_id : null;
    }
}
