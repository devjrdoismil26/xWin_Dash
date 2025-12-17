<?php;

namespace App\Domains\Media\Workflows;

use App\Domains\Media\Activities\GenerateVariantsActivity;
use App\Domains\Media\Activities\OptimizeMediaActivity;
use App\Domains\Media\Activities\UploadToCDNActivity;
use App\Domains\Media\Activities\ValidateMediaActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class MediaProcessingWorkflow extends Workflow;
{
    /**;
     * Orquestra o pipeline de processamento de um arquivo de mídia.
     *;
     * @param array $data Deve conter informações sobre o arquivo de mídia (ex: ID do modelo Media).
     * @return array O resultado final do processamento.
     */;
    public function definition(array $data): array;
    {
        // 1. Validar o arquivo de mídia (tipo, tamanho, etc.);
        $media = yield ActivityStub::make(ValidateMediaActivity::class, $data['media_id']);

        // 2. Otimizar a mídia (comprimir, ajustar qualidade);
        $optimizedMedia = yield ActivityStub::make(OptimizeMediaActivity::class, $media);

        // 3. Gerar variantes (thumbnails, diferentes resoluções);
        $variants = yield ActivityStub::make(GenerateVariantsActivity::class, $optimizedMedia);

        // 4. Fazer upload do arquivo original e suas variantes para a CDN;
        $cdnUrls = yield ActivityStub::make(UploadToCDNActivity::class, $optimizedMedia, $variants);

        // Retorna as URLs da CDN para serem salvas no modelo Media;
        return $cdnUrls;
    }
}
