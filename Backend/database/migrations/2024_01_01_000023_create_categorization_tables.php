<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 🏗️ CATEGORIZATION TABLES
     * 
     * Sistema de categorização universal para todos os módulos
     */
    public function up(): void
    {
        // === CATEGORIES ===
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('type')->default('general'); // general, product, lead, content, etc
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->uuid('parent_id')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->foreignUuid('project_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'is_active']);
            $table->index('parent_id');
            $table->index('slug');
        });

        // === CATEGORY HIERARCHIES ===
        Schema::create('category_hierarchies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ancestor_id')->constrained('categories')->onDelete('cascade');
            $table->foreignUuid('descendant_id')->constrained('categories')->onDelete('cascade');
            $table->integer('depth')->default(0);
            $table->timestamps();

            $table->unique(['ancestor_id', 'descendant_id']);
            $table->index('depth');
        });

        // === CATEGORIZABLES (Polimórfica) ===
        Schema::create('categorizables', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained()->onDelete('cascade');
            $table->uuidMorphs('categorizable');
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->unique(['category_id', 'categorizable_id', 'categorizable_type'], 'categorizable_unique');
            // Índice já criado automaticamente por uuidMorphs, não precisa criar manualmente
        });

        // === CATEGORY RULES ===
        Schema::create('category_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained()->onDelete('cascade');
            $table->string('field');
            $table->string('operator'); // equals, contains, starts_with, etc
            $table->string('value');
            $table->integer('priority')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['category_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_rules');
        Schema::dropIfExists('categorizables');
        Schema::dropIfExists('category_hierarchies');
        Schema::dropIfExists('categories');
    }
};
