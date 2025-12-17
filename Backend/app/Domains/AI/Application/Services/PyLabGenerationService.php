<?php

namespace App\Domains\AI\Application\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

/**
 * 🎨 PyLab Generation Service
 *
 * Serviço especializado para geração de conteúdo via PyLab
 * Responsável por gerar imagens, vídeos, texto e código
 */
class PyLabGenerationService
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
     * Gerar imagem via PyLab
     */
    public function generateImage(array $data): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->defaultHeaders)
                ->post($this->baseUrl . '/generate/image', $data);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha na geração de imagem: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro na geração de imagem PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Gerar vídeo via PyLab
     */
    public function generateVideo(array $data): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->defaultHeaders)
                ->post($this->baseUrl . '/generate/video', $data);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha na geração de vídeo: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro na geração de vídeo PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Gerar texto via PyLab
     */
    public function generateText(array $data): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->defaultHeaders)
                ->post($this->baseUrl . '/generate/text', $data);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha na geração de texto: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro na geração de texto PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Gerar código via PyLab
     */
    public function generateCode(array $data): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->defaultHeaders)
                ->post($this->baseUrl . '/generate/code', $data);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha na geração de código: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro na geração de código PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Gerar conteúdo multimodal via PyLab
     */
    public function generateMultimodal(array $data): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->defaultHeaders)
                ->post($this->baseUrl . '/generate/multimodal', $data);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha na geração multimodal: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro na geração multimodal PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Verificar status de uma geração
     */
    public function getGenerationStatus(string $taskId): array
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/generation/status/' . $taskId);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha ao obter status da geração: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro ao obter status da geração PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obter histórico de gerações
     */
    public function getGenerationHistory(int $limit = 50): array
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/generation/history', ['limit' => $limit]);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha ao obter histórico: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro ao obter histórico PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Cancelar geração
     */
    public function cancelGeneration(string $taskId): bool
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders($this->defaultHeaders)
                ->post($this->baseUrl . '/generation/cancel/' . $taskId);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Erro ao cancelar geração PyLab: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Analisar texto via PyLab
     */
    public function analyzeText(array $data): array
    {
        try {
            $response = Http::timeout(60)
                ->withHeaders($this->defaultHeaders)
                ->post($this->baseUrl . '/analyze/text', $data);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha na análise de texto: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro na análise de texto PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Processar upload de arquivo
     */
    public function processUpload(UploadedFile $file, string $type = 'image'): array
    {
        try {
            $response = Http::timeout(120)
                ->attach('file', $file->getContent(), $file->getClientOriginalName())
                ->post($this->baseUrl . '/upload/' . $type);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha no upload: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro no upload PyLab: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obter estatísticas de geração
     */
    public function getGenerationStats(): array
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/generation/stats');

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Falha ao obter estatísticas: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Erro ao obter estatísticas PyLab: ' . $e->getMessage());
            throw $e;
        }
    }
}
