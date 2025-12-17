<?php

namespace App\Domains\AI\Application\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;

/**
 * 🚀 PyLab Integration Service
 *
 * Serviço principal para integração com o PyLab
 * Orquestra os serviços especializados de conexão e geração
 */
class PyLabIntegrationService
{
    private PyLabConnectionService $connectionService;
    private PyLabGenerationService $generationService;

    public function __construct(
        PyLabConnectionService $connectionService,
        PyLabGenerationService $generationService
    ) {
        $this->connectionService = $connectionService;
        $this->generationService = $generationService;
    }

    // ============================================================================
    // CONNECTION & STATUS
    // ============================================================================

    /**
     * Verificar conexão com PyLab
     */
    public function checkConnection(): bool
    {
        return $this->connectionService->checkConnection();
    }

    /**
     * Obter status do sistema PyLab
     */
    public function getSystemStatus(): array
    {
        return $this->connectionService->getSystemStatus();
    }

    /**
     * Obter capacidades do PyLab
     */
    public function getCapabilities(): array
    {
        return $this->connectionService->getCapabilities();
    }

    /**
     * Obter informações detalhadas do PyLab
     */
    public function getDetailedInfo(): array
    {
        return $this->connectionService->getDetailedInfo();
    }

    /**
     * Testar conexão com PyLab
     */
    public function testConnection(): array
    {
        return $this->connectionService->testConnection();
    }

    /**
     * Obter logs do PyLab
     */
    public function getLogs(int $limit = 100): array
    {
        return $this->connectionService->getLogs($limit);
    }

    /**
     * Limpar logs do PyLab
     */
    public function clearLogs(): bool
    {
        return $this->connectionService->clearLogs();
    }

    /**
     * Reconfigurar PyLab
     */
    public function reconfigure(array $config): bool
    {
        return $this->connectionService->reconfigure($config);
    }

    // ============================================================================
    // MEDIA GENERATION
    // ============================================================================

    /**
     * Gerar imagem via PyLab
     */
    public function generateImage(array $data): array
    {
        return $this->generationService->generateImage($data);
    }

    /**
     * Gerar vídeo via PyLab
     */
    public function generateVideo(array $data): array
    {
        return $this->generationService->generateVideo($data);
    }

    /**
     * Gerar texto via PyLab
     */
    public function generateText(array $data): array
    {
        return $this->generationService->generateText($data);
    }

    /**
     * Gerar código via PyLab
     */
    public function generateCode(array $data): array
    {
        return $this->generationService->generateCode($data);
    }

    /**
     * Gerar conteúdo multimodal via PyLab
     */
    public function generateMultimodal(array $data): array
    {
        return $this->generationService->generateMultimodal($data);
    }

    /**
     * Verificar status de uma geração
     */
    public function getGenerationStatus(string $taskId): array
    {
        return $this->generationService->getGenerationStatus($taskId);
    }

    /**
     * Obter histórico de gerações
     */
    public function getGenerationHistory(int $limit = 50): array
    {
        return $this->generationService->getGenerationHistory($limit);
    }

    /**
     * Cancelar geração
     */
    public function cancelGeneration(string $taskId): bool
    {
        return $this->generationService->cancelGeneration($taskId);
    }

    /**
     * Analisar texto via PyLab
     */
    public function analyzeText(array $data): array
    {
        return $this->generationService->analyzeText($data);
    }

    /**
     * Processar upload de arquivo
     */
    public function processUpload(UploadedFile $file, string $type = 'image'): array
    {
        return $this->generationService->processUpload($file, $type);
    }

    /**
     * Obter estatísticas de geração
     */
    public function getGenerationStats(): array
    {
        return $this->generationService->getGenerationStats();
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    /**
     * Verificar se PyLab está disponível
     */
    public function isAvailable(): bool
    {
        try {
            return $this->checkConnection();
        } catch (\Exception $e) {
            Log::warning('PyLab não disponível: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Obter informações de saúde do PyLab
     */
    public function getHealthInfo(): array
    {
        try {
            $connection = $this->testConnection();
            $status = $this->getSystemStatus();
            $capabilities = $this->getCapabilities();

            return [
                'connection' => $connection,
                'status' => $status,
                'capabilities' => $capabilities,
                'available' => $this->isAvailable(),
                'timestamp' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            Log::error('Erro ao obter informações de saúde PyLab: ' . $e->getMessage());
            return [
                'available' => false,
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ];
        }
    }

    /**
     * Obter resumo de capacidades
     */
    public function getCapabilitiesSummary(): array
    {
        try {
            $capabilities = $this->getCapabilities();

            return [
                'text_generation' => $capabilities['text_generation'] ?? false,
                'image_generation' => $capabilities['image_generation'] ?? false,
                'video_generation' => $capabilities['video_generation'] ?? false,
                'code_generation' => $capabilities['code_generation'] ?? false,
                'text_analysis' => $capabilities['text_analysis'] ?? false,
                'multimodal' => $capabilities['multimodal'] ?? false,
                'models_available' => count($capabilities['models'] ?? []),
                'timestamp' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            Log::error('Erro ao obter resumo de capacidades PyLab: ' . $e->getMessage());
            return [
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ];
        }
    }
}
