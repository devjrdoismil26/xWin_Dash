<?php

namespace App\Domains\Media\Application\DTOs;

readonly class FolderStructureDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $parent_id,
        public int $media_count,
        public array $children = []
    ) {}
}
