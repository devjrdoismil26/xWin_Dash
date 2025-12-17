<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('event_type');
            $table->string('event_name');
            $table->string('category')->nullable();
            $table->json('properties')->nullable();
            $table->string('session_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('event_at');
            $table->timestamps();
            
            $table->index(['event_type', 'event_at']);
            $table->index(['user_id', 'event_at']);
            $table->index('session_id');
        });

        Schema::create('analytics_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('metric_name');
            $table->string('metric_type');
            $table->decimal('value', 15, 2);
            $table->string('dimension')->nullable();
            $table->date('date');
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['metric_name', 'date']);
            $table->index(['metric_type', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_metrics');
        Schema::dropIfExists('analytics_events');
    }
};
