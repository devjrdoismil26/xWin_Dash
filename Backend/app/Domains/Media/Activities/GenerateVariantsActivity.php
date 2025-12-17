<?php

namespace App\Domains\Media\Activities;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

// Supondo o uso da biblioteca Intervention/Image

class GenerateVariantsActivity
{
    /**
     * Execute the activity.
     *
     * @param array $mediaData dados do arquivo de mídia (ex: 'path', 'file_name', 'mime_type')
     *
     * @return array dados atualizados do arquivo de mídia com as variantes geradas
     *
     * @throws \Exception se a geração de variantes falhar
     */
    public function execute(array $mediaData): array
    {
        Log::info("Executando GenerateVariantsActivity para: " . ($mediaData['file_name'] ?? 'arquivo desconhecido'));

        $originalPath = $mediaData['path'];
        $variants = [];

        // Exemplo: Gerar uma miniatura para imagens
        if (str_starts_with($mediaData['mime_type'], 'image/')) {
            try {
                $image = Image::make(Storage::disk('public')->path($originalPath));

                // Gerar miniatura
                $thumbnailPath = 'thumbnails/' . $mediaData['file_name'];
                $image->resize(150, 150, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                })->save(Storage::disk('public')->path($thumbnailPath));
                $variants['thumbnail'] = $thumbnailPath;
                Log::info("Miniatura gerada: {$thumbnailPath}");

                // Gerar versão média
                $mediumPath = 'medium/' . $mediaData['file_name'];
                $image->resize(600, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                })->save(Storage::disk('public')->path($mediumPath));
                $variants['medium'] = $mediumPath;
                Log::info("Versão média gerada: {$mediumPath}");
            } catch (\Exception $e) {
                Log::error("Falha ao gerar variantes para imagem: " . $e->getMessage());
                throw new \Exception("Falha ao gerar variantes de imagem.");
            }
        } elseif (str_starts_with($mediaData['mime_type'], 'video/')) {
            // Lógica para gerar variantes de vídeo (ex: diferentes resoluções, webm)
            Log::info("Geração de variantes de vídeo não implementada para: " . $mediaData['file_name']);
        }

        $mediaData['variants'] = $variants;
        return $mediaData;
    }
}
