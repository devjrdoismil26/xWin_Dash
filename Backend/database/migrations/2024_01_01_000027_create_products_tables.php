<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Products table
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('status')->default('draft'); // draft, active, inactive
            $table->string('sku')->nullable()->unique();
            $table->integer('stock')->nullable()->default(0);
            $table->string('image_url')->nullable();
            $table->string('category_id')->nullable();
            $table->json('tags')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('dimensions')->nullable(); // width, height, length
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['project_id', 'status']);
            $table->index('sku');
            $table->index('category_id');
        });

        // NOTE: landing_pages and lead_capture_forms tables already exist
        // - landing_pages: created in 010_create_landing_pages_table.php
        // - lead_capture_forms: created in 005_create_leads_crm_tables.php

        // Update product_variations if exists
        if (Schema::hasTable('product_variations')) {
            Schema::table('product_variations', function (Blueprint $table) {
                // Add FK if not exists
                if (!Schema::hasColumn('product_variations', 'product_id')) {
                    $table->foreignUuid('product_id')->after('id')->constrained('products')->onDelete('cascade');
                }
            });
        }
    }

    public function down(): void
    {
        // Remove FK from product_variations if exists
        if (Schema::hasTable('product_variations')) {
            Schema::table('product_variations', function (Blueprint $table) {
                if (Schema::hasColumn('product_variations', 'product_id')) {
                    $table->dropForeign(['product_id']);
                }
            });
        }

        Schema::dropIfExists('products');
    }
};
