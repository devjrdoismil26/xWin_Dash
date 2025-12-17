<?php

namespace App\Domains\Media\Application\DTOs;

use Illuminate\Http\UploadedFile;

readonly class MediaUploadDTO
{
    public function __construct(
        public UploadedFile $file,
        public ?string $folder_id,
        public ?string $alt_text,
        public array $tags = [],
        public bool $is_public = true
    ) {}
}
