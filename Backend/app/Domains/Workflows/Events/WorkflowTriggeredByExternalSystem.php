<?php

namespace App\Domains\Workflows\Events;

use App\Domains\Workflows\Models\Workflow;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Validator;

class WorkflowTriggeredByExternalSystem
{
    use Dispatchable;
    use SerializesModels;

    public Workflow $workflow;

    public array $payload;

    public ?string $source_system;

    public ?string $source_id;

    /**
     * Create a new event instance.
     *
     * @param Workflow    $workflow
     * @param array       $payload       the data received from the external system
     * @param string|null $source_system the name of the system that triggered the event
     * @param string|null $source_id     an identifier from the source system
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function __construct(Workflow $workflow, array $payload, ?string $source_system = null, ?string $source_id = null)
    {
        $this->workflow = $workflow;

        // Validação básica da estrutura do payload
        Validator::make($payload, [
            // Exemplo: 'some_key' => 'required|string',
            // Adicione regras de validação específicas conforme a estrutura esperada do payload
        ])->validate();

        $this->payload = $payload;
        $this->source_system = $source_system;
        $this->source_id = $source_id;
    }
}
