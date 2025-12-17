<?php

namespace App\Domains\Aura\Jobs;

use App\Domains\Aura\Events\AuraConnectionDisconnected;
use App\Domains\Aura\Events\AuraConnectionFailed;
use App\Domains\Aura\Models\AuraConnection;
use App\Domains\Aura\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log as LoggerFacade;

class DisconnectAuraConnectionJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

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
            // Tenta desconectar a instância da AuraConnection usando o WhatsAppService.
            $whatsAppService->disconnect($this->auraConnection);
            LoggerFacade::info("DisconnectAuraConnectionJob: Desconexão {$this
                ->auraConnection->id} processada com sucesso.");

            // Notifica o usuário sobre o sucesso da desconexão.
            event(new AuraConnectionDisconnected($this->auraConnection));
        } catch (\Exception $e) {
            LoggerFacade::error("DisconnectAuraConnectionJob: Erro ao desconectar {$this
                ->auraConnection->id}: " . $e->getMessage());

            // Notifica o usuário sobre a falha na desconexão.
            event(new AuraConnectionFailed($this->auraConnection, $e->getMessage()));

            // Relança a exceção para que o Laravel possa lidar com as tentativas e falhas do Job.
            $this->fail($e);
        }
    }
}
