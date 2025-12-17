<?php

namespace App\Domains\Workflows\ValueObjects;

class WhatsappNodeConfig
{
    public function __construct(
        public readonly string $phoneNumber,
        public readonly string $message,
        public readonly ?string $mediaUrl = null,
        public readonly ?string $templateId = null,
        public readonly array $templateParams = []
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['phone_number'],
            $data['message'],
            $data['media_url'] ?? null,
            $data['template_id'] ?? null,
            $data['template_params'] ?? []
        );
    }

    public function toArray(): array
    {
        return [
            'phone_number' => $this->phoneNumber,
            'message' => $this->message,
            'media_url' => $this->mediaUrl,
            'template_id' => $this->templateId,
            'template_params' => $this->templateParams,
        ];
    }
}
