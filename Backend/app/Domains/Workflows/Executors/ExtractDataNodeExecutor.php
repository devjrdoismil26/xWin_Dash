<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;
use Symfony\Component\DomCrawler\Crawler;

class ExtractDataNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado com os dados extraídos
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a extração falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando ExtractDataNodeExecutor para node {$node->id}.");

        $config = $this->extractConfig($node->configuration ?? []);
        $this->validateConfig($config);

        // Construir payload para substituição de placeholders
        $payload = [
            'lead_id' => $lead->id,
            'lead_name' => $lead->name ?? '',
            'lead_email' => $lead->email ?? '',
            'lead_description' => $lead->description ?? '',
            ...$context->getData()
        ];

        if (!$this->sourceFieldExists($config['sourceField'], $payload)) {
            return $context->getData();
        }

        try {
            $extractedResult = $this->extractData($config, $payload);
            $context->setData($config['outputField'], $extractedResult);
            $context->setData('extraction_metadata', [
                'source_field' => $config['sourceField'],
                'extraction_method' => $config['extractionMethod'],
                'extracted_at' => now()->toIso8601String()
            ]);

            Log::info("Dados extraídos e adicionados ao contexto no campo '{$config['outputField']}'.");
        } catch (\Exception $e) {
            Log::error("Falha na extração de dados: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na extração de dados: " . $e->getMessage());
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
        $outputField = $config['output_field'] ?? 'extracted_data';
        $extractedData = $context->getData($outputField);

        // Se extração foi bem-sucedida, seguir para próximo nó
        if ($extractedData !== null) {
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
            'sourceField' => $config['source_field'] ?? null,
            'extractionMethod' => $config['extraction_method'] ?? null,
            'pattern' => $config['pattern'] ?? null,
            'outputField' => $config['output_field'] ?? 'extracted_data'
        ];
    }

    /**
     * Valida a configuração.
     */
    private function validateConfig(array $config): void
    {
        if (!$config['sourceField'] || !$config['extractionMethod'] || !$config['pattern']) {
            throw new WorkflowExecutionException("Nó de extração de dados inválido: 'source_field', 'extraction_method' e 'pattern' são obrigatórios.");
        }
    }

    /**
     * Verifica se o campo de origem existe.
     */
    private function sourceFieldExists(string $sourceField, array $payload): bool
    {
        if (!isset($payload[$sourceField])) {
            Log::warning("Campo de origem '{$sourceField}' não encontrado no payload para extração.");
            return false;
        }

        return true;
    }

    /**
     * Extrai dados usando o método especificado.
     */
    private function extractData(array $config, array $payload): mixed
    {
        $sourceData = $payload[$config['sourceField']];
        $extractionMethod = $config['extractionMethod'];
        $pattern = $config['pattern'];

        return match ($extractionMethod) {
            'regex' => $this->extractWithRegex($pattern, $sourceData),
            'css_selector' => $this->extractWithCssSelector($pattern, $sourceData),
            'xpath' => $this->extractWithXPath($pattern, $sourceData),
            default => throw new WorkflowExecutionException("Método de extração desconhecido: {$extractionMethod}.")
        };
    }

    /**
     * Extrai dados usando regex.
     */
    private function extractWithRegex(string $pattern, string $sourceData): mixed
    {
        preg_match($pattern, $sourceData, $matches);
        return $matches[1] ?? ($matches[0] ?? null);
    }

    /**
     * Extrai dados usando CSS selector.
     */
    private function extractWithCssSelector(string $pattern, string $sourceData): array
    {
        $crawler = new Crawler($sourceData);
        return $crawler->filter($pattern)->each(function (Crawler $node) {
            return $node->text();
        });
    }

    /**
     * Extrai dados usando XPath.
     */
    private function extractWithXPath(string $pattern, string $sourceData): array
    {
        $crawler = new Crawler($sourceData);
        return $crawler->filterXPath($pattern)->each(function (Crawler $node) {
            return $node->text();
        });
    }
}
