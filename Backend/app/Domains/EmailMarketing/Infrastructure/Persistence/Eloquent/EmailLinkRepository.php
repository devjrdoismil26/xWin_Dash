<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailLink;
use App\Domains\EmailMarketing\Domain\EmailLinkRepositoryInterface;

class EmailLinkRepository implements EmailLinkRepositoryInterface
{
    protected EmailLinkModel $model;

    public function __construct(EmailLinkModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo link de e-mail.
     *
     * @param array $data
     *
     * @return EmailLink
     */
    public function create(array $data): EmailLink
    {
        $linkModel = $this->model->create($data);
        return EmailLink::fromArray($linkModel->toArray());
    }

    /**
     * Encontra um link de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailLink|null
     */
    public function find(int $id): ?EmailLink
    {
        $linkModel = $this->model->find($id);
        return $linkModel ? EmailLink::fromArray($linkModel->toArray()) : null;
    }

    /**
     * Encontra um link de e-mail pela URL rastreada.
     *
     * @param string $trackedUrl
     *
     * @return EmailLink|null
     */
    public function findByTrackedUrl(string $trackedUrl): ?EmailLink
    {
        $linkModel = $this->model->where('tracked_url', $trackedUrl)->first();
        return $linkModel ? EmailLink::fromArray($linkModel->toArray()) : null;
    }

    /**
     * Incrementa o contador de cliques de um link.
     *
     * @param int $id
     *
     * @return bool
     */
    public function incrementClicks(int $id): bool
    {
        $linkModel = $this->model->find($id);
        if ($linkModel) {
            $linkModel->increment('clicks');
            return true;
        }
        return false;
    }
}
