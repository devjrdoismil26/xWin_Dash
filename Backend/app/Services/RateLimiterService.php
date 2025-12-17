<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

/**
 * 🚀 Rate Limiter Service
 * 
 * Serviço centralizado para gerenciar rate limiting de todas as APIs externas
 * Suporta diferentes estratégias de rate limiting por plataforma
 */
class RateLimiterService
{
    private array $platformLimits = [
        'facebook' => [
            'calls_per_hour' => 200,
            'calls_per_day' => 4800,
            'burst_limit' => 10,
            'burst_window' => 60, // segundos
        ],
        'google' => [
            'calls_per_minute' => 100,
            'calls_per_day' => 10000,
            'burst_limit' => 20,
            'burst_window' => 60,
        ],
        'twitter' => [
            'calls_per_15min' => 300,
            'calls_per_day' => 1500,
            'burst_limit' => 15,
            'burst_window' => 60,
        ],
        'linkedin' => [
            'calls_per_day' => 100,
            'burst_limit' => 5,
            'burst_window' => 60,
        ],
        'tiktok' => [
            'calls_per_day' => 1000,
            'burst_limit' => 10,
            'burst_window' => 60,
        ],
        'whatsapp' => [
            'messages_per_day' => 1000,
            'burst_limit' => 5,
            'burst_window' => 60,
        ],
        'openai' => [
            'calls_per_minute' => 3500,
            'tokens_per_minute' => 90000,
            'burst_limit' => 50,
            'burst_window' => 60,
        ],
        'claude' => [
            'calls_per_minute' => 1000,
            'tokens_per_minute' => 40000,
            'burst_limit' => 20,
            'burst_window' => 60,
        ],
        'gemini' => [
            'calls_per_minute' => 60,
            'tokens_per_minute' => 32000,
            'burst_limit' => 10,
            'burst_window' => 60,
        ],
    ];

    /**
     * Verifica se uma chamada pode ser feita
     */
    public function canMakeCall(string $platform, string $endpoint = 'default', ?string $userId = null): bool
    {
        $key = $this->generateKey($platform, $endpoint, $userId);
        $limits = $this->platformLimits[$platform] ?? $this->getDefaultLimits();

        // Verificar burst limit
        if (!$this->checkBurstLimit($key, $limits)) {
            return false;
        }

        // Verificar rate limits específicos
        if (!$this->checkRateLimits($key, $limits)) {
            return false;
        }

        return true;
    }

    /**
     * Registra uma chamada feita
     */
    public function recordCall(string $platform, string $endpoint = 'default', ?string $userId = null, int $tokens = 0): void
    {
        $key = $this->generateKey($platform, $endpoint, $userId);
        $limits = $this->platformLimits[$platform] ?? $this->getDefaultLimits();

        // Registrar burst
        $this->recordBurstCall($key, $limits);

        // Registrar rate limits
        $this->recordRateLimitCall($key, $limits, $tokens);

        Log::info("Rate limit call recorded", [
            'platform' => $platform,
            'endpoint' => $endpoint,
            'user_id' => $userId,
            'tokens' => $tokens
        ]);
    }

    /**
     * Aguarda até poder fazer uma chamada
     */
    public function waitForLimit(string $platform, string $endpoint = 'default', ?string $userId = null): void
    {
        $maxWaitTime = 300; // 5 minutos máximo
        $waitTime = 0;
        $checkInterval = 5; // verificar a cada 5 segundos

        while (!$this->canMakeCall($platform, $endpoint, $userId) && $waitTime < $maxWaitTime) {
            sleep($checkInterval);
            $waitTime += $checkInterval;
        }

        if ($waitTime >= $maxWaitTime) {
            throw new \Exception("Rate limit timeout exceeded for {$platform}");
        }
    }

    /**
     * Obtém estatísticas de rate limiting
     */
    public function getUsageStats(string $platform, string $endpoint = 'default', ?string $userId = null): array
    {
        $key = $this->generateKey($platform, $endpoint, $userId);
        $limits = $this->platformLimits[$platform] ?? $this->getDefaultLimits();

        $stats = [
            'platform' => $platform,
            'endpoint' => $endpoint,
            'user_id' => $userId,
            'limits' => $limits,
            'current_usage' => [],
            'reset_times' => [],
            'can_make_call' => $this->canMakeCall($platform, $endpoint, $userId)
        ];

        // Burst stats
        $burstKey = "burst:{$key}";
        $burstData = Cache::get($burstKey, []);
        $stats['current_usage']['burst'] = count($burstData);
        $stats['current_usage']['burst_limit'] = $limits['burst_limit'];

        // Rate limit stats
        foreach ($limits as $limitType => $limitValue) {
            if (str_contains($limitType, 'per_')) {
                $limitKey = "rate:{$limitType}:{$key}";
                $limitData = Cache::get($limitKey, []);
                $stats['current_usage'][$limitType] = count($limitData);
                $stats['current_usage']["{$limitType}_limit"] = $limitValue;

                // Calcular reset time
                if (!empty($limitData)) {
                    $oldestCall = min($limitData);
                    $window = $this->getWindowSeconds($limitType);
                    $stats['reset_times'][$limitType] = Carbon::createFromTimestamp($oldestCall + $window)->toISOString();
                }
            }
        }

        return $stats;
    }

    /**
     * Obtém tempo de reset para um limite específico
     */
    public function getResetTime(string $platform, string $limitType, string $endpoint = 'default', ?string $userId = null): ?Carbon
    {
        $key = $this->generateKey($platform, $endpoint, $userId);
        $limitKey = "rate:{$limitType}:{$key}";
        $limitData = Cache::get($limitKey, []);

        if (empty($limitData)) {
            return [];
        }

        $oldestCall = min($limitData);
        $window = $this->getWindowSeconds($limitType);

        return Carbon::createFromTimestamp($oldestCall + $window);
    }

    /**
     * Limpa todos os limites para uma plataforma/usuário
     */
    public function clearLimits(string $platform, string $endpoint = 'default', ?string $userId = null): void
    {
        $key = $this->generateKey($platform, $endpoint, $userId);
        $limits = $this->platformLimits[$platform] ?? $this->getDefaultLimits();

        // Limpar burst
        Cache::forget("burst:{$key}");

        // Limpar rate limits
        foreach ($limits as $limitType => $limitValue) {
            if (str_contains($limitType, 'per_')) {
                Cache::forget("rate:{$limitType}:{$key}");
            }
        }

        Log::info("Rate limits cleared", [
            'platform' => $platform,
            'endpoint' => $endpoint,
            'user_id' => $userId
        ]);
    }

    /**
     * Atualiza limites de uma plataforma
     */
    public function updatePlatformLimits(string $platform, array $newLimits): void
    {
        $this->platformLimits[$platform] = array_merge(
            $this->platformLimits[$platform] ?? $this->getDefaultLimits(),
            $newLimits
        );

        Log::info("Platform limits updated", [
            'platform' => $platform,
            'new_limits' => $newLimits
        ]);
    }

    /**
     * Obtém todos os limites configurados
     */
    public function getAllLimits(): array
    {
        return $this->platformLimits;
    }

    // Métodos privados

    private function generateKey(string $platform, string $endpoint, ?string $userId): string
    {
        $userPart = $userId ? ":user:{$userId}" : ':global';
        return "ratelimit:{$platform}:{$endpoint}{$userPart}";
    }

    private function checkBurstLimit(string $key, array $limits): bool
    {
        if (!isset($limits['burst_limit'])) {
            return true;
        }

        $burstKey = "burst:{$key}";
        $burstData = Cache::get($burstKey, []);
        $now = time();
        $window = $limits['burst_window'] ?? 60;

        // Remover chamadas antigas
        $burstData = array_filter($burstData, fn($timestamp) => $now - $timestamp < $window);

        return count($burstData) < $limits['burst_limit'];
    }

    private function recordBurstCall(string $key, array $limits): void
    {
        if (!isset($limits['burst_limit'])) {
            return;
        }

        $burstKey = "burst:{$key}";
        $burstData = Cache::get($burstKey, []);
        $now = time();
        $window = $limits['burst_window'] ?? 60;

        // Remover chamadas antigas
        $burstData = array_filter($burstData, fn($timestamp) => $now - $timestamp < $window);

        // Adicionar nova chamada
        $burstData[] = $now;

        // Salvar com TTL baseado na janela
        Cache::put($burstKey, $burstData, $window);
    }

    private function checkRateLimits(string $key, array $limits): bool
    {
        foreach ($limits as $limitType => $limitValue) {
            if (str_contains($limitType, 'per_')) {
                if (!$this->checkRateLimit($key, $limitType, $limitValue)) {
                    return false;
                }
            }
        }

        return true;
    }

    private function checkRateLimit(string $key, string $limitType, int $limitValue): bool
    {
        $limitKey = "rate:{$limitType}:{$key}";
        $limitData = Cache::get($limitKey, []);
        $now = time();
        $window = $this->getWindowSeconds($limitType);

        // Remover chamadas antigas
        $limitData = array_filter($limitData, fn($timestamp) => $now - $timestamp < $window);

        return count($limitData) < $limitValue;
    }

    private function recordRateLimitCall(string $key, array $limits, int $tokens = 0): void
    {
        $now = time();

        foreach ($limits as $limitType => $limitValue) {
            if (str_contains($limitType, 'per_')) {
                $limitKey = "rate:{$limitType}:{$key}";
                $limitData = Cache::get($limitKey, []);
                $window = $this->getWindowSeconds($limitType);

                // Remover chamadas antigas
                $limitData = array_filter($limitData, fn($timestamp) => $now - $timestamp < $window);

                // Adicionar nova chamada
                $limitData[] = $now;

                // Para token limits, adicionar múltiplas entradas baseadas no número de tokens
                if (str_contains($limitType, 'tokens_')) {
                    $tokensPerCall = max(1, intval($tokens / 100)); // Aproximação
                    for ($i = 0; $i < $tokensPerCall; $i++) {
                        $limitData[] = $now + $i; // Pequeno offset para evitar colisões
                    }
                }

                // Salvar com TTL baseado na janela
                Cache::put($limitKey, $limitData, $window);
            }
        }
    }

    private function getWindowSeconds(string $limitType): int
    {
        return match (true) {
            str_contains($limitType, 'per_minute') => 60,
            str_contains($limitType, 'per_15min') => 900,
            str_contains($limitType, 'per_hour') => 3600,
            str_contains($limitType, 'per_day') => 86400,
            default => 3600
        };
    }

    private function getDefaultLimits(): array
    {
        return [
            'calls_per_hour' => 100,
            'burst_limit' => 5,
            'burst_window' => 60,
        ];
    }
}