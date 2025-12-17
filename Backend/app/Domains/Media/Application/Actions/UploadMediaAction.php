<?php

namespace App\Domains\Media\Application\Actions;

use App\Domains\Media\Application\DTOs\MediaUploadDTO;
use App\Domains\Media\Application\Services\MediaOptimizationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadMediaAction
{
    public function __construct(
        private MediaOptimizationService $optimizationService
    ) {}

    public function execute(MediaUploadDTO $dto): array
    {
        $path = $dto->file->store('media', 'public');
        
        $media = [
            'id' => Str::uuid(),
            'filename' => $dto->file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $dto->file->getMimeType(),
            'size' => $dto->file->getSize(),
            'folder_id' => $dto->folder_id,
            'alt_text' => $dto->alt_text,
            'tags' => json_encode($dto->tags),
            'is_public' => $dto->is_public,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('media')->insert($media);

        // Gerar thumbnails
        $thumbnails = $this->optimizationService->generateThumbnails((object)$media);

        return array_merge($media, ['thumbnails' => $thumbnails]);
    }
}
