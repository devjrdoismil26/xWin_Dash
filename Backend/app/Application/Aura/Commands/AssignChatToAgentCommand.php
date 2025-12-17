<?php

namespace App\Application\Aura\Commands;

class AssignChatToAgentCommand
{
    public string $chatId;
    public string $agentId;
    public string $agentName;

    public function __construct(string $chatId, string $agentId, string $agentName)
    {
        $this->chatId = $chatId;
        $this->agentId = $agentId;
        $this->agentName = $agentName;
    }
}