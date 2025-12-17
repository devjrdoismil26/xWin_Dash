<?php

namespace App\Mail;

use App\Domains\Core\Domain\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GenericNotificationMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public Notification $notification;

    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    public function build(): self
    {
        $subject = $this->notification->message; // Assuming message can be used as subject
        return $this->subject($subject)
            ->view('emails.generic_notification')
            ->with(['notification' => $this->notification]);
    }
}