<?php

namespace App\Domains\Media\Services;

use App\Domains\AI\Services\AIService;
use App\Domains\Media\Infrastructure\Persistence\Eloquent\MediaFileModel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * MediaAIService
 * 
 * Service for AI-powered media features:
 * - Generate AI tags
 * - Generate AI descriptions
 * - Detect objects in images
 * - Recognize faces
 * - Extract text (OCR)
 * - Categorize media
 */
class MediaAIService
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Generate AI tags for media
     * 
     * @param string $mediaId
     * @return array
     */
    public function generateAITags(string $mediaId): array
    {
        try {
            $media = MediaFileModel::findOrFail($mediaId);
            
            // Verificar se é imagem
            if (!str_starts_with($media->mime_type, 'image/')) {
                throw new \Exception('AI tags só podem ser gerados para imagens');
            }

            // Obter URL da imagem
            $imageUrl = Storage::url($media->path);

            // Gerar tags usando IA
            $prompt = "Analise esta imagem e gere tags relevantes em português. Retorne apenas uma lista de tags separadas por vírgula, sem explicações: {$imageUrl}";
            
            $response = $this->aiService->generate([
                'prompt' => $prompt,
                'type' => 'text',
                'provider' => 'gemini',
                'model' => 'gemini-pro'
            ]);

            $tagsText = is_array($response) ? ($response['text'] ?? $response['content'] ?? json_encode($response)) : $response;
            $tags = array_map('trim', explode(',', $tagsText));

            // Atualizar tags do media
            $currentTags = $media->tags ?? [];
            $media->update(['tags' => array_unique(array_merge($currentTags, $tags))]);

            Log::info("Tags de IA geradas para media {$mediaId}", [
                'tags_count' => count($tags)
            ]);

            return [
                'success' => true,
                'tags' => $tags,
                'media_id' => $mediaId
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao gerar tags de IA para media {$mediaId}: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Erro ao gerar tags: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Generate AI description for media
     * 
     * @param string $mediaId
     * @return array
     */
    public function generateAIDescription(string $mediaId): array
    {
        try {
            $media = MediaFileModel::findOrFail($mediaId);
            
            // Verificar se é imagem
            if (!str_starts_with($media->mime_type, 'image/')) {
                throw new \Exception('AI description só pode ser gerado para imagens');
            }

            $imageUrl = Storage::url($media->path);
            $prompt = "Descreva esta imagem em português de forma detalhada e profissional: {$imageUrl}";
            
            $response = $this->aiService->generate([
                'prompt' => $prompt,
                'type' => 'text',
                'provider' => 'gemini',
                'model' => 'gemini-pro'
            ]);

            $description = is_array($response) ? ($response['text'] ?? $response['content'] ?? json_encode($response)) : $response;

            // Atualizar descrição do media
            $media->update(['description' => $description]);

            Log::info("Descrição de IA gerada para media {$mediaId}");

            return [
                'success' => true,
                'description' => $description,
                'media_id' => $mediaId
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao gerar descrição de IA para media {$mediaId}: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Erro ao gerar descrição: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Detect objects in image
     * 
     * @param string $mediaId
     * @return array
     */
    public function detectObjects(string $mediaId): array
    {
        try {
            $media = MediaFileModel::findOrFail($mediaId);
            
            if (!str_starts_with($media->mime_type, 'image/')) {
                throw new \Exception('Detecção de objetos só funciona para imagens');
            }

            $imageUrl = Storage::url($media->path);
            $prompt = "Analise esta imagem e liste todos os objetos detectados em formato JSON com campos: object_name, confidence (0-1), bounding_box. Retorne apenas JSON válido: {$imageUrl}";
            
            $response = $this->aiService->generate([
                'prompt' => $prompt,
                'type' => 'text',
                'provider' => 'gemini',
                'model' => 'gemini-pro'
            ]);

            $objectsJson = is_array($response) ? ($response['text'] ?? $response['content'] ?? json_encode($response)) : $response;
            $objects = json_decode($objectsJson, true) ?? [];

            // Salvar detecções no metadata
            $metadata = $media->metadata ?? [];
            $metadata['ai_objects'] = $objects;
            $media->update(['metadata' => $metadata]);

            Log::info("Objetos detectados na media {$mediaId}", [
                'objects_count' => count($objects)
            ]);

            return [
                'success' => true,
                'objects' => $objects,
                'media_id' => $mediaId
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao detectar objetos na media {$mediaId}: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Erro ao detectar objetos: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Recognize faces in image
     * 
     * @param string $mediaId
     * @return array
     */
    public function recognizeFaces(string $mediaId): array
    {
        try {
            $media = MediaFileModel::findOrFail($mediaId);
            
            if (!str_starts_with($media->mime_type, 'image/')) {
                throw new \Exception('Reconhecimento facial só funciona para imagens');
            }

            $imageUrl = Storage::url($media->path);
            $prompt = "Analise esta imagem e detecte faces. Retorne JSON com campos: face_count, faces (array com: age_range, gender, emotions). Retorne apenas JSON válido: {$imageUrl}";
            
            $response = $this->aiService->generate([
                'prompt' => $prompt,
                'type' => 'text',
                'provider' => 'gemini',
                'model' => 'gemini-pro'
            ]);

            $facesJson = is_array($response) ? ($response['text'] ?? $response['content'] ?? json_encode($response)) : $response;
            $facesData = json_decode($facesJson, true) ?? ['face_count' => 0, 'faces' => []];

            // Salvar no metadata
            $metadata = $media->metadata ?? [];
            $metadata['ai_faces'] = $facesData;
            $media->update(['metadata' => $metadata]);

            Log::info("Faces reconhecidas na media {$mediaId}", [
                'face_count' => $facesData['face_count'] ?? 0
            ]);

            return [
                'success' => true,
                'faces' => $facesData,
                'media_id' => $mediaId
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao reconhecer faces na media {$mediaId}: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Erro ao reconhecer faces: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Extract text from image (OCR)
     * 
     * @param string $mediaId
     * @return array
     */
    public function extractText(string $mediaId): array
    {
        try {
            $media = MediaFileModel::findOrFail($mediaId);
            
            if (!str_starts_with($media->mime_type, 'image/')) {
                throw new \Exception('Extração de texto só funciona para imagens');
            }

            $imageUrl = Storage::url($media->path);
            $prompt = "Extraia todo o texto visível nesta imagem. Retorne apenas o texto extraído, sem explicações: {$imageUrl}";
            
            $response = $this->aiService->generate([
                'prompt' => $prompt,
                'type' => 'text',
                'provider' => 'gemini',
                'model' => 'gemini-pro'
            ]);

            $extractedText = is_array($response) ? ($response['text'] ?? $response['content'] ?? json_encode($response)) : $response;

            // Salvar texto extraído
            $metadata = $media->metadata ?? [];
            $metadata['ai_extracted_text'] = $extractedText;
            $media->update(['metadata' => $metadata]);

            Log::info("Texto extraído da media {$mediaId}");

            return [
                'success' => true,
                'text' => $extractedText,
                'media_id' => $mediaId
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao extrair texto da media {$mediaId}: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Erro ao extrair texto: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Categorize media automatically
     * 
     * @param string $mediaId
     * @return array
     */
    public function categorizeMedia(string $mediaId): array
    {
        try {
            $media = MediaFileModel::findOrFail($mediaId);
            
            $imageUrl = Storage::url($media->path);
            $prompt = "Categorize esta mídia em uma das seguintes categorias: document, image, video, audio, presentation, spreadsheet, archive, other. Retorne apenas o nome da categoria: {$imageUrl}";
            
            $response = $this->aiService->generate([
                'prompt' => $prompt,
                'type' => 'text',
                'provider' => 'gemini',
                'model' => 'gemini-pro'
            ]);

            $category = is_array($response) ? ($response['text'] ?? $response['content'] ?? 'other') : $response;
            $category = strtolower(trim($category));

            // Validar categoria
            $validCategories = ['document', 'image', 'video', 'audio', 'presentation', 'spreadsheet', 'archive', 'other'];
            if (!in_array($category, $validCategories)) {
                $category = 'other';
            }

            // Atualizar categoria
            $metadata = $media->metadata ?? [];
            $metadata['ai_category'] = $category;
            $media->update(['metadata' => $metadata]);

            Log::info("Media {$mediaId} categorizada como: {$category}");

            return [
                'success' => true,
                'category' => $category,
                'media_id' => $mediaId
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao categorizar media {$mediaId}: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Erro ao categorizar: ' . $e->getMessage()
            ];
        }
    }
}
