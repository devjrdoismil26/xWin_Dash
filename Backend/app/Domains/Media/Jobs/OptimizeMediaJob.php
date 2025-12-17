<?php

namespace App\Domains\Media\Jobs;

use App\Domains\Media\Models\Media;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

// Necessário instalar: composer require intervention/image

class OptimizeMediaJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public string $mediaId;

    /**
     * Create a new job instance.
     */
    public function __construct(string $mediaId)
    {
        $this->mediaId = $mediaId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $media = Media::find($this->mediaId);

        if (!$media) {
            LoggerFacade::warning("OptimizeMediaJob: Mídia não encontrada com ID {$this->mediaId}");
            return;
        }

        // Apenas otimiza imagens
        if (!$media->isImage()) {
            LoggerFacade::info("OptimizeMediaJob: Mídia {$media->id} não é uma imagem, pulando otimização.");
            return;
        }

        try {
            $disk = Storage::disk($media->disk);
            $originalPath = $media->path;

            if (!$disk->exists($originalPath)) {
                LoggerFacade::error("OptimizeMediaJob: Arquivo de mídia não encontrado no disco: {$originalPath}");
                return;
            }

            $imageContent = $disk->get($originalPath);
            $image = Image::make($imageContent);

            // Exemplo de otimização: redimensionar se for muito grande e comprimir
            $maxWidth = 1920;
            $maxHeight = 1080;
            $quality = 75; // Qualidade JPEG/WebP

            if ($image->width() > $maxWidth || $image->height() > $maxHeight) {
                $image->resize($maxWidth, $maxHeight, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }

            // Salvar a imagem otimizada de volta
            $optimizedContent = $image->encode(null, $quality); // null para manter o formato original

            $disk->put($originalPath, $optimizedContent);

            // Atualizar o tamanho do arquivo no banco de dados
            $media->size = $disk->size($originalPath);
            $media->save();

            LoggerFacade::info("OptimizeMediaJob: Mídia {$media
                ->id} otimizada com sucesso. Novo tamanho: {$media->size} bytes.");
        } catch (\Exception $e) {
            LoggerFacade::error("OptimizeMediaJob: Erro ao otimizar mídia {$media->id}: " . $e->getMessage(), [
                'exception' => $e,
                'media_id' => $media->id,
            ]);
        }
    }
}
