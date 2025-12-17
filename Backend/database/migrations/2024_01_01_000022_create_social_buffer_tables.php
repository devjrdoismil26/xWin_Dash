<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Social Accounts
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('platform'); // facebook, instagram, twitter, linkedin, tiktok, pinterest
            $table->string('account_name');
            $table->string('account_id')->nullable();
            $table->string('username')->nullable();
            $table->string('profile_image')->nullable();
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['user_id', 'platform']);
            $table->index('is_active');
        });

        // Posts
        Schema::create('social_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('draft'); // draft, scheduled, published, failed
            $table->string('type')->default('text'); // text, image, video, carousel
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->string('link_url')->nullable();
            $table->string('link_title')->nullable();
            $table->text('link_description')->nullable();
            $table->string('link_image')->nullable();
            $table->json('hashtags')->nullable();
            $table->json('mentions')->nullable();
            $table->json('location')->nullable();
            $table->json('metadata')->nullable();
            $table->json('custom_fields')->nullable();
            $table->integer('retry_count')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index('scheduled_at');
            $table->index('published_at');
        });

        // Post Social Accounts (pivot)
        Schema::create('post_social_accounts', function (Blueprint $table) {
            $table->uuid('post_id');
            $table->uuid('social_account_id');
            $table->string('status')->default('pending'); // pending, published, failed
            $table->string('external_id')->nullable();
            $table->text('external_url')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            $table->foreign('post_id')->references('id')->on('social_posts')->onDelete('cascade');
            $table->foreign('social_account_id')->references('id')->on('social_accounts')->onDelete('cascade');
            $table->primary(['post_id', 'social_account_id']);
        });

        // Media
        Schema::create('social_media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('post_id')->constrained('social_posts')->onDelete('cascade');
            $table->string('type'); // image, video, gif
            $table->string('url');
            $table->string('thumbnail_url')->nullable();
            $table->integer('size')->nullable();
            $table->string('mime_type')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('duration')->nullable();
            $table->integer('order')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index('post_id');
        });

        // Analytics
        Schema::create('social_analytics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('post_id')->constrained('social_posts')->onDelete('cascade');
            $table->foreignUuid('social_account_id')->constrained('social_accounts')->onDelete('cascade');
            $table->integer('likes')->default(0);
            $table->integer('comments')->default(0);
            $table->integer('shares')->default(0);
            $table->integer('views')->default(0);
            $table->integer('clicks')->default(0);
            $table->integer('saves')->default(0);
            $table->decimal('engagement_rate', 5, 2)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
            
            $table->index(['post_id', 'social_account_id']);
        });

        // Interactions
        Schema::create('social_interactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('post_id')->constrained('social_posts')->onDelete('cascade');
            $table->foreignUuid('social_account_id')->constrained('social_accounts')->onDelete('cascade');
            $table->string('type'); // like, comment, share, view, click
            $table->string('external_user_id')->nullable();
            $table->string('external_username')->nullable();
            $table->text('content')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();
            
            $table->index(['post_id', 'type']);
        });

        // Schedules
        Schema::create('social_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->json('days_of_week'); // [0,1,2,3,4,5,6]
            $table->json('times'); // ["09:00", "14:00", "18:00"]
            $table->string('timezone')->default('UTC');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('user_id');
        });

        // Hashtag Groups
        Schema::create('hashtag_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->json('hashtags');
            $table->text('description')->nullable();
            $table->integer('usage_count')->default(0);
            $table->timestamps();
            
            $table->index('user_id');
        });

        // Shortened Links
        Schema::create('shortened_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('original_url');
            $table->string('short_code')->unique();
            $table->string('short_url');
            $table->integer('clicks')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index('short_code');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shortened_links');
        Schema::dropIfExists('hashtag_groups');
        Schema::dropIfExists('social_schedules');
        Schema::dropIfExists('social_interactions');
        Schema::dropIfExists('social_analytics');
        Schema::dropIfExists('social_media');
        Schema::dropIfExists('post_social_accounts');
        Schema::dropIfExists('social_posts');
        Schema::dropIfExists('social_accounts');
    }
};
