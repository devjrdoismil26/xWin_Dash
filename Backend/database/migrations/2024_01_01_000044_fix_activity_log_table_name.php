<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Fix activity_log vs activity_logs inconsistency
     * The code uses 'activity_logs' but some migrations create 'activity_log'
     * This migration ensures consistency by creating activity_logs if it doesn't exist
     * and migrating data if needed
     */
    public function up(): void
    {
        // Check if activity_log exists but activity_logs doesn't
        if (Schema::hasTable('activity_log') && !Schema::hasTable('activity_logs')) {
            // Rename activity_log to activity_logs
            Schema::rename('activity_log', 'activity_logs');
        } elseif (!Schema::hasTable('activity_logs')) {
            // Create activity_logs table if neither exists
            Schema::create('activity_logs', function (Blueprint $table) {
                $table->id();
                $table->string('log_name')->nullable();
                $table->text('description');
                $table->string('entity_type')->nullable();
                $table->unsignedBigInteger('entity_id')->nullable();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
                $table->string('action')->nullable(); // created, updated, deleted, etc.
                $table->json('properties')->nullable();
                $table->string('ip_address')->nullable();
                $table->string('user_agent')->nullable();
                $table->timestamps();
                
                $table->index('log_name');
                $table->index(['entity_type', 'entity_id']);
                $table->index(['user_id', 'created_at']);
                $table->index('created_at');
            });
        }
    }

    public function down(): void
    {
        // Don't drop activity_logs as it's the primary table
        // This migration is idempotent
    }
};
