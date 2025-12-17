<?php

namespace App\Shared\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MonitorSystemHealthCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:monitor-health';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitors the overall health of the system and reports anomalies.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting system health monitoring...');

        $allHealthy = true;

        // 1. Check Database Connection
        if (!$this->checkDatabaseConnection()) {
            $this->error('Database connection failed!');
            $allHealthy = false;
        }

        // 2. Check Queue Health (simplificado)
        if (!$this->checkQueueHealth()) {
            $this->error('Queue is not processing jobs!');
            $allHealthy = false;
        }

        // 3. Check External Service (ex: Google.com)
        if (!$this->checkExternalService('https://www.google.com')) {
            $this->error('External service (Google) is unreachable!');
            $allHealthy = false;
        }

        if ($allHealthy) {
            $this->info('System is healthy.');
            Log::info('System health check: All systems operational.');
            return Command::SUCCESS;
        } else {
            $this->error('System health check detected anomalies. Check logs for details.');
            Log::critical('System health check: ANOMALIES DETECTED.');
            // Aqui você pode adicionar lógica para enviar notificações (email, Slack, etc.)
            return Command::FAILURE;
        }
    }

    protected function checkDatabaseConnection(): bool
    {
        try {
            DB::connection()->getPdo();
            $this->line('Database: OK');
            return true;
        } catch (\Exception $e) {
            Log::error('Database connection error: ' . $e->getMessage());
            return false;
        }
    }

    protected function checkQueueHealth(): bool
    {
        // Isso é uma verificação muito básica. Em um ambiente real, você verificaria
        // o número de jobs pendentes, workers ativos, etc.
        // Por exemplo, verificar se há jobs na fila 'default'
        try {
            $pendingJobs = DB::table(config('queue.connections.database.table', 'jobs'))->count();
            if ($pendingJobs > 100) { // Limite arbitrário
                Log::warning("High number of pending jobs: {$pendingJobs}");
                $this->line('Queue: WARNING (High pending jobs)');
                return false;
            }
            $this->line('Queue: OK');
            return true;
        } catch (\Exception $e) {
            Log::error('Queue health check error: ' . $e->getMessage());
            return false;
        }
    }

    protected function checkExternalService(string $url): bool
    {
        try {
            $response = Http::timeout(5)->get($url);
            if ($response->successful()) {
                $this->line("External Service ({$url}): OK");
                return true;
            } else {
                Log::error("External service {$url} returned non-successful status: {$response->status()}");
                return false;
            }
        } catch (\Exception $e) {
            Log::error("External service {$url} connection error: " . $e->getMessage());
            return false;
        }
    }
}
