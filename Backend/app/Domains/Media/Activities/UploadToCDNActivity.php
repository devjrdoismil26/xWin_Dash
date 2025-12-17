<?php

namespace App\Domains\Media\Activities;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UploadToCDNActivity
{
    /**
     * Execute the activity.
     *
     * @param array $mediaData dados do arquivo de mídia (ex: 'path', 'file_name', 'variants')
     *
     * @return array dados atualizados do arquivo de mídia com URLs da CDN
     *
     * @throws \Exception se o upload para a CDN falhar
     */
    public function execute(array $mediaData): array
    {
        Log::info("Executando UploadToCDNActivity para: " . ($mediaData['file_name'] ?? 'arquivo desconhecido'));

        $cdnUrls = [];

        // Upload do arquivo original
        $originalPath = $mediaData['path'];
        $cdnOriginalUrl = $this->uploadFileToCDN($originalPath, $mediaData['file_name']);
        $cdnUrls['original'] = $cdnOriginalUrl;

        // Upload das variantes
        if (isset($mediaData['variants']) && is_array($mediaData['variants'])) {
            foreach ($mediaData['variants'] as $variantName => $variantPath) {
                $cdnVariantUrl = $this->uploadFileToCDN($variantPath, "{$variantName}_" . $mediaData['file_name']);
                $cdnUrls[$variantName] = $cdnVariantUrl;
            }
        }

        $mediaData['cdn_urls'] = $cdnUrls;
        Log::info("Upload para CDN concluído para: " . ($mediaData['file_name'] ?? 'arquivo desconhecido'));
        return $mediaData;
    }

    /**
     * Simula o upload de um arquivo para a CDN.
     * 
     * IMPLEMENTAÇÃO MOCKADA: Esta implementação simula um serviço de CDN real.
     * Em produção, substituir por integração real com AWS CloudFront, Cloudflare, etc.
     *
     * @param string $filePath caminho local do arquivo
     * @param string $fileName nome do arquivo na CDN
     *
     * @return string URL do arquivo na CDN
     *
     * @throws \Exception se o upload falhar
     */
    protected function uploadFileToCDN(string $filePath, string $fileName): string
    {
        // Verificar se o arquivo existe localmente
        if (!Storage::disk('public')->exists($filePath)) {
            throw new \Exception("Arquivo não encontrado para upload na CDN: {$filePath}");
        }

        // Configuração da CDN mockada
        $cdnBaseUrl = env('CDN_BASE_URL', config('app.url') . '/cdn');
        $cdnProvider = env('CDN_PROVIDER', 'mock'); // mock, cloudfront, cloudflare, s3
        
        // Gerar caminho único na CDN (incluindo timestamp para cache busting)
        $timestamp = time();
        $hash = substr(md5($filePath . $timestamp), 0, 8);
        $cdnPath = sprintf('media/%s/%s_%s', date('Y/m'), $hash, $fileName);
        
        // Simular upload baseado no provider
        switch ($cdnProvider) {
            case 'cloudfront':
                // Em produção: usar AWS SDK
                // $this->uploadToCloudFront($filePath, $cdnPath);
                Log::info("CDN Mock: Simulando upload para AWS CloudFront", [
                    'local_path' => $filePath,
                    'cdn_path' => $cdnPath
                ]);
                break;
                
            case 'cloudflare':
                // Em produção: usar Cloudflare API
                // $this->uploadToCloudflare($filePath, $cdnPath);
                Log::info("CDN Mock: Simulando upload para Cloudflare", [
                    'local_path' => $filePath,
                    'cdn_path' => $cdnPath
                ]);
                break;
                
            case 's3':
                // Em produção: usar AWS S3 SDK
                // Storage::disk('s3')->put($cdnPath, Storage::disk('public')->get($filePath));
                Log::info("CDN Mock: Simulando upload para AWS S3", [
                    'local_path' => $filePath,
                    'cdn_path' => $cdnPath
                ]);
                break;
                
            default: // 'mock'
                // Simulação completa: apenas log e retorno de URL mockada
                Log::info("CDN Mock: Simulando upload de arquivo", [
                    'local_path' => $filePath,
                    'cdn_path' => $cdnPath,
                    'file_size' => Storage::disk('public')->size($filePath),
                    'mime_type' => Storage::disk('public')->mimeType($filePath)
                ]);
                break;
        }
        
        // Retornar URL completa da CDN
        $cdnUrl = rtrim($cdnBaseUrl, '/') . '/' . ltrim($cdnPath, '/');
        
        Log::info("Upload para CDN concluído (mockado)", [
            'cdn_url' => $cdnUrl,
            'provider' => $cdnProvider
        ]);
        
        return $cdnUrl;
    }
}
