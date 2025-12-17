<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Accounts table
        Schema::create('adstool_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('project_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('platform'); // google_ads, facebook_ads, linkedin_ads, etc
            $table->string('account_id');
            $table->string('account_name')->nullable();
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->json('account_settings')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_sync_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'platform', 'account_id']);
        });

        // Campaigns table
        Schema::create('adstool_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('account_id')->nullable()->constrained('adstool_accounts')->onDelete('set null');
            $table->string('name');
            $table->string('objective')->nullable();
            $table->string('platform'); // google_ads, facebook_ads, etc
            $table->decimal('daily_budget', 10, 2)->default(0);
            $table->string('status')->default('draft'); // draft, active, paused, completed
            $table->string('sync_status')->default('pending'); // pending, syncing, synced, failed
            $table->text('error_message')->nullable();
            $table->string('platform_campaign_id')->nullable();
            $table->string('platform_status')->nullable();
            $table->json('platform_specific_data')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index(['platform', 'platform_campaign_id']);
        });

        // Creatives table
        Schema::create('adstool_creatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('adstool_campaigns')->onDelete('cascade');
            $table->string('name');
            $table->string('type'); // image, video, carousel, text
            $table->json('content')->nullable();
            $table->json('assets')->nullable(); // URLs, media IDs
            $table->json('performance_metrics')->nullable();
            $table->string('status')->default('draft');
            $table->string('platform_creative_id')->nullable();
            $table->timestamps();
            
            $table->index('campaign_id');
        });

        // Analytics table
        Schema::create('adstool_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('adstool_campaigns')->onDelete('cascade');
            $table->date('date');
            $table->integer('impressions')->default(0);
            $table->integer('clicks')->default(0);
            $table->integer('conversions')->default(0);
            $table->decimal('spend', 10, 2)->default(0);
            $table->decimal('ctr', 5, 2)->default(0); // Click-through rate
            $table->decimal('cpc', 10, 2)->default(0); // Cost per click
            $table->decimal('cpa', 10, 2)->default(0); // Cost per acquisition
            $table->decimal('roas', 10, 2)->default(0); // Return on ad spend
            $table->json('additional_metrics')->nullable();
            $table->timestamps();
            
            $table->unique(['campaign_id', 'date']);
            $table->index('date');
        });

        // API Settings table
        Schema::create('adstool_api_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->string('platform');
            $table->string('api_key')->nullable();
            $table->text('api_secret')->nullable();
            $table->json('additional_config')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['user_id', 'platform']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adstool_analytics');
        Schema::dropIfExists('adstool_creatives');
        Schema::dropIfExists('adstool_campaigns');
        Schema::dropIfExists('adstool_api_settings');
        Schema::dropIfExists('adstool_accounts');
    }
};
