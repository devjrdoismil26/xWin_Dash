<?php

namespace App\Domains\EmailMarketing\Domain;

use App\Domains\EmailMarketing\Domain\ValueObjects\EmailCampaignStatus;
use App\Domains\EmailMarketing\Domain\ValueObjects\EmailCampaignType;
use App\Domains\EmailMarketing\Domain\ValueObjects\EmailCampaignPriority;
use App\Domains\EmailMarketing\Domain\ValueObjects\EmailCampaignMetrics;
use DateTime;
use InvalidArgumentException;

/**
 * Domain Model para Campanha de Email
 *
 * Representa uma campanha de email marketing com todas suas propriedades
 * e comportamentos de negócio.
 */
class EmailCampaign
{
    public ?int $id;
    public string $name;
    public string $subject;
    public string $content;
    public EmailCampaignType $type;
    public EmailCampaignPriority $priority;
    public int $emailListId;
    public int $userId;
    public EmailCampaignStatus $status;
    public ?DateTime $scheduledAt;
    public ?DateTime $sentAt;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;
    public ?string $fromName;
    public ?string $fromEmail;
    public ?string $replyToEmail;
    public ?array $segments;
    public ?array $tags;
    public ?array $customFields;
    public EmailCampaignMetrics $metrics;
    public ?string $templateId;
    public ?array $attachments;
    public ?array $trackingSettings;

    public function __construct(
        string $name,
        string $subject,
        string $content,
        int $emailListId,
        int $userId,
        EmailCampaignType $type = null,
        EmailCampaignPriority $priority = null,
        EmailCampaignStatus $status = null,
        ?DateTime $scheduledAt = null,
        ?DateTime $sentAt = null,
        ?string $fromName = null,
        ?string $fromEmail = null,
        ?string $replyToEmail = null,
        ?array $segments = null,
        ?array $tags = null,
        ?array $customFields = null,
        ?string $templateId = null,
        ?array $attachments = null,
        ?array $trackingSettings = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
        ?EmailCampaignMetrics $metrics = null
    ) {
        $this->validateName($name);
        $this->validateSubject($subject);
        $this->validateContent($content);
        $this->validateEmailListId($emailListId);
        $this->validateUserId($userId);
        $this->validateFromEmail($fromEmail);
        $this->validateReplyToEmail($replyToEmail);

        $this->id = $id;
        $this->name = $name;
        $this->subject = $subject;
        $this->content = $content;
        $this->type = $type ?? EmailCampaignType::regular();
        $this->priority = $priority ?? EmailCampaignPriority::normal();
        $this->status = $status ?? EmailCampaignStatus::draft();
        $this->emailListId = $emailListId;
        $this->userId = $userId;
        $this->scheduledAt = $scheduledAt;
        $this->sentAt = $sentAt;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->fromName = $fromName;
        $this->fromEmail = $fromEmail;
        $this->replyToEmail = $replyToEmail;
        $this->segments = $segments;
        $this->tags = $tags;
        $this->customFields = $customFields;
        $this->templateId = $templateId;
        $this->attachments = $attachments;
        $this->trackingSettings = $trackingSettings;
        $this->metrics = $metrics ?? EmailCampaignMetrics::empty();
    }

    // ===== BUSINESS METHODS =====

    /**
     * Verifica se a campanha pode ser editada
     */
    public function canBeEdited(): bool
    {
        return $this->status->canBeEdited();
    }

    /**
     * Verifica se a campanha pode ser enviada
     */
    public function canBeSent(): bool
    {
        return $this->status->canBeSent() && $this->isValidForSending();
    }

    /**
     * Verifica se a campanha pode ser pausada
     */
    public function canBePaused(): bool
    {
        return $this->status->canBePaused();
    }

    /**
     * Verifica se a campanha pode ser cancelada
     */
    public function canBeCancelled(): bool
    {
        return $this->status->canBeCancelled();
    }

    /**
     * Verifica se a campanha pode ser deletada
     */
    public function canBeDeleted(): bool
    {
        return $this->status->canBeDeleted();
    }

    /**
     * Verifica se a campanha está pronta para envio
     */
    public function isReadyForSending(): bool
    {
        return $this->status->isDraft() &&
               $this->isValidForSending() &&
               $this->hasValidSchedule();
    }

    /**
     * Verifica se a campanha está agendada
     */
    public function isScheduled(): bool
    {
        return $this->status->isScheduled() && $this->scheduledAt !== null;
    }

    /**
     * Verifica se a campanha está sendo enviada
     */
    public function isSending(): bool
    {
        return $this->status->isSending();
    }

    /**
     * Verifica se a campanha foi enviada
     */
    public function isSent(): bool
    {
        return $this->status->isSent();
    }

    /**
     * Verifica se a campanha falhou
     */
    public function hasFailed(): bool
    {
        return $this->status->isFailed();
    }

    /**
     * Verifica se a campanha é automatizada
     */
    public function isAutomated(): bool
    {
        return $this->type->isAutomated();
    }

    /**
     * Verifica se a campanha requer agendamento
     */
    public function requiresScheduling(): bool
    {
        return $this->type->requiresScheduling();
    }

    /**
     * Obtém a taxa de abertura
     */
    public function getOpenRate(): float
    {
        return $this->metrics->getOpenRate();
    }

    /**
     * Obtém a taxa de cliques
     */
    public function getClickRate(): float
    {
        return $this->metrics->getClickRate();
    }

    /**
     * Obtém a taxa de bounce
     */
    public function getBounceRate(): float
    {
        return $this->metrics->getBounceRate();
    }

    /**
     * Obtém a taxa de unsubscribe
     */
    public function getUnsubscribeRate(): float
    {
        return $this->metrics->getUnsubscribeRate();
    }

    /**
     * Obtém a taxa de entrega
     */
    public function getDeliveryRate(): float
    {
        return $this->metrics->getDeliveryRate();
    }

    /**
     * Obtém a taxa de cliques por abertura
     */
    public function getClickToOpenRate(): float
    {
        return $this->metrics->getClickToOpenRate();
    }

    // ===== STATE TRANSITIONS =====

    /**
     * Marca a campanha como rascunho
     */
    public function markAsDraft(): void
    {
        if (!$this->canBeEdited()) {
            throw new InvalidArgumentException('Campaign cannot be marked as draft in current status');
        }

        $this->status = EmailCampaignStatus::draft();
        $this->updatedAt = new DateTime();
    }

    /**
     * Agenda a campanha
     */
    public function schedule(DateTime $scheduledAt): void
    {
        if (!$this->canBeSent()) {
            throw new InvalidArgumentException('Campaign cannot be scheduled in current status');
        }

        if ($scheduledAt <= new DateTime()) {
            throw new InvalidArgumentException('Scheduled date must be in the future');
        }

        $this->status = EmailCampaignStatus::scheduled();
        $this->scheduledAt = $scheduledAt;
        $this->updatedAt = new DateTime();
    }

    /**
     * Inicia o envio da campanha
     */
    public function startSending(): void
    {
        if (!$this->canBeSent()) {
            throw new InvalidArgumentException('Campaign cannot be sent in current status');
        }

        $this->status = EmailCampaignStatus::sending();
        $this->updatedAt = new DateTime();
    }

    /**
     * Marca a campanha como enviada
     */
    public function markAsSent(): void
    {
        if (!$this->status->isSending()) {
            throw new InvalidArgumentException('Campaign must be in sending status to be marked as sent');
        }

        $this->status = EmailCampaignStatus::sent();
        $this->sentAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Pausa a campanha
     */
    public function pause(): void
    {
        if (!$this->canBePaused()) {
            throw new InvalidArgumentException('Campaign cannot be paused in current status');
        }

        $this->status = EmailCampaignStatus::paused();
        $this->updatedAt = new DateTime();
    }

    /**
     * Cancela a campanha
     */
    public function cancel(): void
    {
        if (!$this->canBeCancelled()) {
            throw new InvalidArgumentException('Campaign cannot be cancelled in current status');
        }

        $this->status = EmailCampaignStatus::cancelled();
        $this->updatedAt = new DateTime();
    }

    /**
     * Marca a campanha como falhada
     */
    public function markAsFailed(): void
    {
        $this->status = EmailCampaignStatus::failed();
        $this->updatedAt = new DateTime();
    }

    // ===== METRICS UPDATES =====

    /**
     * Atualiza as métricas da campanha
     */
    public function updateMetrics(EmailCampaignMetrics $metrics): void
    {
        $this->metrics = $metrics;
        $this->updatedAt = new DateTime();
    }

    /**
     * Incrementa contador de emails enviados
     */
    public function incrementSentCount(int $count = 1): void
    {
        $this->metrics = $this->metrics->incrementSent($count);
        $this->updatedAt = new DateTime();
    }

    /**
     * Incrementa contador de emails entregues
     */
    public function incrementDeliveredCount(int $count = 1): void
    {
        $this->metrics = $this->metrics->incrementDelivered($count);
        $this->updatedAt = new DateTime();
    }

    /**
     * Incrementa contador de emails abertos
     */
    public function incrementOpenedCount(int $count = 1): void
    {
        $this->metrics = $this->metrics->incrementOpened($count);
        $this->updatedAt = new DateTime();
    }

    /**
     * Incrementa contador de cliques
     */
    public function incrementClickedCount(int $count = 1): void
    {
        $this->metrics = $this->metrics->incrementClicked($count);
        $this->updatedAt = new DateTime();
    }

    /**
     * Incrementa contador de unsubscribes
     */
    public function incrementUnsubscribedCount(int $count = 1): void
    {
        $this->metrics = $this->metrics->incrementUnsubscribed($count);
        $this->updatedAt = new DateTime();
    }

    /**
     * Incrementa contador de bounces
     */
    public function incrementBouncedCount(int $count = 1): void
    {
        $this->metrics = $this->metrics->incrementBounced($count);
        $this->updatedAt = new DateTime();
    }

    // ===== VALIDATION METHODS =====

    /**
     * Verifica se a campanha é válida para envio
     */
    private function isValidForSending(): bool
    {
        return !empty($this->name) &&
               !empty($this->subject) &&
               !empty($this->content) &&
               $this->emailListId > 0 &&
               $this->userId > 0;
    }

    /**
     * Verifica se o agendamento é válido
     */
    private function hasValidSchedule(): bool
    {
        if ($this->scheduledAt === null) {
            return true; // Envio imediato
        }

        return $this->scheduledAt > new DateTime();
    }

    // ===== VALIDATORS =====

    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Campaign name cannot be empty');
        }

        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Campaign name cannot exceed 255 characters');
        }
    }

    private function validateSubject(string $subject): void
    {
        if (empty(trim($subject))) {
            throw new InvalidArgumentException('Campaign subject cannot be empty');
        }

        if (strlen($subject) > 255) {
            throw new InvalidArgumentException('Campaign subject cannot exceed 255 characters');
        }
    }

    private function validateContent(string $content): void
    {
        if (empty(trim($content))) {
            throw new InvalidArgumentException('Campaign content cannot be empty');
        }
    }

    private function validateEmailListId(int $emailListId): void
    {
        if ($emailListId <= 0) {
            throw new InvalidArgumentException('Email list ID must be positive');
        }
    }

    private function validateUserId(int $userId): void
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User ID must be positive');
        }
    }

    private function validateFromEmail(?string $fromEmail): void
    {
        if ($fromEmail !== null && !filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid from email address');
        }
    }

    private function validateReplyToEmail(?string $replyToEmail): void
    {
        if ($replyToEmail !== null && !filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid reply-to email address');
        }
    }

    // ===== FACTORY METHODS =====

    /**
     * Cria uma nova campanha de email
     */
    public static function create(
        string $name,
        string $subject,
        string $content,
        int $emailListId,
        int $userId,
        ?string $fromEmail = null,
        ?string $fromName = null
    ): self {
        return new self(
            name: $name,
            subject: $subject,
            content: $content,
            emailListId: $emailListId,
            userId: $userId,
            fromEmail: $fromEmail,
            fromName: $fromName,
            createdAt: new DateTime(),
            updatedAt: new DateTime()
        );
    }

    /**
     * Cria uma campanha automatizada
     */
    public static function createAutomation(
        string $name,
        string $subject,
        string $content,
        int $emailListId,
        int $userId,
        ?string $fromEmail = null,
        ?string $fromName = null
    ): self {
        return new self(
            name: $name,
            subject: $subject,
            content: $content,
            emailListId: $emailListId,
            userId: $userId,
            type: EmailCampaignType::automation(),
            fromEmail: $fromEmail,
            fromName: $fromName,
            createdAt: new DateTime(),
            updatedAt: new DateTime()
        );
    }

    /**
     * Cria uma campanha de broadcast
     */
    public static function createBroadcast(
        string $name,
        string $subject,
        string $content,
        int $emailListId,
        int $userId,
        ?string $fromEmail = null,
        ?string $fromName = null
    ): self {
        return new self(
            name: $name,
            subject: $subject,
            content: $content,
            emailListId: $emailListId,
            userId: $userId,
            type: EmailCampaignType::broadcast(),
            fromEmail: $fromEmail,
            fromName: $fromName,
            createdAt: new DateTime(),
            updatedAt: new DateTime()
        );
    }

    // ===== SERIALIZATION =====

    /**
     * Converte para array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'subject' => $this->subject,
            'content' => $this->content,
            'type' => $this->type->getValue(),
            'priority' => $this->priority->getValue(),
            'status' => $this->status->getValue(),
            'email_list_id' => $this->emailListId,
            'user_id' => $this->userId,
            'scheduled_at' => $this->scheduledAt?->format('Y-m-d H:i:s'),
            'sent_at' => $this->sentAt?->format('Y-m-d H:i:s'),
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
            'from_name' => $this->fromName,
            'from_email' => $this->fromEmail,
            'reply_to_email' => $this->replyToEmail,
            'segments' => $this->segments,
            'tags' => $this->tags,
            'custom_fields' => $this->customFields,
            'template_id' => $this->templateId,
            'attachments' => $this->attachments,
            'tracking_settings' => $this->trackingSettings,
            'metrics' => $this->metrics->toArray(),
        ];
    }

    /**
     * Cria a partir de array
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            subject: $data['subject'],
            content: $data['content'],
            emailListId: $data['email_list_id'],
            userId: $data['user_id'],
            type: isset($data['type']) ? new EmailCampaignType($data['type']) : null,
            priority: isset($data['priority']) ? new EmailCampaignPriority($data['priority']) : null,
            status: isset($data['status']) ? new EmailCampaignStatus($data['status']) : null,
            scheduledAt: isset($data['scheduled_at']) ? new DateTime($data['scheduled_at']) : null,
            sentAt: isset($data['sent_at']) ? new DateTime($data['sent_at']) : null,
            fromName: $data['from_name'] ?? null,
            fromEmail: $data['from_email'] ?? null,
            replyToEmail: $data['reply_to_email'] ?? null,
            segments: $data['segments'] ?? null,
            tags: $data['tags'] ?? null,
            customFields: $data['custom_fields'] ?? null,
            templateId: $data['template_id'] ?? null,
            attachments: $data['attachments'] ?? null,
            trackingSettings: $data['tracking_settings'] ?? null,
            id: $data['id'] ?? null,
            createdAt: isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            updatedAt: isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
            metrics: isset($data['metrics']) ? EmailCampaignMetrics::fromArray($data['metrics']) : null
        );
    }
}
