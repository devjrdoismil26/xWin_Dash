<?php

namespace App\Domains\Workflows\ValueObjects;

class EmailNodeConfig
{
    public function __construct(
        public readonly string $to,
        public readonly string $subject,
        public readonly string $body,
        public readonly ?string $template = null,
        public readonly array $attachments = [],
        public readonly ?string $cc = null,
        public readonly ?string $bcc = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['to'],
            $data['subject'],
            $data['body'],
            $data['template'] ?? null,
            $data['attachments'] ?? [],
            $data['cc'] ?? null,
            $data['bcc'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'to' => $this->to,
            'subject' => $this->subject,
            'body' => $this->body,
            'template' => $this->template,
            'attachments' => $this->attachments,
            'cc' => $this->cc,
            'bcc' => $this->bcc,
        ];
    }
}
