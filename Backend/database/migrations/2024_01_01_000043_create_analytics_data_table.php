<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->nullable()->constrained('analytics_reports')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('metric_name');
            $table->string('dimension')->nullable();
            $table->decimal('value', 15, 2);
            $table->date('date');
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['report_id', 'date']);
            $table->index(['user_id', 'date']);
            $table->index(['metric_name', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_data');
    }
};
