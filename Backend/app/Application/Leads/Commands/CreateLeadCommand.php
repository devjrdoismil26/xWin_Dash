<?php

namespace App\Application\Leads\Commands;

class CreateLeadCommand
{
    public string $name;

    public string $email;

    public ?string $phone;

    public ?string $source;

    public ?array $customFields;

    public function __construct(string $name, string $email, ?string $phone = null, ?string $source = null, ?array $customFields = null)
    {
        $this->name = $name;
        $this->email = $email;
        $this->phone = $phone;
        $this->source = $source;
        $this->customFields = $customFields;
    }
}
