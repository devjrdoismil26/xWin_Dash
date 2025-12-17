<?php

namespace App\Domains\SocialBuffer\Application\Services;

use App\Domains\SocialBuffer\Application\Commands\CreatePostCommand;
use App\Domains\SocialBuffer\Domain\Post;
use App\Domains\SocialBuffer\Domain\ValueObjects\PostType;
use App\Domains\SocialBuffer\Domain\ValueObjects\PostPriority;
use Illuminate\Support\Facades\Log;

class PostValidationService
{
    private SocialBufferApplicationService $applicationService;

    public function __construct(SocialBufferApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Valida o comando de criação de post.
     *
     * @param CreatePostCommand $command
     * @return array
     */
    public function validateCommand(CreatePostCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        $errors = array_merge($errors, $this->validateRequiredFields($command));

        // Validar formato do conteúdo
        $errors = array_merge($errors, $this->validateContentFormat($command));

        // Validar tipo de post
        $errors = array_merge($errors, $this->validatePostType($command));

        // Validar prioridade
        $errors = array_merge($errors, $this->validatePriority($command));

        // Validar contas sociais
        $errors = array_merge($errors, $this->validateSocialAccounts($command));

        // Validar data de agendamento
        $errors = array_merge($errors, $this->validateScheduling($command));

        return $errors;
    }

    /**
     * Valida regras cross-module.
     *
     * @param Post $post
     * @param int $userId
     * @return array
     */
    public function validateCrossModuleRules(Post $post, int $userId): array
    {
        try {
            // Buscar usuário para validação
            $user = $this->applicationService->getUserById($userId);
            if (!$user) {
                return ['Usuário não encontrado'];
            }

            // Validar contas sociais
            $accountErrors = $this->validateSocialAccountOwnership($post->socialAccountIds, $userId);
            if (!empty($accountErrors)) {
                return $accountErrors;
            }

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($userId);
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            // Validar mídia se fornecida
            if ($post->type->requiresMedia()) {
                $mediaErrors = $this->validateMedia($post);
                if (!empty($mediaErrors)) {
                    return $mediaErrors;
                }
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for post', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Valida campos obrigatórios.
     *
     * @param CreatePostCommand $command
     * @return array
     */
    protected function validateRequiredFields(CreatePostCommand $command): array
    {
        $errors = [];

        if (empty($command->getContent())) {
            $errors[] = 'Conteúdo do post é obrigatório';
        }

        if (empty($command->getType())) {
            $errors[] = 'Tipo do post é obrigatório';
        }

        if (empty($command->getSocialAccountIds())) {
            $errors[] = 'Pelo menos uma conta social deve ser selecionada';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }

    /**
     * Valida formato do conteúdo.
     *
     * @param CreatePostCommand $command
     * @return array
     */
    protected function validateContentFormat(CreatePostCommand $command): array
    {
        $errors = [];

        if (strlen($command->getContent()) < 1) {
            $errors[] = 'Conteúdo deve ter pelo menos 1 caractere';
        }

        if (strlen($command->getContent()) > 2000) {
            $errors[] = 'Conteúdo deve ter no máximo 2000 caracteres';
        }

        return $errors;
    }

    /**
     * Valida tipo de post.
     *
     * @param CreatePostCommand $command
     * @return array
     */
    protected function validatePostType(CreatePostCommand $command): array
    {
        $errors = [];

        $validTypes = [
            PostType::TEXT,
            PostType::IMAGE,
            PostType::VIDEO,
            PostType::LINK,
            PostType::CAROUSEL,
            PostType::STORY,
            PostType::REEL
        ];

        if (!in_array($command->getType(), $validTypes)) {
            $errors[] = 'Tipo de post inválido';
        }

        return $errors;
    }

    /**
     * Valida prioridade.
     *
     * @param CreatePostCommand $command
     * @return array
     */
    protected function validatePriority(CreatePostCommand $command): array
    {
        $errors = [];

        $validPriorities = [
            PostPriority::LOW,
            PostPriority::MEDIUM,
            PostPriority::HIGH,
            PostPriority::URGENT
        ];

        if (!in_array($command->getPriority(), $validPriorities)) {
            $errors[] = 'Prioridade inválida';
        }

        return $errors;
    }

    /**
     * Valida contas sociais.
     *
     * @param CreatePostCommand $command
     * @return array
     */
    protected function validateSocialAccounts(CreatePostCommand $command): array
    {
        $errors = [];

        foreach ($command->getSocialAccountIds() as $accountId) {
            if ($accountId <= 0) {
                $errors[] = 'ID da conta social deve ser maior que zero';
                break;
            }
        }

        return $errors;
    }

    /**
     * Valida agendamento.
     *
     * @param CreatePostCommand $command
     * @return array
     */
    protected function validateScheduling(CreatePostCommand $command): array
    {
        $errors = [];

        if ($command->getScheduledAt() && $command->getScheduledAt() < new \DateTime()) {
            $errors[] = 'Data de agendamento não pode ser no passado';
        }

        return $errors;
    }

    /**
     * Valida propriedade das contas sociais.
     *
     * @param array $socialAccountIds
     * @param int $userId
     * @return array
     */
    protected function validateSocialAccountOwnership(array $socialAccountIds, int $userId): array
    {
        $errors = [];

        foreach ($socialAccountIds as $accountId) {
            $socialAccount = $this->applicationService->getSocialAccountById($accountId);

            if (!$socialAccount) {
                $errors[] = "Conta social ID {$accountId} não encontrada";
                continue;
            }

            if ($socialAccount->getUserId() !== $userId) {
                $errors[] = "Conta social ID {$accountId} não pertence ao usuário";
                continue;
            }

            if (!$socialAccount->isActive()) {
                $errors[] = "Conta social ID {$accountId} não está ativa";
                continue;
            }

            if (!$socialAccount->hasValidCredentials()) {
                $errors[] = "Conta social ID {$accountId} não possui credenciais válidas";
            }
        }

        return $errors;
    }

    /**
     * Valida limites do usuário.
     *
     * @param int $userId
     * @return array
     */
    protected function validateUserLimits(int $userId): array
    {
        $errors = [];

        // Verificar limite de posts agendados
        $scheduledPostsCount = $this->applicationService->getScheduledPostsCount($userId);
        $maxScheduledPosts = $this->applicationService->getUserMaxScheduledPosts($userId);

        if ($scheduledPostsCount >= $maxScheduledPosts) {
            $errors[] = "Usuário excedeu o limite de posts agendados ({$maxScheduledPosts})";
        }

        // Verificar limite de posts diários
        $dailyPostsCount = $this->applicationService->getDailyPostsCount($userId);
        $maxDailyPosts = $this->applicationService->getUserMaxDailyPosts($userId);

        if ($dailyPostsCount >= $maxDailyPosts) {
            $errors[] = "Usuário excedeu o limite de posts diários ({$maxDailyPosts})";
        }

        return $errors;
    }

    /**
     * Valida mídia.
     *
     * @param Post $post
     * @return array
     */
    protected function validateMedia(Post $post): array
    {
        $errors = [];

        // Validar mídia baseada no tipo
        switch ($post->type->getValue()) {
            case PostType::IMAGE:
                if (empty($post->mediaUrls)) {
                    $errors[] = 'Posts de imagem devem ter pelo menos uma imagem';
                }
                break;

            case PostType::VIDEO:
                if (empty($post->mediaUrls)) {
                    $errors[] = 'Posts de vídeo devem ter pelo menos um vídeo';
                }
                break;

            case PostType::CAROUSEL:
                if (count($post->mediaUrls) < 2) {
                    $errors[] = 'Posts de carrossel devem ter pelo menos 2 mídias';
                }
                break;

            case PostType::STORY:
            case PostType::REEL:
                if (empty($post->mediaUrls)) {
                    $errors[] = 'Posts de story/reel devem ter pelo menos uma mídia';
                }
                break;
        }

        return $errors;
    }

    /**
     * Valida hashtags.
     *
     * @param array $hashtags
     * @return array
     */
    public function validateHashtags(array $hashtags): array
    {
        $errors = [];

        if (count($hashtags) > 30) {
            $errors[] = 'Máximo de 30 hashtags permitidas';
        }

        foreach ($hashtags as $hashtag) {
            if (!preg_match('/^#[a-zA-Z0-9_]+$/', $hashtag)) {
                $errors[] = "Hashtag inválida: {$hashtag}";
            }
        }

        return $errors;
    }

    /**
     * Valida menções.
     *
     * @param array $mentions
     * @return array
     */
    public function validateMentions(array $mentions): array
    {
        $errors = [];

        if (count($mentions) > 20) {
            $errors[] = 'Máximo de 20 menções permitidas';
        }

        foreach ($mentions as $mention) {
            if (!preg_match('/^@[a-zA-Z0-9_]+$/', $mention)) {
                $errors[] = "Menção inválida: {$mention}";
            }
        }

        return $errors;
    }
}
