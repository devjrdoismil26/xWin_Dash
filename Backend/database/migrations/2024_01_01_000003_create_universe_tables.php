<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * 🏗️ MIGRAÇÃO CONSOLIDADA: UNIVERSE.
     *
     * Sistema Universe com UUIDs consistentes:
     * - Templates, Instances, Snapshots
     * - Analytics, Ratings, Shares
     * - Webhooks
     */
    public function up(): void
    {
        // === UNIVERSE TEMPLATES ===
        Schema::create('universe_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category', 50);
            $table->enum('difficulty', ['iniciante', 'intermediario', 'avancado'])->default('intermediario');
            $table->string('icon', 10)->nullable();
            $table->string('author')->nullable();
            $table->boolean('is_public')->default(false);
            $table->boolean('is_system')->default(false);
            $table->json('tags')->nullable();
            $table->json('modules_config');
            $table->json('connections_config')->nullable();
            $table->json('ai_commands')->nullable();
            $table->json('theme_config')->nullable();
            $table->json('layout_config')->nullable();
            $table->unsignedInteger('usage_count')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->foreignUuid('user_id')->nullable()->constrained()->onDelete('set null');
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category', 'is_public', 'rating']);
            $table->index(['is_public', 'usage_count']);
            $table->index(['user_id', 'is_public']);
        });

        // === UNIVERSE INSTANCES ===
        Schema::create('universe_instances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('project_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignUuid('template_id')->nullable()->constrained('universe_templates')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->json('modules_config');
            $table->json('connections_config')->nullable();
            $table->json('layout_config')->nullable();
            $table->json('theme_config')->nullable();
            $table->json('performance_metrics')->nullable();
            $table->json('usage_stats')->nullable();
            $table->json('ai_insights')->nullable();
            $table->timestamp('last_accessed_at')->nullable();
            $table->string('version', 20)->default('1.0.0');
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'is_active']);
            $table->index(['user_id', 'is_default']);
            $table->index(['project_id', 'is_active']);
            $table->index(['template_id', 'created_at']);
            $table->index('last_accessed_at');
        });

        // === UNIVERSE SNAPSHOTS ===
        Schema::create('universe_snapshots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignUuid('instance_id')->constrained('universe_instances')->onDelete('cascade');
            $table->json('snapshot_data');
            $table->string('version', 20);
            $table->boolean('is_auto_generated')->default(false);
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['instance_id', 'created_at']);
            $table->index(['instance_id', 'version']);
        });

        // === UNIVERSE ANALYTICS ===
        Schema::create('universe_analytics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->foreignUuid('instance_id')->nullable()->constrained('universe_instances')->onDelete('cascade');
            $table->foreignUuid('template_id')->nullable()->constrained('universe_templates')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->json('metrics');
            $table->integer('session_duration')->nullable();
            $table->integer('actions_count')->default(0);
            $table->json('feature_usage')->nullable();
            $table->timestamps();

            $table->unique(['date', 'instance_id', 'user_id']);
            $table->index(['date', 'template_id']);
        });

        // === UNIVERSE TEMPLATE RATINGS ===
        Schema::create('universe_template_ratings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('template_id')->constrained('universe_templates')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('rating'); // 1-5
            $table->text('review')->nullable();
            $table->timestamps();

            $table->unique(['template_id', 'user_id']);
            $table->index(['template_id', 'rating']);
        });

        // === UNIVERSE INSTANCE SHARES ===
        Schema::create('universe_instance_shares', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('instance_id')->constrained('universe_instances')->onDelete('cascade');
            $table->foreignUuid('shared_by')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('shared_with')->constrained('users')->onDelete('cascade');
            $table->json('permissions');
            $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->unique(['instance_id', 'shared_with']);
            $table->index(['shared_with', 'is_active']);
        });

        // === UNIVERSE WEBHOOKS ===
        Schema::create('universe_webhooks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('url');
            $table->json('events');
            $table->string('secret')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('instance_id')->constrained('universe_instances')->onDelete('cascade');
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['instance_id', 'is_active']);
        });

        // === UNIVERSE BLOCK MARKETPLACE ===
        Schema::create('universe_block_marketplace', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category');
            $table->string('author');
            $table->string('version')->default('1.0.0');
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('downloads')->default(0);
            $table->json('tags')->nullable();
            $table->string('preview')->nullable();
            $table->json('features')->nullable();
            $table->json('compatibility')->nullable();
            $table->boolean('is_premium')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('author_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category', 'is_active']);
            $table->index(['is_premium', 'is_active']);
            $table->index(['is_featured', 'is_active']);
            $table->index(['rating', 'downloads']);
            $table->index('author_id');
        });

        // === UNIVERSE BLOCK INSTALLATIONS ===
        Schema::create('universe_block_installations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('block_id')->constrained('universe_block_marketplace')->onDelete('cascade');
            $table->foreignUuid('instance_id')->constrained('universe_instances')->onDelete('cascade');
            $table->string('version')->default('1.0.0');
            $table->json('configuration')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('installed_at')->useCurrent();
            $table->foreignUuid('installed_by')->constrained('users');
            $table->timestamps();

            $table->unique(['block_id', 'instance_id']);
            $table->index(['instance_id', 'is_active']);
        });

        // === UNIVERSE BLOCK RATINGS ===
        Schema::create('universe_block_ratings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('block_id')->constrained('universe_block_marketplace')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('rating'); // 1-5
            $table->text('review')->nullable();
            $table->timestamps();

            $table->unique(['block_id', 'user_id']);
            $table->index(['block_id', 'rating']);
        });

        // === UNIVERSE AI SUPER AGENTS ===
        Schema::create('universe_ai_super_agents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type'); // assistant, automation, analysis
            $table->json('capabilities');
            $table->json('configuration');
            $table->string('status')->default('active');
            $table->boolean('is_public')->default(false);
            $table->integer('usage_count')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->foreignUuid('instance_id')->constrained('universe_instances')->onDelete('cascade');
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['instance_id', 'status']);
            $table->index(['type', 'is_public']);
        });

        // === UNIVERSE AI AGENT TASKS ===
        Schema::create('universe_ai_agent_tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('agent_id')->constrained('universe_ai_super_agents')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type');
            $table->json('parameters');
            $table->string('status')->default('pending');
            $table->json('result')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['agent_id', 'status']);
            $table->index(['status', 'scheduled_at']);
        });

        // === UNIVERSE AI AGENT LOGS ===
        Schema::create('universe_ai_agent_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('agent_id')->constrained('universe_ai_super_agents')->onDelete('cascade');
            $table->foreignUuid('task_id')->nullable()->constrained('universe_ai_agent_tasks')->onDelete('set null');
            $table->string('level'); // info, warning, error, debug
            $table->string('message');
            $table->json('context')->nullable();
            $table->timestamp('logged_at')->useCurrent();
            $table->timestamps();

            $table->index(['agent_id', 'logged_at']);
            $table->index(['level', 'logged_at']);
        });

        // === UNIVERSE CONNECTORS ===
        Schema::create('universe_connectors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type'); // api, webhook, database, file
            $table->string('provider'); // google, facebook, openai, etc.
            $table->json('configuration');
            $table->string('status')->default('inactive');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_sync_at')->nullable();
            $table->text('last_error')->nullable();
            $table->foreignUuid('instance_id')->constrained('universe_instances')->onDelete('cascade');
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['instance_id', 'status']);
            $table->index(['type', 'provider']);
        });

        // === UNIVERSE CONNECTOR SYNC LOGS ===
        Schema::create('universe_connector_sync_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('connector_id')->constrained('universe_connectors')->onDelete('cascade');
            $table->string('sync_type'); // full, incremental, manual
            $table->string('status'); // running, completed, failed
            $table->integer('records_processed')->default(0);
            $table->integer('records_successful')->default(0);
            $table->integer('records_failed')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->timestamps();

            $table->index(['connector_id', 'started_at']);
            $table->index(['status', 'started_at']);
        });

        // === UNIVERSE CONNECTOR ERRORS ===
        Schema::create('universe_connector_errors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('connector_id')->constrained('universe_connectors')->onDelete('cascade');
            $table->string('error_type');
            $table->string('error_code')->nullable();
            $table->text('error_message');
            $table->json('error_context')->nullable();
            $table->string('severity')->default('error'); // info, warning, error, critical
            $table->boolean('is_resolved')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->foreignUuid('resolved_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index(['connector_id', 'is_resolved']);
            $table->index(['severity', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('universe_connector_errors');
        Schema::dropIfExists('universe_connector_sync_logs');
        Schema::dropIfExists('universe_connectors');
        Schema::dropIfExists('universe_ai_agent_logs');
        Schema::dropIfExists('universe_ai_agent_tasks');
        Schema::dropIfExists('universe_ai_super_agents');
        Schema::dropIfExists('universe_block_ratings');
        Schema::dropIfExists('universe_block_installations');
        Schema::dropIfExists('universe_block_marketplace');
        Schema::dropIfExists('universe_webhooks');
        Schema::dropIfExists('universe_instance_shares');
        Schema::dropIfExists('universe_template_ratings');
        Schema::dropIfExists('universe_analytics');
        Schema::dropIfExists('universe_snapshots');
        Schema::dropIfExists('universe_instances');
        Schema::dropIfExists('universe_templates');
    }
};
