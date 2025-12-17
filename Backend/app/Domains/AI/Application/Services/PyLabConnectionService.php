<?php

namespace App\Domains\AI\Application\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * 🔗 PyLab Connection Service
 *
 * Serviço especializado para gerenciar conexões com PyLab
 * Responsável por verificar status, capacidades e configurações
 */
class PyLabConnectionService
{
    private string $baseUrl;
    private int $timeout;
    private array $defaultHeaders;

    public function __construct()
    {
        $this->baseUrl = config('services.pylab.url', 'http://localhost:8000');
        $this->timeout = config('services.pylab.timeout', 300);
        $this->defaultHeaders = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'User-Agent' => 'xWin-Dash/1.0'
        ];
    }

    /**
     * Verificar conexão com PyLab
     */
    public function checkConnection(): bool
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/');

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Erro ao verificar conexão PyLab: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Obter status do sistema PyLab
     */
    public function getSystemStatus(): array
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/system-status');

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha ao obter status do sistema: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro ao obter status do sistema PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obter capacidades do PyLab
     */
    public function getCapabilities(): array
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/capabilities');

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha ao obter capacidades: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro ao obter capacidades PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obter informações detalhadas do PyLab
     */
    public function getDetailedInfo(): array
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/info');

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha ao obter informações: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro ao obter informações PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Testar conexão com PyLab
     */
    public function testConnection(): array
    {
        try {
            $startTime = microtime(true);

            $response = Http::timeout(10)
                ->withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/health');

            $endTime = microtime(true);
            $responseTime = round(($endTime - $startTime) * 1000, 2);

            return [
                'success' => $response->successful(),
                'status_code' => $response->status(),
                'response_time_ms' => $responseTime,
                'timestamp' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            Log::error('Erro no teste de conexão PyLab: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ];
        }
    }

    /**
     * Obter logs do PyLab
     */
    public function getLogs(int $limit = 100): array
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/logs', ['limit' => $limit]);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha ao obter logs: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro ao obter logs PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Limpar logs do PyLab
     */
    public function clearLogs(): bool
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders($this->defaultHeaders)
                ->delete($this->baseUrl . '/logs');

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Erro ao limpar logs PyLab: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Reconfigurar PyLab
     */
    public function reconfigure(array $config): bool
    {
        try {
            $response = Http::timeout(60)
                ->withHeaders($this->defaultHeaders)
                ->post($this->baseUrl . '/reconfigure', $config);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Erro ao reconfigurar PyLab: ' . $e->getMessage());
            return false;
        }
    }
}
