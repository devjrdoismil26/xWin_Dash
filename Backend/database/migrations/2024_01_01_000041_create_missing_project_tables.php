<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Project Milestones
        Schema::create('project_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('due_date'); // Changed from target_date to match code
            $table->date('completed_date')->nullable();
            $table->string('status')->default('pending'); // pending, in_progress, completed, cancelled
            $table->integer('progress_percentage')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            $table->index(['project_id', 'status']);
            $table->index('due_date');
        });

        // Project Resources
        Schema::create('project_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('type'); // human, material, equipment, financial (matches code)
            $table->text('description')->nullable();
            $table->decimal('cost_per_unit', 15, 2)->default(0); // Changed from cost to match code
            $table->string('unit')->nullable(); // hours, days, units, etc.
            $table->decimal('quantity', 10, 2)->default(1);
            $table->string('status')->default('available'); // available, allocated, exhausted
            $table->foreignId('allocated_to')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            $table->index(['project_id', 'type']);
            $table->index('status');
        });

        // Project Budgets
        Schema::create('project_budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('category'); // labor, materials, equipment, overhead, contingency
            $table->decimal('allocated_amount', 15, 2);
            $table->decimal('spent_amount', 15, 2)->default(0);
            $table->decimal('remaining_amount', 15, 2)->virtualAs('allocated_amount - spent_amount');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['project_id', 'category']);
        });

        // Project Risks
        Schema::create('project_risks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('category')->nullable(); // technical, financial, schedule, resource, external
            $table->string('status')->default('identified'); // identified, analyzing, mitigating, resolved, closed
            $table->string('severity')->default('medium'); // low, medium, high, critical
            $table->string('probability')->default('medium'); // low, medium, high
            $table->text('impact')->nullable();
            $table->text('mitigation_plan')->nullable();
            $table->foreignId('owner_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('identified_date');
            $table->date('resolved_date')->nullable();
            $table->timestamps();
            
            $table->index(['project_id', 'status']);
            $table->index(['project_id', 'severity']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_risks');
        Schema::dropIfExists('project_budgets');
        Schema::dropIfExists('project_resources');
        Schema::dropIfExists('project_milestones');
    }
};
