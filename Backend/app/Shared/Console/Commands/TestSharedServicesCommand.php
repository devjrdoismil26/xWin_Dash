<?php

namespace App\Shared\Console\Commands;

use App\Shared\Services\CacheService;
use App\Shared\Transactions\TransactionManager;
use Illuminate\Console\Command; // Exemplo de serviço compartilhado
use Illuminate\Support\Facades\Log; // Exemplo de serviço compartilhado

class TestSharedServicesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'shared:test-services';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tests the functionality of shared services.';

    protected CacheService $cacheService;

    protected TransactionManager $transactionManager;

    public function __construct(CacheService $cacheService, TransactionManager $transactionManager)
    {
        parent::__construct();
        $this->cacheService = $cacheService;
        $this->transactionManager = $transactionManager;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting tests for shared services...');

        $this->testCacheService();
        $this->testTransactionManager();

        $this->info('All shared services tests completed.');

        return Command::SUCCESS;
    }

    protected function testCacheService()
    {
        $this->comment('Testing CacheService...');
        $key = 'test_key';
        $value = 'test_value';
        $ttl = 60; // 1 minute

        $this->cacheService->put($key, $value, $ttl);
        $retrievedValue = $this->cacheService->get($key);

        if ($retrievedValue === $value) {
            $this->info('CacheService: Put and Get successful.');
        } else {
            $this->error('CacheService: Put or Get failed.');
            Log::error("CacheService test failed. Expected: {$value}, Got: {$retrievedValue}");
        }

        $this->cacheService->forget($key);
        $retrievedValueAfterForget = $this->cacheService->get($key);

        if ($retrievedValueAfterForget === null) {
            $this->info('CacheService: Forget successful.');
        } else {
            $this->error('CacheService: Forget failed.');
            Log::error("CacheService forget test failed. Value still present.");
        }
    }

    protected function testTransactionManager()
    {
        $this->comment('Testing TransactionManager...');

        // Test successful transaction
        try {
            $result = $this->transactionManager->transaction(function () {
                // Simular uma operação de DB
                Log::info("Inside successful transaction.");
                return true;
            });
            if ($result === true) {
                $this->info('TransactionManager: Successful transaction test passed.');
            } else {
                $this->error('TransactionManager: Successful transaction test failed.');
            }
        } catch (\Throwable $e) {
            $this->error('TransactionManager: Successful transaction test failed with exception: ' . $e->getMessage());
        }

        // Test failed transaction with rollback
        try {
            $this->transactionManager->transaction(function () {
                Log::info("Inside failing transaction.");
                throw new \Exception("Simulated transaction failure.");
            });
            $this->error('TransactionManager: Failing transaction test failed (no exception caught).');
        } catch (\Throwable $e) {
            $this->info('TransactionManager: Failing transaction test passed (exception caught and rollback implied).');
        }
    }
}
