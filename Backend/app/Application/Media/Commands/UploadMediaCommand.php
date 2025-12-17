<?php

namespace App\Application\Media\Commands;

use Illuminate\Http\UploadedFile;

class UploadMediaCommand
{
    public UploadedFile $file;

    public int $userId;

    public ?string $path;

    public function __construct(UploadedFile $file, int $userId, ?string $path = null)
    {
        $this->file = $file;
        $this->userId = $userId;
        $this->path = $path;
    }
}
