<?php

namespace App\Domains\Workflows\Factories;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Executors\EmailNodeExecutor;
use Illuminate\Contracts\Container\Container;
use InvalidArgumentException;

class WorkflowNodeExecutorFactory
{
    protected Container $container;

    /**
     * @var array|string[]
     */
    protected array $executors = [
        'email' => EmailNodeExecutor::class,
        'ai_generate_text' => \App\Domains\Workflows\Executors\AIGenerateTextNodeExecutor::class,
        'ai_analyze_text' => \App\Domains\Workflows\Executors\AIAnalyzeTextNodeExecutor::class,
        'ai_generate_image' => \App\Domains\Workflows\Executors\AIGenerateImageNodeExecutor::class,
        'pause_campaign' => \App\Domains\Workflows\Executors\PauseCampaignNodeExecutor::class,
        'adjust_budget' => \App\Domains\Workflows\Executors\AdjustBudgetNodeExecutor::class,
        'create_ad_creative' => \App\Domains\Workflows\Executors\CreateAdCreativeNodeExecutor::class,
        'schedule_social_post' => \App\Domains\Workflows\Executors\ScheduleSocialPostNodeExecutor::class,
        'publish_social_post_immediately' => \App\Domains\Workflows\Executors\PublishSocialPostImmediatelyNodeExecutor::class,
        'get_social_post_insights' => \App\Domains\Workflows\Executors\GetSocialPostInsightsNodeExecutor::class,
        'if_else' => \App\Domains\Workflows\Executors\IfElseNodeExecutor::class,
        'lead_has_tag' => \App\Domains\Workflows\Executors\LeadHasTagNodeExecutor::class,
        'lead_field_matches' => \App\Domains\Workflows\Executors\LeadFieldMatchesNodeExecutor::class,
        'email_engagement_condition' => \App\Domains\Workflows\Executors\EmailEngagementConditionNodeExecutor::class,
        'adstool_campaign_status' => \App\Domains\Workflows\Executors\ADSToolCampaignStatusNodeExecutor::class,
        'social_post_has_media' => \App\Domains\Workflows\Executors\SocialPostHasMediaNodeExecutor::class,
        'transform_data' => \App\Domains\Workflows\Executors\TransformDataNodeExecutor::class,
        'merge_data' => \App\Domains\Workflows\Executors\MergeDataNodeExecutor::class,
        'extract_data' => \App\Domains\Workflows\Executors\ExtractDataNodeExecutor::class,
        'google_sheets' => \App\Domains\Workflows\Executors\GoogleSheetsNodeExecutor::class,
        'zapier_webhook' => \App\Domains\Workflows\Executors\ZapierWebhookNodeExecutor::class,
        'custom_webhook' => \App\Domains\Workflows\Executors\CustomWebhookNodeExecutor::class,
        'ai_text_analysis' => \App\Domains\Workflows\Executors\AITextAnalysisNodeExecutor::class,
        'email_campaign' => \App\Domains\Workflows\Executors\EmailCampaignNodeExecutor::class,
        'social_media_automation' => \App\Domains\Workflows\Executors\SocialMediaAutomationNodeExecutor::class,
        'analytics_report' => \App\Domains\Workflows\Executors\AnalyticsReportNodeExecutor::class,
        'media_processing' => \App\Domains\Workflows\Executors\MediaProcessingNodeExecutor::class,
        'slack_message' => \App\Domains\Workflows\Executors\SlackMessageNodeExecutor::class,
        'discord_message' => \App\Domains\Workflows\Executors\DiscordMessageNodeExecutor::class,
        'google_ads_api_action' => \App\Domains\Workflows\Executors\GoogleAdsApiActionNodeExecutor::class,
        'facebook_ads_api_action' => \App\Domains\Workflows\Executors\FacebookAdsApiActionNodeExecutor::class,
        'facebook_graph_api_action' => \App\Domains\Workflows\Executors\FacebookGraphApiActionNodeExecutor::class,
        'twitter_api_action' => \App\Domains\Workflows\Executors\TwitterApiActionNodeExecutor::class,
        'linkedin_api_action' => \App\Domains\Workflows\Executors\LinkedInApiActionNodeExecutor::class,
        'send_whatsapp_message' => \App\Domains\Workflows\Executors\SendWhatsappMessageNodeExecutor::class,
        'update_lead' => \App\Domains\Workflows\Executors\UpdateLeadNodeExecutor::class,
        'create_lead' => \App\Domains\Workflows\Executors\CreateLeadNodeExecutor::class,
        'api_call' => \App\Domains\Workflows\Executors\ApiCallNodeExecutor::class,
        'upload_media' => \App\Domains\Workflows\Executors\UploadMediaNodeExecutor::class,
        'start_aura_ura_flow' => \App\Domains\Workflows\Executors\StartAuraUraFlowNodeExecutor::class,
        'assign_aura_chat' => \App\Domains\Workflows\Executors\AssignAuraChatNodeExecutor::class,
        'close_aura_chat' => \App\Domains\Workflows\Executors\CloseAuraChatNodeExecutor::class,
    ];

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function create(string $nodeType): WorkflowNodeExecutor
    {
        if (!isset($this->executors[$nodeType])) {
            throw new InvalidArgumentException("No executor found for node type: {$nodeType}");
        }

        return $this->container->make($this->executors[$nodeType]);
    }
}
