<?php

namespace App\Domains\Aura\Services;

use App\Services\BaseExternalApiService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 WhatsApp Interactive Messages Service
 *
 * Serviço completo para enviar mensagens interativas do WhatsApp Business
 * Inclui botões, listas, quick replies e mensagens com mídia
 */
class WhatsAppInteractiveService extends BaseExternalApiService
{
    protected ?array $credentials = null;
    protected ?string $accessToken = null;
    protected ?string $phoneNumberId = null;

    /**
     * Define as credenciais da API
     */
    public function setCredentials(?array $credentials): void
    {
        $this->credentials = $credentials;
        $this->accessToken = $credentials['access_token'] ?? null;
        $this->phoneNumberId = $credentials['phone_number_id'] ?? null;
    }

    /**
     * Envia mensagem com botões
     */
    public function sendButtonMessage(string $to, string $body, array $buttons, ?string $header = null, ?string $footer = null): array
    {
        if (!$this->phoneNumberId) {
            throw new \Exception('Phone Number ID não configurado.');
        }

        $endpoint = "/{$this->phoneNumberId}/messages";
        $messageData = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'interactive',
            'interactive' => [
                'type' => 'button',
                'body' => [
                    'text' => $body
                ],
                'action' => [
                    'buttons' => array_map(function ($button, $index) {
                        return [
                            'type' => 'reply',
                            'reply' => [
                                'id' => $button['id'] ?? "btn_{$index}",
                                'title' => $button['title']
                            ]
                        ];
                    }, $buttons, array_keys($buttons))
                ]
            ]
        ];

        // Adicionar header se fornecido
        if ($header) {
            $messageData['interactive']['header'] = [
                'type' => 'text',
                'text' => $header
            ];
        }

        // Adicionar footer se fornecido
        if ($footer) {
            $messageData['interactive']['footer'] = [
                'text' => $footer
            ];
        }

        $messageData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $messageData,
            [],
            'send_button_message'
        );

        return $this->processResponse($response);
    }

    /**
     * Envia mensagem com lista
     */
    public function sendListMessage(string $to, string $body, string $buttonText, array $sections, ?string $header = null, ?string $footer = null): array
    {
        if (!$this->phoneNumberId) {
            throw new \Exception('Phone Number ID não configurado.');
        }

        $endpoint = "/{$this->phoneNumberId}/messages";
        $messageData = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'interactive',
            'interactive' => [
                'type' => 'list',
                'body' => [
                    'text' => $body
                ],
                'action' => [
                    'button' => $buttonText,
                    'sections' => $sections
                ]
            ]
        ];

        // Adicionar header se fornecido
        if ($header) {
            $messageData['interactive']['header'] = [
                'type' => 'text',
                'text' => $header
            ];
        }

        // Adicionar footer se fornecido
        if ($footer) {
            $messageData['interactive']['footer'] = [
                'text' => $footer
            ];
        }

        $messageData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $messageData,
            [],
            'send_list_message'
        );

        return $this->processResponse($response);
    }

    /**
     * Envia mensagem com quick replies
     */
    public function sendQuickReplyMessage(string $to, string $body, array $quickReplies, ?string $header = null, ?string $footer = null): array
    {
        if (!$this->phoneNumberId) {
            throw new \Exception('Phone Number ID não configurado.');
        }

        $endpoint = "/{$this->phoneNumberId}/messages";
        $messageData = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'interactive',
            'interactive' => [
                'type' => 'button',
                'body' => [
                    'text' => $body
                ],
                'action' => [
                    'buttons' => array_map(function ($reply, $index) {
                        return [
                            'type' => 'reply',
                            'reply' => [
                                'id' => $reply['id'] ?? "qr_{$index}",
                                'title' => $reply['title']
                            ]
                        ];
                    }, $quickReplies, array_keys($quickReplies))
                ]
            ]
        ];

        // Adicionar header se fornecido
        if ($header) {
            $messageData['interactive']['header'] = [
                'type' => 'text',
                'text' => $header
            ];
        }

        // Adicionar footer se fornecido
        if ($footer) {
            $messageData['interactive']['footer'] = [
                'text' => $footer
            ];
        }

        $messageData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $messageData,
            [],
            'send_quick_reply_message'
        );

        return $this->processResponse($response);
    }

    /**
     * Envia mensagem com mídia e botões
     */
    public function sendMediaInteractiveMessage(string $to, string $mediaType, string $mediaUrl, string $caption, array $buttons, ?string $header = null, ?string $footer = null): array
    {
        if (!$this->phoneNumberId) {
            throw new \Exception('Phone Number ID não configurado.');
        }

        $endpoint = "/{$this->phoneNumberId}/messages";
        $messageData = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'interactive',
            'interactive' => [
                'type' => 'button',
                'body' => [
                    'text' => $caption
                ],
                'action' => [
                    'buttons' => array_map(function ($button, $index) {
                        return [
                            'type' => 'reply',
                            'reply' => [
                                'id' => $button['id'] ?? "btn_{$index}",
                                'title' => $button['title']
                            ]
                        ];
                    }, $buttons, array_keys($buttons))
                ]
            ]
        ];

        // Adicionar header com mídia
        $messageData['interactive']['header'] = [
            'type' => $mediaType,
            $mediaType => [
                'link' => $mediaUrl
            ]
        ];

        // Adicionar footer se fornecido
        if ($footer) {
            $messageData['interactive']['footer'] = [
                'text' => $footer
            ];
        }

        $messageData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $messageData,
            [],
            'send_media_interactive_message'
        );

        return $this->processResponse($response);
    }

    /**
     * Envia mensagem com localização
     */
    public function sendLocationMessage(string $to, float $latitude, float $longitude, ?string $name = null, ?string $address = null): array
    {
        if (!$this->phoneNumberId) {
            throw new \Exception('Phone Number ID não configurado.');
        }

        $endpoint = "/{$this->phoneNumberId}/messages";
        $messageData = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'location',
            'location' => [
                'latitude' => $latitude,
                'longitude' => $longitude
            ]
        ];

        // Adicionar nome se fornecido
        if ($name) {
            $messageData['location']['name'] = $name;
        }

        // Adicionar endereço se fornecido
        if ($address) {
            $messageData['location']['address'] = $address;
        }

        $messageData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $messageData,
            [],
            'send_location_message'
        );

        return $this->processResponse($response);
    }

    /**
     * Envia mensagem com contato
     */
    public function sendContactMessage(string $to, array $contacts): array
    {
        if (!$this->phoneNumberId) {
            throw new \Exception('Phone Number ID não configurado.');
        }

        $endpoint = "/{$this->phoneNumberId}/messages";
        $messageData = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'contacts',
            'contacts' => array_map(function ($contact) {
                return [
                    'name' => [
                        'formatted_name' => $contact['name'] ?? '',
                        'first_name' => $contact['first_name'] ?? '',
                        'last_name' => $contact['last_name'] ?? ''
                    ],
                    'phones' => array_map(function ($phone) {
                        return [
                            'phone' => $phone['number'] ?? '',
                            'type' => $phone['type'] ?? 'MOBILE'
                        ];
                    }, $contact['phones'] ?? [])
                ];
            }, $contacts)
        ];

        $messageData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $messageData,
            [],
            'send_contact_message'
        );

        return $this->processResponse($response);
    }

    /**
     * Envia mensagem com reação
     */
    public function sendReactionMessage(string $to, string $messageId, string $emoji): array
    {
        if (!$this->phoneNumberId) {
            throw new \Exception('Phone Number ID não configurado.');
        }

        $endpoint = "/{$this->phoneNumberId}/messages";
        $messageData = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'reaction',
            'reaction' => [
                'message_id' => $messageId,
                'emoji' => $emoji
            ]
        ];

        $messageData['access_token'] = $this->accessToken;

        $response = $this->makeProtectedHttpCall(
            'POST',
            $endpoint,
            $messageData,
            [],
            'send_reaction_message'
        );

        return $this->processResponse($response);
    }

    /**
     * Cria seção para lista
     */
    public function createListSection(string $title, array $rows): array
    {
        return [
            'title' => $title,
            'rows' => array_map(function ($row, $index) {
                return [
                    'id' => $row['id'] ?? "row_{$index}",
                    'title' => $row['title'],
                    'description' => $row['description'] ?? ''
                ];
            }, $rows, array_keys($rows))
        ];
    }

    /**
     * Valida dados de botão
     */
    public function validateButton(array $button): array
    {
        $errors = [];

        if (empty($button['title'])) {
            $errors[] = 'Título do botão é obrigatório';
        } elseif (strlen($button['title']) > 20) {
            $errors[] = 'Título do botão deve ter no máximo 20 caracteres';
        }

        if (empty($button['id'])) {
            $errors[] = 'ID do botão é obrigatório';
        } elseif (strlen($button['id']) > 256) {
            $errors[] = 'ID do botão deve ter no máximo 256 caracteres';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Valida dados de lista
     */
    public function validateList(array $listData): array
    {
        $errors = [];

        if (empty($listData['body'])) {
            $errors[] = 'Corpo da mensagem é obrigatório';
        } elseif (strlen($listData['body']) > 1024) {
            $errors[] = 'Corpo da mensagem deve ter no máximo 1024 caracteres';
        }

        if (empty($listData['button_text'])) {
            $errors[] = 'Texto do botão é obrigatório';
        } elseif (strlen($listData['button_text']) > 20) {
            $errors[] = 'Texto do botão deve ter no máximo 20 caracteres';
        }

        if (empty($listData['sections'])) {
            $errors[] = 'Seções são obrigatórias';
        } elseif (count($listData['sections']) > 10) {
            $errors[] = 'Máximo de 10 seções permitidas';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
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
            'User-Agent' => 'xWin-Dash-WhatsAppInteractive/1.0'
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
