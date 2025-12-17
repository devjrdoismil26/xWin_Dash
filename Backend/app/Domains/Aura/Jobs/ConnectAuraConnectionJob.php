<?php

namespace App\Domains\Aura\Jobs;

use App\Domains\Aura\Events\AuraConnectionConnected;
use App\Domains\Aura\Events\AuraConnectionFailed;
use App\Domains\Aura\Models\AuraConnection;
use App\Domains\Aura\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log as LoggerFacade;

class ConnectAuraConnectionJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public int $timeout = 300;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public AuraConnection $auraConnection,
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(WhatsAppService $whatsAppService): void
    {
        try {
            // Tenta conectar a instância da AuraConnection usando o WhatsAppService.
            $whatsAppService->connect($this->auraConnection);
            LoggerFacade::info("ConnectAuraConnectionJob: Conexão {$this->auraConnection->id} processada com sucesso.");

            // Notifica o usuário sobre o sucesso da conexão.
            event(new AuraConnectionConnected($this->auraConnection));
        } catch (\Exception $e) {
            LoggerFacade::error("ConnectAuraConnectionJob: Erro ao conectar {$this
                ->auraConnection->id}: " . $e->getMessage());

            // Notifica o usuário sobre a falha na conexão.
            event(new AuraConnectionFailed($this->auraConnection, $e->getMessage()));

            // Relança a exceção para que o Laravel possa lidar com as tentativas e falhas do Job.
            $this->fail($e);
        }
    }
}
