<?php

namespace App\Console\Commands;

use App\Domains\AI\Services\AIVideoGenerationService;
use App\Domains\AI\Services\ChatService;
use App\Domains\AI\Infrastructure\Http\PyLabClient;
use Illuminate\Console\Command;

class TestAIServicesCommand extends Command
{
    protected $signature = 'ai:test 
                            {--service= : Testar serviço específico (video|chat|pylab)}
                            {--prompt= : Prompt para teste}';

    protected $description = 'Testar serviços de IA integrados com PyLab';

    public function handle(): int
    {
        $service = $this->option('service');
        $prompt = $this->option('prompt') ?? 'Um vídeo de um gato brincando no jardim';

        $this->info('🧪 TESTANDO SERVIÇOS DE IA');
        $this->newLine();

        try {
            switch ($service) {
                case 'video':
                    return $this->testVideoService($prompt);
                case 'chat':
                    return $this->testChatService($prompt);
                case 'pylab':
                    return $this->testPyLabClient();
                default:
                    return $this->testAllServices($prompt);
            }
        } catch (\Exception $e) {
            $this->error('❌ Erro: ' . $e->getMessage());
            return 1;
        }
    }

    private function testVideoService(string $prompt): int
    {
        $this->info('🎬 TESTANDO SERVIÇO DE GERAÇÃO DE VÍDEO');
        
        /** @var AIVideoGenerationService $service */
        $service = app(AIVideoGenerationService::class);

        // Testar validação
        $this->line('Testando validação de parâmetros...');
        $isValid = $service->validateGenerationParams(['prompt' => $prompt]);
        $this->info($isValid ? '✅ Validação passou' : '❌ Validação falhou');

        // Testar geração (modo simulação)
        $this->line('Testando geração de vídeo...');
        $result = $service->generateVideo($prompt, [
            'duration' => 10,
            'quality' => 'hd',
            'fps' => 24
        ]);

        $this->table(
            ['Campo', 'Valor'],
            [
                ['Sucesso', $result['success'] ? '✅ Sim' : '❌ Não'],
                ['Job ID', $result['job_id'] ?? 'N/A'],
                ['Status', $result['status'] ?? 'N/A'],
                ['Tempo Estimado', ($result['estimated_time'] ?? 0) . 's'],
                ['Fallback', isset($result['fallback']) ? '⚠️ Sim' : '✅ Não']
            ]
        );

        // Testar estatísticas
        $this->line('Obtendo estatísticas do serviço...');
        $stats = $service->getServiceStats();
        
        $this->table(
            ['Estatística', 'Valor'],
            [
                ['PyLab Disponível', $stats['pylab_available'] ? '✅ Sim' : '❌ Não'],
                ['Queue Habilitada', $stats['queue_enabled'] ? '✅ Sim' : '❌ Não'],
                ['Duração Máxima', $stats['max_duration'] . 's'],
                ['Qualidades Suportadas', implode(', ', $stats['supported_qualities'])]
            ]
        );

        return 0;
    }

    private function testChatService(string $message): int
    {
        $this->info('💬 TESTANDO SERVIÇO DE CHAT');
        
        /** @var ChatService $service */
        $service = app(ChatService::class);

        // Testar validação
        $this->line('Testando validação de mensagem...');
        $isValid = $service->validateMessage($message);
        $this->info($isValid ? '✅ Validação passou' : '❌ Validação falhou');

        // Iniciar conversa
        $this->line('Iniciando nova conversa...');
        $conversation = $service->startConversation([
            'user_id' => 1,
            'domain' => 'business',
            'language' => 'pt-BR'
        ]);

        $this->table(
            ['Campo', 'Valor'],
            [
                ['ID da Conversa', $conversation['conversation_id']],
                ['Status', $conversation['status']],
                ['Modelo', $conversation['settings']['model']],
                ['Temperatura', $conversation['settings']['temperature']],
                ['Idioma', $conversation['settings']['language']]
            ]
        );

        // Processar mensagem
        $this->line('Processando mensagem...');
        $response = $service->processMessage($message, [
            'conversation_id' => $conversation['conversation_id'],
            'user_id' => 1
        ]);

        $this->table(
            ['Campo', 'Valor'],
            [
                ['Sucesso', $response['success'] ? '✅ Sim' : '❌ Não'],
                ['Resposta', substr($response['response'], 0, 100) . '...'],
                ['Confiança', $response['confidence']],
                ['Modelo', $response['model'] ?? 'N/A'],
                ['É Fallback', isset($response['is_fallback']) ? '⚠️ Sim' : '✅ Não']
            ]
        );

        // Finalizar conversa
        $this->line('Finalizando conversa...');
        $endedConversation = $service->endConversation($conversation['conversation_id']);
        $this->info('✅ Conversa finalizada. Duração: ' . ($endedConversation['duration'] ?? 0) . 's');

        // Testar estatísticas
        $this->line('Obtendo estatísticas do serviço...');
        $stats = $service->getServiceStats();
        
        $this->table(
            ['Estatística', 'Valor'],
            [
                ['PyLab Disponível', $stats['pylab_available'] ? '✅ Sim' : '❌ Não'],
                ['Tamanho Máx. Mensagem', $stats['max_message_length']],
                ['Modelos Suportados', implode(', ', $stats['supported_models'])],
                ['Conversas Ativas', $stats['active_conversations']]
            ]
        );

        return 0;
    }

    private function testPyLabClient(): int
    {
        $this->info('🔬 TESTANDO CLIENTE PYLAB');
        
        /** @var PyLabClient $client */
        $client = app(PyLabClient::class);

        // Testar disponibilidade
        $this->line('Verificando disponibilidade do PyLab...');
        $available = $client->isAvailable();
        $this->info($available ? '✅ PyLab está disponível' : '❌ PyLab não está disponível');

        // Obter estatísticas
        $this->line('Obtendo estatísticas do PyLab...');
        $stats = $client->getStats();

        if (isset($stats['error'])) {
            $this->warn('⚠️ Erro ao obter estatísticas: ' . $stats['error']);
        } else {
            $this->table(
                ['Campo', 'Valor'],
                [
                    ['Disponível', $stats['available'] ?? 'N/A'],
                    ['GPU Disponível', isset($stats['system']['gpu_available']) ? ($stats['system']['gpu_available'] ? '✅ Sim' : '❌ Não') : 'N/A'],
                    ['Contagem GPU', $stats['system']['gpu_count'] ?? 'N/A'],
                    ['CPU Count', $stats['system']['cpu_count'] ?? 'N/A'],
                    ['Memória Total', isset($stats['system']['memory_total']) ? round($stats['system']['memory_total'] / 1024 / 1024 / 1024, 2) . ' GB' : 'N/A']
                ]
            );
        }

        return 0;
    }

    private function testAllServices(string $prompt): int
    {
        $this->info('🚀 TESTANDO TODOS OS SERVIÇOS');
        $this->newLine();

        $results = [];

        // Testar PyLab Client
        $this->line('1. Testando PyLab Client...');
        try {
            $this->testPyLabClient();
            $results['PyLab Client'] = '✅ OK';
        } catch (\Exception $e) {
            $results['PyLab Client'] = '❌ Erro: ' . $e->getMessage();
        }

        $this->newLine();

        // Testar Chat Service
        $this->line('2. Testando Chat Service...');
        try {
            $this->testChatService('Olá, como você pode me ajudar?');
            $results['Chat Service'] = '✅ OK';
        } catch (\Exception $e) {
            $results['Chat Service'] = '❌ Erro: ' . $e->getMessage();
        }

        $this->newLine();

        // Testar Video Service
        $this->line('3. Testando Video Service...');
        try {
            $this->testVideoService($prompt);
            $results['Video Service'] = '✅ OK';
        } catch (\Exception $e) {
            $results['Video Service'] = '❌ Erro: ' . $e->getMessage();
        }

        $this->newLine();
        $this->info('📊 RESUMO DOS TESTES:');
        
        foreach ($results as $service => $result) {
            $this->line("  {$service}: {$result}");
        }

        return 0;
    }
}