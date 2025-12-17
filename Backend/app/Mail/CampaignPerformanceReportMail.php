<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignPerformanceReportMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public array $report;

    public function __construct(array $report)
    {
        $this->report = $report;
    }

    public function build(): self
    {
        return $this->subject('Campaign Performance Report')
            ->view('emails.campaign_performance_report')
            ->with(['report' => $this->report]);
    }
}
