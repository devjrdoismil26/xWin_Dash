<?php

namespace App\Domains\Universe\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TestPyLabCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'universe:test-pylab';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tests the integration with the PyLab environment.';

    protected string $pylabBaseUrl;

    public function __construct()
    {
        parent::__construct();
        $this->pylabBaseUrl = config('services.pylab.base_url'); // Supondo uma configuração em config/services.php
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Testing PyLab integration...');

        try {
            $response = Http::timeout(10)->get("{$this->pylabBaseUrl}/health"); // Supondo um endpoint de saúde

            if ($response->successful()) {
                $this->info('PyLab connection successful!');
                Log::info('PyLab integration test: Connection successful.');

                // Opcional: Testar a execução de um script simples
                $scriptResult = $this->runTestScript();
                if ($scriptResult['success']) {
                    $output = $scriptResult['output'] ?? '';
                    $this->info('PyLab script execution successful: ' . $output);
                    Log::info('PyLab integration test: Script execution successful.');
                } else {
                    $error = $scriptResult['error'] ?? 'Unknown error';
                    $this->error('PyLab script execution failed: ' . $error);
                    Log::error('PyLab integration test: Script execution failed.');
                    return Command::FAILURE;
                }

                return Command::SUCCESS;
            } else {
                $this->error('PyLab connection failed. Status: ' . $response->status() . ', Response: ' . $response->body());
                Log::error('PyLab integration test: Connection failed.');
                return Command::FAILURE;
            }
        } catch (\Exception $e) {
            $this->error('PyLab connection error: ' . $e->getMessage());
            Log::error('PyLab integration test: Connection error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    /**
     * Simula a execução de um script simples no PyLab.
     *
     * @return array{success: bool, output?: string, error?: string}
     */
    protected function runTestScript(): array
    {
        Log::info('Executando script de teste no PyLab.');
        try {
            $response = Http::timeout(30)->post("{$this->pylabBaseUrl}/execute", [
                'script' => 'print("Hello from PyLab!")',
            ]);

            if ($response->successful()) {
                return ['success' => true, 'output' => $response->json()['output'] ?? ''];
            } else {
                return ['success' => false, 'error' => $response->body()];
            }
        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
