<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // === EXTERNAL INTEGRATIONS ===
        Schema::create('external_integrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('platform'); // facebook, google, twitter, etc.
            $table->string('service_type'); // ads, social, ai, messaging
            $table->string('account_id');
            $table->string('account_name')->nullable();
            $table->json('credentials')->nullable(); // encrypted
            $table->json('configuration')->nullable();
            $table->string('status')->default('active'); // active, inactive, error
            $table->timestamp('last_sync_at')->nullable();
            $table->timestamp('last_error_at')->nullable();
            $table->text('last_error_message')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['platform', 'service_type']);
            $table->index(['status', 'last_sync_at']);
        });

        // === CIRCUIT BREAKER LOGS ===
        Schema::create('circuit_breaker_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('platform');
            $table->string('endpoint')->default('default');
            $table->string('state'); // closed, open, half_open
            $table->integer('failure_count')->default(0);
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('last_failure_at')->nullable();
            $table->text('last_failure_message')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['platform', 'endpoint']);
            $table->index(['state', 'opened_at']);
        });

        // === INTEGRATION ANALYTICS ===
        Schema::create('integration_analytics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('platform');
            $table->string('account_id');
            $table->string('metric_type'); // impressions, clicks, spend, etc.
            $table->decimal('value', 15, 4);
            $table->string('period'); // hour, day, week, month
            $table->date('date');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['platform', 'account_id', 'date']);
            $table->index(['metric_type', 'period', 'date']);
        });

        // === CONTENT SCHEDULING ===
        Schema::create('scheduled_content', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('platform');
            $table->string('account_id');
            $table->string('content_type'); // post, ad, message
            $table->json('content_data');
            $table->timestamp('scheduled_at');
            $table->timestamp('published_at')->nullable();
            $table->string('status')->default('scheduled'); // scheduled, published, failed, cancelled
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['platform', 'account_id', 'scheduled_at']);
            $table->index(['status', 'scheduled_at']);
        });

        // === FUNCTION CALLING LOGS ===
        Schema::create('function_calling_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('function_name');
            $table->string('ai_provider'); // openai, claude, gemini
            $table->json('arguments');
            $table->json('result')->nullable();
            $table->boolean('success')->default(false);
            $table->text('error_message')->nullable();
            $table->integer('execution_time_ms')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['function_name', 'ai_provider']);
            $table->index(['success', 'created_at']);
        });

        // === API USAGE STATS ===
        Schema::create('api_usage_stats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('platform');
            $table->string('endpoint');
            $table->string('method'); // GET, POST, PUT, DELETE
            $table->integer('status_code');
            $table->integer('response_time_ms');
            $table->integer('request_size_bytes')->nullable();
            $table->integer('response_size_bytes')->nullable();
            $table->timestamp('requested_at');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['platform', 'endpoint', 'requested_at']);
            $table->index(['status_code', 'requested_at']);
        });

        // === INTEGRATION HEALTH CHECKS ===
        Schema::create('integration_health_checks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('platform');
            $table->string('service_type');
            $table->string('account_id');
            $table->boolean('is_healthy')->default(false);
            $table->integer('response_time_ms')->nullable();
            $table->text('error_message')->nullable();
            $table->json('health_data')->nullable();
            $table->timestamp('checked_at');
            $table->timestamps();

            $table->index(['platform', 'service_type', 'checked_at']);
            $table->index(['is_healthy', 'checked_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integration_health_checks');
        Schema::dropIfExists('api_usage_stats');
        Schema::dropIfExists('function_calling_logs');
        Schema::dropIfExists('scheduled_content');
        Schema::dropIfExists('integration_analytics');
        Schema::dropIfExists('circuit_breaker_logs');
        Schema::dropIfExists('external_integrations');
    }
};