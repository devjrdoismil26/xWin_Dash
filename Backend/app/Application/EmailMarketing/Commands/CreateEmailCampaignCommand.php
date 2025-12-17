<?php

namespace App\Application\EmailMarketing\Commands;

class CreateEmailCampaignCommand
{
    public string $name;

    public string $subject;

    public string $content;

    public int $emailListId;

    public int $userId;

    public function __construct(string $name, string $subject, string $content, int $emailListId, int $userId)
    {
        $this->name = $name;
        $this->subject = $subject;
        $this->content = $content;
        $this->emailListId = $emailListId;
        $this->userId = $userId;
    }
}
