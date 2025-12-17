<?php

namespace App\Domains\Aura\Services;

use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 WhatsApp Template Service
 *
 * Serviço completo para gerenciar Message Templates do WhatsApp Business
 * Inclui criação, listagem, aprovação e envio de templates
 */
class WhatsAppTemplateService extends BaseExternalApiService
{
    protected ?array $credentials = null;
    protected ?string $accessToken = null;
    protected ?string $phoneNumberId = null;
    protected ?string $businessAccountId = null;

    /**
     * Define as credenciais da API
     */
    public function setCredentials(?array $credentials): void
    {
        $this->credentials = $credentials;
        $this->accessToken = $credentials['access_token'] ?? null;
        $this->phoneNumberId = $credentials['phone_number_id'] ?? null;
        $this->businessAccountId = $credentials['business_account_id'] ?? null;
    }

    /**
     * Cria um novo template de mensagem
     */
    public function createTemplate(array $templateData): array
    {
        if (!$this->businessAccountId) {
            throw new \Exception('Business Account ID não configurado.');
        }

        $endpoint = "/{$this->businessAccountId}/message_templates";
        $templateData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $templateData,
            [],
            'create_template'
        );

        return $this->processResponse($response);
    }

    /**
     * Lista todos os templates
     */
    public function listTemplates(array $filters = []): array
    {
        if (!$this->businessAccountId) {
            throw new \Exception('Business Account ID não configurado.');
        }

        $endpoint = "/{$this->businessAccountId}/message_templates";
        $params = [
            'access_token' => $this->accessToken,
            'limit' => $filters['limit'] ?? 100
        ];

        // Adicionar filtros
        if (!empty($filters['status'])) {
            $params['status'] = $filters['status'];
        }
        if (!empty($filters['category'])) {
            $params['category'] = $filters['category'];
        }
        if (!empty($filters['language'])) {
            $params['language'] = $filters['language'];
        }

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'list_templates'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém informações de um template específico
     */
    public function getTemplate(string $templateName): array
    {
        if (!$this->businessAccountId) {
            throw new \Exception('Business Account ID não configurado.');
        }

        $endpoint = "/{$this->businessAccountId}/message_templates/{$templateName}";
        $params = [
            'access_token' => $this->accessToken
        ];

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_template'
        );

        return $this->processResponse($response);
    }

    /**
     * Deleta um template
     */
    public function deleteTemplate(string $templateName): array
    {
        if (!$this->businessAccountId) {
            throw new \Exception('Business Account ID não configurado.');
        }

        $endpoint = "/{$this->businessAccountId}/message_templates/{$templateName}";
        $params = [
            'access_token' => $this->accessToken
        ];

        $response = $this->makeProtectedHttpCall(
            'DELETE',
            $endpoint,
            $params,
            [],
            'delete_template'
        );

        return $this->processResponse($response);
    }

    /**
     * Envia uma mensagem usando template
     */
    public function sendTemplateMessage(string $to, string $templateName, array $parameters = [], ?string $language = null): array
    {
        if (!$this->phoneNumberId) {
            throw new \Exception('Phone Number ID não configurado.');
        }

        $endpoint = "/{$this->phoneNumberId}/messages";
        $messageData = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'template',
            'template' => [
                'name' => $templateName,
                'language' => [
                    'code' => $language ?? 'pt_BR'
                ]
            ]
        ];

        // Adicionar parâmetros se fornecidos
        if (!empty($parameters)) {
            $messageData['template']['components'] = [
                [
                    'type' => 'body',
                    'parameters' => array_map(function ($param) {
                        return ['type' => 'text', 'text' => $param];
                    }, $parameters)
                ]
            ];
        }

        $messageData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $messageData,
            [],
            'send_template_message'
        );

        return $this->processResponse($response);
    }

    /**
     * Cria um template de texto simples
     */
    public function createTextTemplate(string $name, string $category, string $language, string $body): array
    {
        return $this->createTemplate([
            'name' => $name,
            'category' => $category,
            'language' => $language,
            'components' => [
                [
                    'type' => 'BODY',
                    'text' => $body
                ]
            ]
        ]);
    }

    /**
     * Cria um template com botões
     */
    public function createButtonTemplate(string $name, string $category, string $language, string $body, array $buttons): array
    {
        $components = [
            [
                'type' => 'BODY',
                'text' => $body
            ]
        ];

        // Adicionar botões
        if (!empty($buttons)) {
            $components[] = [
                'type' => 'BUTTONS',
                'buttons' => array_map(function ($button) {
                    return [
                        'type' => $button['type'] ?? 'QUICK_REPLY',
                        'text' => $button['text']
                    ];
                }, $buttons)
            ];
        }

        return $this->createTemplate([
            'name' => $name,
            'category' => $category,
            'language' => $language,
            'components' => $components
        ]);
    }

    /**
     * Cria um template com mídia
     */
    public function createMediaTemplate(string $name, string $category, string $language, string $body, string $mediaType, string $mediaUrl): array
    {
        $components = [
            [
                'type' => 'BODY',
                'text' => $body
            ],
            [
                'type' => 'HEADER',
                'format' => strtoupper($mediaType),
                strtolower($mediaType) => [
                    'link' => $mediaUrl
                ]
            ]
        ];

        return $this->createTemplate([
            'name' => $name,
            'category' => $category,
            'language' => $language,
            'components' => $components
        ]);
    }

    /**
     * Cria um template com lista
     */
    public function createListTemplate(string $name, string $category, string $language, string $body, string $header, array $sections): array
    {
        $components = [
            [
                'type' => 'BODY',
                'text' => $body
            ],
            [
                'type' => 'HEADER',
                'format' => 'TEXT',
                'text' => $header
            ],
            [
                'type' => 'BUTTONS',
                'buttons' => [
                    [
                        'type' => 'LIST',
                        'text' => 'Ver opções',
                        'sections' => $sections
                    ]
                ]
            ]
        ];

        return $this->createTemplate([
            'name' => $name,
            'category' => $category,
            'language' => $language,
            'components' => $components
        ]);
    }

    /**
     * Valida um template antes de criar
     */
    public function validateTemplate(array $templateData): array
    {
        $errors = [];

        // Validar nome
        if (empty($templateData['name'])) {
            $errors[] = 'Nome do template é obrigatório';
        } elseif (!preg_match('/^[a-z0-9_]+$/', $templateData['name'])) {
            $errors[] = 'Nome do template deve conter apenas letras minúsculas, números e underscore';
        }

        // Validar categoria
        $validCategories = ['AUTHENTICATION', 'MARKETING', 'UTILITY'];
        if (empty($templateData['category']) || !in_array($templateData['category'], $validCategories)) {
            $errors[] = 'Categoria deve ser uma das seguintes: ' . implode(', ', $validCategories);
        }

        // Validar idioma
        if (empty($templateData['language'])) {
            $errors[] = 'Idioma é obrigatório';
        }

        // Validar componentes
        if (empty($templateData['components'])) {
            $errors[] = 'Componentes são obrigatórios';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Obtém estatísticas de uso de templates
     */
    public function getTemplateUsageStats(string $templateName, array $params = []): array
    {
        if (!$this->businessAccountId) {
            throw new \Exception('Business Account ID não configurado.');
        }

        $endpoint = "/{$this->businessAccountId}/message_templates/{$templateName}/analytics";
        $defaultParams = [
            'access_token' => $this->accessToken,
            'start' => $params['start'] ?? date('Y-m-d', strtotime('-30 days')),
            'end' => $params['end'] ?? date('Y-m-d')
        ];

        $params = array_merge($defaultParams, $params);

        $response = $this->makeProtectedHttpCall(
            'GET',
            $endpoint,
            $params,
            [],
            'get_template_stats'
        );

        return $this->processResponse($response);
    }

    /**
     * Obtém templates por categoria
     */
    public function getTemplatesByCategory(string $category): array
    {
        return $this->listTemplates(['category' => $category]);
    }

    /**
     * Obtém templates por status
     */
    public function getTemplatesByStatus(string $status): array
    {
        return $this->listTemplates(['status' => $status]);
    }

    /**
     * Obtém templates por idioma
     */
    public function getTemplatesByLanguage(string $language): array
    {
        return $this->listTemplates(['language' => $language]);
    }

    // Implementação dos métodos abstratos

    public function getPlatformName(): string
    {
        return 'whatsapp';
    }

    public function getBaseUrl(): string
    {
        return 'https://graph.facebook.com/v18.0';
    }

    public function getDefaultHeaders(): array
    {
        return [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'User-Agent' => 'xWin-Dash-WhatsAppTemplates/1.0'
        ];
    }

    protected function getHealthCheckEndpoint(): string
    {
        return "/{$this->phoneNumberId}";
    }

    /**
     * Sobrescreve o método para adicionar access_token automaticamente
     */
    protected function performHttpRequest(string $method, string $url, array $data, array $headers): array
    {
        // Adicionar access_token se não estiver presente
        if ($this->accessToken && !isset($data['access_token'])) {
            if (strtoupper($method) === 'GET') {
                $data['access_token'] = $this->accessToken;
            } else {
                $data['access_token'] = $this->accessToken;
            }
        }

        return parent::performHttpRequest($method, $url, $data, $headers);
    }
}
