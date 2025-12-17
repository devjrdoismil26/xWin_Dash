<?php

namespace App\Domains\Media\Activities;

use Illuminate\Support\Facades\Log;

class ValidateMediaActivity
{
    /**
     * Execute the activity.
     *
     * @param array $mediaData dados do arquivo de mídia (ex: 'path', 'mime_type', 'size')
     *
     * @return bool true se a validação for bem-sucedida
     *
     * @throws \Exception se a validação falhar
     */
    public function execute(array $mediaData): bool
    {
        Log::info("Executando ValidateMediaActivity para: " . ($mediaData['file_name'] ?? 'arquivo desconhecido'));

        // Exemplo de validação: verificar tipo e tamanho
        if (!isset($mediaData['mime_type']) || !in_array($mediaData['mime_type'], ['image/jpeg', 'image/png', 'video/mp4'])) {
            throw new \Exception("Tipo de mídia não suportado: " . ($mediaData['mime_type'] ?? 'N/A'));
        }

        if (!isset($mediaData['size']) || $mediaData['size'] > 20 * 1024 * 1024) { // Max 20MB
            throw new \Exception("Tamanho do arquivo excede o limite permitido.");
        }

        Log::info("Validação de mídia bem-sucedida para: " . ($mediaData['file_name'] ?? 'arquivo desconhecido'));
        return true;
    }
}
