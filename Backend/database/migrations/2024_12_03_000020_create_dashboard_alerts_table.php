<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_alerts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->uuid('project_id')->nullable();
            $table->string('type')->default('info'); // info, warning, error, success
            $table->string('title');
            $table->text('message');
            $table->json('metadata')->nullable();
            $table->boolean('read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('project_id');
            $table->index(['user_id', 'read']);
            $table->index(['user_id', 'project_id', 'read']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_alerts');
    }
};
