<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * 🏗️ MIGRAÇÃO CONSOLIDADA: LEADS & CRM.
     *
     * Sistema completo de CRM:
     * - Leads, Activities, Segments
     * - Scoring, Forms, Sources
     * - Notes, Duplicates, Imports
     */
    public function up(): void
    {
        // === LEADS ===
        Schema::create('leads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('position')->nullable();
            $table->string('website')->nullable();
            $table->text('notes')->nullable();
            $table->string('source')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('utm_term')->nullable();
            $table->json('address')->nullable();
            $table->string('status')->default('new');
            $table->integer('score')->default(0);
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamp('converted_at')->nullable();
            $table->decimal('value', 15, 2)->nullable();
            $table->foreignUuid('assigned_to')->nullable()->constrained('users');
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['project_id', 'status', 'score']);
            $table->index(['email', 'project_id']);
            $table->index(['phone', 'project_id']);
            $table->index(['assigned_to', 'status']);
            $table->index('last_activity_at');
        });

        // === LEAD ACTIVITIES ===
        Schema::create('lead_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('lead_id')->constrained()->onDelete('cascade');
            $table->string('type');
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('performed_at')->useCurrent();
            $table->foreignUuid('performed_by')->nullable()->constrained('users');
            $table->string('source')->nullable();
            $table->timestamps();

            $table->index(['lead_id', 'performed_at']);
            $table->index(['type', 'performed_at']);
        });

        // === LEAD SEGMENTS ===
        Schema::create('lead_segments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('conditions');
            $table->string('type')->default('dynamic');
            $table->integer('leads_count')->default(0);
            $table->timestamp('last_updated_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['project_id', 'is_active']);
        });

        // === LEAD SEGMENT MEMBERS ===
        Schema::create('lead_segment_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('segment_id')->constrained('lead_segments')->onDelete('cascade');
            $table->foreignUuid('lead_id')->constrained()->onDelete('cascade');
            $table->timestamp('added_at')->useCurrent();
            $table->string('source')->default('automatic');
            $table->timestamps();

            $table->unique(['segment_id', 'lead_id']);
        });

        // === LEAD SCORING RULES ===
        Schema::create('lead_scoring_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('trigger');
            $table->json('conditions')->nullable();
            $table->integer('points');
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index(['project_id', 'is_active', 'priority']);
        });

        // === LEAD SCORE HISTORY ===
        Schema::create('lead_score_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('lead_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('rule_id')->nullable()->constrained('lead_scoring_rules')->onDelete('set null');
            $table->integer('points_change');
            $table->integer('total_score_before');
            $table->integer('total_score_after');
            $table->string('reason');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['lead_id', 'created_at']);
        });

        // === LEAD CAPTURE FORMS ===
        Schema::create('lead_capture_forms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('slug');
            $table->json('fields');
            $table->json('settings')->nullable();
            $table->string('success_message')->nullable();
            $table->string('redirect_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('submissions_count')->default(0);
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->unique(['slug', 'project_id']);
        });

        // === FORM SUBMISSIONS ===
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_id')->constrained('lead_capture_forms')->onDelete('cascade');
            $table->foreignUuid('lead_id')->nullable()->constrained()->onDelete('set null');
            $table->json('data');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referrer')->nullable();
            $table->json('utm_parameters')->nullable();
            $table->boolean('is_processed')->default(false);
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['form_id', 'created_at']);
            $table->index(['is_processed', 'created_at']);
        });

        // === LEAD SOURCES ===
        Schema::create('lead_sources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type');
            $table->string('category')->nullable();
            $table->json('tracking_parameters')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('leads_count')->default(0);
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index(['project_id', 'type']);
        });

        // === LEAD NOTES ===
        Schema::create('lead_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('lead_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->string('type')->default('note');
            $table->boolean('is_private')->default(false);
            $table->timestamp('scheduled_at')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['lead_id', 'type']);
            $table->index(['created_by', 'scheduled_at']);
        });

        // === LEAD DUPLICATES ===
        Schema::create('lead_duplicates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('original_lead_id')->constrained('leads')->onDelete('cascade');
            $table->foreignUuid('duplicate_lead_id')->constrained('leads')->onDelete('cascade');
            $table->decimal('similarity_score', 5, 4);
            $table->json('matching_fields');
            $table->string('status')->default('pending');
            $table->timestamp('resolved_at')->nullable();
            $table->foreignUuid('resolved_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->unique(['original_lead_id', 'duplicate_lead_id']);
            $table->index('status');
        });

        // === LEAD IMPORTS ===
        Schema::create('lead_imports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('filename');
            $table->string('original_filename');
            $table->integer('total_records');
            $table->integer('processed_records')->default(0);
            $table->integer('successful_records')->default(0);
            $table->integer('failed_records')->default(0);
            $table->json('mapping')->nullable();
            $table->json('errors')->nullable();
            $table->string('status')->default('pending');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('imported_by')->constrained('users');
            $table->timestamps();

            $table->index(['project_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_imports');
        Schema::dropIfExists('lead_duplicates');
        Schema::dropIfExists('lead_notes');
        Schema::dropIfExists('lead_sources');
        Schema::dropIfExists('form_submissions');
        Schema::dropIfExists('lead_capture_forms');
        Schema::dropIfExists('lead_score_history');
        Schema::dropIfExists('lead_scoring_rules');
        Schema::dropIfExists('lead_segment_members');
        Schema::dropIfExists('lead_segments');
        Schema::dropIfExists('lead_activities');
        Schema::dropIfExists('leads');
    }
};
