<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\CreatePostCommand;
use App\Application\SocialBuffer\Commands\SchedulePostCommand;

class OrchestratePostCreationAndSchedulingUseCase
{
    protected CreatePostUseCase $createPostUseCase;

    protected SchedulePostUseCase $schedulePostUseCase;

    public function __construct(CreatePostUseCase $createPostUseCase, SchedulePostUseCase $schedulePostUseCase)
    {
        $this->createPostUseCase = $createPostUseCase;
        $this->schedulePostUseCase = $schedulePostUseCase;
    }

    /**
     * Executa o caso de uso para orquestrar a criação e o agendamento de posts.
     *
     * @param CreatePostCommand $createCommand
     *
     * @return mixed o post criado e agendado
     */
    public function execute(CreatePostCommand $createCommand)
    {
        // 1. Criar o post
        $post = $this->createPostUseCase->execute($createCommand);

        // 2. Agendar o post, se uma data de agendamento foi fornecida
        if ($createCommand->scheduledAt) {
            $scheduleCommand = new SchedulePostCommand($post->id, $createCommand->scheduledAt);
            $this->schedulePostUseCase->execute($scheduleCommand);
        }

        return $post;
    }
}
