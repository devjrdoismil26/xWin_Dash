<?php

namespace App\Domains\EmailMarketing\Application\Commands;

use DateTime;

/**
 * Command para criação de campanha de email
 *
 * Representa a intenção de criar uma nova campanha de email
 * com todos os dados necessários.
 */
class CreateEmailCampaignCommand
{
    private string $name;
    private int $userId;
    private string $subject;
    private string $content;
    private string $type;
    private string $status;
    private array $emailListIds;
    private ?int $templateId;
    private ?string $senderName;
    private ?string $senderEmail;
    private ?string $replyToEmail;
    private ?DateTime $scheduleDate;
    private ?array $tags;
    private ?int $projectId;
    private ?array $metadata;

    public function __construct(
        string $name,
        int $userId,
        string $subject,
        string $content,
        string $type,
        array $emailListIds,
        ?int $templateId = null,
        string $status = 'draft',
        ?string $senderName = null,
        ?string $senderEmail = null,
        ?string $replyToEmail = null,
        ?DateTime $scheduleDate = null,
        ?array $tags = null,
        ?int $projectId = null,
        ?array $metadata = null
    ) {
        $this->name = $name;
        $this->userId = $userId;
        $this->subject = $subject;
        $this->content = $content;
        $this->type = $type;
        $this->status = $status;
        $this->emailListIds = $emailListIds;
        $this->templateId = $templateId;
        $this->senderName = $senderName;
        $this->senderEmail = $senderEmail;
        $this->replyToEmail = $replyToEmail;
        $this->scheduleDate = $scheduleDate;
        $this->tags = $tags;
        $this->projectId = $projectId;
        $this->metadata = $metadata;
    }

    // Getters
    public function getName(): string
    {
        return $this->name;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getSubject(): string
    {
        return $this->subject;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getEmailListIds(): array
    {
        return $this->emailListIds;
    }

    public function getTemplateId(): ?int
    {
        return $this->templateId;
    }

    public function getSenderName(): ?string
    {
        return $this->senderName;
    }

    public function getSenderEmail(): ?string
    {
        return $this->senderEmail;
    }

    public function getReplyToEmail(): ?string
    {
        return $this->replyToEmail;
    }

    public function getScheduleDate(): ?DateTime
    {
        return $this->scheduleDate;
    }

    public function getTags(): ?array
    {
        return $this->tags;
    }

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    /**
     * Cria comando a partir de array de dados
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            userId: $data['user_id'],
            subject: $data['subject'],
            content: $data['content'],
            type: $data['type'],
            emailListIds: $data['email_list_ids'],
            templateId: $data['template_id'] ?? null,
            status: $data['status'] ?? 'draft',
            senderName: $data['sender_name'] ?? null,
            senderEmail: $data['sender_email'] ?? null,
            replyToEmail: $data['reply_to_email'] ?? null,
            scheduleDate: isset($data['schedule_date']) ? new DateTime($data['schedule_date']) : null,
            tags: $data['tags'] ?? null,
            projectId: $data['project_id'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    /**
     * Converte comando para array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'user_id' => $this->userId,
            'subject' => $this->subject,
            'content' => $this->content,
            'type' => $this->type,
            'status' => $this->status,
            'email_list_ids' => $this->emailListIds,
            'template_id' => $this->templateId,
            'sender_name' => $this->senderName,
            'sender_email' => $this->senderEmail,
            'reply_to_email' => $this->replyToEmail,
            'schedule_date' => $this->scheduleDate?->format('Y-m-d H:i:s'),
            'tags' => $this->tags,
            'project_id' => $this->projectId,
            'metadata' => $this->metadata
        ];
    }

    /**
     * Valida o comando
     */
    public function validate(): array
    {
        $errors = [];

        if (empty($this->name)) {
            $errors[] = 'Nome é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($this->subject)) {
            $errors[] = 'Assunto é obrigatório';
        }

        if (empty($this->content)) {
            $errors[] = 'Conteúdo é obrigatório';
        }

        if (empty($this->type)) {
            $errors[] = 'Tipo é obrigatório';
        }

        if (empty($this->emailListIds)) {
            $errors[] = 'Lista de emails é obrigatória';
        }

        // Validar formato do assunto
        if (strlen($this->subject) < 5) {
            $errors[] = 'Assunto deve ter pelo menos 5 caracteres';
        }

        if (strlen($this->subject) > 200) {
            $errors[] = 'Assunto deve ter no máximo 200 caracteres';
        }

        // Validar tipo de campanha
        $validTypes = ['newsletter', 'promotional', 'transactional', 'automation', 'welcome'];
        if (!in_array($this->type, $validTypes)) {
            $errors[] = 'Tipo de campanha inválido';
        }

        // Validar email do remetente se fornecido
        if ($this->senderEmail && !filter_var($this->senderEmail, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email do remetente inválido';
        }

        // Validar email de resposta se fornecido
        if ($this->replyToEmail && !filter_var($this->replyToEmail, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email de resposta inválido';
        }

        return $errors;
    }

    /**
     * Verifica se o comando é válido
     */
    public function isValid(): bool
    {
        return empty($this->validate());
    }

    /**
     * Verifica se a campanha está agendada
     */
    public function isScheduled(): bool
    {
        return $this->scheduleDate !== null && $this->scheduleDate > new DateTime();
    }

    /**
     * Verifica se a campanha é automática
     */
    public function isAutomation(): bool
    {
        return $this->type === 'automation';
    }

    /**
     * Verifica se a campanha é transacional
     */
    public function isTransactional(): bool
    {
        return $this->type === 'transactional';
    }
}
