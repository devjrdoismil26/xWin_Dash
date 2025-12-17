<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Media\Services\MediaService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class UploadMediaNodeExecutor implements WorkflowNodeExecutor
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
     * @return array<string, mixed> o payload atualizado com os dados da mídia uploaded
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o upload falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando UploadMediaNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $filePath = $config['file_path'] ?? null; // Caminho temporário ou URL do arquivo
        $fileName = $config['file_name'] ?? null;
        $userId = $config['user_id'] ?? ($lead->user_id ?? 1); // Pega do lead ou default
        $folderId = $config['folder_id'] ?? null;
        $outputField = $config['output_field'] ?? 'uploaded_media';

        if (!$filePath || !$fileName) {
            throw new WorkflowExecutionException("Nó de upload de mídia inválido: 'file_path' e 'file_name' são obrigatórios.");
        }

        try {
            $uploadedFile = $this->prepareFileForUpload($filePath, $fileName, $config);

            $mediaData = [
                'name' => $fileName,
                'folder_id' => $folderId,
                'description' => $config['description'] ?? '',
                'tags' => $config['tags'] ?? [],
            ];

            $media = $this->mediaService->createMedia($userId, $mediaData, $uploadedFile);

            $mediaData = [
                'id' => $media->id,
                'name' => $media->name,
                'path' => $media->path,
                'url' => $media->url ?? Storage::url($media->path),
                'size' => $media->size,
                'mime_type' => $media->mime_type ?? 'application/octet-stream',
                'created_at' => $media->created_at ?? now(),
            ];

            $context->setData($outputField, $mediaData);

            Log::info("Mídia uploaded com sucesso e adicionada ao contexto no campo '{$outputField}'.");
        } catch (\Exception $e) {
            Log::error("Falha ao fazer upload de mídia: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha no upload de mídia: " . $e->getMessage());
        }

        return $context->getData();
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context, including the result of the current node's execution
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        return $node->next_node_id ? (string) $node->next_node_id : null;
    }

    /**
     * Prepara o arquivo para upload baseado no tipo de fonte.
     *
     * @param array<string, mixed> $config
     */
    protected function prepareFileForUpload(string $filePath, string $fileName, array $config): UploadedFile
    {
        $sourceType = $config['source_type'] ?? 'local';

        switch ($sourceType) {
            case 'url':
                return $this->downloadFileFromUrl($filePath, $fileName);

            case 'base64':
                return $this->createFileFromBase64($filePath, $fileName);

            case 'storage':
                return $this->createFileFromStorage($filePath, $fileName);

            case 'local':
            default:
                return $this->createFileFromLocalPath($filePath, $fileName);
        }
    }

    /**
     * Baixa arquivo de uma URL.
     */
    protected function downloadFileFromUrl(string $url, string $fileName): UploadedFile
    {
        Log::info("Baixando arquivo de URL: {$url}");

        $response = Http::timeout(30)->get($url);

        if (!$response->successful()) {
            throw new WorkflowExecutionException("Falha ao baixar arquivo da URL: {$url}");
        }

        $tempPath = tempnam(sys_get_temp_dir(), 'workflow_upload_');
        file_put_contents($tempPath, $response->body());

        $mimeType = $response->header('content-type') ?? 'application/octet-stream';

        return new UploadedFile($tempPath, $fileName, $mimeType, null, true);
    }

    /**
     * Cria arquivo a partir de string base64.
     */
    protected function createFileFromBase64(string $base64Data, string $fileName): UploadedFile
    {
        Log::info("Criando arquivo a partir de base64");

        // Remove prefixo data: se existir
        if (strpos($base64Data, 'data:') === 0) {
            $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
        }

        $fileContent = base64_decode($base64Data);
        if ($fileContent === false) {
            throw new WorkflowExecutionException("Dados base64 inválidos");
        }

        $tempPath = tempnam(sys_get_temp_dir(), 'workflow_upload_');
        file_put_contents($tempPath, $fileContent);

        $mimeType = mime_content_type($tempPath) ?: 'application/octet-stream';

        return new UploadedFile($tempPath, $fileName, $mimeType, null, true);
    }

    /**
     * Cria arquivo a partir do storage do Laravel.
     */
    protected function createFileFromStorage(string $storagePath, string $fileName): UploadedFile
    {
        Log::info("Criando arquivo a partir do storage: {$storagePath}");

        if (!Storage::exists($storagePath)) {
            throw new WorkflowExecutionException("Arquivo não encontrado no storage: {$storagePath}");
        }

        $fullPath = Storage::path($storagePath);
        $mimeType = mime_content_type($fullPath) ?: 'application/octet-stream';

        return new UploadedFile($fullPath, $fileName, $mimeType, null, true);
    }

    /**
     * Cria arquivo a partir de caminho local.
     */
    protected function createFileFromLocalPath(string $localPath, string $fileName): UploadedFile
    {
        Log::info("Criando arquivo a partir de caminho local: {$localPath}");

        // Tentar vários caminhos possíveis
        $possiblePaths = [
            $localPath,
            storage_path('app/public/' . $localPath),
            storage_path('app/' . $localPath),
            public_path($localPath),
        ];

        $fullPath = null;
        foreach ($possiblePaths as $path) {
            if (file_exists($path)) {
                $fullPath = $path;
                break;
            }
        }

        if (!$fullPath) {
            throw new WorkflowExecutionException("Arquivo não encontrado em nenhum dos caminhos possíveis: " . implode(', ', $possiblePaths));
        }

        $mimeType = mime_content_type($fullPath) ?: 'application/octet-stream';

        return new UploadedFile($fullPath, $fileName, $mimeType, null, true);
    }
}
