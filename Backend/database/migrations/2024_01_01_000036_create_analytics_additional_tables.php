<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Analytics Pages
        Schema::create('analytics_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('path');
            $table->string('title')->nullable();
            $table->integer('pageviews')->default(0);
            $table->integer('unique_visitors')->default(0);
            $table->integer('avg_time_on_page')->default(0); // in seconds
            $table->decimal('bounce_rate', 5, 2)->default(0);
            $table->date('date');
            $table->timestamps();
            
            $table->index(['path', 'date']);
            $table->index(['user_id', 'date']);
        });

        // Analytics Traffic Sources
        Schema::create('analytics_traffic_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('source'); // organic, direct, social, referral, email
            $table->string('medium')->nullable();
            $table->string('campaign')->nullable();
            $table->integer('visits')->default(0);
            $table->date('date');
            $table->timestamps();
            
            $table->index(['source', 'date']);
            $table->index(['user_id', 'date']);
        });

        // Analytics Conversions
        Schema::create('analytics_conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('conversion_type'); // lead, sale, signup, etc.
            $table->decimal('conversion_rate', 5, 2)->default(0);
            $table->decimal('revenue', 15, 2)->default(0);
            $table->date('date');
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['conversion_type', 'date']);
            $table->index(['user_id', 'date']);
        });

        // Analytics Reports
        Schema::create('analytics_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('type'); // traffic, conversion, engagement
            $table->date('start_date');
            $table->date('end_date');
            $table->json('filters')->nullable();
            $table->json('data')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'created_at']);
            $table->index('type');
        });

        // Analytics Insights
        Schema::create('analytics_insights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->string('type'); // positive, negative, neutral
            $table->string('metric'); // pageviews, bounce_rate, etc.
            $table->decimal('change', 5, 2)->default(0); // percentage change
            $table->date('date');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['user_id', 'date', 'is_active']);
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_insights');
        Schema::dropIfExists('analytics_reports');
        Schema::dropIfExists('analytics_conversions');
        Schema::dropIfExists('analytics_traffic_sources');
        Schema::dropIfExists('analytics_pages');
    }
};
