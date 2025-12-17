<?php

namespace App\Shared\Console\Commands;

use Illuminate\Console\Command;
use App\Shared\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

/**
 * Comando para processar fila de eventos cross-module
 */
class ProcessEventQueue extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cross-module:process-queue 
                            {--limit=100 : Número máximo de eventos para processar}
                            {--timeout=300 : Timeout em segundos para processamento}
                            {--force : Forçar processamento mesmo com eventos antigos}';

    /**
     * The console command description.
     */
    protected $description = 'Processa a fila de eventos cross-module pendentes';

    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(CrossModuleEventDispatcher $eventDispatcher)
    {
        parent::__construct();
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $limit = (int) $this->option('limit');
        $timeout = (int) $this->option('timeout');
        $force = $this->option('force');

        $this->info('Iniciando processamento da fila de eventos cross-module...');
        $this->info("Limite: {$limit} eventos");
        $this->info("Timeout: {$timeout} segundos");
        $this->info("Forçar: " . ($force ? 'Sim' : 'Não'));

        $startTime = time();
        $processedCount = 0;
        $errorCount = 0;

        try {
            // Obter eventos pendentes
            $pendingEvents = $this->eventDispatcher->getPendingEvents();
            
            if (empty($pendingEvents)) {
                $this->info('Nenhum evento pendente encontrado.');
                return 0;
            }

            $this->info("Encontrados " . count($pendingEvents) . " eventos pendentes.");

            // Processar eventos
            foreach (array_slice($pendingEvents, 0, $limit) as $event) {
                try {
                    // Verificar timeout
                    if (time() - $startTime > $timeout) {
                        $this->warn('Timeout atingido. Parando processamento.');
                        break;
                    }

                    // Verificar se evento não é muito antigo (a menos que force seja usado)
                    if (!$force && $event->getAgeInMinutes() > 60) {
                        $this->warn("Evento {$event->eventId} muito antigo, pulando...");
                        continue;
                    }

                    // Processar evento
                    $this->eventDispatcher->processEvent($event);
                    $processedCount++;

                    $this->line("Processado evento {$event->eventId} ({$event->getEventType()})");

                } catch (\Throwable $exception) {
                    $errorCount++;
                    $this->error("Erro ao processar evento {$event->eventId}: " . $exception->getMessage());
                    
                    Log::error('Event processing error in command', [
                        'event_id' => $event->eventId,
                        'event_type' => $event->getEventType(),
                        'error' => $exception->getMessage(),
                        'trace' => $exception->getTraceAsString()
                    ]);
                }
            }

            // Exibir estatísticas
            $this->info("\n=== Estatísticas do Processamento ===");
            $this->info("Eventos processados: {$processedCount}");
            $this->info("Erros: {$errorCount}");
            $this->info("Tempo total: " . (time() - $startTime) . " segundos");

            // Exibir estatísticas do dispatcher
            $stats = $this->eventDispatcher->getStats();
            $this->info("\n=== Estatísticas do Dispatcher ===");
            $this->info("Tamanho da fila: {$stats['queue_size']}");
            $this->info("Eventos em processamento: {$stats['processing_events']}");
            $this->info("Máximo de tentativas: {$stats['max_retries']}");
            $this->info("Delay entre tentativas: {$stats['retry_delay']} segundos");

            if ($errorCount > 0) {
                $this->warn("Processamento concluído com {$errorCount} erros.");
                return 1;
            }

            $this->info('Processamento concluído com sucesso!');
            return 0;

        } catch (\Throwable $exception) {
            $this->error('Erro fatal durante processamento: ' . $exception->getMessage());
            
            Log::error('Fatal error in ProcessEventQueue command', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return 1;
        }
    }
}