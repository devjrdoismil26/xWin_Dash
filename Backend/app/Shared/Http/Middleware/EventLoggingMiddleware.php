<?php

namespace App\Shared\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\BaseDomainEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

/**
 * Middleware para logging de eventos cross-module
 * 
 * Registra eventos relacionados a operações HTTP
 * que podem afetar múltiplos módulos.
 */
class EventLoggingMiddleware
{
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(CrossModuleEventDispatcher $eventDispatcher)
    {
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        $startTime = microtime(true);
        $user = Auth::user();
        $routeName = $request->route()->getName();

        try {
            // Log da requisição recebida
            $this->logRequest($request, $user, $routeName);

            // Processar requisição
            $response = $next($request);

            // Log da resposta
            $this->logResponse($request, $response, $user, $routeName, $startTime);

            // Disparar eventos baseados na rota e método
            $this->dispatchRouteEvents($request, $response, $user, $routeName);

            return $response;

        } catch (\Throwable $exception) {
            // Log do erro
            $this->logError($request, $exception, $user, $routeName, $startTime);

            // Disparar evento de erro
            $this->dispatchErrorEvent($request, $exception, $user, $routeName);

            throw $exception;
        }
    }

    /**
     * Log da requisição recebida
     */
    private function logRequest(Request $request, $user, string $routeName): void
    {
        try {
            Log::info('HTTP Request received', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'route' => $routeName,
                'user_id' => $user?->id,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'headers' => $this->getSafeHeaders($request),
                'parameters' => $this->getSafeParameters($request),
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error logging request', [
                'error' => $exception->getMessage(),
                'route' => $routeName
            ]);
        }
    }

    /**
     * Log da resposta
     */
    private function logResponse(Request $request, $response, $user, string $routeName, float $startTime): void
    {
        try {
            $duration = microtime(true) - $startTime;
            $statusCode = $response->getStatusCode();

            Log::info('HTTP Response sent', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'route' => $routeName,
                'user_id' => $user?->id,
                'status_code' => $statusCode,
                'duration_ms' => round($duration * 1000, 2),
                'response_size' => strlen($response->getContent()),
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error logging response', [
                'error' => $exception->getMessage(),
                'route' => $routeName
            ]);
        }
    }

    /**
     * Log de erro
     */
    private function logError(Request $request, \Throwable $exception, $user, string $routeName, float $startTime): void
    {
        try {
            $duration = microtime(true) - $startTime;

            Log::error('HTTP Request error', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'route' => $routeName,
                'user_id' => $user?->id,
                'error' => $exception->getMessage(),
                'error_code' => $exception->getCode(),
                'duration_ms' => round($duration * 1000, 2),
                'trace' => $exception->getTraceAsString(),
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Throwable $logException) {
            Log::error('Error logging error', [
                'error' => $logException->getMessage(),
                'original_error' => $exception->getMessage(),
                'route' => $routeName
            ]);
        }
    }

    /**
     * Dispara eventos baseados na rota
     */
    private function dispatchRouteEvents(Request $request, $response, $user, string $routeName): void
    {
        try {
            if (!$user) {
                return; // Não disparar eventos para usuários não autenticados
            }

            $method = $request->method();
            $statusCode = $response->getStatusCode();

            // Disparar eventos baseados no método HTTP e rota
            if ($method === 'POST' && $statusCode >= 200 && $statusCode < 300) {
                $this->dispatchCreationEvents($request, $user, $routeName);
            } elseif ($method === 'PUT' || $method === 'PATCH') {
                $this->dispatchUpdateEvents($request, $user, $routeName);
            } elseif ($method === 'DELETE') {
                $this->dispatchDeletionEvents($request, $user, $routeName);
            }

        } catch (\Throwable $exception) {
            Log::error('Error dispatching route events', [
                'error' => $exception->getMessage(),
                'route' => $routeName,
                'user_id' => $user?->id
            ]);
        }
    }

    /**
     * Dispara eventos de criação
     */
    private function dispatchCreationEvents(Request $request, $user, string $routeName): void
    {
        try {
            $data = $request->all();

            // Mapear rotas para eventos específicos
            $eventMappings = [
                'users.store' => function($data, $user) {
                    return new \App\Shared\Events\UserCreatedEvent(
                        userId: $data['id'] ?? 0,
                        userName: $data['name'] ?? '',
                        userEmail: $data['email'] ?? '',
                        projectId: $data['project_id'] ?? null,
                        metadata: ['source' => 'api', 'route' => 'users.store']
                    );
                },
                'projects.store' => function($data, $user) {
                    return new \App\Shared\Events\ProjectCreatedEvent(
                        projectId: $data['id'] ?? 0,
                        projectName: $data['name'] ?? '',
                        userId: $user->id,
                        projectType: $data['type'] ?? null,
                        metadata: ['source' => 'api', 'route' => 'projects.store']
                    );
                },
                'leads.store' => function($data, $user) {
                    return new \App\Shared\Events\LeadCreatedEvent(
                        leadId: $data['id'] ?? 0,
                        leadName: $data['name'] ?? '',
                        leadEmail: $data['email'] ?? '',
                        userId: $user->id,
                        projectId: $data['project_id'] ?? null,
                        leadSource: $data['source'] ?? null,
                        metadata: ['source' => 'api', 'route' => 'leads.store']
                    );
                },
                'email-campaigns.store' => function($data, $user) {
                    return new \App\Shared\Events\EmailCampaignCreatedEvent(
                        campaignId: $data['id'] ?? 0,
                        campaignName: $data['name'] ?? '',
                        userId: $user->id,
                        projectId: $data['project_id'] ?? null,
                        campaignType: $data['type'] ?? null,
                        metadata: ['source' => 'api', 'route' => 'email-campaigns.store']
                    );
                }
            ];

            if (isset($eventMappings[$routeName])) {
                $event = $eventMappings[$routeName]($data, $user);
                if ($event instanceof BaseDomainEvent) {
                    $this->eventDispatcher->dispatch($event);
                }
            }

        } catch (\Throwable $exception) {
            Log::error('Error dispatching creation events', [
                'error' => $exception->getMessage(),
                'route' => $routeName,
                'user_id' => $user->id
            ]);
        }
    }

    /**
     * Dispara eventos de atualização
     */
    private function dispatchUpdateEvents(Request $request, $user, string $routeName): void
    {
        try {
            $data = $request->all();
            $entityId = $request->route('id') ?? $request->route('project') ?? $request->route('lead');

            // Mapear rotas para eventos específicos
            $eventMappings = [
                'posts.update' => function($data, $user, $entityId) {
                    // Verificar se o post foi publicado
                    if (isset($data['status']) && $data['status'] === 'published') {
                        return new \App\Shared\Events\PostPublishedEvent(
                            postId: $entityId,
                            postContent: $data['content'] ?? '',
                            userId: $user->id,
                            projectId: $data['project_id'] ?? null,
                            postType: $data['type'] ?? null,
                            socialAccounts: $data['social_accounts'] ?? null,
                            metadata: ['source' => 'api', 'route' => 'posts.update']
                        );
                    }
                    return null;
                }
            ];

            if (isset($eventMappings[$routeName])) {
                $event = $eventMappings[$routeName]($data, $user, $entityId);
                if ($event instanceof BaseDomainEvent) {
                    $this->eventDispatcher->dispatch($event);
                }
            }

        } catch (\Throwable $exception) {
            Log::error('Error dispatching update events', [
                'error' => $exception->getMessage(),
                'route' => $routeName,
                'user_id' => $user->id
            ]);
        }
    }

    /**
     * Dispara eventos de deleção
     */
    private function dispatchDeletionEvents(Request $request, $user, string $routeName): void
    {
        try {
            $entityId = $request->route('id') ?? $request->route('project') ?? $request->route('lead');

            // Mapear rotas para eventos específicos
            $eventMappings = [
                'users.destroy' => function($user, $entityId) {
                    return new \App\Shared\Events\UserDeletedEvent(
                        userId: $entityId,
                        userName: $user->name ?? '',
                        userEmail: $user->email ?? '',
                        deletedBy: $user->id,
                        metadata: ['source' => 'api', 'route' => 'users.destroy']
                    );
                },
                'projects.destroy' => function($user, $entityId) {
                    return new \App\Shared\Events\ProjectDeletedEvent(
                        projectId: $entityId,
                        projectName: 'Deleted Project',
                        userId: $user->id,
                        deletedBy: $user->id,
                        metadata: ['source' => 'api', 'route' => 'projects.destroy']
                    );
                }
            ];

            if (isset($eventMappings[$routeName])) {
                $event = $eventMappings[$routeName]($user, $entityId);
                if ($event instanceof BaseDomainEvent) {
                    $this->eventDispatcher->dispatch($event);
                }
            }

        } catch (\Throwable $exception) {
            Log::error('Error dispatching deletion events', [
                'error' => $exception->getMessage(),
                'route' => $routeName,
                'user_id' => $user->id
            ]);
        }
    }

    /**
     * Dispara evento de erro
     */
    private function dispatchErrorEvent(Request $request, \Throwable $exception, $user, string $routeName): void
    {
        try {
            if (!$user) {
                return;
            }

            $errorEvent = new \App\Shared\Events\ErrorOccurredEvent(
                error: $exception->getMessage(),
                errorCode: $exception->getCode(),
                userId: $user->id,
                route: $routeName,
                method: $request->method(),
                url: $request->fullUrl(),
                metadata: [
                    'source' => 'api',
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'trace' => $exception->getTraceAsString()
                ]
            );

            $this->eventDispatcher->dispatch($errorEvent);

        } catch (\Throwable $dispatchException) {
            Log::error('Error dispatching error event', [
                'error' => $dispatchException->getMessage(),
                'original_error' => $exception->getMessage(),
                'route' => $routeName
            ]);
        }
    }

    /**
     * Obtém headers seguros (sem informações sensíveis)
     */
    private function getSafeHeaders(Request $request): array
    {
        $headers = $request->headers->all();
        
        // Remover headers sensíveis
        $sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
        
        foreach ($sensitiveHeaders as $header) {
            if (isset($headers[$header])) {
                $headers[$header] = ['***'];
            }
        }

        return $headers;
    }

    /**
     * Obtém parâmetros seguros (sem informações sensíveis)
     */
    private function getSafeParameters(Request $request): array
    {
        $parameters = $request->all();
        
        // Remover parâmetros sensíveis
        $sensitiveParameters = ['password', 'password_confirmation', 'token', 'api_key', 'secret'];
        
        foreach ($sensitiveParameters as $param) {
            if (isset($parameters[$param])) {
                $parameters[$param] = '***';
            }
        }

        return $parameters;
    }
}