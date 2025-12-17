<?php

namespace App\Domains\EmailMarketing\Mail;

use App\Domains\EmailMarketing\Domain\EmailSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

class NurturingEmail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public EmailSubscriber $subscriber;

    public string $subject;

    public string $content;

    /**
     * Create a new message instance.
     *
     * @param EmailSubscriber $subscriber
     * @param string          $subject
     * @param string          $content
     */
    public function __construct(EmailSubscriber $subscriber, string $subject, string $content)
    {
        $this->subscriber = $subscriber;
        $this->subject = $subject;
        $this->content = $content;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->subject)
                    ->html($this->content) // Usando o conteúdo HTML fornecido
                    ->with([
                        'subscriber' => $this->subscriber,
                    ]);
    }
}
