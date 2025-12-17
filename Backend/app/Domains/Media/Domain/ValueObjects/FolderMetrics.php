<?php

namespace App\Domains\Media\Domain\ValueObjects;

class FolderMetrics
{
    private int $mediaCount;
    private int $subfolderCount;
    private int $totalSize;
    private int $accessCount;
    private ?int $lastAccessedAt;

    public function __construct(
        int $mediaCount = 0,
        int $subfolderCount = 0,
        int $totalSize = 0,
        int $accessCount = 0,
        ?int $lastAccessedAt = null
    ) {
        $this->mediaCount = max(0, $mediaCount);
        $this->subfolderCount = max(0, $subfolderCount);
        $this->totalSize = max(0, $totalSize);
        $this->accessCount = max(0, $accessCount);
        $this->lastAccessedAt = $lastAccessedAt;
    }

    public static function empty(): self
    {
        return new self();
    }

    public function getMediaCount(): int
    {
        return $this->mediaCount;
    }

    public function getSubfolderCount(): int
    {
        return $this->subfolderCount;
    }

    public function getTotalSize(): int
    {
        return $this->totalSize;
    }

    public function getAccessCount(): int
    {
        return $this->accessCount;
    }

    public function getLastAccessedAt(): ?int
    {
        return $this->lastAccessedAt;
    }

    public function incrementMediaCount(): self
    {
        return new self(
            $this->mediaCount + 1,
            $this->subfolderCount,
            $this->totalSize,
            $this->accessCount,
            $this->lastAccessedAt
        );
    }

    public function decrementMediaCount(): self
    {
        return new self(
            max(0, $this->mediaCount - 1),
            $this->subfolderCount,
            $this->totalSize,
            $this->accessCount,
            $this->lastAccessedAt
        );
    }

    public function incrementSubfolderCount(): self
    {
        return new self(
            $this->mediaCount,
            $this->subfolderCount + 1,
            $this->totalSize,
            $this->accessCount,
            $this->lastAccessedAt
        );
    }

    public function decrementSubfolderCount(): self
    {
        return new self(
            $this->mediaCount,
            max(0, $this->subfolderCount - 1),
            $this->totalSize,
            $this->accessCount,
            $this->lastAccessedAt
        );
    }

    public function addToTotalSize(int $size): self
    {
        return new self(
            $this->mediaCount,
            $this->subfolderCount,
            $this->totalSize + $size,
            $this->accessCount,
            $this->lastAccessedAt
        );
    }

    public function subtractFromTotalSize(int $size): self
    {
        return new self(
            $this->mediaCount,
            $this->subfolderCount,
            max(0, $this->totalSize - $size),
            $this->accessCount,
            $this->lastAccessedAt
        );
    }

    public function incrementAccessCount(): self
    {
        return new self(
            $this->mediaCount,
            $this->subfolderCount,
            $this->totalSize,
            $this->accessCount + 1,
            time()
        );
    }

    public function setMediaCount(int $count): self
    {
        return new self(
            max(0, $count),
            $this->subfolderCount,
            $this->totalSize,
            $this->accessCount,
            $this->lastAccessedAt
        );
    }

    public function setSubfolderCount(int $count): self
    {
        return new self(
            $this->mediaCount,
            max(0, $count),
            $this->totalSize,
            $this->accessCount,
            $this->lastAccessedAt
        );
    }

    public function setTotalSize(int $size): self
    {
        return new self(
            $this->mediaCount,
            $this->subfolderCount,
            max(0, $size),
            $this->accessCount,
            $this->lastAccessedAt
        );
    }

    public function getTotalItems(): int
    {
        return $this->mediaCount + $this->subfolderCount;
    }

    public function getTotalSizeInMB(): float
    {
        return round($this->totalSize / 1048576, 2);
    }

    public function getTotalSizeInGB(): float
    {
        return round($this->totalSize / 1073741824, 2);
    }

    public function getFormattedTotalSize(): string
    {
        if ($this->totalSize < 1024) {
            return $this->totalSize . ' B';
        } elseif ($this->totalSize < 1048576) {
            return round($this->totalSize / 1024, 2) . ' KB';
        } elseif ($this->totalSize < 1073741824) {
            return round($this->totalSize / 1048576, 2) . ' MB';
        } else {
            return round($this->totalSize / 1073741824, 2) . ' GB';
        }
    }

    public function getAverageFileSize(): float
    {
        if ($this->mediaCount === 0) {
            return 0.0;
        }
        return round($this->totalSize / $this->mediaCount, 2);
    }

    public function getFormattedAverageFileSize(): string
    {
        $avgSize = $this->getAverageFileSize();

        if ($avgSize < 1024) {
            return round($avgSize, 2) . ' B';
        } elseif ($avgSize < 1048576) {
            return round($avgSize / 1024, 2) . ' KB';
        } elseif ($avgSize < 1073741824) {
            return round($avgSize / 1048576, 2) . ' MB';
        } else {
            return round($avgSize / 1073741824, 2) . ' GB';
        }
    }

    public function isEmpty(): bool
    {
        return $this->getTotalItems() === 0;
    }

    public function hasMedia(): bool
    {
        return $this->mediaCount > 0;
    }

    public function hasSubfolders(): bool
    {
        return $this->subfolderCount > 0;
    }

    public function hasBeenAccessed(): bool
    {
        return $this->accessCount > 0;
    }

    public function getLastAccessedFormatted(): ?string
    {
        if ($this->lastAccessedAt === null) {
            return null;
        }
        return date('Y-m-d H:i:s', $this->lastAccessedAt);
    }

    public function getLastAccessedRelative(): ?string
    {
        if ($this->lastAccessedAt === null) {
            return null;
        }

        $diff = time() - $this->lastAccessedAt;

        if ($diff < 60) {
            return 'há ' . $diff . ' segundos';
        } elseif ($diff < 3600) {
            return 'há ' . floor($diff / 60) . ' minutos';
        } elseif ($diff < 86400) {
            return 'há ' . floor($diff / 3600) . ' horas';
        } elseif ($diff < 2592000) {
            return 'há ' . floor($diff / 86400) . ' dias';
        } else {
            return 'há ' . floor($diff / 2592000) . ' meses';
        }
    }

    public function getDensity(): float
    {
        if ($this->mediaCount === 0) {
            return 0.0;
        }
        return round($this->totalSize / $this->mediaCount, 2);
    }

    public function getUtilizationPercentage(int $maxItems): float
    {
        if ($maxItems === 0) {
            return 0.0;
        }
        return round(($this->getTotalItems() / $maxItems) * 100, 2);
    }

    public function toArray(): array
    {
        return [
            'media_count' => $this->mediaCount,
            'subfolder_count' => $this->subfolderCount,
            'total_size' => $this->totalSize,
            'total_size_formatted' => $this->getFormattedTotalSize(),
            'total_size_mb' => $this->getTotalSizeInMB(),
            'total_size_gb' => $this->getTotalSizeInGB(),
            'access_count' => $this->accessCount,
            'last_accessed_at' => $this->lastAccessedAt,
            'last_accessed_formatted' => $this->getLastAccessedFormatted(),
            'last_accessed_relative' => $this->getLastAccessedRelative(),
            'total_items' => $this->getTotalItems(),
            'average_file_size' => $this->getAverageFileSize(),
            'average_file_size_formatted' => $this->getFormattedAverageFileSize(),
            'density' => $this->getDensity(),
            'is_empty' => $this->isEmpty(),
            'has_media' => $this->hasMedia(),
            'has_subfolders' => $this->hasSubfolders(),
            'has_been_accessed' => $this->hasBeenAccessed(),
        ];
    }
}
