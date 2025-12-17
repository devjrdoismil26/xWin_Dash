<?php

namespace App\Shared\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CleanupOldSagasCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sagas:cleanup-old';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleans up old or completed sagas from the database.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting old sagas cleanup...');

        $thresholdDays = 30; // Sagas mais antigas que 30 dias

        try {
            $deletedCount = DB::table('sagas') // Supondo uma tabela 'sagas' para armazenar o estado das sagas
                                ->where('status', 'completed')
                                ->orWhere('status', 'failed')
                                ->where('updated_at', '<=', now()->subDays($thresholdDays))
                                ->delete();

            $this->info("{$deletedCount} old sagas cleaned up successfully.");
            Log::info("CleanupOldSagasCommand: {$deletedCount} sagas antigas removidas.");

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error during sagas cleanup: ' . $e->getMessage());
            Log::error("CleanupOldSagasCommand failed: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
