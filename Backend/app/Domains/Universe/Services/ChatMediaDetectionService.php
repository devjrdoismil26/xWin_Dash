<?php

namespace App\Domains\Universe\Services;

use Illuminate\Support\Facades\Log;

class ChatMediaDetectionService
{
    /**
     * Detecta e processa mídias em uma mensagem de chat.
     *
     * @param string $messageContent o conteúdo da mensagem de chat
     * @param array<int, array<string, mixed>> $attachments anexos da mensagem (ex: URLs de mídia, tipos)
     *
     * @return array<string, mixed> um array com os resultados da detecção e processamento de mídia
     */
    public function processChatMessageMedia(string $messageContent, array $attachments = []): array
    {
        Log::info("Processando mídias em mensagem de chat.");
        $mediaResults = [
            'detected_media' => [],
            'processed_data' => [],
        ];

        // Exemplo de detecção de URLs de mídia no conteúdo da mensagem
        preg_match_all('/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|mp4|mov|avi|mp3|wav))/i', $messageContent, $matches);
        foreach ($matches[0] as $url) {
            $mediaResults['detected_media'][] = [
                'type' => $this->getMediaTypeFromUrl($url),
                'url' => $url,
                'source' => 'message_content',
            ];
        }

        // Processar anexos fornecidos
        foreach ($attachments as $attachment) {
            $mediaResults['detected_media'][] = [
                'type' => $attachment['type'] ?? 'unknown',
                'url' => $attachment['url'] ?? null,
                'source' => 'attachment',
            ];

            // Exemplo de processamento: se for imagem, pode-se chamar um serviço de IA para análise
            if (($attachment['type'] ?? '') === 'image') {
                // $aiAnalysisResult = $this->aiIntegrationService->analyzeImage($attachment['url']);
                // $mediaResults['processed_data']['image_analysis'][] = $aiAnalysisResult;
                Log::info("Simulando análise de imagem para anexo.");
            }
            // Exemplo: se for áudio, pode-se chamar um serviço de transcrição
            if (($attachment['type'] ?? '') === 'audio') {
                // $transcription = $this->aiIntegrationService->transcribeAudio($attachment['url']);
                // $mediaResults['processed_data']['audio_transcription'][] = $transcription;
                Log::info("Simulando transcrição de áudio para anexo.");
            }
        }

        Log::info("Processamento de mídias em chat concluído.", $mediaResults);
        return $mediaResults;
    }

    /**
     * Tenta determinar o tipo de mídia a partir da URL.
     *
     * @param string $url
     *
     * @return string
     */
    protected function getMediaTypeFromUrl(string $url): string
    {
        $extension = pathinfo($url, PATHINFO_EXTENSION);
        return match (strtolower($extension)) {
            'jpg', 'jpeg', 'png', 'gif' => 'image',
            'mp4', 'mov', 'avi' => 'video',
            'mp3', 'wav' => 'audio',
            default => 'unknown',
        };
    }
}
