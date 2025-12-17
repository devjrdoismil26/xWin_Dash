<?php

namespace App\Domains\SocialBuffer\Application\Services;

use App\Domains\SocialBuffer\Application\Commands\CreateSocialAccountCommand;
use App\Domains\SocialBuffer\Domain\SocialAccount;
use Illuminate\Support\Facades\Log;

class SocialAccountValidationService
{
    private SocialBufferApplicationService $applicationService;

    public function __construct(SocialBufferApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Valida o comando de criação de conta social.
     *
     * @param CreateSocialAccountCommand $command
     * @return array
     */
    public function validateCommand(CreateSocialAccountCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        $errors = array_merge($errors, $this->validateRequiredFields($command));

        // Validar plataforma
        $errors = array_merge($errors, $this->validatePlatform($command));

        // Validar formato do nome de usuário
        $errors = array_merge($errors, $this->validateUsername($command));

        // Validar tokens
        $errors = array_merge($errors, $this->validateTokens($command));

        // Validar data de expiração
        $errors = array_merge($errors, $this->validateExpiration($command));

        return $errors;
    }

    /**
     * Valida regras cross-module.
     *
     * @param SocialAccount $socialAccount
     * @param int $userId
     * @return array
     */
    public function validateCrossModuleRules(SocialAccount $socialAccount, int $userId): array
    {
        try {
            // Buscar usuário para validação
            $user = $this->applicationService->getUserById($userId);
            if (!$user) {
                return ['Usuário não encontrado'];
            }

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($userId);
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            // Validar conta duplicada
            $duplicateErrors = $this->validateDuplicateAccount($socialAccount->platform, $socialAccount->username, $userId);
            if (!empty($duplicateErrors)) {
                return $duplicateErrors;
            }

            // Validar credenciais
            $credentialErrors = $this->validateCredentials($socialAccount);
            if (!empty($credentialErrors)) {
                return $credentialErrors;
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for social account', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Valida campos obrigatórios.
     *
     * @param CreateSocialAccountCommand $command
     * @return array
     */
    protected function validateRequiredFields(CreateSocialAccountCommand $command): array
    {
        $errors = [];

        if (empty($command->getPlatform())) {
            $errors[] = 'Plataforma é obrigatória';
        }

        if (empty($command->getUsername())) {
            $errors[] = 'Nome de usuário é obrigatório';
        }

        if (empty($command->getAccessToken())) {
            $errors[] = 'Token de acesso é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }

    /**
     * Valida plataforma.
     *
     * @param CreateSocialAccountCommand $command
     * @return array
     */
    protected function validatePlatform(CreateSocialAccountCommand $command): array
    {
        $errors = [];

        $validPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'pinterest'];
        if (!in_array($command->getPlatform(), $validPlatforms)) {
            $errors[] = 'Plataforma inválida';
        }

        return $errors;
    }

    /**
     * Valida formato do nome de usuário.
     *
     * @param CreateSocialAccountCommand $command
     * @return array
     */
    protected function validateUsername(CreateSocialAccountCommand $command): array
    {
        $errors = [];

        if (strlen($command->getUsername()) < 1) {
            $errors[] = 'Nome de usuário deve ter pelo menos 1 caractere';
        }

        if (strlen($command->getUsername()) > 50) {
            $errors[] = 'Nome de usuário deve ter no máximo 50 caracteres';
        }

        // Validar caracteres no nome de usuário
        if (!preg_match('/^[a-zA-Z0-9._-]+$/', $command->getUsername())) {
            $errors[] = 'Nome de usuário contém caracteres inválidos';
        }

        return $errors;
    }

    /**
     * Valida tokens.
     *
     * @param CreateSocialAccountCommand $command
     * @return array
     */
    protected function validateTokens(CreateSocialAccountCommand $command): array
    {
        $errors = [];

        // Validar token de acesso
        if (strlen($command->getAccessToken()) < 10) {
            $errors[] = 'Token de acesso deve ter pelo menos 10 caracteres';
        }

        // Validar token de refresh se fornecido
        if ($command->getRefreshToken() && strlen($command->getRefreshToken()) < 10) {
            $errors[] = 'Token de refresh deve ter pelo menos 10 caracteres';
        }

        return $errors;
    }

    /**
     * Valida data de expiração.
     *
     * @param CreateSocialAccountCommand $command
     * @return array
     */
    protected function validateExpiration(CreateSocialAccountCommand $command): array
    {
        $errors = [];

        if ($command->getExpiresAt() && $command->getExpiresAt() < new \DateTime()) {
            $errors[] = 'Data de expiração não pode ser no passado';
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

        // Verificar limite de contas sociais
        $currentAccountsCount = $this->applicationService->getUserSocialAccountsCount($userId);
        $maxAccounts = $this->applicationService->getUserMaxSocialAccounts($userId);

        if ($currentAccountsCount >= $maxAccounts) {
            $errors[] = "Usuário excedeu o limite de contas sociais ({$maxAccounts})";
        }

        return $errors;
    }

    /**
     * Valida conta duplicada.
     *
     * @param string $platform
     * @param string $username
     * @param int $userId
     * @return array
     */
    protected function validateDuplicateAccount(string $platform, string $username, int $userId): array
    {
        $existingAccount = $this->applicationService->getSocialAccountByPlatformAndUsername($platform, $username, $userId);

        if ($existingAccount) {
            return ['Conta social já existe para esta plataforma e nome de usuário'];
        }

        return [];
    }

    /**
     * Valida credenciais.
     *
     * @param SocialAccount $socialAccount
     * @return array
     */
    protected function validateCredentials(SocialAccount $socialAccount): array
    {
        $errors = [];

        try {
            // Validar credenciais com a plataforma
            $isValid = $this->applicationService->validateSocialAccountCredentials($socialAccount);

            if (!$isValid) {
                $errors[] = 'Credenciais inválidas para a plataforma';
            }
        } catch (\Throwable $exception) {
            Log::error('Error validating social account credentials', [
                'error' => $exception->getMessage(),
                'platform' => $socialAccount->platform,
                'username' => $socialAccount->username
            ]);

            $errors[] = 'Erro ao validar credenciais';
        }

        return $errors;
    }

    /**
     * Valida display name.
     *
     * @param string $displayName
     * @return array
     */
    public function validateDisplayName(string $displayName): array
    {
        $errors = [];

        if (strlen($displayName) > 100) {
            $errors[] = 'Nome de exibição deve ter no máximo 100 caracteres';
        }

        return $errors;
    }

    /**
     * Valida bio.
     *
     * @param string $bio
     * @return array
     */
    public function validateBio(string $bio): array
    {
        $errors = [];

        if (strlen($bio) > 500) {
            $errors[] = 'Bio deve ter no máximo 500 caracteres';
        }

        return $errors;
    }

    /**
     * Valida contadores.
     *
     * @param int $followersCount
     * @param int $followingCount
     * @param int $postsCount
     * @return array
     */
    public function validateCounters(int $followersCount, int $followingCount, int $postsCount): array
    {
        $errors = [];

        if ($followersCount < 0) {
            $errors[] = 'Contador de seguidores não pode ser negativo';
        }

        if ($followingCount < 0) {
            $errors[] = 'Contador de seguindo não pode ser negativo';
        }

        if ($postsCount < 0) {
            $errors[] = 'Contador de posts não pode ser negativo';
        }

        return $errors;
    }
}
