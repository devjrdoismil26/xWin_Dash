<?php

namespace App\Domains\Dashboard\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DashboardShouldUpdate implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public string $updateType;

    public ?string $resourceId;

    /**
     * Create a new event instance.
     */
    public function __construct(string $updateType = 'general', ?string $resourceId = null)
    {
        $this->updateType = $updateType;
        $this->resourceId = $resourceId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // Este será um canal público, pois não envia dados sensíveis.
        // Qualquer pessoa na página do dashboard pode receber a notificação para atualizar.
        return new Channel('dashboard');
    }

    /**
     * O nome do evento que será transmitido.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'DashboardShouldUpdate';
    }
}
