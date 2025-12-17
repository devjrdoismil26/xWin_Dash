<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // === EMAIL CAMPAIGNS ===
        Schema::create('email_campaigns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('subject');
            $table->longText('html_content');
            $table->longText('plain_content')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->integer('recipients_count')->default(0);
            $table->integer('sent_count')->default(0);
            $table->integer('delivered_count')->default(0);
            $table->integer('opened_count')->default(0);
            $table->integer('clicked_count')->default(0);
            $table->integer('bounced_count')->default(0);
            $table->integer('unsubscribed_count')->default(0);
            $table->foreignUuid('template_id')->nullable()->constrained('email_templates')->onDelete('set null');
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'scheduled_at']);
        });

        // === EMAIL LISTS ===
        Schema::create('email_lists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('subscribers_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        // === EMAIL SUBSCRIBERS ===
        Schema::create('email_subscribers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email');
            $table->string('name')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('status')->default('active'); // active, unsubscribed, bounced
            $table->json('custom_fields')->nullable();
            $table->timestamp('subscribed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['email', 'project_id']);
            $table->index('status');
        });

        // === LIST SUBSCRIBERS (Pivot) ===
        Schema::create('list_subscribers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('list_id')->constrained('email_lists')->onDelete('cascade');
            $table->foreignUuid('subscriber_id')->constrained('email_subscribers')->onDelete('cascade');
            $table->timestamp('subscribed_at')->nullable();
            $table->timestamps();

            $table->unique(['list_id', 'subscriber_id']);
        });

        // === EMAIL TEMPLATES ===
        Schema::create('email_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('subject');
            $table->longText('html_content');
            $table->longText('plain_content')->nullable();
            $table->string('type')->default('transactional'); // transactional, marketing, automated
            $table->json('variables')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'is_active']);
        });

        // === EMAIL SEGMENTS ===
        Schema::create('email_segments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('conditions');
            $table->integer('subscribers_count')->default(0);
            $table->boolean('is_dynamic')->default(true);
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // === CAMPAIGN SEGMENTS (Pivot) ===
        Schema::create('campaign_segments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('campaign_id')->constrained('email_campaigns')->onDelete('cascade');
            $table->foreignUuid('segment_id')->constrained('email_segments')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['campaign_id', 'segment_id']);
        });

        // === EMAIL SEQUENCES ===
        Schema::create('email_sequences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('trigger_type'); // signup, purchase, abandoned_cart, etc
            $table->json('trigger_conditions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // === SEQUENCE EMAILS ===
        Schema::create('sequence_emails', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sequence_id')->constrained('email_sequences')->onDelete('cascade');
            $table->foreignUuid('template_id')->constrained('email_templates')->onDelete('cascade');
            $table->integer('delay_days')->default(0);
            $table->integer('delay_hours')->default(0);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index(['sequence_id', 'order']);
        });

        // === SEQUENCE SUBSCRIBERS ===
        Schema::create('sequence_subscribers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sequence_id')->constrained('email_sequences')->onDelete('cascade');
            $table->foreignUuid('subscriber_id')->constrained('email_subscribers')->onDelete('cascade');
            $table->string('status')->default('active'); // active, completed, paused
            $table->integer('current_step')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['sequence_id', 'subscriber_id']);
        });

        // === EMAIL METRICS ===
        Schema::create('email_metrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('campaign_id')->nullable()->constrained('email_campaigns')->onDelete('cascade');
            $table->foreignUuid('subscriber_id')->constrained('email_subscribers')->onDelete('cascade');
            $table->string('event_type'); // sent, delivered, opened, clicked, bounced, unsubscribed
            $table->timestamp('event_at');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['campaign_id', 'event_type']);
            $table->index(['subscriber_id', 'event_type']);
            $table->index('event_at');
        });

        // === EMAIL OPENS ===
        Schema::create('email_opens', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('campaign_id')->constrained('email_campaigns')->onDelete('cascade');
            $table->foreignUuid('subscriber_id')->constrained('email_subscribers')->onDelete('cascade');
            $table->timestamp('opened_at');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['campaign_id', 'opened_at']);
        });

        // === EMAIL CLICKS ===
        Schema::create('email_clicks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('campaign_id')->constrained('email_campaigns')->onDelete('cascade');
            $table->foreignUuid('subscriber_id')->constrained('email_subscribers')->onDelete('cascade');
            $table->foreignUuid('link_id')->nullable()->constrained('email_links')->onDelete('set null');
            $table->string('url');
            $table->timestamp('clicked_at');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['campaign_id', 'clicked_at']);
        });

        // === EMAIL LINKS ===
        Schema::create('email_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('campaign_id')->constrained('email_campaigns')->onDelete('cascade');
            $table->string('url');
            $table->string('short_code')->unique();
            $table->integer('clicks_count')->default(0);
            $table->timestamps();

            $table->index('campaign_id');
        });

        // === EMAIL BOUNCES ===
        Schema::create('email_bounces', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('campaign_id')->nullable()->constrained('email_campaigns')->onDelete('cascade');
            $table->foreignUuid('subscriber_id')->constrained('email_subscribers')->onDelete('cascade');
            $table->string('bounce_type'); // hard, soft
            $table->text('reason')->nullable();
            $table->timestamp('bounced_at');
            $table->timestamps();

            $table->index(['subscriber_id', 'bounce_type']);
        });

        // === EMAIL UNSUBSCRIBES ===
        Schema::create('email_unsubscribes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('campaign_id')->nullable()->constrained('email_campaigns')->onDelete('cascade');
            $table->foreignUuid('subscriber_id')->constrained('email_subscribers')->onDelete('cascade');
            $table->text('reason')->nullable();
            $table->timestamp('unsubscribed_at');
            $table->timestamps();

            $table->index('subscriber_id');
        });

        // === CAMPAIGN RECIPIENTS ===
        Schema::create('campaign_recipients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('campaign_id')->constrained('email_campaigns')->onDelete('cascade');
            $table->foreignUuid('subscriber_id')->constrained('email_subscribers')->onDelete('cascade');
            $table->string('status')->default('pending'); // pending, sent, failed
            $table->timestamp('sent_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->unique(['campaign_id', 'subscriber_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_recipients');
        Schema::dropIfExists('email_unsubscribes');
        Schema::dropIfExists('email_bounces');
        Schema::dropIfExists('email_links');
        Schema::dropIfExists('email_clicks');
        Schema::dropIfExists('email_opens');
        Schema::dropIfExists('email_metrics');
        Schema::dropIfExists('sequence_subscribers');
        Schema::dropIfExists('sequence_emails');
        Schema::dropIfExists('email_sequences');
        Schema::dropIfExists('campaign_segments');
        Schema::dropIfExists('email_segments');
        Schema::dropIfExists('list_subscribers');
        Schema::dropIfExists('email_lists');
        Schema::dropIfExists('email_templates');
        Schema::dropIfExists('email_subscribers');
        Schema::dropIfExists('email_campaigns');
    }
};
