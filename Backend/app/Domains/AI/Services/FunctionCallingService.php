<?php

namespace App\Domains\AI\Services;

use Illuminate\Support\Facades\Log;

/**
 * 🚀 Function Calling Service
 *
 * Serviço para gerenciar Function Calling com diferentes provedores de IA
 * Suporta OpenAI, Claude e Gemini
 */
class FunctionCallingService
{
    private array $availableFunctions = [];
    private array $functionHandlers = [];

    public function __construct()
    {
        $this->registerDefaultFunctions();
    }

    /**
     * Registra uma função disponível para chamada
     */
    public function registerFunction(string $name, array $schema, callable $handler): void
    {
        $this->availableFunctions[$name] = $schema;
        $this->functionHandlers[$name] = $handler;

        Log::info("Function registered", [
            'name' => $name,
            'schema' => $schema
        ]);
    }

    /**
     * Remove uma função registrada
     */
    public function unregisterFunction(string $name): void
    {
        unset($this->availableFunctions[$name]);
        unset($this->functionHandlers[$name]);

        Log::info("Function unregistered", [
            'name' => $name
        ]);
    }

    /**
     * Obtém todas as funções disponíveis
     */
    public function getAvailableFunctions(): array
    {
        return $this->availableFunctions;
    }

    /**
     * Obtém esquemas das funções para um provedor específico
     */
    public function getFunctionSchemasForProvider(string $provider): array
    {
        $schemas = [];

        foreach ($this->availableFunctions as $name => $schema) {
            $schemas[] = [
                'name' => $name,
                'description' => $schema['description'] ?? '',
                'parameters' => $schema['parameters'] ?? []
            ];
        }

        return $schemas;
    }

    /**
     * Executa uma função chamada pela IA
     */
    public function executeFunction(string $name, array $arguments): array
    {
        if (!isset($this->functionHandlers[$name])) {
            throw new \Exception("Function '{$name}' not found");
        }

        try {
            Log::info("Executing function", [
                'name' => $name,
                'arguments' => $arguments
            ]);

            $result = call_user_func($this->functionHandlers[$name], $arguments);

            Log::info("Function executed successfully", [
                'name' => $name,
                'result' => $result
            ]);

            return [
                'success' => true,
                'result' => $result
            ];
        } catch (\Exception $e) {
            Log::error("Function execution failed", [
                'name' => $name,
                'arguments' => $arguments,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Processa resposta da IA que pode conter chamadas de função
     */
    public function processAIResponse(array $response, string $provider): array
    {
        $functionCalls = $this->extractFunctionCalls($response, $provider);

        if (empty($functionCalls)) {
            return $response;
        }

        $results = [];
        foreach ($functionCalls as $call) {
            $result = $this->executeFunction($call['name'], $call['arguments']);
            $results[] = [
                'name' => $call['name'],
                'result' => $result
            ];
        }

        return [
            'original_response' => $response,
            'function_calls' => $functionCalls,
            'function_results' => $results
        ];
    }

    /**
     * Extrai chamadas de função da resposta da IA
     */
    private function extractFunctionCalls(array $response, string $provider): array
    {
        $functionCalls = [];

        switch ($provider) {
            case 'openai':
                $functionCalls = $this->extractOpenAIFunctionCalls($response);
                break;
            case 'claude':
                $functionCalls = $this->extractClaudeFunctionCalls($response);
                break;
            case 'gemini':
                $functionCalls = $this->extractGeminiFunctionCalls($response);
                break;
        }

        return $functionCalls;
    }

    /**
     * Extrai chamadas de função do formato OpenAI
     */
    private function extractOpenAIFunctionCalls(array $response): array
    {
        $functionCalls = [];

        if (isset($response['choices'][0]['message']['tool_calls'])) {
            foreach ($response['choices'][0]['message']['tool_calls'] as $toolCall) {
                if ($toolCall['type'] === 'function') {
                    $functionCalls[] = [
                        'name' => $toolCall['function']['name'],
                        'arguments' => json_decode($toolCall['function']['arguments'], true)
                    ];
                }
            }
        }

        return $functionCalls;
    }

    /**
     * Extrai chamadas de função do formato Claude
     */
    private function extractClaudeFunctionCalls(array $response): array
    {
        $functionCalls = [];

        if (isset($response['content'])) {
            foreach ($response['content'] as $content) {
                if ($content['type'] === 'tool_use') {
                    $functionCalls[] = [
                        'name' => $content['name'],
                        'arguments' => $content['input']
                    ];
                }
            }
        }

        return $functionCalls;
    }

    /**
     * Extrai chamadas de função do formato Gemini
     */
    private function extractGeminiFunctionCalls(array $response): array
    {
        $functionCalls = [];

        if (isset($response['candidates'][0]['content']['parts'])) {
            foreach ($response['candidates'][0]['content']['parts'] as $part) {
                if (isset($part['functionCall'])) {
                    $functionCalls[] = [
                        'name' => $part['functionCall']['name'],
                        'arguments' => $part['functionCall']['args']
                    ];
                }
            }
        }

        return $functionCalls;
    }

    /**
     * Registra funções padrão do sistema
     */
    private function registerDefaultFunctions(): void
    {
        // Função para obter informações do sistema
        $this->registerFunction('get_system_info', [
            'description' => 'Obtém informações sobre o sistema',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'info_type' => [
                        'type' => 'string',
                        'description' => 'Tipo de informação a ser obtida',
                        'enum' => ['status', 'version', 'config']
                    ]
                ],
                'required' => ['info_type']
            ]
        ], function (array $args) {
            $infoType = $args['info_type'] ?? 'status';

            switch ($infoType) {
                case 'status':
                    return [
                        'status' => 'online',
                        'timestamp' => now()->toISOString(),
                        'uptime' => '24h'
                    ];
                case 'version':
                    return [
                        'version' => '1.0.0',
                        'build' => '2024.01.01'
                    ];
                case 'config':
                    return [
                        'environment' => config('app.env'),
                        'debug' => config('app.debug')
                    ];
                default:
                    return ['error' => 'Invalid info type'];
            }
        });

        // Função para calcular
        $this->registerFunction('calculate', [
            'description' => 'Executa cálculos matemáticos',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'expression' => [
                        'type' => 'string',
                        'description' => 'Expressão matemática a ser calculada'
                    ]
                ],
                'required' => ['expression']
            ]
        ], function (array $args) {
            $expression = $args['expression'] ?? '';

            // Validar expressão para segurança
            if (!preg_match('/^[0-9+\-*/().\s]+$/', $expression)) {
                throw new \Exception('Invalid mathematical expression');
            }

            try {
                $result = eval("return {$expression};");
                return [
                    'expression' => $expression,
                    'result' => $result
                ];
            } catch (\Exception $e) {
                throw new \Exception('Error calculating expression: ' . $e->getMessage());
            }
        });

        // Função para obter dados do usuário
        $this->registerFunction('get_user_data', [
            'description' => 'Obtém dados do usuário atual',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'data_type' => [
                        'type' => 'string',
                        'description' => 'Tipo de dados a serem obtidos',
                        'enum' => ['profile', 'preferences', 'activity']
                    ]
                ],
                'required' => ['data_type']
            ]
        ], function (array $args) {
            $dataType = $args['data_type'] ?? 'profile';

            // Aqui você implementaria a lógica real para obter dados do usuário
            switch ($dataType) {
                case 'profile':
                    return [
                        'name' => 'User Name',
                        'email' => 'user@example.com',
                        'created_at' => '2024-01-01'
                    ];
                case 'preferences':
                    return [
                        'language' => 'pt-BR',
                        'timezone' => 'America/Sao_Paulo',
                        'theme' => 'dark'
                    ];
                case 'activity':
                    return [
                        'last_login' => now()->toISOString(),
                        'total_sessions' => 100
                    ];
                default:
                    return ['error' => 'Invalid data type'];
            }
        });

        // Função para enviar notificação
        $this->registerFunction('send_notification', [
            'description' => 'Envia uma notificação para o usuário',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'message' => [
                        'type' => 'string',
                        'description' => 'Mensagem da notificação'
                    ],
                    'type' => [
                        'type' => 'string',
                        'description' => 'Tipo da notificação',
                        'enum' => ['info', 'warning', 'error', 'success']
                    ]
                ],
                'required' => ['message', 'type']
            ]
        ], function (array $args) {
            $message = $args['message'] ?? '';
            $type = $args['type'] ?? 'info';

            // Aqui você implementaria a lógica real para enviar notificação
            Log::info("Notification sent", [
                'message' => $message,
                'type' => $type
            ]);

            return [
                'success' => true,
                'message' => 'Notification sent successfully',
                'notification_id' => uniqid()
            ];
        });
    }

    /**
     * Obtém estatísticas de uso das funções
     */
    public function getFunctionStats(): array
    {
        return [
            'total_functions' => count($this->availableFunctions),
            'available_functions' => array_keys($this->availableFunctions),
            'registered_at' => now()->toISOString()
        ];
    }
}
