<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Core Policies
        \App\Domains\Settings\Models\Setting::class => \App\Domains\Core\Policies\SettingsPolicy::class,
        \App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingModel::class => \App\Domains\Core\Policies\SettingsPolicy::class,
        \App\Domains\Core\Infrastructure\Persistence\Eloquent\ProjectIntegrationModel::class => \App\Domains\Integrations\Policies\IntegrationPolicy::class,
        
        // Project Policies
        \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::class => \App\Domains\Projects\Policies\ProjectPolicy::class,
        
        // Integration Policies
        \App\Domains\Integrations\Models\Integration::class => \App\Domains\Integrations\Policies\IntegrationPolicy::class,
        
        // ADStool Policies
        \App\Domains\ADStool\Infrastructure\Persistence\Eloquent\ADSCampaign::class => \App\Domains\ADStool\Policies\ADSCampaignPolicy::class,
        
        // Email Marketing Policies
        \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel::class => \App\Domains\EmailMarketing\Policies\EmailCampaignPolicy::class,
        
        // SocialBuffer Policies
        \App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\HashtagGroupModel::class => \App\Domains\SocialBuffer\Policies\HashtagGroupPolicy::class,
        \App\Domains\SocialBuffer\Models\SocialPost::class => \App\Domains\SocialBuffer\Policies\PostPolicy::class,
        \App\Domains\SocialBuffer\Models\SocialAccount::class => \App\Domains\SocialBuffer\Policies\SocialAccountPolicy::class,
        
        // Media Policies
        \App\Domains\Media\Models\MediaFile::class => \App\Domains\Media\Policies\MediaPolicy::class,
        \App\Domains\Media\Models\MediaFolder::class => \App\Domains\Media\Policies\FolderPolicy::class,
        
        // Activity Policies
        \App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModel::class => \App\Domains\Activity\Policies\ActivityLogPolicy::class,
        
        // Dashboard Policies
        \App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardWidgetModel::class => \App\Domains\Dashboard\Policies\DashboardPolicy::class,
        \App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardLayoutModel::class => \App\Domains\Dashboard\Policies\DashboardPolicy::class,
        \App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardAlertModel::class => \App\Domains\Dashboard\Policies\DashboardPolicy::class,
        
        // AI Policies
        \App\Domains\AI\Models\AIGeneration::class => \App\Domains\AI\Policies\GeminiPolicy::class,
        \App\Domains\AI\Infrastructure\Persistence\Eloquent\AIGenerationModel::class => \App\Domains\AI\Policies\GeminiPolicy::class,
        
        // Analytics Policies
        \App\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticsEventModel::class => \App\Domains\Analytics\Policies\AnalyticsPolicy::class,
        
        // Leads Policies
        \App\Domains\Leads\Models\Lead::class => \App\Domains\Leads\Policies\LeadPolicy::class,
        
        // Products Policies
        \App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel::class => \App\Domains\Products\Policies\ProductPolicy::class,
        \App\Domains\Products\Infrastructure\Persistence\Eloquent\LandingPageModel::class => \App\Domains\Products\Policies\LandingPagePolicy::class,
        
        // Categorization Policies
        \App\Domains\Categorization\Infrastructure\Persistence\Eloquent\TagModel::class => \App\Domains\Categorization\Policies\TagPolicy::class,
        
        // Users Policies
        \App\Models\User::class => \App\Domains\Users\Policies\UserPolicy::class,
        
        // Workflows Policies
        \App\Domains\Workflows\Models\Workflow::class => \App\Domains\Workflows\Policies\WorkflowPolicy::class,
        
        // Universe Policies
        \App\Domains\Universe\Models\UniverseInstance::class => \App\Domains\Universe\Policies\UniverseInstancePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Gates específicos do xWin Dash
        $this->defineGates();
    }

    /**
     * Define application gates
     */
    private function defineGates(): void
    {
        // Gate para gerenciar usuários
        Gate::define('manage-users', function (User $user) {
            return $user->hasRole('admin') || $user->hasRole('super-admin');
        });

        // Gate para gerenciar projetos
        Gate::define('manage-projects', function (User $user) {
            return $user->hasRole('admin') || $user->hasRole('super-admin') || $user->hasRole('project-manager');
        });

        // Gate para acessar funcionalidades premium
        Gate::define('access-premium', function (User $user) {
            return $user->hasRole('premium') || $user->hasRole('admin') || $user->hasRole('super-admin');
        });

        // Gate para acessar configurações do sistema
        Gate::define('access-system-settings', function (User $user) {
            return $user->hasRole('super-admin');
        });
    }
}