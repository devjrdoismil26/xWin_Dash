<?php

namespace Database\Factories;

use App\Domains\Media\Models\MediaFile;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MediaFileFactory extends Factory
{
    protected $model = MediaFile::class;

    public function definition(): array
    {
        $type = fake()->randomElement(['image', 'video', 'document', 'audio']);
        $extensions = [
            'image' => ['jpg', 'png', 'gif', 'webp'],
            'video' => ['mp4', 'mov', 'avi'],
            'document' => ['pdf', 'docx', 'xlsx'],
            'audio' => ['mp3', 'wav', 'ogg'],
        ];
        
        $extension = fake()->randomElement($extensions[$type]);
        $filename = Str::slug(fake()->words(3, true)) . '.' . $extension;
        
        return [
            'name' => fake()->words(3, true),
            'filename' => $filename,
            'path' => 'media/' . date('Y/m/') . $filename,
            'disk' => 's3',
            'type' => $type,
            'mime_type' => $this->getMimeType($type, $extension),
            'size' => fake()->numberBetween(1024, 10485760), // 1KB to 10MB
            'size_bytes' => fake()->numberBetween(1024, 10485760),
            'url' => fake()->imageUrl(1200, 800),
            'project_id' => Project::factory(),
            'uploaded_by' => User::factory(),
            'is_public' => fake()->boolean(70),
            'is_orphaned' => false,
            'metadata' => [
                'width' => $type === 'image' ? fake()->numberBetween(800, 4000) : null,
                'height' => $type === 'image' ? fake()->numberBetween(600, 3000) : null,
                'duration' => in_array($type, ['video', 'audio']) ? fake()->numberBetween(10, 600) : null,
            ],
        ];
    }

    private function getMimeType(string $type, string $extension): string
    {
        $mimeTypes = [
            'image' => ['jpg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp'],
            'video' => ['mp4' => 'video/mp4', 'mov' => 'video/quicktime', 'avi' => 'video/x-msvideo'],
            'document' => ['pdf' => 'application/pdf', 'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            'audio' => ['mp3' => 'audio/mpeg', 'wav' => 'audio/wav', 'ogg' => 'audio/ogg'],
        ];
        
        return $mimeTypes[$type][$extension] ?? 'application/octet-stream';
    }

    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'image',
            'mime_type' => 'image/jpeg',
            'filename' => Str::slug(fake()->words(3, true)) . '.jpg',
        ]);
    }

    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'video',
            'mime_type' => 'video/mp4',
            'filename' => Str::slug(fake()->words(3, true)) . '.mp4',
            'size' => fake()->numberBetween(10485760, 524288000), // 10MB to 500MB
        ]);
    }
}
