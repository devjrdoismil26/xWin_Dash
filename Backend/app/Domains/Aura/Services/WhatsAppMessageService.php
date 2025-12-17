<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;
use Illuminate\Support\Facades\Log;

/**
 * Service especializado para envio de mensagens WhatsApp
 *
 * Responsável por enviar diferentes tipos de mensagens,
 * incluindo texto, mídia, interativas e templates.
 */
class WhatsAppMessageService
{
    protected WhatsAppTemplateService $templateService;
    protected WhatsAppInteractiveService $interactiveService;

    public function __construct(
        private readonly AuraConnectionModel $connectionModel,
        RateLimiterService $rateLimiter,
        CircuitBreakerService $circuitBreaker,
        RetryService $retryService
    ) {
        $this->templateService = new WhatsAppTemplateService($rateLimiter, $circuitBreaker, $retryService);
        $this->interactiveService = new WhatsAppInteractiveService($rateLimiter, $circuitBreaker, $retryService);
    }

    /**
     * Envia uma mensagem genérica
     */
    public function sendMessage(string $connectionId, string $to, array $message): array
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => 'Conexão não encontrada'
                ];
            }

            $messageType = $message['type'] ?? 'text';

            switch ($messageType) {
                case 'text':
                    return $this->sendTextMessage($connectionId, $to, $message['text'] ?? '');

                case 'media':
                    return $this->sendMediaMessage(
                        $connectionId,
                        $to,
                        $message['media_url'] ?? '',
                        $message['caption'] ?? ''
                    );

                case 'template':
                    return $this->sendTemplateMessage(
                        $connectionId,
                        $to,
                        $message['template_name'] ?? '',
                        $message['parameters'] ?? [],
                        $message['language'] ?? null
                    );

                case 'interactive':
                    return $this->sendInteractiveMessage(
                        $connectionId,
                        $to,
                        $message['text'] ?? '',
                        $message['buttons'] ?? []
                    );

                default:
                    return [
                        'success' => false,
                        'error' => 'Tipo de mensagem não suportado'
                    ];
            }
        } catch (\Throwable $exception) {
            Log::error('Erro ao enviar mensagem WhatsApp', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId,
                'to' => $to,
                'message' => $message
            ]);

            return [
                'success' => false,
                'error' => 'Erro interno ao enviar mensagem',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Envia mensagem de texto
     */
    public function sendTextMessage(string $connectionId, string $to, string $text): array
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => 'Conexão não encontrada'
                ];
            }

            $messageData = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'text',
                'text' => [
                    'body' => $text
                ]
            ];

            $response = $this->makeApiCall($connection, 'messages', $messageData);

            Log::info('Mensagem de texto enviada', [
                'connection_id' => $connectionId,
                'to' => $to,
                'message_id' => $response['messages'][0]['id'] ?? null
            ]);

            return [
                'success' => true,
                'message_id' => $response['messages'][0]['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro ao enviar mensagem de texto', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId,
                'to' => $to
            ]);

            return [
                'success' => false,
                'error' => 'Erro ao enviar mensagem de texto',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Envia mensagem de mídia
     */
    public function sendMediaMessage(string $connectionId, string $to, string $mediaUrl, string $caption = ''): array
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => 'Conexão não encontrada'
                ];
            }

            $mediaType = $this->detectMediaType($mediaUrl);

            $messageData = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => $mediaType,
                $mediaType => [
                    'link' => $mediaUrl
                ]
            ];

            if (!empty($caption)) {
                $messageData[$mediaType]['caption'] = $caption;
            }

            $response = $this->makeApiCall($connection, 'messages', $messageData);

            Log::info('Mensagem de mídia enviada', [
                'connection_id' => $connectionId,
                'to' => $to,
                'media_type' => $mediaType,
                'message_id' => $response['messages'][0]['id'] ?? null
            ]);

            return [
                'success' => true,
                'message_id' => $response['messages'][0]['id'] ?? null,
                'media_type' => $mediaType,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro ao enviar mensagem de mídia', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId,
                'to' => $to,
                'media_url' => $mediaUrl
            ]);

            return [
                'success' => false,
                'error' => 'Erro ao enviar mensagem de mídia',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Envia mensagem interativa
     */
    public function sendInteractiveMessage(string $connectionId, string $to, string $text, array $buttons): array
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => 'Conexão não encontrada'
                ];
            }

            $messageData = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'interactive',
                'interactive' => [
                    'type' => 'button',
                    'body' => [
                        'text' => $text
                    ],
                    'action' => [
                        'buttons' => $this->formatButtons($buttons)
                    ]
                ]
            ];

            $response = $this->makeApiCall($connection, 'messages', $messageData);

            Log::info('Mensagem interativa enviada', [
                'connection_id' => $connectionId,
                'to' => $to,
                'buttons_count' => count($buttons),
                'message_id' => $response['messages'][0]['id'] ?? null
            ]);

            return [
                'success' => true,
                'message_id' => $response['messages'][0]['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro ao enviar mensagem interativa', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId,
                'to' => $to
            ]);

            return [
                'success' => false,
                'error' => 'Erro ao enviar mensagem interativa',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Envia mensagem de template
     */
    public function sendTemplateMessage(string $connectionId, string $to, string $templateName, array $parameters = [], ?string $language = null): array
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => 'Conexão não encontrada'
                ];
            }

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

            $response = $this->makeApiCall($connection, 'messages', $messageData);

            Log::info('Mensagem de template enviada', [
                'connection_id' => $connectionId,
                'to' => $to,
                'template_name' => $templateName,
                'message_id' => $response['messages'][0]['id'] ?? null
            ]);

            return [
                'success' => true,
                'message_id' => $response['messages'][0]['id'] ?? null,
                'template_name' => $templateName,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro ao enviar mensagem de template', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId,
                'to' => $to,
                'template_name' => $templateName
            ]);

            return [
                'success' => false,
                'error' => 'Erro ao enviar mensagem de template',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Envia mensagem de botão
     */
    public function sendButtonMessage(string $connectionId, string $to, string $body, array $buttons, ?string $header = null, ?string $footer = null): array
    {
        return $this->interactiveService->sendButtonMessage($connectionId, $to, $body, $buttons, $header, $footer);
    }

    /**
     * Envia mensagem de lista
     */
    public function sendListMessage(string $connectionId, string $to, string $body, string $buttonText, array $sections, ?string $header = null, ?string $footer = null): array
    {
        return $this->interactiveService->sendListMessage($connectionId, $to, $body, $buttonText, $sections, $header, $footer);
    }

    /**
     * Envia mensagem de resposta rápida
     */
    public function sendQuickReplyMessage(string $connectionId, string $to, string $body, array $quickReplies, ?string $header = null, ?string $footer = null): array
    {
        return $this->interactiveService->sendQuickReplyMessage($connectionId, $to, $body, $quickReplies, $header, $footer);
    }

    /**
     * Envia mensagem interativa com mídia
     */
    public function sendMediaInteractiveMessage(string $connectionId, string $to, string $mediaType, string $mediaUrl, string $caption, array $buttons, ?string $header = null, ?string $footer = null): array
    {
        return $this->interactiveService->sendMediaInteractiveMessage($connectionId, $to, $mediaType, $mediaUrl, $caption, $buttons, $header, $footer);
    }

    /**
     * Envia mensagem de localização
     */
    public function sendLocationMessage(string $connectionId, string $to, float $latitude, float $longitude, ?string $name = null, ?string $address = null): array
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => 'Conexão não encontrada'
                ];
            }

            $messageData = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'location',
                'location' => [
                    'latitude' => $latitude,
                    'longitude' => $longitude
                ]
            ];

            if ($name) {
                $messageData['location']['name'] = $name;
            }

            if ($address) {
                $messageData['location']['address'] = $address;
            }

            $response = $this->makeApiCall($connection, 'messages', $messageData);

            return [
                'success' => true,
                'message_id' => $response['messages'][0]['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro ao enviar mensagem de localização', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId,
                'to' => $to
            ]);

            return [
                'success' => false,
                'error' => 'Erro ao enviar mensagem de localização',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Envia mensagem de contato
     */
    public function sendContactMessage(string $connectionId, string $to, array $contacts): array
    {
        try {
            $connection = $this->getConnection($connectionId);
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => 'Conexão não encontrada'
                ];
            }

            $messageData = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'contacts',
                'contacts' => $contacts
            ];

            $response = $this->makeApiCall($connection, 'messages', $messageData);

            return [
                'success' => true,
                'message_id' => $response['messages'][0]['id'] ?? null,
                'data' => $response
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro ao enviar mensagem de contato', [
                'error' => $exception->getMessage(),
                'connection_id' => $connectionId,
                'to' => $to
            ]);

            return [
                'success' => false,
                'error' => 'Erro ao enviar mensagem de contato',
                'details' => $exception->getMessage()
            ];
        }
    }

    // ===== MÉTODOS AUXILIARES =====

    /**
     * Obtém conexão por ID
     */
    private function getConnection(string $connectionId): ?AuraConnectionModel
    {
        return $this->connectionModel->find($connectionId);
    }

    /**
     * Detecta tipo de mídia pela URL
     */
    private function detectMediaType(string $mediaUrl): string
    {
        $extension = strtolower(pathinfo(parse_url($mediaUrl, PHP_URL_PATH), PATHINFO_EXTENSION));

        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
        $audioExtensions = ['mp3', 'wav', 'ogg', 'm4a'];
        $documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];

        if (in_array($extension, $imageExtensions)) {
            return 'image';
        } elseif (in_array($extension, $videoExtensions)) {
            return 'video';
        } elseif (in_array($extension, $audioExtensions)) {
            return 'audio';
        } elseif (in_array($extension, $documentExtensions)) {
            return 'document';
        } else {
            return 'document'; // Default
        }
    }

    /**
     * Formata botões para API do WhatsApp
     */
    private function formatButtons(array $buttons): array
    {
        $formattedButtons = [];
        $buttonId = 1;

        foreach ($buttons as $button) {
            $formattedButtons[] = [
                'type' => 'reply',
                'reply' => [
                    'id' => (string) $buttonId,
                    'title' => $button['title'] ?? $button
                ]
            ];
            $buttonId++;
        }

        return $formattedButtons;
    }

    /**
     * Faz chamada para API do WhatsApp
     */
    private function makeApiCall(AuraConnectionModel $connection, string $endpoint, array $data): array
    {
        // Implementar chamada real para API do WhatsApp
        // Por enquanto, retorna resposta simulada
        return [
            'messages' => [
                [
                    'id' => 'wamid.' . uniqid()
                ]
            ]
        ];
    }
}
