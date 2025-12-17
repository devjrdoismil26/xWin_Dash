<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resource_allocations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('task_id')->nullable()->constrained('tasks')->onDelete('set null');
            $table->decimal('allocated_hours', 8, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();

            $table->index(['project_id', 'user_id']);
            $table->index('task_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resource_allocations');
    }
};
