<?php

namespace App\Domains\Core\Events;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado quando uma notificação push precisa ser enviada.
 */
class PushNotificationEvent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var UserModel o usuário para quem a notificação push será enviada
     */
    public UserModel $user;

    /**
     * @var string o título da notificação push
     */
    public string $title;

    /**
     * @var string o corpo da notificação push
     */
    public string $body;

    /**
     * @var array<string, mixed> dados adicionais para a notificação push
     */
    public array $data;

    /**
     * Create a new event instance.
     *
     * @param UserModel $user
     * @param string    $title
     * @param string    $body
     * @param array<string, mixed>     $data
     */
    public function __construct(UserModel $user, string $title, string $body, array $data = [])
    {
        $this->user = $user;
        $this->title = $title;
        $this->body = $body;
        $this->data = $data;
    }
}
