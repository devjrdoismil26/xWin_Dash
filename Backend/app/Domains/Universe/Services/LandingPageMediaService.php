<?php

namespace App\Domains\Universe\Services;

use App\Domains\Media\Services\MediaService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class LandingPageMediaService
{
    protected MediaService $mediaService;
    protected ImageManager $imageManager;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Faz o upload de uma imagem para ser usada em uma landing page.
     *
     * @param int          $userId        o ID do usuário que está fazendo o upload
     * @param UploadedFile $file          o arquivo de imagem enviado
     * @param int|null     $landingPageId o ID da landing page associada (opcional)
     *
     * @return array<string, mixed> dados da mídia, incluindo URL
     *
     * @throws \Exception se o upload ou processamento falhar
     */
    public function uploadLandingPageImage(int $userId, UploadedFile $file, ?int $landingPageId = null): array
    {
        Log::info("Iniciando upload de imagem para landing page para o usuário ID: {$userId}.");

        try {
            // Usar o MediaService real para criar mídia
            $media = $this->mediaService->createMedia(
                $userId,
                [
                    'name' => $file->getClientOriginalName(),
                    'folder_id' => null // Pasta específica para landing pages pode ser implementada
                ],
                $file
            );

            // Aqui você pode adicionar lógica específica para landing pages, como otimização adicional
            // ou registro da mídia diretamente na landing page.

            Log::info("Imagem para landing page uploaded com sucesso. Mídia ID: {$media->id}.");
            return [
                'id' => $media->id,
                'url' => Storage::url($media->path),
                'name' => $media->name,
                'mime_type' => $media->mimeType,
                'size' => $media->size,
                'file_name' => $media->fileName,
            ];
        } catch (\Exception $e) {
            Log::error("Falha ao fazer upload de imagem para landing page: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Otimiza uma imagem para uso em landing pages.
     *
     * @param int $mediaId o ID da mídia a ser otimizada
     *
     * @return array<string, mixed> dados da mídia otimizada
     *
     * @throws \Exception se a otimização falhar
     */
    public function optimizeImageForLandingPage(int $mediaId): array
    {
        Log::info("Otimizando imagem ID: {$mediaId} para landing page.");

        try {
            // Usar o MediaService real para obter mídia
            $media = $this->mediaService->getMediaById($mediaId);

            if (!$media) {
                throw new \Exception("Mídia ID: {$mediaId} não encontrada.");
            }

            // Implementar otimização real de imagem
            Log::info("Otimizando imagem para {$media->fileName}.");

            $optimizedMedia = $this->optimizeImage($media);

            return [
                'id' => $optimizedMedia['id'],
                'url' => $optimizedMedia['url'],
                'original_url' => Storage::url($media->path),
                'status' => 'optimized',
                'optimizations' => $optimizedMedia['optimizations'],
                'size_reduction' => $optimizedMedia['size_reduction'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error("Falha ao otimizar imagem ID: {$mediaId} para landing page: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Otimiza uma imagem aplicando compressão e redimensionamento.
     *
     * @param object $media
     * @return array
     */
    protected function optimizeImage(object $media): array
    {
        try {
            $originalPath = Storage::path($media->path);
            $optimizations = [];

            if (!file_exists($originalPath)) {
                throw new \Exception("Arquivo não encontrado: {$originalPath}");
            }

            // Obter tamanho original
            $originalSize = filesize($originalPath);

            // Carregar imagem
            $image = $this->imageManager->read($originalPath);

            // Otimizações específicas para landing pages
            $maxWidth = config('universe.media.max_width', 1920);
            $maxHeight = config('universe.media.max_height', 1080);
            $quality = config('universe.media.quality', 85);

            // Redimensionar se necessário (mantendo proporção)
            if ($image->width() > $maxWidth || $image->height() > $maxHeight) {
                $image->scaleDown($maxWidth, $maxHeight);
                $optimizations[] = "Redimensionado para {$image->width()}x{$image->height()}";
                Log::info("Imagem redimensionada para {$image->width()}x{$image->height()}");
            }

            // Aplicar compressão baseada no formato
            $extension = strtolower(pathinfo($media->fileName, PATHINFO_EXTENSION));
            $optimizedPath = $this->generateOptimizedPath($media->path);
            $optimizedFullPath = Storage::path($optimizedPath);

            // Garantir que o diretório existe
            $optimizedDir = dirname($optimizedFullPath);
            if (!is_dir($optimizedDir)) {
                mkdir($optimizedDir, 0755, true);
            }

            switch ($extension) {
                case 'jpg':
                case 'jpeg':
                    $image->toJpeg($quality)->save($optimizedFullPath);
                    $optimizations[] = "Compressão JPEG aplicada (qualidade: {$quality}%)";
                    break;

                case 'png':
                    // Para PNG, converter para JPEG se não tiver transparência
                    if (!$this->hasTransparency($originalPath)) {
                        $image->toJpeg($quality)->save($optimizedFullPath);
                        $optimizations[] = "Convertido PNG para JPEG (qualidade: {$quality}%)";
                    } else {
                        $image->toPng()->save($optimizedFullPath);
                        $optimizations[] = "Compressão PNG aplicada";
                    }
                    break;

                case 'webp':
                    $image->toWebp($quality)->save($optimizedFullPath);
                    $optimizations[] = "Compressão WebP aplicada (qualidade: {$quality}%)";
                    break;

                default:
                    // Converter para JPEG por padrão
                    $image->toJpeg($quality)->save($optimizedFullPath);
                    $optimizations[] = "Convertido para JPEG (qualidade: {$quality}%)";
                    break;
            }

            // Calcular redução de tamanho
            $optimizedSize = filesize($optimizedFullPath);
            $sizeReduction = round((($originalSize - $optimizedSize) / $originalSize) * 100, 2);

            Log::info("Otimização concluída. Redução de tamanho: {$sizeReduction}%");

            return [
                'id' => $media->id,
                'url' => Storage::url($optimizedPath),
                'path' => $optimizedPath,
                'optimizations' => $optimizations,
                'size_reduction' => $sizeReduction,
                'original_size' => $originalSize,
                'optimized_size' => $optimizedSize,
            ];
        } catch (\Exception $e) {
            Log::error("Erro na otimização de imagem: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Gera caminho para arquivo otimizado.
     */
    protected function generateOptimizedPath(string $originalPath): string
    {
        $pathInfo = pathinfo($originalPath);
        $directory = $pathInfo['dirname'];
        $filename = $pathInfo['filename'];
        $extension = $pathInfo['extension'];

        return $directory . '/' . $filename . '_optimized.' . $extension;
    }

    /**
     * Verifica se uma imagem PNG tem transparência.
     */
    protected function hasTransparency(string $imagePath): bool
    {
        try {
            $image = imagecreatefrompng($imagePath);
            if (!$image) {
                return false;
            }

            $width = imagesx($image);
            $height = imagesy($image);

            // Verificar alguns pixels para transparência
            for ($x = 0; $x < $width; $x += 10) {
                for ($y = 0; $y < $height; $y += 10) {
                    $rgba = imagecolorat($image, $x, $y);
                    $alpha = ($rgba & 0x7F000000) >> 24;
                    if ($alpha > 0) {
                        imagedestroy($image);
                        return true;
                    }
                }
            }

            imagedestroy($image);
            return false;
        } catch (\Exception $e) {
            Log::warning("Erro ao verificar transparência: " . $e->getMessage());
            return true; // Assumir transparência em caso de erro
        }
    }

    /**
     * Cria diferentes tamanhos de uma imagem (thumbnails).
     */
    public function createThumbnails(int $mediaId, array $sizes = []): array
    {
        $defaultSizes = [
            'thumb' => [150, 150],
            'medium' => [300, 300],
            'large' => [800, 600],
        ];

        $sizes = array_merge($defaultSizes, $sizes);
        $thumbnails = [];

        try {
            $media = $this->mediaService->getMediaById($mediaId);
            if (!$media) {
                throw new \Exception("Mídia não encontrada");
            }

            $originalPath = Storage::path($media->path);
            $image = $this->imageManager->read($originalPath);

            foreach ($sizes as $sizeName => $dimensions) {
                [$width, $height] = $dimensions;

                $thumbnailImage = clone $image;
                $thumbnailImage->cover($width, $height);

                $thumbnailPath = $this->generateThumbnailPath($media->path, $sizeName);
                $thumbnailFullPath = Storage::path($thumbnailPath);

                // Garantir diretório
                $thumbnailDir = dirname($thumbnailFullPath);
                if (!is_dir($thumbnailDir)) {
                    mkdir($thumbnailDir, 0755, true);
                }

                $thumbnailImage->toJpeg(85)->save($thumbnailFullPath);

                $thumbnails[$sizeName] = [
                    'url' => Storage::url($thumbnailPath),
                    'path' => $thumbnailPath,
                    'width' => $width,
                    'height' => $height,
                ];
            }

            Log::info("Thumbnails criados para mídia ID: {$mediaId}");
            return $thumbnails;
        } catch (\Exception $e) {
            Log::error("Erro ao criar thumbnails: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Gera caminho para thumbnail.
     */
    protected function generateThumbnailPath(string $originalPath, string $sizeName): string
    {
        $pathInfo = pathinfo($originalPath);
        $directory = $pathInfo['dirname'] . '/thumbnails';
        $filename = $pathInfo['filename'];

        return $directory . '/' . $filename . '_' . $sizeName . '.jpg';
    }
}
