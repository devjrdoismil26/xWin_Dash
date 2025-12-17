<?php

namespace App\Domains\Auth\Application\Handlers;

use App\Domains\Auth\Application\Commands\VerifyEmailCommand;
use App\Domains\Auth\Domain\Services\EmailVerificationService;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use Illuminate\Support\Facades\Log;

class VerifyEmailHandler
{
    public function __construct(
        private EmailVerificationService $emailVerificationService,
        private UserRepositoryInterface $userRepository,
        private UserService $userService
    ) {
    }

    public function handle(VerifyEmailCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Validar token de verificação
            $tokenData = $this->emailVerificationService->validateVerificationToken($command->token);

            if (!$tokenData) {
                throw new \Exception('Token de verificação inválido ou expirado');
            }

            // Buscar usuário
            $user = $this->userRepository->findById($tokenData['user_id']);

            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Verificar se o email já foi verificado
            if ($user->email_verified) {
                return [
                    'user' => $user->toArray(),
                    'message' => 'Email já foi verificado'
                ];
            }

            // Marcar email como verificado
            $updatedUser = $this->userService->markEmailAsVerified($user);

            // Salvar no repositório
            $savedUser = $this->userRepository->save($updatedUser);

            // Invalidar token de verificação
            $this->emailVerificationService->invalidateVerificationToken($command->token);

            Log::info('Email verified successfully', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return [
                'user' => $savedUser->toArray(),
                'message' => 'Email verificado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error verifying email', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(VerifyEmailCommand $command): void
    {
        if (empty($command->token)) {
            throw new \InvalidArgumentException('Token é obrigatório');
        }
    }
}
