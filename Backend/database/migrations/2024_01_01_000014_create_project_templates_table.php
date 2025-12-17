<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category')->default('general'); // general, web_development, mobile_app, marketing, design, research
            $table->json('template_data')->nullable(); // Project structure, default settings, etc.
            $table->json('default_tasks')->nullable(); // Default tasks to create
            $table->json('default_settings')->nullable(); // Default project settings
            $table->json('modules')->nullable(); // Default modules to enable
            $table->string('industry')->nullable();
            $table->string('timezone')->nullable();
            $table->string('currency')->nullable();
            $table->boolean('is_public')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->integer('usage_count')->default(0);
            $table->uuid('created_by');
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');

            // Indexes
            $table->index(['category']);
            $table->index(['is_public']);
            $table->index(['is_featured']);
            $table->index(['usage_count']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_templates');
    }
};
