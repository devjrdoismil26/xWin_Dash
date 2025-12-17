<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\EmailMarketing\Models\EmailSegment;
use Illuminate\Support\Collection;
use Workflow\Activity;

class GetSegmentSubscribersActivity extends Activity
{
    /**
     * Obtém os assinantes de um segmento de e-mail.
     *
     * @param string $segmentId o ID do segmento de e-mail
     *
     * @return Collection uma coleção de modelos EmailSubscriber
     *
     * @throws \Exception se o segmento não for encontrado
     */
    public function execute(string $segmentId): Collection
    {
        $segment = EmailSegment::find($segmentId);

        if (!$segment) {
            throw new \Exception("Segmento de e-mail com ID {$segmentId} não encontrado.");
        }

        return $segment->getMatchingSubscribers();
    }
}
