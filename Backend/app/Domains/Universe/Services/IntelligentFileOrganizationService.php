<?php

namespace App\Domains\Universe\Services;

use App\Domains\AI\Services\AIService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

// Supondo que este serviço exista

class IntelligentFileOrganizationService
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Analisa um arquivo e sugere uma categoria e/ou nome.
     *
     * @param string $filePath o caminho do arquivo a ser analisado
     *
     * @return array<string, string> um array com a categoria e o nome sugeridos
     *
     * @throws \Exception se a análise falhar
     */
    public function suggestCategoryAndName(string $filePath): array
    {
        Log::info("Analisando arquivo para organização inteligente: {$filePath}");

        try {
            $fileContent = Storage::get($filePath); // Obter conteúdo do arquivo (cuidado com arquivos grandes)
            $fileName = basename($filePath);
            $mimeType = Storage::mimeType($filePath);

            $contentPreview = $fileContent ? substr($fileContent, 0, 500) : '';
            $prompt = "Analise o conteúdo do arquivo '{$fileName}' (Tipo: {$mimeType}) e sugira uma categoria (ex: Documentos, Imagens, Relatórios) e um nome de arquivo mais descritivo. Conteúdo inicial: " . $contentPreview . "...";

            $aiResponse = $this->aiService->generateText($prompt, 'gemini-pro'); // Exemplo de chamada de IA

            // Parsear a resposta da IA (exemplo: esperar JSON ou formato específico)
            $suggestions = json_decode($aiResponse, true); // Supondo que a IA retorna JSON

            if (json_last_error() !== JSON_ERROR_NONE || !isset($suggestions['category']) || !isset($suggestions['suggested_name'])) {
                Log::warning("Resposta da IA malformada ou incompleta para organização de arquivo: " . $aiResponse);
                return ['category' => 'Outros', 'suggested_name' => $fileName];
            }

            Log::info("Sugestão de organização para {$fileName}: Categoria: {$suggestions['category']}, Nome: {$suggestions['suggested_name']}.");
            return [
                'category' => $suggestions['category'],
                'suggested_name' => $suggestions['suggested_name'],
            ];
        } catch (\Exception $e) {
            Log::error("Falha na análise inteligente de arquivo {$filePath}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Organiza um arquivo automaticamente para uma pasta sugerida.
     *
     * @param string $filePath          o caminho do arquivo a ser organizado
     * @param string $suggestedCategory a categoria sugerida para o arquivo
     * @param string $suggestedName     o nome sugerido para o arquivo
     *
     * @return string o novo caminho do arquivo
     *
     * @throws \Exception se a organização falhar
     */
    public function organizeFile(string $filePath, string $suggestedCategory, string $suggestedName): string
    {
        Log::info("Organizando arquivo {$filePath} para categoria: {$suggestedCategory}, nome: {$suggestedName}.");

        try {
            $newDirectory = "organized_files/{$suggestedCategory}";
            Storage::makeDirectory($newDirectory); // Criar diretório se não existir

            $newPath = "{$newDirectory}/{$suggestedName}";
            Storage::move($filePath, $newPath); // Mover o arquivo

            Log::info("Arquivo movido de {$filePath} para {$newPath}.");
            return $newPath;
        } catch (\Exception $e) {
            Log::error("Falha ao organizar arquivo {$filePath}: " . $e->getMessage());
            throw $e;
        }
    }
}
