<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor; // Supondo que a interface exista
use App\Domains\Workflows\Exceptions\InvalidNodeConfigException; // Supondo que esta exceção exista
use Illuminate\Support\Facades\Log;

class WorkflowNodeExecutorFactory
{
    /**
     * Cria uma instância do executor de nó de workflow apropriado.
     *
     * @param string $nodeType o tipo do nó (ex: 'send_email', 'if_else', 'create_lead')
     *
     * @return WorkflowNodeExecutor
     *
     * @throws InvalidNodeConfigException se o tipo de nó não tiver um executor registrado
     */
    public static function create(string $nodeType): WorkflowNodeExecutor
    {
        Log::info("Criando executor para o tipo de nó: {$nodeType}.");

        // Mapeamento de tipos de nó para classes de executor
        $executorMap = [
            'send_email' => EmailNodeExecutor::class,
            'if_else' => IfElseNodeExecutor::class,
            'create_lead' => CreateLeadNodeExecutor::class,
            'send_whatsapp_message' => SendWhatsappMessageNodeExecutor::class,
            'custom_webhook' => CustomWebhookNodeExecutor::class,
            'ai_generate_text' => AIGenerateTextNodeExecutor::class,
            'ai_generate_image' => AIGenerateImageNodeExecutor::class,
            'start_aura_ura_flow' => StartAuraUraFlowNodeExecutor::class,
            'email_campaign' => EmailCampaignNodeExecutor::class,
            'social_media_automation' => SocialMediaAutomationNodeExecutor::class,
            'google_sheets' => GoogleSheetsNodeExecutor::class,
            'merge_data' => MergeDataNodeExecutor::class,
            'discord_message' => DiscordMessageNodeExecutor::class,
            'analytics_report' => AnalyticsReportNodeExecutor::class,
            'assign_aura_chat' => AssignAuraChatNodeExecutor::class,
            'transform_data' => TransformDataNodeExecutor::class,
            'publish_social_post_immediately' => PublishSocialPostImmediatelyNodeExecutor::class,
            'trigger_workflow' => TriggerWorkflowNodeExecutor::class,
            'get_social_post_insights' => GetSocialPostInsightsNodeExecutor::class,
            'schedule_social_post' => ScheduleSocialPostNodeExecutor::class,
            'extract_data' => ExtractDataNodeExecutor::class,
            'update_lead' => UpdateLeadNodeExecutor::class,
            'close_aura_chat' => CloseAuraChatNodeExecutor::class,
            'pause_campaign' => PauseCampaignNodeExecutor::class,
            'ai_text_analysis' => AITextAnalysisNodeExecutor::class,
            'media_processing' => MediaProcessingNodeExecutor::class,
            'slack_message' => SlackMessageNodeExecutor::class,
            'ai_analyze_text' => AIAnalyzeTextNodeExecutor::class,
            'upload_media' => UploadMediaNodeExecutor::class,
            'adjust_budget' => AdjustBudgetNodeExecutor::class,
            'ads_tool_campaign_status' => ADSToolCampaignStatusNodeExecutor::class,
            'loop' => LoopNodeExecutor::class,
            'lead_field_matches' => LeadFieldMatchesNodeExecutor::class,
            'zapier_webhook' => ZapierWebhookNodeExecutor::class,
            // Adicione outros mapeamentos aqui
        ];

        if (!isset($executorMap[$nodeType])) {
            throw new InvalidNodeConfigException("Nenhum executor registrado para o tipo de nó: {$nodeType}.");
        }

        $executorClass = $executorMap[$nodeType];

        // Resolver o executor do container de serviços do Laravel
        return app($executorClass);
    }
}
