<?php

namespace App\Application\AI\Commands;

class CreateAIGenerationCommand
{
    public int $userId;

    public string $type;

    public string $prompt;

    public string $provider;

    public string $model;

    /** @var array<string, mixed> */
    public array $parameters;

    /**
     * @param int $userId
     * @param string $type
     * @param string $prompt
     * @param string $provider
     * @param string $model
     * @param array<string, mixed> $parameters
     */
    public function __construct(int $userId, string $type, string $prompt, string $provider, string $model, array $parameters = [])
    {
        $this->userId = $userId;
        $this->type = $type;
        $this->prompt = $prompt;
        $this->provider = $provider;
        $this->model = $model;
        $this->parameters = $parameters;
    }
}
