<?php

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\ServiceProvider;

return [
    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application. This value is used when the
    | framework needs to place the application's name in a notification or
    | any other location as required by the application or its packages.
    |
    */

    'name' => env('APP_NAME', 'xWin Dash'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | your application so that it is used when running Artisan tasks.
    |
    */

    'url' => env('APP_URL', 'http://127.0.0.1:8000'),

    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),

    'asset_url' => env('ASSET_URL'),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. We have gone
    | ahead and set this to a sensible default for you out of the box.
    |
    */

    'timezone' => env('APP_TIMEZONE', 'UTC'),

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by the translation service provider. You are free to set this value
    | to any of the locales which will be supported by the application.
    |
    */

    'locale' => env('APP_LOCALE', 'pt_BR'),

    /*
    |--------------------------------------------------------------------------
    | Application Fallback Locale
    |--------------------------------------------------------------------------
    |
    | The fallback locale determines the locale to use when the current one
    | is not available. You may change the value to correspond to any of
    | the language folders that are provided through your application.
    |
    */

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Faker Locale
    |--------------------------------------------------------------------------
    |
    | This locale will be used by the Faker PHP library when generating fake
    | data for your database seeds. For example, this will be used to get
    | localized telephone numbers, street address information and more.
    |
    */

    'faker_locale' => env('APP_FAKER_LOCALE', 'pt_BR'),

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is used by the Illuminate encrypter service and should be set
    | to a random, 32 character string, otherwise these encrypted strings
    | will not be safe. Please do this before deploying an application!
    |
    */

    'key' => env('APP_KEY', 'base64:0P5IHCt3ASTuriIoBRXGIwiuFmmm20IIY9m3MF4huy0='),

    'cipher' => 'AES-256-CBC',

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'redis'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Autoloaded Service Providers
    |--------------------------------------------------------------------------
    |
    | The service providers listed here will be automatically loaded on the
    | request to your application. Feel free to add your own services to
    | this array to grant expanded functionality to your applications.
    |
    */

    'providers' => ServiceProvider::defaultProviders()->merge([
        /*
         * Package Service Providers...
         */
        Laravel\Sanctum\SanctumServiceProvider::class,
        Inertia\ServiceProvider::class,
        Laravel\Horizon\HorizonServiceProvider::class,

        Maatwebsite\Excel\ExcelServiceProvider::class,

        /*
         * Application Service Providers...
         */
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        App\Providers\EventServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
        App\Providers\RouteManagerServiceProvider::class,
        App\Providers\WorkflowServiceProvider::class,
        App\Domains\Core\Providers\BroadcastServiceProvider::class,
        App\Providers\ModuleServiceProvider::class,
        /*
         * Integration Service Providers (Fragmentados)
         */
        App\Providers\Integrations\Core\ExternalIntegrationCoreServiceProvider::class,
        App\Providers\Integrations\SocialMedia\SocialMediaIntegrationServiceProvider::class,
        App\Providers\Integrations\Payment\PaymentIntegrationServiceProvider::class,
        App\Providers\Integrations\Communication\CommunicationIntegrationServiceProvider::class,
        App\Providers\Integrations\Analytics\AnalyticsIntegrationServiceProvider::class,
        App\Providers\Integrations\Storage\StorageIntegrationServiceProvider::class,
        /*
         * Workflow Domain Providers (Fragmentados)
         */
        App\Domains\Workflows\Providers\Core\WorkflowCoreServiceProvider::class,
        App\Domains\Workflows\Providers\Execution\WorkflowExecutionServiceProvider::class,
        App\Domains\Workflows\Providers\Node\WorkflowNodeServiceProvider::class,
        App\Domains\Workflows\Providers\Integration\WorkflowIntegrationServiceProvider::class,
        /*
         * Universe Domain Providers (Fragmentados)
         */
        App\Domains\Universe\Providers\Core\UniverseCoreServiceProvider::class,
        App\Domains\Universe\Providers\Data\UniverseDataServiceProvider::class,
        App\Domains\Universe\Providers\Analytics\UniverseAnalyticsServiceProvider::class,
        App\Domains\Universe\Providers\Integration\UniverseIntegrationServiceProvider::class,
        App\Domains\Activity\Providers\ActivityDomainServiceProvider::class,
        App\Domains\Activity\Providers\ActivityServiceProvider::class,
        App\Domains\ADStool\Providers\ADStoolDomainServiceProvider::class,
        App\Domains\Analytics\Providers\AnalyticsDomainServiceProvider::class,
        App\Domains\Categorization\Providers\CategorizationDomainServiceProvider::class,
        App\Domains\Core\Providers\CoreDomainServiceProvider::class,
        App\Domains\Dashboard\Providers\DashboardDomainServiceProvider::class,
        App\Domains\EmailMarketing\Providers\EmailMarketingDomainServiceProvider::class,
        App\Domains\Integrations\Providers\IntegrationsDomainServiceProvider::class,
        App\Domains\Leads\Providers\LeadsDomainServiceProvider::class,
        App\Domains\Media\Providers\MediaDomainServiceProvider::class,
        App\Domains\Products\Providers\ProductsDomainServiceProvider::class,
        App\Domains\Projects\Providers\ProjectsDomainServiceProvider::class,
        App\Domains\SocialBuffer\Providers\SocialBufferDomainServiceProvider::class,
        App\Domains\Users\Providers\UsersDomainServiceProvider::class,
        App\Domains\Workflows\Providers\WorkflowsDomainServiceProvider::class,
        App\Services\RouteFixAutomation\RouteFixAutomationServiceProvider::class,

        /*
         * Module Service Providers
         */

        /*
         * Shared Services Providers (Fragmentados)
         */
        App\Providers\Shared\Monitoring\MonitoringServiceProvider::class,
        App\Providers\Shared\Alerting\AlertingServiceProvider::class,
        App\Providers\Shared\QueryOptimization\QueryOptimizationServiceProvider::class,
        App\Providers\Shared\EventSystem\EventSystemServiceProvider::class,
        App\Providers\Shared\Cache\CacheServiceProvider::class,
        App\Providers\Shared\Security\SecurityServiceProvider::class,

        /*
         * Database Optimization Providers (Fragmentados)
         */
        App\Providers\Database\Query\DatabaseQueryServiceProvider::class,
        App\Providers\Database\Index\DatabaseIndexServiceProvider::class,
        App\Providers\Database\Connection\DatabaseConnectionServiceProvider::class,
        App\Providers\Database\Migration\DatabaseMigrationServiceProvider::class,

        /*
         * Domain Providers (Fragmentados)
         */
        App\Providers\Domains\Core\CoreDomainServiceProvider::class,
        App\Providers\Domains\Business\BusinessDomainServiceProvider::class,
        App\Providers\Domains\Integration\IntegrationDomainServiceProvider::class,
        App\Providers\Domains\Utility\UtilityDomainServiceProvider::class,

        /*
         * Email Marketing Providers (Fragmentados)
         */
        App\Domains\EmailMarketing\Providers\Campaign\EmailCampaignServiceProvider::class,
        App\Domains\EmailMarketing\Providers\Template\EmailTemplateServiceProvider::class,
        App\Domains\EmailMarketing\Providers\Analytics\EmailAnalyticsServiceProvider::class,
        App\Domains\EmailMarketing\Providers\Integration\EmailIntegrationServiceProvider::class,

        /*
         * Analytics Providers (Fragmentados)
         */
        App\Domains\Analytics\Providers\Web\WebAnalyticsServiceProvider::class,
        App\Domains\Analytics\Providers\User\UserAnalyticsServiceProvider::class,
        App\Domains\Analytics\Providers\Business\BusinessAnalyticsServiceProvider::class,
        App\Domains\Analytics\Providers\Performance\PerformanceAnalyticsServiceProvider::class,

        /*
         * AI Providers (Fragmentados)
         */
        App\Domains\AI\Providers\Core\AICoreServiceProvider::class,
        App\Domains\AI\Providers\Model\AIModelServiceProvider::class,
        App\Domains\AI\Providers\Training\AITrainingServiceProvider::class,
        App\Domains\AI\Providers\Integration\AIIntegrationServiceProvider::class,

        /*
         * Social Buffer Providers (Fragmentados)
         */
        App\Domains\SocialBuffer\Providers\Core\SocialBufferCoreServiceProvider::class,
        App\Domains\SocialBuffer\Providers\Facebook\SocialBufferFacebookServiceProvider::class,
        App\Domains\SocialBuffer\Providers\Instagram\SocialBufferInstagramServiceProvider::class,
        App\Domains\SocialBuffer\Providers\Twitter\SocialBufferTwitterServiceProvider::class,

        /*
         * Security Providers (Fragmentados)
         */
        App\Providers\Security\Authentication\AuthenticationServiceProvider::class,
        App\Providers\Security\Authorization\AuthorizationServiceProvider::class,
        App\Providers\Security\Encryption\EncryptionServiceProvider::class,
        App\Providers\Security\Audit\AuditServiceProvider::class,

        /*
         * Cache Providers (Fragmentados)
         */
        App\Providers\Cache\Core\CacheCoreServiceProvider::class,
        // App\Providers\Cache\Redis\CacheRedisServiceProvider::class,
        App\Providers\Cache\File\CacheFileServiceProvider::class,
        App\Providers\Cache\Database\CacheDatabaseServiceProvider::class,

        /*
         * Notification Providers (Fragmentados)
         */
        App\Providers\Notifications\Core\NotificationCoreServiceProvider::class,
        App\Providers\Notifications\Email\NotificationEmailServiceProvider::class,
        App\Providers\Notifications\Sms\NotificationSmsServiceProvider::class,
        App\Providers\Notifications\Push\NotificationPushServiceProvider::class,

        /*
         * Logging Providers (Fragmentados)
         */
        App\Providers\Logging\Core\LoggingCoreServiceProvider::class,
        App\Providers\Logging\File\LoggingFileServiceProvider::class,
        App\Providers\Logging\Database\LoggingDatabaseServiceProvider::class,
        App\Providers\Logging\External\LoggingExternalServiceProvider::class,

        /*
         * Validation Providers (Fragmentados)
         */
        App\Providers\Validation\Core\ValidationCoreServiceProvider::class,
        App\Providers\Validation\Form\ValidationFormServiceProvider::class,
        App\Providers\Validation\Api\ValidationApiServiceProvider::class,
        App\Providers\Validation\Business\ValidationBusinessServiceProvider::class,

        App\Providers\HorizonServiceProvider::class,

        /*
         * Custom Service Providers...
         */
        App\Domains\AI\Providers\EventServiceProvider::class,
        App\Domains\AI\Providers\ServiceProvider::class,
        App\Domains\Leads\Providers\LeadServiceProvider::class,
        App\Domains\ADStool\Providers\AdPlatformIntegrationServiceProvider::class,
        App\Domains\ADStool\Providers\ADStoolServiceProvider::class,
        App\Domains\Aura\Providers\AuraServiceProvider::class,
        // App\Domains\Core\Providers\WorkflowServiceProvider::class, // Removido - não existe
        // App\Domains\Core\Providers\AuraServiceProvider::class, // Removido - não existe
        // App\Domains\Core\Providers\GeminiServiceProvider::class, // Removido - não existe
    ])->toArray(),

    /*
    |--------------------------------------------------------------------------
    | Class Aliases
    |--------------------------------------------------------------------------
    |
    | This array of class aliases will be registered when this application
    | is started. However, feel free to register as many as you wish as
    | the aliases are "lazy" loaded so they don't hinder performance.
    |
    */

    'aliases' => Facade::defaultAliases()->merge([
        'Excel' => Maatwebsite\Excel\Facades\Excel::class,
        'Workflow' => App\Facades\Workflow::class,
        'Aura' => App\Facades\Aura::class,
        'Gemini' => App\Domains\AI\Infrastructure\Facades\Gemini::class,
        'Config' => Illuminate\Support\Facades\Config::class,
    ])->toArray(),

    /*
    |--------------------------------------------------------------------------
    | xWin Dash Specific Configuration
    |--------------------------------------------------------------------------
    |
    | Custom configuration specific to xWin Dash application.
    |
    */

    'version' => env('APP_VERSION', '9.9.0'),

    'admin_email' => env('ADMIN_EMAIL', 'admin@xwin.com'),

    'features' => [
        'workflows' => env('FEATURE_WORKFLOWS', true),
        'email_marketing' => env('FEATURE_EMAIL_MARKETING', true),
        'aura' => env('FEATURE_AURA', true),
        'gemini' => env('FEATURE_GEMINI', true),
        'analytics' => env('FEATURE_ANALYTICS', true),
    ],

    'limits' => [
        'max_projects' => env('LIMIT_MAX_PROJECTS', 10),
        'max_leads_per_project' => env('LIMIT_MAX_LEADS_PER_PROJECT', 10000),
        'max_workflows_per_project' => env('LIMIT_MAX_WORKFLOWS_PER_PROJECT', 50),
        'max_emails_per_day' => env('LIMIT_MAX_EMAILS_PER_DAY', 5000),
        'max_whatsapp_messages_per_day' => env('LIMIT_MAX_WHATSAPP_MESSAGES_PER_DAY', 1000),
    ],

    'security' => [
        'password_expiry_days' => env('SECURITY_PASSWORD_EXPIRY_DAYS', 90),
        'max_login_attempts' => env('SECURITY_MAX_LOGIN_ATTEMPTS', 5),
        'lockout_minutes' => env('SECURITY_LOCKOUT_MINUTES', 10),
        'two_factor_enabled' => env('SECURITY_TWO_FACTOR_ENABLED', false),
    ],

    'monitoring' => [
        'enabled' => env('MONITORING_ENABLED', true),
        'log_level' => env('MONITORING_LOG_LEVEL', 'error'),
        'alert_email' => env('MONITORING_ALERT_EMAIL'),
    ],
];
