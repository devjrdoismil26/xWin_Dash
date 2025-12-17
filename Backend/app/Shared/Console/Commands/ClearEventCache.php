<?php

namespace App\Shared\Console\Commands;

use Illuminate\Console\Command;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Comando para limpar cache de eventos e validações cross-module
 */
class ClearEventCache extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cross-module:clear-cache 
                            {--type=all : Tipo de cache para limpar (all, events, validations, queue)}
                            {--force : Forçar limpeza sem confirmação}';

    /**
     * The console command description.
     */
    protected $description = 'Limpa cache de eventos e validações cross-module';

    private CrossModuleEventDispatcher $eventDispatcher;
    private CrossModuleValidationService $validationService;

    public function __construct(
        CrossModuleEventDispatcher $eventDispatcher,
        CrossModuleValidationService $validationService
    ) {
        parent::__construct();
        $this->eventDispatcher = $eventDispatcher;
        $this->validationService = $validationService;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $type = $this->option('type');
        $force = $this->option('force');

        $this->info('Iniciando limpeza de cache cross-module...');
        $this->info("Tipo: {$type}");
        $this->info("Forçar: " . ($force ? 'Sim' : 'Não'));

        try {
            // Confirmar ação se não forçada
            if (!$force && !$this->confirm('Tem certeza que deseja limpar o cache?')) {
                $this->info('Operação cancelada.');
                return 0;
            }

            $clearedItems = [];

            switch ($type) {
                case 'all':
                    $clearedItems = array_merge(
                        $clearedItems,
                        $this->clearEventCache(),
                        $this->clearValidationCache(),
                        $this->clearQueueCache(),
                        $this->clearGeneralCache()
                    );
                    break;

                case 'events':
                    $clearedItems = array_merge($clearedItems, $this->clearEventCache());
                    break;

                case 'validations':
                    $clearedItems = array_merge($clearedItems, $this->clearValidationCache());
                    break;

                case 'queue':
                    $clearedItems = array_merge($clearedItems, $this->clearQueueCache());
                    break;

                default:
                    $this->error("Tipo de cache inválido: {$type}");
                    $this->info("Tipos válidos: all, events, validations, queue");
                    return 1;
            }

            // Exibir resultados
            $this->info("\n=== Cache Limpo ===");
            foreach ($clearedItems as $item) {
                $this->line("✓ {$item}");
            }

            $this->info("\nLimpeza de cache concluída com sucesso!");
            return 0;

        } catch (\Throwable $exception) {
            $this->error('Erro durante limpeza de cache: ' . $exception->getMessage());
            
            Log::error('Error in ClearEventCache command', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return 1;
        }
    }

    /**
     * Limpa cache de eventos
     */
    private function clearEventCache(): array
    {
        $clearedItems = [];

        try {
            // Limpar cache de eventos processados
            $eventKeys = Cache::get('event_processed_*');
            if ($eventKeys) {
                Cache::forget('event_processed_*');
                $clearedItems[] = 'Cache de eventos processados';
            }

            // Limpar cache de contadores de tentativas
            $retryKeys = Cache::get('event_retry_count_*');
            if ($retryKeys) {
                Cache::forget('event_retry_count_*');
                $clearedItems[] = 'Cache de contadores de tentativas';
            }

            // Limpar cache de estatísticas de eventos
            Cache::forget('event_stats');
            $clearedItems[] = 'Cache de estatísticas de eventos';

            $this->line('Cache de eventos limpo.');

        } catch (\Throwable $exception) {
            $this->warn('Erro ao limpar cache de eventos: ' . $exception->getMessage());
        }

        return $clearedItems;
    }

    /**
     * Limpa cache de validações
     */
    private function clearValidationCache(): array
    {
        $clearedItems = [];

        try {
            // Limpar cache do serviço de validação
            $this->validationService->clearValidationCache();
            $clearedItems[] = 'Cache do serviço de validação';

            // Limpar cache de validações específicas
            $validationKeys = Cache::get('*_validation_*');
            if ($validationKeys) {
                Cache::forget('*_validation_*');
                $clearedItems[] = 'Cache de validações específicas';
            }

            // Limpar cache de estatísticas de validação
            Cache::forget('validation_stats');
            $clearedItems[] = 'Cache de estatísticas de validação';

            $this->line('Cache de validações limpo.');

        } catch (\Throwable $exception) {
            $this->warn('Erro ao limpar cache de validações: ' . $exception->getMessage());
        }

        return $clearedItems;
    }

    /**
     * Limpa cache da fila
     */
    private function clearQueueCache(): array
    {
        $clearedItems = [];

        try {
            // Limpar fila de eventos
            $this->eventDispatcher->clearQueue();
            $clearedItems[] = 'Fila de eventos';

            // Limpar cache de estatísticas da fila
            Cache::forget('queue_stats');
            $clearedItems[] = 'Cache de estatísticas da fila';

            $this->line('Cache da fila limpo.');

        } catch (\Throwable $exception) {
            $this->warn('Erro ao limpar cache da fila: ' . $exception->getMessage());
        }

        return $clearedItems;
    }

    /**
     * Limpa cache geral
     */
    private function clearGeneralCache(): array
    {
        $clearedItems = [];

        try {
            // Limpar cache de relacionamentos
            Cache::forget('user_relationships_*');
            $clearedItems[] = 'Cache de relacionamentos';

            // Limpar cache de integrações
            Cache::forget('module_integrations_*');
            $clearedItems[] = 'Cache de integrações';

            // Limpar cache de estatísticas gerais
            Cache::forget('cross_module_stats');
            $clearedItems[] = 'Cache de estatísticas gerais';

            $this->line('Cache geral limpo.');

        } catch (\Throwable $exception) {
            $this->warn('Erro ao limpar cache geral: ' . $exception->getMessage());
        }

        return $clearedItems;
    }
}