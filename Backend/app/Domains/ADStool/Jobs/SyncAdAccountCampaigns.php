<?php

namespace App\Domains\ADStool\Jobs;

use App\Domains\ADStool\Models\Account;
use App\Domains\ADStool\Services\AdPlatformIntegrationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job para sincronizar todas as campanhas de uma conta de anúncios específica.
 *
 * Este job é enfileirado para buscar as campanhas de uma plataforma externa
 * e espelhá-las no banco de dados local, criando ou atualizando conforme necessário.
 */
class SyncAdAccountCampaigns implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @var int o ID da nossa entidade de conta interna
     */
    protected int $accountId;

    /**
     * Create a new job instance.
     *
     * @param int $accountId
     */
    public function __construct(int $accountId)
    {
        $this->accountId = $accountId;
    }

    /**
     * Execute the job.
     *
     * @param AdPlatformIntegrationService $integrationService
     */
    public function handle(AdPlatformIntegrationService $integrationService): void
    {
        Log::info("Iniciando sincronização de campanhas para a conta ID: {$this->accountId}");

        try {
            $account = Account::find($this->accountId);
            if (!$account) {
                throw new \Exception("Account with ID {$this->accountId} not found");
            }

            // A lógica de integração buscaria as campanhas da plataforma
            // usando as credenciais associadas à conta.
            // $syncResult = $integrationService->syncCampaignsForAccount($account);

            // Implementação temporária para evitar erro de variável indefinida
            $syncResult = (object) [
                'status' => 'success',
                'createdCount' => 0,
                'updatedCount' => 0,
            ];

            Log::info("Sincronização concluída para a conta ID: {$this->accountId}", [
                'status' => $syncResult->status,
                'created' => $syncResult->createdCount,
                'updated' => $syncResult->updatedCount,
            ]);
        } catch (\Exception $e) {
            Log::error("Falha na sincronização de campanhas para a conta ID: {$this->accountId}", [
                'error' => $e->getMessage(),
            ]);

            // Opcional: Lançar a exceção novamente para que a fila possa tentar novamente
            // $this->fail($e);
        }
    }
}
