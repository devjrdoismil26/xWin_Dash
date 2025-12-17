<?php

namespace App\Application\SocialBuffer\Commands;

class GenerateContentCommand
{
    public int $userId;

    public string $topic;

    public ?string $tone;

    public ?string $length;

    public ?string $platform;

    public function __construct(int $userId, string $topic, ?string $tone = null, ?string $length = null, ?string $platform = null)
    {
        $this->userId = $userId;
        $this->topic = $topic;
        $this->tone = $tone;
        $this->length = $length;
        $this->platform = $platform;
    }
}
