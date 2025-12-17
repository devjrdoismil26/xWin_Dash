<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Integration Mappings
        if (!Schema::hasTable('integration_mappings')) {
            Schema::create('integration_mappings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('integration_id')->constrained('integrations')->onDelete('cascade');
                $table->string('entity_type'); // Model type (Lead, Product, etc.) - matches model
                $table->string('local_field'); // Local field name - matches model
                $table->string('remote_field'); // Remote field name - matches model
                $table->string('direction')->default('bidirectional'); // inbound, outbound, bidirectional - matches model
                $table->json('transformation')->nullable(); // Transformation rules - matches model
                $table->boolean('is_required')->default(false); // Required field flag - matches model
                $table->timestamps();
                
                $table->index(['integration_id', 'entity_type']);
                $table->index('direction');
            });
        }

        // Integration Logs
        if (!Schema::hasTable('integration_logs')) {
            Schema::create('integration_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('integration_id')->constrained('integrations')->onDelete('cascade');
                $table->string('action'); // sync, import, export, error, etc. - matches model
                $table->string('status')->default('pending'); // pending, success, error - matches model
                $table->json('request_data')->nullable(); // Request data - matches model
                $table->json('response_data')->nullable(); // Response data - matches model
                $table->text('error_message')->nullable(); // Error message - matches model
                $table->integer('duration_ms')->nullable(); // Duration in milliseconds - matches model (not execution_time_ms)
                $table->integer('records_processed')->nullable(); // Records processed - matches model
                $table->timestamps();
                
                $table->index(['integration_id', 'status', 'created_at']);
                $table->index(['integration_id', 'action']);
                $table->index('created_at');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('integration_logs');
        Schema::dropIfExists('integration_mappings');
    }
};
