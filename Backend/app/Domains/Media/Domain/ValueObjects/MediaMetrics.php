<?php

namespace App\Domains\Media\Domain\ValueObjects;

class MediaMetrics
{
    private int $downloadCount;
    private int $viewCount;
    private int $shareCount;
    private ?int $width;
    private ?int $height;
    private ?int $duration;
    private int $size;

    public function __construct(
        int $downloadCount = 0,
        int $viewCount = 0,
        int $shareCount = 0,
        ?int $width = null,
        ?int $height = null,
        ?int $duration = null,
        int $size = 0
    ) {
        $this->downloadCount = max(0, $downloadCount);
        $this->viewCount = max(0, $viewCount);
        $this->shareCount = max(0, $shareCount);
        $this->width = $width;
        $this->height = $height;
        $this->duration = $duration;
        $this->size = max(0, $size);
    }

    public static function empty(): self
    {
        return new self();
    }

    public function getDownloadCount(): int
    {
        return $this->downloadCount;
    }

    public function getViewCount(): int
    {
        return $this->viewCount;
    }

    public function getShareCount(): int
    {
        return $this->shareCount;
    }

    public function getWidth(): ?int
    {
        return $this->width;
    }

    public function getHeight(): ?int
    {
        return $this->height;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function incrementDownloadCount(): self
    {
        return new self(
            $this->downloadCount + 1,
            $this->viewCount,
            $this->shareCount,
            $this->width,
            $this->height,
            $this->duration,
            $this->size
        );
    }

    public function incrementViewCount(): self
    {
        return new self(
            $this->downloadCount,
            $this->viewCount + 1,
            $this->shareCount,
            $this->width,
            $this->height,
            $this->duration,
            $this->size
        );
    }

    public function incrementShareCount(): self
    {
        return new self(
            $this->downloadCount,
            $this->viewCount,
            $this->shareCount + 1,
            $this->width,
            $this->height,
            $this->duration,
            $this->size
        );
    }

    public function setDimensions(?int $width, ?int $height): self
    {
        return new self(
            $this->downloadCount,
            $this->viewCount,
            $this->shareCount,
            $width,
            $height,
            $this->duration,
            $this->size
        );
    }

    public function setDuration(?int $duration): self
    {
        return new self(
            $this->downloadCount,
            $this->viewCount,
            $this->shareCount,
            $this->width,
            $this->height,
            $duration,
            $this->size
        );
    }

    public function setSize(int $size): self
    {
        return new self(
            $this->downloadCount,
            $this->viewCount,
            $this->shareCount,
            $this->width,
            $this->height,
            $this->duration,
            $size
        );
    }

    public function getSizeInMB(): float
    {
        return round($this->size / 1048576, 2);
    }

    public function getSizeInGB(): float
    {
        return round($this->size / 1073741824, 2);
    }

    public function getFormattedSize(): string
    {
        if ($this->size < 1024) {
            return $this->size . ' B';
        } elseif ($this->size < 1048576) {
            return round($this->size / 1024, 2) . ' KB';
        } elseif ($this->size < 1073741824) {
            return round($this->size / 1048576, 2) . ' MB';
        } else {
            return round($this->size / 1073741824, 2) . ' GB';
        }
    }

    public function getAspectRatio(): ?float
    {
        if ($this->width === null || $this->height === null || $this->height === 0) {
            return null;
        }
        return round($this->width / $this->height, 2);
    }

    public function getDurationInSeconds(): ?int
    {
        return $this->duration;
    }

    public function getDurationFormatted(): ?string
    {
        if ($this->duration === null) {
            return null;
        }

        $hours = floor($this->duration / 3600);
        $minutes = floor(($this->duration % 3600) / 60);
        $seconds = $this->duration % 60;

        if ($hours > 0) {
            return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
        } else {
            return sprintf('%02d:%02d', $minutes, $seconds);
        }
    }

    public function getTotalEngagement(): int
    {
        return $this->downloadCount + $this->viewCount + $this->shareCount;
    }

    public function getEngagementRate(): float
    {
        if ($this->viewCount === 0) {
            return 0.0;
        }
        return round(($this->downloadCount + $this->shareCount) / $this->viewCount * 100, 2);
    }

    public function hasDimensions(): bool
    {
        return $this->width !== null && $this->height !== null;
    }

    public function hasDuration(): bool
    {
        return $this->duration !== null;
    }

    public function isLandscape(): bool
    {
        return $this->hasDimensions() && $this->width > $this->height;
    }

    public function isPortrait(): bool
    {
        return $this->hasDimensions() && $this->height > $this->width;
    }

    public function isSquare(): bool
    {
        return $this->hasDimensions() && $this->width === $this->height;
    }

    public function getResolution(): ?string
    {
        if (!$this->hasDimensions()) {
            return null;
        }
        return $this->width . 'x' . $this->height;
    }

    public function getQuality(): string
    {
        if (!$this->hasDimensions()) {
            return 'unknown';
        }

        $pixels = $this->width * $this->height;

        if ($pixels >= 2073600) { // 1920x1080
            return 'high';
        } elseif ($pixels >= 921600) { // 1280x720
            return 'medium';
        } else {
            return 'low';
        }
    }

    public function toArray(): array
    {
        return [
            'download_count' => $this->downloadCount,
            'view_count' => $this->viewCount,
            'share_count' => $this->shareCount,
            'width' => $this->width,
            'height' => $this->height,
            'duration' => $this->duration,
            'size' => $this->size,
            'size_formatted' => $this->getFormattedSize(),
            'aspect_ratio' => $this->getAspectRatio(),
            'duration_formatted' => $this->getDurationFormatted(),
            'total_engagement' => $this->getTotalEngagement(),
            'engagement_rate' => $this->getEngagementRate(),
            'resolution' => $this->getResolution(),
            'quality' => $this->getQuality(),
        ];
    }

    public function isEmpty(): bool
    {
        return $this->downloadCount === 0
            && $this->viewCount === 0
            && $this->shareCount === 0
            && $this->size === 0;
    }

    public function hasActivity(): bool
    {
        return $this->downloadCount > 0 || $this->viewCount > 0 || $this->shareCount > 0;
    }
}
