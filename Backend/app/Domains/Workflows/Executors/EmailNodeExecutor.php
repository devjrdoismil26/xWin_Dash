<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Mail\WorkflowEmail;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use App\Domains\Leads\Models\Lead;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> the result of the execution, which can be used by subsequent nodes
     *
     * @throws \Exception if an error occurs during execution
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        Log::info("Executando EmailNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $to = $config['to'] ?? $lead->email ?? null;
        $subject = $config['subject'] ?? 'Workflow Notification';
        $body = $config['body'] ?? $config['message'] ?? 'This is an automated message from your workflow.';
        $from = $config['from'] ?? config('mail.from.address');
        $fromName = $config['from_name'] ?? config('mail.from.name');
        $actionUrl = $config['action_url'] ?? null;
        $actionText = $config['action_text'] ?? null;
        $attachments = $config['attachments'] ?? [];
        $cc = $config['cc'] ?? [];
        $bcc = $config['bcc'] ?? [];
        $template = $config['template'] ?? null;
        $templateData = $config['template_data'] ?? [];

        if (!$to) {
            throw new WorkflowExecutionException("Nó de e-mail inválido: 'to' é obrigatório.");
        }

        try {
            // Construir payload completo para substituição de placeholders
            $payload = [
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                'lead_phone' => $lead->phone ?? '',
                'lead_company' => $lead->company ?? '',
                'lead_status' => $lead->status ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders no assunto e corpo
            $finalSubject = $this->replacePlaceholders($subject, $payload);
            $finalBody = $this->replacePlaceholders($body, $payload);
            $finalTo = $this->replacePlaceholders($to, $payload);

            // Processar anexos se houver
            $finalAttachments = [];
            foreach ($attachments as $attachment) {
                if (isset($attachment['path']) || isset($attachment['url'])) {
                    $finalAttachments[] = $attachment;
                }
            }

            // Enviar email
            $mailable = new WorkflowEmail($finalSubject, $finalBody, $actionUrl, $actionText);
            
            if ($from) {
                $mailable->from($from, $fromName);
            }

            if (!empty($cc)) {
                $mailable->cc($cc);
            }

            if (!empty($bcc)) {
                $mailable->bcc($bcc);
            }

            // Adicionar anexos
            foreach ($finalAttachments as $attachment) {
                if (isset($attachment['path'])) {
                    $mailable->attach($attachment['path'], [
                        'as' => $attachment['as'] ?? basename($attachment['path']),
                        'mime' => $attachment['mime'] ?? null
                    ]);
                } elseif (isset($attachment['url'])) {
                    // Para URLs, baixar temporariamente (implementação básica)
                    Log::warning("Anexos via URL não suportados ainda", ['url' => $attachment['url']]);
                }
            }

            // Adicionar dados de template se especificado
            if ($template) {
                $mailable->with(array_merge($templateData, $payload));
            }

            Mail::to($finalTo)->send($mailable);

            // Registrar envio no contexto
            $result = [
                'to' => $finalTo,
                'subject' => $finalSubject,
                'status' => 'sent',
                'sent_at' => now()->toIso8601String(),
                'has_attachments' => !empty($finalAttachments),
                'attachments_count' => count($finalAttachments)
            ];

            $context->setData('email_send_result', $result);
            $context->setData('email_sent_to', $finalTo);
            $context->setData('email_subject', $finalSubject);

            Log::info("E-mail enviado com sucesso para {$finalTo}. Assunto: {$finalSubject}");
        } catch (\Exception $e) {
            Log::error("Falha ao enviar e-mail para {$to}: " . $e->getMessage(), [
                'to' => $to,
                'subject' => $subject,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            $context->setData('email_send_result', [
                'to' => $to,
                'status' => 'failed',
                'error' => $e->getMessage()
            ]);
            
            throw new WorkflowExecutionException("Falha ao enviar e-mail: " . $e->getMessage());
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

        $sendResult = $context->getData()['email_send_result'] ?? null;
        $isSuccess = $sendResult && ($sendResult['status'] ?? '') === 'sent';

        if ($isSuccess && $successPath) {
            return (string) $successPath;
        }

        if (!$isSuccess && $failurePath) {
            return (string) $failurePath;
        }

        return $node->next_node_id ? (string) $node->next_node_id : null;
    }
}
