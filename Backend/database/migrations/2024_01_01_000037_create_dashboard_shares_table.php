<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_shares', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dashboard_id')->nullable(); // Can be null for now
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('token', 64)->unique();
            $table->string('share_url');
            $table->json('permissions')->nullable(); // ['view', 'edit', 'export']
            $table->timestamp('expires_at')->nullable();
            $table->integer('view_count')->default(0);
            $table->timestamp('last_accessed_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['token', 'is_active']);
            $table->index(['user_id', 'is_active']);
            $table->index('expires_at');
            
            // Add foreign key constraint only if dashboards table exists
            if (Schema::hasTable('dashboards')) {
                $table->foreign('dashboard_id')->references('id')->on('dashboards')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_shares');
    }
};
