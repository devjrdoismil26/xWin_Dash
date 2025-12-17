<?php

namespace App\Domains\Universe\Console\Commands;

use App\Domains\Universe\Models\UniverseAnalytics;
use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Models\UniverseSnapshot; // Supondo que o model exista
use Illuminate\Console\Command; // Supondo que o model exista
use Illuminate\Support\Facades\Log;

// Supondo que o model exista

class CleanupUniverseDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'universe:cleanup-data {--snapshots=30 : Number of days to keep snapshots}
                                                {--analytics=90 : Number of days to keep analytics data}
                                                {--inactive-instances=180 : Number of days after which inactive instances are deleted}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleans up old or unnecessary data from the Universe module.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $this->info('Starting Universe data cleanup...');

        $snapshotDays = (int) $this->option('snapshots');
        $analyticsDays = (int) $this->option('analytics');
        $inactiveInstanceDays = (int) $this->option('inactive-instances');

        $this->cleanupSnapshots($snapshotDays);
        $this->cleanupAnalytics($analyticsDays);
        $this->cleanupInactiveInstances($inactiveInstanceDays);

        $this->info('Universe data cleanup completed.');

        return Command::SUCCESS;
    }

    protected function cleanupSnapshots(int $days): void
    {
        $threshold = now()->subDays($days);
        $deletedCount = UniverseSnapshot::where('created_at', '<=', $threshold)->delete();
        $this->info("Cleaned up {$deletedCount} Universe snapshots older than {$days} days.");
        Log::info("Universe data cleanup: {$deletedCount} snapshots removed.");
    }

    protected function cleanupAnalytics(int $days): void
    {
        $threshold = now()->subDays($days);
        $deletedCount = UniverseAnalytics::where('timestamp', '<=', $threshold)->delete();
        $this->info("Cleaned up {$deletedCount} Universe analytics data older than {$days} days.");
        Log::info("Universe data cleanup: {$deletedCount} analytics records removed.");
    }

    protected function cleanupInactiveInstances(int $days): void
    {
        $threshold = now()->subDays($days);
        // Supondo que 'updated_at' ou um campo 'last_activity_at' pode indicar inatividade
        $deletedCount = UniverseInstance::where('status', 'inactive')
                                        ->orWhere('status', 'suspended')
                                        ->where('updated_at', '<=', $threshold)
                                        ->delete();
        $this->info("Cleaned up {$deletedCount} inactive Universe instances older than {$days} days.");
        Log::info("Universe data cleanup: {$deletedCount} inactive instances removed.");
    }
}
