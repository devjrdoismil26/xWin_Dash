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
        Schema::create('landing_pages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->text('content')->nullable(); // HTML content
            $table->text('hero_section')->nullable(); // JSON: {title, subtitle, image, cta}
            $table->text('features_section')->nullable(); // JSON array of features
            $table->text('testimonials_section')->nullable(); // JSON array of testimonials
            $table->text('pricing_section')->nullable(); // JSON: pricing plans
            $table->text('cta_section')->nullable(); // JSON: call-to-action
            $table->text('footer_section')->nullable(); // JSON: footer content
            $table->text('custom_css')->nullable();
            $table->text('custom_js')->nullable();
            $table->text('analytics_code')->nullable();
            $table->string('status')->default('draft'); // draft, published, archived
            $table->boolean('is_active')->default(true);
            $table->integer('views_count')->default(0);
            $table->integer('conversions_count')->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0.00);
            $table->uuid('product_id')->nullable(); // Associated product
            $table->uuid('lead_capture_form_id')->nullable(); // Associated form
            $table->uuid('project_id');
            $table->uuid('created_by');
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            $table->foreign('lead_capture_form_id')->references('id')->on('lead_capture_forms')->onDelete('set null');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');

            // Indexes
            $table->index(['slug']);
            $table->index(['status', 'is_active']);
            $table->index(['project_id']);
            $table->index(['product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_pages');
    }
};
