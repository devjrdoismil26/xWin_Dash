<?php

namespace App\Domains\Media\Activities;

use App\Domains\Media\Models\Media;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Illuminate\Support\Facades\Storage;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Workflow\Activity;

class OptimizeMediaActivity extends Activity
{
    /**
     * Otimiza o arquivo de mídia original.
     *
     * @param Media $media o modelo de mídia
     *
     * @return Media o modelo de mídia após a otimização
     */
    public function execute(Media $media): Media
    {
        if (!$media->isImage()) {
            LoggerFacade::info('Otimização pulada: mídia não é uma imagem.', ['media_id' => $media->id]);
            return $media;
        }

        LoggerFacade::info('Otimizando mídia', ['media_id' => $media->id, 'path' => $media->getPath()]);

        $optimizerChain = OptimizerChainFactory::create();
        $optimizerChain->optimize($media->getPath());

        // Atualiza o tamanho do arquivo no banco de dados
        $media->size = Storage::disk($media->disk)->size($media->getPath());
        $media->save();

        LoggerFacade::info('Mídia otimizada com sucesso', ['media_id' => $media->id, 'new_size' => $media->size]);

        return $media;
    }
}
