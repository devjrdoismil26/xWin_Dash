<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailLog;
use App\Domains\EmailMarketing\Contracts\EmailLogRepositoryInterface;

class EmailLogRepository implements EmailLogRepositoryInterface
{
    protected EmailLogModel $model;

    public function __construct(EmailLogModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo log de e-mail.
     *
     * @param array $data
     *
     * @return EmailLog
     */
    public function create(array $data): EmailLog
    {
        $logModel = $this->model->create($data);
        return EmailLog::fromArray($logModel->toArray());
    }

    /**
     * Encontra um log de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailLog|null
     */
    public function find(int $id): ?EmailLog
    {
        $logModel = $this->model->find($id);
        return $logModel ? EmailLog::fromArray($logModel->toArray()) : null;
    }

    /**
     * Retorna logs de e-mail para uma campanha específica.
     *
     * @param int $campaignId
     *
     * @return array<EmailLog>
     */
    public function getByCampaignId(int $campaignId): array
    {
        return $this->model->where('campaign_id', $campaignId)
                           ->get()
                           ->map(function ($item) {
                               return EmailLog::fromArray($item->toArray());
                           })->toArray();
    }

    /**
     * Atualiza o status de um log de e-mail.
     *
     * @param int         $id
     * @param string      $status
     * @param string|null $errorMessage
     *
     * @return EmailLog
     */
    public function updateStatus(int $id, string $status, ?string $errorMessage = null): EmailLog
    {
        $logModel = $this->model->find($id);
        if (!$logModel) {
            throw new \RuntimeException("Email Log not found.");
        }
        $logModel->status = $status;
        $logModel->error_message = $errorMessage;
        $logModel->save();
        return EmailLog::fromArray($logModel->toArray());
    }
}
