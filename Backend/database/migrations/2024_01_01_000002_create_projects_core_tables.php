<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * 🏗️ MIGRAÇÃO CONSOLIDADA: PROJECTS & CORE.
     *
     * Sistema multi-tenant e configurações:
     * - Projects, Members, Modules
     * - Settings, Integrations
     * - Tags, Folders, Custom Fields
     * - Notifications, Webhooks
     * 
     * NOTA: Workflows movidos para migração 032
     */
    public function up(): void
    {
        // === PROJECTS ===
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('website')->nullable();
            $table->string('industry')->nullable();
            $table->string('timezone')->default('UTC');
            $table->string('currency')->default('BRL');
            $table->json('settings')->nullable();
            $table->json('modules')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('owner_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['slug', 'is_active']);
            $table->index('owner_id');
        });

        // Add foreign key to users table
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('current_project_id')->references('id')->on('projects')->onDelete('set null');
        });

        // === PROJECT MEMBERS ===
        Schema::create('project_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('role_id')->constrained();
            $table->json('permissions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('joined_at')->useCurrent();
            $table->foreignUuid('invited_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->unique(['project_id', 'user_id']);
        });

        // === MODULES ===
        Schema::create('modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('version')->default('1.0.0');
            $table->json('config')->nullable();
            $table->json('dependencies')->nullable();
            $table->boolean('is_core')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // === PROJECT MODULES ===
        Schema::create('project_modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('module_id')->constrained()->onDelete('cascade');
            $table->json('config')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->timestamp('enabled_at')->useCurrent();
            $table->foreignUuid('enabled_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->unique(['project_id', 'module_id']);
        });

        // === SETTINGS ===
        Schema::create('settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key');
            $table->json('value')->nullable();
            $table->string('type')->default('string');
            $table->text('description')->nullable();
            $table->string('group')->default('general');
            $table->boolean('is_public')->default(false);
            $table->boolean('is_encrypted')->default(false);
            $table->foreignUuid('project_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['key', 'project_id']);
            $table->index(['group', 'is_public']);
        });

        // === INTEGRATIONS ===
        Schema::create('integrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->string('provider');
            $table->string('type');
            $table->json('config_schema')->nullable();
            $table->string('icon')->nullable();
            $table->string('documentation_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['provider', 'type']);
        });

        // === PROJECT INTEGRATIONS ===
        Schema::create('project_integrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('integration_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->json('credentials');
            $table->json('config')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('connected_at')->useCurrent();
            $table->timestamp('last_sync_at')->nullable();
            $table->json('sync_status')->nullable();
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['project_id', 'is_active']);
        });

        // === TAGS ===
        Schema::create('tags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug');
            $table->string('color')->nullable();
            $table->text('description')->nullable();
            $table->string('type')->default('general');
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['slug', 'project_id']);
            $table->index(['project_id', 'type']);
        });

        // === TAGGABLES ===
        Schema::create('taggables', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tag_id')->constrained()->onDelete('cascade');
            $table->morphs('taggable');
            $table->timestamps();

            $table->unique(['tag_id', 'taggable_type', 'taggable_id']);
        });

        // === FOLDERS ===
        Schema::create('folders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignUuid('parent_id')->nullable();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->string('type')->default('general');
            $table->json('permissions')->nullable();
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['project_id', 'type']);
            $table->index('parent_id');
        });

        // === CUSTOM FIELDS ===
        Schema::create('custom_fields', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('label');
            $table->string('type');
            $table->json('options')->nullable();
            $table->json('validation')->nullable();
            $table->boolean('is_required')->default(false);
            $table->boolean('is_searchable')->default(false);
            $table->string('applies_to');
            $table->integer('sort_order')->default(0);
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index(['project_id', 'applies_to']);
        });

        // === CUSTOM FIELD VALUES ===
        Schema::create('custom_field_values', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('custom_field_id')->constrained()->onDelete('cascade');
            $table->morphs('entity');
            $table->json('value');
            $table->timestamps();

            $table->unique(['custom_field_id', 'entity_type', 'entity_id']);
        });

        // === NOTIFICATIONS ===
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable();
            $table->string('action_url')->nullable();
            $table->string('action_text')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['notifiable_type', 'notifiable_id', 'read_at']);
        });

        // === WEBHOOKS ===
        Schema::create('webhooks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('url');
            $table->json('events');
            $table->string('secret')->nullable();
            $table->json('headers')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_triggered_at')->nullable();
            $table->json('last_response')->nullable();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['project_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('webhooks');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('custom_field_values');
        Schema::dropIfExists('custom_fields');
        Schema::dropIfExists('folders');
        Schema::dropIfExists('taggables');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('project_integrations');
        Schema::dropIfExists('integrations');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('project_modules');
        Schema::dropIfExists('modules');
        Schema::dropIfExists('project_members');
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['current_project_id']);
        });
        Schema::dropIfExists('projects');
    }
};
