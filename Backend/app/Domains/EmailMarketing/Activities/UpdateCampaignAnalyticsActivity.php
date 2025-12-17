<?php

namespace App\Domains\EmailMarketing\Activities;

use App\Domains\EmailMarketing\Models\EmailCampaign;
use App\Domains\EmailMarketing\Models\EmailCampaignMetric;
use Workflow\Activity;

class UpdateCampaignAnalyticsActivity extends Activity
{
    public function execute(EmailCampaign $campaign, array $metricsData): EmailCampaignMetric
    {
        $totalSent = $metricsData['total_sent'] ?? 0;
        $totalOpened = $metricsData['total_opened'] ?? 0;
        $totalClicked = $metricsData['total_clicked'] ?? 0;
        $totalBounced = $metricsData['total_bounced'] ?? 0;
        $totalUnsubscribed = $metricsData['total_unsubscribed'] ?? 0;
        $totalSpamComplaints = $metricsData['total_spam_complaints'] ?? 0;
        $revenue = $metricsData['revenue'] ?? 0.0;

        $openRate = $totalSent > 0 ? ($totalOpened / $totalSent) : 0;
        $clickThroughRate = $totalSent > 0 ? ($totalClicked / $totalSent) : 0;
        $clickToOpenRate = $totalOpened > 0 ? ($totalClicked / $totalOpened) : 0;
        $bounceRate = $totalSent > 0 ? ($totalBounced / $totalSent) : 0;
        $unsubscribeRate = $totalSent > 0 ? ($totalUnsubscribed / $totalSent) : 0;
        $spamComplaintRate = $totalSent > 0 ? ($totalSpamComplaints / $totalSent) : 0;

        // Assuming conversion_rate and roi are provided or calculated elsewhere
        $conversionRate = $metricsData['conversion_rate'] ?? 0.0;
        $roi = $metricsData['roi'] ?? 0.0;

        $campaignMetric = EmailCampaignMetric::updateOrCreate(
            ['campaign_id' => $campaign->id, 'timestamp' => now()->toDateString()], // Group by day for simplicity
            [
                'total_sent' => $totalSent,
                'total_delivered' => $metricsData['total_delivered'] ?? $totalSent,
                'total_opened' => $totalOpened,
                'total_clicked' => $totalClicked,
                'total_bounced' => $totalBounced,
                'total_unsubscribed' => $totalUnsubscribed,
                'total_spam_complaints' => $totalSpamComplaints,
                'revenue' => $revenue,
                'roi' => $roi,
                'open_rate' => $openRate,
                'click_through_rate' => $clickThroughRate,
                'click_to_open_rate' => $clickToOpenRate,
                'conversion_rate' => $conversionRate,
                'bounce_rate' => $bounceRate,
                'unsubscribe_rate' => $unsubscribeRate,
                'spam_complaint_rate' => $spamComplaintRate,
            ],
        );

        return $campaignMetric;
    }
}
