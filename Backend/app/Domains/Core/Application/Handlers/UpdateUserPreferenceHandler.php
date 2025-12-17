<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Commands\UpdateUserPreferenceCommand;
use App\Domains\Core\Services\UserPreferenceService;
use App\Domains\Core\Repositories\UserPreferenceRepository;
use App\Domains\Core\Exceptions\UserPreferenceUpdateException;
use Illuminate\Support\Facades\Log;

class UpdateUserPreferenceHandler
{
    public function __construct(
        private UserPreferenceService $userPreferenceService,
        private UserPreferenceRepository $userPreferenceRepository
    ) {
    }

    public function handle(UpdateUserPreferenceCommand $command): array
    {
        try {
            // Validar valor da preferência
            $this->validatePreferenceValue($command->value);

            // Atualizar ou criar a preferência
            $preference = $this->userPreferenceService->setPreference(
                $command->userId,
                $command->preferenceKey,
                $command->value,
                $command->category
            );

            // Log da atualização
            Log::info("User preference updated", [
                'user_id' => $command->userId,
                'preference_key' => $command->preferenceKey,
                'category' => $command->category
            ]);

            return [
                'success' => true,
                'user_id' => $command->userId,
                'preference_key' => $command->preferenceKey,
                'value' => $command->value,
                'category' => $command->category,
                'updated_at' => $preference->updated_at->toISOString()
            ];
        } catch (UserPreferenceUpdateException $e) {
            Log::error("User preference update failed", [
                'user_id' => $command->userId,
                'preference_key' => $command->preferenceKey,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during user preference update", [
                'user_id' => $command->userId,
                'preference_key' => $command->preferenceKey,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new UserPreferenceUpdateException(
                "Failed to update user preference: " . $e->getMessage()
            );
        }
    }

    private function validatePreferenceValue(mixed $value): void
    {
        // Validar se o valor é serializável
        if (!is_scalar($value) && !is_array($value) && !is_null($value)) {
            throw new UserPreferenceUpdateException(
                "Preference value must be serializable"
            );
        }

        // Validar tamanho do valor (ex: máximo 1MB)
        $serialized = serialize($value);
        if (strlen($serialized) > 1024 * 1024) {
            throw new UserPreferenceUpdateException(
                "Preference value size exceeds 1MB limit"
            );
        }
    }
}
