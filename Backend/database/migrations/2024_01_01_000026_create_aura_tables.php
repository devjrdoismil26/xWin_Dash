<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Connections table
        Schema::create('aura_connections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('created_by')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('phone_number')->unique();
            $table->string('business_name')->nullable();
            $table->string('status')->default('disconnected'); // connected, disconnected, error
            $table->string('connection_type')->default('whatsapp'); // whatsapp, telegram, etc
            $table->json('credentials')->nullable();
            $table->json('settings')->nullable();
            $table->json('webhook_config')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamp('connected_at')->nullable();
            $table->timestamp('disconnected_at')->nullable();
            $table->text('error_message')->nullable();
            $table->integer('messages_sent_today')->default(0);
            $table->integer('messages_received_today')->default(0);
            $table->date('daily_reset_date')->nullable();
            $table->timestamps();
            
            $table->index(['project_id', 'status']);
        });

        // Chats table
        Schema::create('aura_chats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('connection_id')->constrained('aura_connections')->onDelete('cascade');
            $table->foreignUuid('lead_id')->nullable()->constrained('leads')->onDelete('set null');
            $table->foreignUuid('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->string('contact_phone');
            $table->string('contact_name')->nullable();
            $table->string('contact_avatar')->nullable();
            $table->string('status')->default('open'); // open, closed, archived
            $table->timestamp('last_message_at')->nullable();
            $table->integer('unread_count')->default(0);
            $table->json('contact_info')->nullable();
            $table->json('labels')->nullable();
            $table->boolean('is_business')->default(false);
            $table->boolean('is_group')->default(false);
            $table->string('group_name')->nullable();
            $table->json('group_participants')->nullable();
            $table->timestamps();
            
            $table->unique(['connection_id', 'contact_phone']);
            $table->index(['connection_id', 'status']);
            $table->index('last_message_at');
        });

        // Messages table
        Schema::create('aura_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('chat_id')->constrained('aura_chats')->onDelete('cascade');
            $table->foreignUuid('sent_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('whatsapp_message_id')->nullable();
            $table->string('direction'); // inbound, outbound
            $table->string('type'); // text, image, video, audio, document, location, contact
            $table->json('content');
            $table->json('media')->nullable();
            $table->json('metadata')->nullable();
            $table->string('status')->default('pending'); // pending, sent, delivered, read, failed
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->text('error_message')->nullable();
            $table->boolean('is_template')->default(false);
            $table->string('template_name')->nullable();
            $table->json('template_params')->nullable();
            $table->timestamps();
            
            $table->index(['chat_id', 'created_at']);
            $table->index('whatsapp_message_id');
            $table->index(['direction', 'status']);
        });

        // Flows table
        Schema::create('aura_flows', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('connection_id')->constrained('aura_connections')->onDelete('cascade');
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('created_by')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('triggers')->nullable(); // keywords, events, conditions
            $table->json('structure'); // flow nodes and connections
            $table->json('variables')->nullable();
            $table->integer('execution_count')->default(0);
            $table->timestamp('last_executed_at')->nullable();
            $table->timestamps();
            
            $table->index(['connection_id', 'is_active']);
            $table->index('project_id');
        });

        // Flow Executions table
        Schema::create('aura_flow_executions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('flow_id')->constrained('aura_flows')->onDelete('cascade');
            $table->foreignUuid('chat_id')->constrained('aura_chats')->onDelete('cascade');
            $table->string('phone_number');
            $table->string('status')->default('running'); // running, completed, failed, paused
            $table->json('context')->nullable(); // execution variables
            $table->string('current_node_id')->nullable();
            $table->json('execution_history')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->index(['flow_id', 'status']);
            $table->index(['chat_id', 'created_at']);
        });

        // Flow Nodes table (for flow builder)
        Schema::create('aura_flow_nodes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('flow_id')->constrained('aura_flows')->onDelete('cascade');
            $table->string('node_id'); // unique within flow
            $table->string('type'); // message, condition, action, delay, etc
            $table->string('label')->nullable();
            $table->json('config'); // node-specific configuration
            $table->json('position')->nullable(); // x, y coordinates for UI
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->unique(['flow_id', 'node_id']);
            $table->index('flow_id');
        });

        // Templates table
        Schema::create('aura_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('connection_id')->constrained('aura_connections')->onDelete('cascade');
            $table->string('name');
            $table->string('language')->default('pt_BR');
            $table->string('category'); // marketing, utility, authentication
            $table->text('content');
            $table->json('variables')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->string('whatsapp_template_id')->nullable();
            $table->timestamps();
            
            $table->index(['connection_id', 'status']);
        });

        // Sessions table (for conversation context)
        Schema::create('aura_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('chat_id')->constrained('aura_chats')->onDelete('cascade');
            $table->json('context')->nullable();
            $table->json('variables')->nullable();
            $table->string('current_state')->nullable();
            $table->timestamp('last_interaction_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->index('chat_id');
            $table->index('expires_at');
        });

        // Stats table (for analytics)
        Schema::create('aura_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('connection_id')->constrained('aura_connections')->onDelete('cascade');
            $table->date('date');
            $table->integer('messages_sent')->default(0);
            $table->integer('messages_received')->default(0);
            $table->integer('chats_opened')->default(0);
            $table->integer('chats_closed')->default(0);
            $table->integer('flows_executed')->default(0);
            $table->decimal('response_time_avg', 8, 2)->nullable(); // in seconds
            $table->timestamps();
            
            $table->unique(['connection_id', 'date']);
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aura_stats');
        Schema::dropIfExists('aura_sessions');
        Schema::dropIfExists('aura_templates');
        Schema::dropIfExists('aura_flow_nodes');
        Schema::dropIfExists('aura_flow_executions');
        Schema::dropIfExists('aura_flows');
        Schema::dropIfExists('aura_messages');
        Schema::dropIfExists('aura_chats');
        Schema::dropIfExists('aura_connections');
    }
};
