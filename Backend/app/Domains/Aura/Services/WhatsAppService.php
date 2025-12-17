<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Domains\Aura\Services\WhatsAppTemplateService;
use App\Domains\Aura\Services\WhatsAppInteractiveService;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;

/**
 * 🚀 WhatsApp Service (Refatorado)
 *
 * Orquestra serviços especializados para WhatsApp Business API
 * Inclui mensagens, conexões, templates e funcionalidades interativas
 *
 * Refatorado para reduzir complexidade e melhorar manutenibilidade.
 */
class WhatsAppService
{
    private WhatsAppMessageService $messageService;
    private WhatsAppConnectionService $connectionService;
    private WhatsAppTemplateService $templateService;
    private WhatsAppInteractiveService $interactiveService;

    public function __construct(
        private readonly AuraConnectionModel $connectionModel,
        RateLimiterService $rateLimiter,
        CircuitBreakerService $circuitBreaker,
        RetryService $retryService
    ) {
        $this->messageService = new WhatsAppMessageService($connectionModel, $rateLimiter, $circuitBreaker, $retryService);
        $this->connectionService = new WhatsAppConnectionService($connectionModel);
        $this->templateService = new WhatsAppTemplateService($rateLimiter, $circuitBreaker, $retryService);
        $this->interactiveService = new WhatsAppInteractiveService($rateLimiter, $circuitBreaker, $retryService);
    }

    // ===== CONEXÕES =====

    /**
     * Conecta uma conta WhatsApp
     */
    public function connect(string $connectionId): bool
    {
        return $this->connectionService->connect($connectionId);
    }

    /**
     * Desconecta uma conta WhatsApp
     */
    public function disconnect(string $connectionId): bool
    {
        return $this->connectionService->disconnect($connectionId);
    }

    /**
     * Valida uma conexão WhatsApp
     */
    public function validateConnection(string $connectionId): array
    {
        return $this->connectionService->validateConnection($connectionId);
    }

    /**
     * Processa mensagem recebida via webhook
     */
    public function processIncomingMessage(string $connectionId, array $webhookData): array
    {
        return $this->connectionService->processIncomingMessage($connectionId, $webhookData);
    }

    /**
     * Obtém URL do webhook para uma conexão
     */
    public function getWebhookUrl(string $connectionId): string
    {
        return $this->connectionService->getWebhookUrl($connectionId);
    }

    /**
     * Obtém estatísticas de uma conexão
     */
    public function getConnectionStatistics(string $connectionId): array
    {
        return $this->connectionService->getConnectionStatistics($connectionId);
    }

    // ===== MENSAGENS =====

    /**
     * Envia uma mensagem genérica
     */
    public function sendMessage(string $connectionId, string $to, array $message): array
    {
        return $this->messageService->sendMessage($connectionId, $to, $message);
    }

    /**
     * Envia mensagem de texto
     */
    public function sendTextMessage(string $connectionId, string $to, string $text): array
    {
        return $this->messageService->sendTextMessage($connectionId, $to, $text);
    }

    /**
     * Envia mensagem de mídia
     */
    public function sendMediaMessage(string $connectionId, string $to, string $mediaUrl, string $caption = ''): array
    {
        return $this->messageService->sendMediaMessage($connectionId, $to, $mediaUrl, $caption);
    }

    /**
     * Envia mensagem interativa
     */
    public function sendInteractiveMessage(string $connectionId, string $to, string $text, array $buttons): array
    {
        return $this->messageService->sendInteractiveMessage($connectionId, $to, $text, $buttons);
    }

    /**
     * Envia mensagem de template
     */
    public function sendTemplateMessage(string $connectionId, string $to, string $templateName, array $parameters = [], ?string $language = null): array
    {
        return $this->messageService->sendTemplateMessage($connectionId, $to, $templateName, $parameters, $language);
    }

    /**
     * Envia mensagem de botão
     */
    public function sendButtonMessage(string $connectionId, string $to, string $body, array $buttons, ?string $header = null, ?string $footer = null): array
    {
        return $this->messageService->sendButtonMessage($connectionId, $to, $body, $buttons, $header, $footer);
    }

    /**
     * Envia mensagem de lista
     */
    public function sendListMessage(string $connectionId, string $to, string $body, string $buttonText, array $sections, ?string $header = null, ?string $footer = null): array
    {
        return $this->messageService->sendListMessage($connectionId, $to, $body, $buttonText, $sections, $header, $footer);
    }

    /**
     * Envia mensagem de resposta rápida
     */
    public function sendQuickReplyMessage(string $connectionId, string $to, string $body, array $quickReplies, ?string $header = null, ?string $footer = null): array
    {
        return $this->messageService->sendQuickReplyMessage($connectionId, $to, $body, $quickReplies, $header, $footer);
    }

    /**
     * Envia mensagem interativa com mídia
     */
    public function sendMediaInteractiveMessage(string $connectionId, string $to, string $mediaType, string $mediaUrl, string $caption, array $buttons, ?string $header = null, ?string $footer = null): array
    {
        return $this->messageService->sendMediaInteractiveMessage($connectionId, $to, $mediaType, $mediaUrl, $caption, $buttons, $header, $footer);
    }

    /**
     * Envia mensagem de localização
     */
    public function sendLocationMessage(string $connectionId, string $to, float $latitude, float $longitude, ?string $name = null, ?string $address = null): array
    {
        return $this->messageService->sendLocationMessage($connectionId, $to, $latitude, $longitude, $name, $address);
    }

    /**
     * Envia mensagem de contato
     */
    public function sendContactMessage(string $connectionId, string $to, array $contacts): array
    {
        return $this->messageService->sendContactMessage($connectionId, $to, $contacts);
    }

    // ===== TEMPLATES =====

    /**
     * Cria um template de mensagem
     */
    public function createTemplate(string $connectionId, array $templateData): array
    {
        return $this->templateService->createTemplate($connectionId, $templateData);
    }

    /**
     * Lista templates de uma conexão
     */
    public function listTemplates(string $connectionId, array $filters = []): array
    {
        return $this->templateService->listTemplates($connectionId, $filters);
    }
}
