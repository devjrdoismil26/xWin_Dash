<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create aura_ura_sessions table
     * This is a separate table from aura_sessions for URA (Unified Response Automation) sessions
     */
    public function up(): void
    {
        Schema::create('aura_ura_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID to match model
            $table->foreignUuid('chat_id')->nullable()->constrained('aura_chats')->onDelete('cascade');
            $table->string('session_id')->nullable(); // Additional session identifier
            $table->json('context')->nullable();
            $table->json('history')->nullable(); // Changed from variables/state to history to match model
            $table->string('status')->default('active'); // active, completed, abandoned, error
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable(); // Changed from expires_at to ended_at to match model
            $table->timestamps();
            
            $table->index(['chat_id', 'status']);
            $table->index('started_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aura_ura_sessions');
    }
};
