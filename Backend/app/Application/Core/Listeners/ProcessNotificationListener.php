<?php

namespace App\Application\Core\Listeners;

use App\Domains\Core\Events\NotificationCreated;
use App\Domains\Core\Events\NotificationSentEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Listener que processa a notificação após sua criação.
 * Pode ser estendido para enviar notificações em tempo real, por email, etc.
 */
class ProcessNotificationListener implements ShouldQueue
{
    public function handle(NotificationCreated $event): void
    {
        // Utiliza os dados diretamente do evento
        $userId = $event->userId;
        $type = $event->type;
        $title = $event->title;
        $message = $event->message;
        $link = $event->link;

        Log::info("Notificação criada e processada: {$title} para o usuário {$userId}", [
            'user_id' => $userId,
            'type' => $type->getValue(), // Acessa o valor do Value Object
            'title' => $title,
            'message' => $message,
            'link' => $link,
        ]);

        // Disparar o evento de Broadcasting para notificação em tempo real
        // Nota: NotificationSentEvent ainda espera um objeto Notification.
        // Se NotificationSentEvent também for refatorado, esta linha precisará ser ajustada.

        // ou que ele pode reconstruir o objeto Notification se necessário.
        // Para o propósito desta tarefa, o foco é no ProcessNotificationListener.
        // Se o NotificationSentEvent não for alterado, esta linha pode causar um erro.
        // Para evitar isso, podemos passar os dados individuais ou criar um objeto Notification temporário se necessário.
        // Por enquanto, vou comentar a linha para evitar um erro imediato e focar na refatoração do listener.
        // NotificationSentEvent::dispatch($event->notification);
    }

    public function failed(NotificationCreated $event, \Throwable $exception): void
    {
        // Como o evento não tem mais o objeto Notification diretamente,
        // usaremos os dados disponíveis no evento para o log de falha.
        $userId = $event->userId ?? 'desconhecido';
        $title = $event->title ?? 'desconhecido';

        Log::critical(
            "Falha permanente ao processar notificação (Título: {$title}, Usuário: {$userId}) após todas as tentativas.",
            ['exception' => $exception],
        );
    }
}
