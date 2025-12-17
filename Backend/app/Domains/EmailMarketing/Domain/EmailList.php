<?php

namespace App\Domains\EmailMarketing\Domain;

use App\Domains\EmailMarketing\Domain\ValueObjects\EmailListStatus;
use App\Domains\EmailMarketing\Domain\ValueObjects\EmailListType;
use App\Domains\EmailMarketing\Domain\ValueObjects\EmailListMetrics;
use DateTime;
use InvalidArgumentException;

/**
 * 📧 Email List Domain Model
 *
 * Modelo de domínio para Lista de Email
 * Encapsula regras de negócio e validações
 */
class EmailList
{
    public ?int $id;
    public string $name;
    public ?string $description;
    public EmailListStatus $status;
    public EmailListType $type;
    public int $userId;
    public ?string $slug;
    public ?array $tags;
    public ?array $customFields;
    public ?array $segmentationRules;
    public EmailListMetrics $metrics;
    public ?DateTime $lastActivityAt;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $name,
        int $userId,
        ?string $description = null,
        EmailListStatus $status = null,
        EmailListType $type = null,
        ?string $slug = null,
        ?array $tags = null,
        ?array $customFields = null,
        ?array $segmentationRules = null,
        ?EmailListMetrics $metrics = null,
        ?DateTime $lastActivityAt = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateName($name);
        $this->validateUserId($userId);
        $this->validateDescription($description);
        $this->validateSlug($slug);
        $this->validateTags($tags);
        $this->validateCustomFields($customFields);
        $this->validateSegmentationRules($segmentationRules);
        $this->validateLastActivityAt($lastActivityAt);

        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->status = $status ?? EmailListStatus::active();
        $this->type = $type ?? EmailListType::static();
        $this->userId = $userId;
        $this->slug = $slug;
        $this->tags = $tags;
        $this->customFields = $customFields;
        $this->segmentationRules = $segmentationRules;
        $this->metrics = $metrics ?? EmailListMetrics::empty();
        $this->lastActivityAt = $lastActivityAt;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    // ============================================================================
    // VALIDATION METHODS
    // ============================================================================

    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Email list name cannot be empty');
        }
        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Email list name cannot exceed 255 characters');
        }
    }

    private function validateUserId(int $userId): void
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User ID must be positive');
        }
    }

    private function validateDescription(?string $description): void
    {
        if ($description !== null && strlen($description) > 1000) {
            throw new InvalidArgumentException('Description cannot exceed 1000 characters');
        }
    }

    private function validateSlug(?string $slug): void
    {
        if ($slug !== null) {
            if (empty(trim($slug))) {
                throw new InvalidArgumentException('Slug cannot be empty');
            }
            if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
                throw new InvalidArgumentException('Slug can only contain lowercase letters, numbers, and hyphens');
            }
            if (strlen($slug) > 100) {
                throw new InvalidArgumentException('Slug cannot exceed 100 characters');
            }
        }
    }

    private function validateTags(?array $tags): void
    {
        if ($tags !== null) {
            foreach ($tags as $tag) {
                if (!is_string($tag) || empty(trim($tag))) {
                    throw new InvalidArgumentException('All tags must be non-empty strings');
                }
            }
        }
    }

    private function validateCustomFields(?array $customFields): void
    {
        if ($customFields !== null) {
            foreach ($customFields as $field) {
                if (!is_array($field) || !isset($field['name']) || !isset($field['type'])) {
                    throw new InvalidArgumentException('All custom fields must have name and type');
                }
            }
        }
    }

    private function validateSegmentationRules(?array $segmentationRules): void
    {
        if ($segmentationRules !== null) {
            foreach ($segmentationRules as $rule) {
                if (!is_array($rule) || !isset($rule['field']) || !isset($rule['operator'])) {
                    throw new InvalidArgumentException('All segmentation rules must have field and operator');
                }
            }
        }
    }

    private function validateLastActivityAt(?DateTime $lastActivityAt): void
    {
        if ($lastActivityAt !== null && $lastActivityAt > new DateTime()) {
            throw new InvalidArgumentException('Last activity at cannot be in the future');
        }
    }

    // ============================================================================
    // BUSINESS LOGIC METHODS
    // ============================================================================

    /**
     * Ativar lista
     */
    public function activate(): void
    {
        if (!$this->status->canTransitionTo(EmailListStatus::ACTIVE)) {
            throw new InvalidArgumentException('Cannot activate list from current status');
        }

        $this->status = $this->status->transitionTo(EmailListStatus::ACTIVE);
        $this->updatedAt = new DateTime();
    }

    /**
     * Desativar lista
     */
    public function deactivate(): void
    {
        if (!$this->status->canTransitionTo(EmailListStatus::INACTIVE)) {
            throw new InvalidArgumentException('Cannot deactivate list from current status');
        }

        $this->status = $this->status->transitionTo(EmailListStatus::INACTIVE);
        $this->updatedAt = new DateTime();
    }

    /**
     * Arquivar lista
     */
    public function archive(): void
    {
        if (!$this->status->canTransitionTo(EmailListStatus::ARCHIVED)) {
            throw new InvalidArgumentException('Cannot archive list from current status');
        }

        $this->status = $this->status->transitionTo(EmailListStatus::ARCHIVED);
        $this->updatedAt = new DateTime();
    }

    /**
     * Adicionar subscriber
     */
    public function addSubscriber(): void
    {
        if (!$this->status->canReceiveSubscribers()) {
            throw new InvalidArgumentException('Cannot add subscribers to list in current status');
        }

        $this->metrics = $this->metrics->addSubscriber();
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Remover subscriber
     */
    public function removeSubscriber(): void
    {
        $this->metrics = $this->metrics->removeSubscriber();
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Unsubscribe subscriber
     */
    public function unsubscribeSubscriber(): void
    {
        $this->metrics = $this->metrics->unsubscribeSubscriber();
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Bounce subscriber
     */
    public function bounceSubscriber(): void
    {
        $this->metrics = $this->metrics->bounceSubscriber();
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Registrar envio de email
     */
    public function recordEmailSent(int $count = 1): void
    {
        $this->metrics = $this->metrics->recordEmailSent($count);
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Registrar abertura de email
     */
    public function recordEmailOpened(int $count = 1): void
    {
        $this->metrics = $this->metrics->recordEmailOpened($count);
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Registrar clique em email
     */
    public function recordEmailClicked(int $count = 1): void
    {
        $this->metrics = $this->metrics->recordEmailClicked($count);
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Adicionar tag
     */
    public function addTag(string $tag): void
    {
        if (empty(trim($tag))) {
            throw new InvalidArgumentException('Tag cannot be empty');
        }

        if ($this->tags === null) {
            $this->tags = [];
        }

        if (!in_array($tag, $this->tags)) {
            $this->tags[] = $tag;
            $this->updatedAt = new DateTime();
        }
    }

    /**
     * Remover tag
     */
    public function removeTag(string $tag): void
    {
        if ($this->tags !== null) {
            $this->tags = array_filter($this->tags, fn($t) => $t !== $tag);
            $this->updatedAt = new DateTime();
        }
    }

    /**
     * Adicionar campo customizado
     */
    public function addCustomField(string $name, string $type, array $options = []): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Custom field name cannot be empty');
        }

        if ($this->customFields === null) {
            $this->customFields = [];
        }

        $this->customFields[] = [
            'name' => $name,
            'type' => $type,
            'options' => $options
        ];

        $this->updatedAt = new DateTime();
    }

    /**
     * Adicionar regra de segmentação
     */
    public function addSegmentationRule(string $field, string $operator, $value): void
    {
        if (empty(trim($field))) {
            throw new InvalidArgumentException('Segmentation rule field cannot be empty');
        }

        if ($this->segmentationRules === null) {
            $this->segmentationRules = [];
        }

        $this->segmentationRules[] = [
            'field' => $field,
            'operator' => $operator,
            'value' => $value
        ];

        $this->updatedAt = new DateTime();
    }

    /**
     * Verificar se pode receber novos subscribers
     */
    public function canReceiveSubscribers(): bool
    {
        return $this->status->canReceiveSubscribers();
    }

    /**
     * Verificar se pode ser editado
     */
    public function canBeEdited(): bool
    {
        return $this->status->canBeEdited();
    }

    /**
     * Verificar se pode ser usado em campanhas
     */
    public function canBeUsedInCampaigns(): bool
    {
        return $this->status->canBeUsedInCampaigns();
    }

    /**
     * Verificar se suporta segmentação
     */
    public function supportsSegmentation(): bool
    {
        return $this->type->supportsSegmentation();
    }

    /**
     * Verificar se suporta campos customizados
     */
    public function supportsCustomFields(): bool
    {
        return $this->type->supportsCustomFields();
    }

    /**
     * Obter resumo da lista
     */
    public function getSummary(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status->toArray(),
            'type' => $this->type->toArray(),
            'slug' => $this->slug,
            'tags' => $this->tags,
            'metrics' => $this->metrics->getSummary(),
            'can_receive_subscribers' => $this->canReceiveSubscribers(),
            'can_be_edited' => $this->canBeEdited(),
            'can_be_used_in_campaigns' => $this->canBeUsedInCampaigns(),
            'supports_segmentation' => $this->supportsSegmentation(),
            'supports_custom_fields' => $this->supportsCustomFields(),
            'last_activity_at' => $this->lastActivityAt?->format('Y-m-d H:i:s'),
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s')
        ];
    }

    /**
     * Obter estatísticas da lista
     */
    public function getStatistics(): array
    {
        return [
            'subscriber_count' => $this->metrics->getSubscriberCount(),
            'active_subscriber_count' => $this->metrics->getActiveSubscriberCount(),
            'unsubscribed_count' => $this->metrics->getUnsubscribedCount(),
            'bounced_count' => $this->metrics->getBouncedCount(),
            'average_open_rate' => $this->metrics->getAverageOpenRate(),
            'average_click_rate' => $this->metrics->getAverageClickRate(),
            'average_unsubscribe_rate' => $this->metrics->getAverageUnsubscribeRate(),
            'average_bounce_rate' => $this->metrics->getAverageBounceRate(),
            'status' => $this->metrics->getStatus(),
            'last_activity_at' => $this->metrics->getLastActivityAt()
        ];
    }

    /**
     * Verificar se é do tipo especificado
     */
    public function isType(EmailListType $type): bool
    {
        return $this->type->equals($type);
    }

    /**
     * Verificar se tem status especificado
     */
    public function hasStatus(EmailListStatus $status): bool
    {
        return $this->status->equals($status);
    }

    /**
     * Obter configurações específicas do tipo
     */
    public function getTypeConfiguration(): array
    {
        return [
            'supports_manual_add' => $this->type->supportsManualAdd(),
            'supports_automatic_add' => $this->type->supportsAutomaticAdd(),
            'supports_segmentation' => $this->type->supportsSegmentation(),
            'supports_custom_fields' => $this->type->supportsCustomFields(),
            'supports_tags' => $this->type->supportsTags(),
            'supports_analytics' => $this->type->supportsAnalytics(),
            'max_subscribers' => $this->type->getMaxSubscribers(),
            'requires_segmentation_rules' => $this->type->requiresSegmentationRules()
        ];
    }
}
