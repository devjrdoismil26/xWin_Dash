<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Media\Services\MediaService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class MediaProcessingNodeExecutor implements WorkflowNodeExecutor
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado com os resultados do processamento
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o processamento falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando MediaProcessingNodeExecutor para node {$node->id}.");

        $config = $this->extractConfig($node->configuration ?? []);
        $this->validateConfig($config);

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            $finalMediaId = $this->replacePlaceholder($config['mediaId'], $payload);
            $media = $this->getMediaById($finalMediaId);
            $processingResult = $this->processMedia($config, $media, $finalMediaId);

            // Adicionar resultado ao contexto
            $context->setData('media_processing_result', $processingResult);
            $context->setData('media_processing_metadata', [
                'media_id' => $finalMediaId,
                'action' => $config['action'],
                'processed_at' => now()->toIso8601String()
            ]);

            Log::info("Processamento de mídia ID: {$finalMediaId} concluído com sucesso.");
        } catch (\Exception $e) {
            Log::error("Falha ao processar mídia ID: {$config['mediaId']}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha no processamento de mídia: " . $e->getMessage());
        }

        return $context->getData();
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $result = $context->getData('media_processing_result');

        // Se processamento foi bem-sucedido, seguir para próximo nó
        if ($result !== null) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Extrai a configuração do nó.
     */
    private function extractConfig(array $config): array
    {
        return [
            'mediaId' => $config['media_id'] ?? null,
            'action' => $config['action'] ?? null,
            'parameters' => $config['parameters'] ?? []
        ];
    }

    /**
     * Valida a configuração.
     */
    private function validateConfig(array $config): void
    {
        if (!$config['mediaId'] || !$config['action']) {
            throw new WorkflowExecutionException("Nó de processamento de mídia inválido: 'media_id' e 'action' são obrigatórios.");
        }
    }

    /**
     * Obtém a mídia pelo ID.
     */
    private function getMediaById(string $mediaId): mixed
    {
        $media = $this->mediaService->getMediaById($mediaId);
        if (!$media) {
            throw new WorkflowExecutionException("Mídia ID: {$mediaId} não encontrada para processamento.");
        }

        return $media;
    }

    /**
     * Processa a mídia com a ação especificada.
     */
    private function processMedia(array $config, mixed $media, string $mediaId): array
    {
        $action = $config['action'];
        $parameters = $config['parameters'];

        return match ($action) {
            'resize' => $this->resizeMedia($media, $parameters, $mediaId),
            'compress' => $this->compressMedia($media, $parameters, $mediaId),
            'convert' => $this->convertMedia($media, $parameters, $mediaId),
            default => throw new WorkflowExecutionException("Ação de processamento de mídia desconhecida: {$action}.")
        };
    }

    /**
     * Redimensiona a mídia.
     */
    private function resizeMedia(mixed $media, array $parameters, string $mediaId): array
    {
        // $processingResult = $this->mediaService->resizeMedia($media, $parameters['width'], $parameters['height']);
        Log::info("Simulando redimensionamento de mídia ID: {$mediaId}.");
        return [];
    }

    /**
     * Comprime a mídia.
     */
    private function compressMedia(mixed $media, array $parameters, string $mediaId): array
    {
        // $processingResult = $this->mediaService->compressMedia($media, $parameters['quality']);
        Log::info("Simulando compressão de mídia ID: {$mediaId}.");
        return [];
    }

    /**
     * Converte a mídia.
     */
    private function convertMedia(mixed $media, array $parameters, string $mediaId): array
    {
        // $processingResult = $this->mediaService->convertMedia($media, $parameters['format']);
        Log::info("Simulando conversão de mídia ID: {$mediaId}.");
        return [];
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ media_id }}")
     * @param array       $payload o payload do workflow
     *
     * @return string|null o texto com placeholder substituído ou null
     */
    protected function replacePlaceholder(?string $text, array $payload): ?string
    {
        if ($text === null) {
            return null;
        }
        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
            $key = $matches[1];
            return $payload[$key] ?? $matches[0]; // Retorna o placeholder original se a chave não existir
        }, $text);
    }
}
