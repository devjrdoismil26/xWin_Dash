<?php

namespace App\Domains\Workflows\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WorkflowEmail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public string $subjectText;

    public string $bodyText;

    public ?string $actionUrl;

    public ?string $actionText;

    /**
     * Create a new message instance.
     *
     * @param string      $subjectText o assunto do e-mail
     * @param string      $bodyText    o corpo do e-mail
     * @param string|null $actionUrl   a URL para a ação (opcional)
     * @param string|null $actionText  o texto do botão de ação (opcional)
     */
    public function __construct(string $subjectText, string $bodyText, ?string $actionUrl = null, ?string $actionText = null)
    {
        $this->subjectText = $subjectText;
        $this->bodyText = $bodyText;
        $this->actionUrl = $actionUrl;
        $this->actionText = $actionText;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->subjectText)
                    ->markdown('emails.workflow') // Supondo um template Blade em resources/views/emails/workflow.blade.php
                    ->with([
                        'bodyText' => $this->bodyText,
                        'actionUrl' => $this->actionUrl,
                        'actionText' => $this->actionText,
                    ]);
    }
}
