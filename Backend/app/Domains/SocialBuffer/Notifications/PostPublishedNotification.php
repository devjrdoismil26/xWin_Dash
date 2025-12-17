<?php

namespace App\Domains\SocialBuffer\Notifications;

use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostPublishedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Post $post;
    protected PublishResultDTO $result;

    /**
     * Create a new notification instance.
     */
    public function __construct(Post $post, PublishResultDTO $result)
    {
        $this->post = $post;
        $this->result = $result;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
                    ->subject('Post Publicado com Sucesso')
                    ->greeting('Olá!')
                    ->line('Seu post foi publicado com sucesso.')
                    ->line('Plataforma: ' . ucfirst($this->result->platform))
                    ->line('Conteúdo: ' . substr($this->post->content ?? '', 0, 100) . '...')
                    ->when($this->result->postUrl, function ($mail) {
                        return $mail->action('Ver Post', $this->result->postUrl);
                    })
                    ->line('Obrigado por usar nossa plataforma!');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Post Publicado',
            'message' => $this->result->success
                ? "Post publicado com sucesso no {$this->result->platform}."
                : "Falha ao publicar post no {$this->result->platform}: {$this->result->message}",
            'type' => $this->result->success ? 'post_published_success' : 'post_published_failed',
            'post_id' => $this->post->id,
            'platform' => $this->result->platform,
            'platform_post_id' => $this->result->platformPostId,
            'success' => $this->result->success,
            'action_url' => $this->result->postUrl,
        ];
    }
}
