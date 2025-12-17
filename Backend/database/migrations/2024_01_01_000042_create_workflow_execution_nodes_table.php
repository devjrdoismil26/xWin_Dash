<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_execution_nodes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('execution_id'); // Changed to match code (not foreignId)
            $table->foreignId('workflow_step_id')->nullable()->constrained('workflow_steps')->onDelete('set null');
            $table->string('node_id'); // ID do nó no workflow definition
            $table->string('status')->default('pending'); // pending, running, completed, failed, skipped
            $table->text('error')->nullable(); // Changed from error_message to match code
            $table->text('output')->nullable(); // Changed from output_data (JSON) to text to match code
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->index(['execution_id', 'node_id']);
            $table->index(['execution_id', 'status']);
            
            // Add foreign key if workflow_executions table exists
            if (Schema::hasTable('workflow_executions')) {
                $table->foreign('execution_id')->references('id')->on('workflow_executions')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_execution_nodes');
    }
};
