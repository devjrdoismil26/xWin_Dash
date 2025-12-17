<?php

namespace Database\Factories\Domains\Media\Models;

use App\Domains\Media\Models\Media;
use App\Domains\Media\Models\MediaFolder;
use App\Domains\Users\Models\User;
use App\Domains\Projects\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition(): array
    {
        $mimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/avi',
            'video/mov',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'application/zip',
            'audio/mpeg',
            'audio/wav'
        ];

        $mimeType = $this->faker->randomElement($mimeTypes);
        $fileName = $this->faker->word() . $this->getFileExtension($mimeType);

        return [
            'name' => $this->faker->words(2, true),
            'file_name' => $fileName,
            'mime_type' => $mimeType,
            'path' => 'media/' . $this->faker->date('Y/m') . '/' . $fileName,
            'size' => $this->faker->numberBetween(1024, 10485760), // 1KB to 10MB
            'folder_id' => null,
            'user_id' => null,
            'project_id' => null,
            'metadata' => $this->faker->optional(0.7)->randomElements([
                'width' => $this->faker->numberBetween(100, 4000),
                'height' => $this->faker->numberBetween(100, 4000),
                'duration' => $this->faker->numberBetween(10, 3600),
                'bitrate' => $this->faker->numberBetween(128, 320),
                'fps' => $this->faker->randomElement([24, 25, 30, 60]),
                'resolution' => $this->faker->randomElement(['720p', '1080p', '4K']),
                'format' => $this->faker->randomElement(['MP4', 'AVI', 'MOV', 'JPEG', 'PNG']),
                'color_space' => $this->faker->randomElement(['RGB', 'CMYK', 'sRGB']),
                'compression' => $this->faker->randomElement(['lossless', 'lossy']),
                'created_with' => $this->faker->randomElement(['Photoshop', 'GIMP', 'Canva', 'Figma']),
                'camera' => $this->faker->randomElement(['iPhone 14', 'Canon EOS R5', 'Sony A7R IV']),
                'lens' => $this->faker->randomElement(['24-70mm', '50mm', '85mm']),
                'iso' => $this->faker->numberBetween(100, 6400),
                'aperture' => $this->faker->randomFloat(1, 1.4, 22),
                'shutter_speed' => $this->faker->randomElement(['1/60', '1/125', '1/250', '1/500']),
                'tags' => $this->faker->words(3),
                'description' => $this->faker->sentence(),
                'alt_text' => $this->faker->sentence(),
                'copyright' => $this->faker->company(),
                'location' => $this->faker->address(),
                'gps_latitude' => $this->faker->latitude(),
                'gps_longitude' => $this->faker->longitude(),
                'file_hash' => $this->faker->sha256(),
                'virus_scan_status' => $this->faker->randomElement(['clean', 'infected', 'quarantined']),
                'processing_status' => $this->faker->randomElement(['pending', 'processing', 'completed', 'failed']),
                'thumbnail_path' => 'thumbnails/' . $this->faker->uuid() . '.jpg',
                'preview_path' => 'previews/' . $this->faker->uuid() . '.jpg'
            ], $this->faker->numberBetween(2, 8))
        ];
    }

    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'mime_type' => $this->faker->randomElement(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
            'file_name' => $this->faker->word() . $this->getFileExtension('image/jpeg'),
            'metadata' => array_merge($attributes['metadata'] ?? [], [
                'width' => $this->faker->numberBetween(100, 4000),
                'height' => $this->faker->numberBetween(100, 4000),
                'color_space' => $this->faker->randomElement(['RGB', 'CMYK', 'sRGB']),
                'compression' => $this->faker->randomElement(['lossless', 'lossy'])
            ])
        ]);
    }

    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'mime_type' => $this->faker->randomElement(['video/mp4', 'video/avi', 'video/mov']),
            'file_name' => $this->faker->word() . $this->getFileExtension('video/mp4'),
            'size' => $this->faker->numberBetween(10485760, 1073741824), // 10MB to 1GB
            'metadata' => array_merge($attributes['metadata'] ?? [], [
                'duration' => $this->faker->numberBetween(10, 3600),
                'bitrate' => $this->faker->numberBetween(128, 320),
                'fps' => $this->faker->randomElement([24, 25, 30, 60]),
                'resolution' => $this->faker->randomElement(['720p', '1080p', '4K']),
                'format' => $this->faker->randomElement(['MP4', 'AVI', 'MOV'])
            ])
        ]);
    }

    public function document(): static
    {
        return $this->state(fn (array $attributes) => [
            'mime_type' => $this->faker->randomElement([
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain'
            ]),
            'file_name' => $this->faker->word() . $this->getFileExtension('application/pdf'),
            'metadata' => array_merge($attributes['metadata'] ?? [], [
                'pages' => $this->faker->numberBetween(1, 100),
                'author' => $this->faker->name(),
                'title' => $this->faker->sentence(3),
                'subject' => $this->faker->words(2, true),
                'keywords' => $this->faker->words(5),
                'created_date' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d H:i:s'),
                'modified_date' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d H:i:s')
            ])
        ]);
    }

    public function audio(): static
    {
        return $this->state(fn (array $attributes) => [
            'mime_type' => $this->faker->randomElement(['audio/mpeg', 'audio/wav', 'audio/flac']),
            'file_name' => $this->faker->word() . $this->getFileExtension('audio/mpeg'),
            'metadata' => array_merge($attributes['metadata'] ?? [], [
                'duration' => $this->faker->numberBetween(30, 3600),
                'bitrate' => $this->faker->numberBetween(128, 320),
                'sample_rate' => $this->faker->randomElement([44100, 48000, 96000]),
                'channels' => $this->faker->randomElement([1, 2, 5, 7]),
                'format' => $this->faker->randomElement(['MP3', 'WAV', 'FLAC']),
                'artist' => $this->faker->name(),
                'album' => $this->faker->words(2, true),
                'title' => $this->faker->words(2, true),
                'genre' => $this->faker->randomElement(['Rock', 'Pop', 'Jazz', 'Classical', 'Electronic'])
            ])
        ]);
    }

    public function large(): static
    {
        return $this->state(fn (array $attributes) => [
            'size' => $this->faker->numberBetween(104857600, 1073741824), // 100MB to 1GB
        ]);
    }

    public function small(): static
    {
        return $this->state(fn (array $attributes) => [
            'size' => $this->faker->numberBetween(1024, 1048576), // 1KB to 1MB
        ]);
    }

    private function getFileExtension(string $mimeType): string
    {
        $extensions = [
            'image/jpeg' => '.jpg',
            'image/png' => '.png',
            'image/gif' => '.gif',
            'image/webp' => '.webp',
            'video/mp4' => '.mp4',
            'video/avi' => '.avi',
            'video/mov' => '.mov',
            'application/pdf' => '.pdf',
            'application/msword' => '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => '.docx',
            'application/vnd.ms-excel' => '.xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => '.xlsx',
            'text/plain' => '.txt',
            'application/zip' => '.zip',
            'audio/mpeg' => '.mp3',
            'audio/wav' => '.wav',
            'audio/flac' => '.flac'
        ];

        return $extensions[$mimeType] ?? '.bin';
    }
}