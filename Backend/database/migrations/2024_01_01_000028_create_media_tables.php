<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Folders table
        Schema::create('media_folders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('parent_id')->nullable()->constrained('media_folders')->onDelete('cascade');
            $table->string('name');
            $table->string('full_path')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['project_id', 'parent_id']);
            $table->index('user_id');
        });

        // Media table
        Schema::create('media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('folder_id')->nullable()->constrained('media_folders')->onDelete('set null');
            $table->string('disk')->default('public'); // public, s3, etc
            $table->string('path');
            $table->string('filename');
            $table->string('mime_type');
            $table->string('type'); // image, video, audio, document
            $table->unsignedBigInteger('size')->default(0); // in bytes
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->json('tags')->nullable();
            $table->nullableMorphs('mediable'); // polymorphic relation
            $table->json('metadata')->nullable(); // dimensions, duration, etc
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['project_id', 'type']);
            $table->index(['user_id', 'created_at']);
            $table->index('folder_id');
            // Note: nullableMorphs() already creates index for mediable_type and mediable_id
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
        Schema::dropIfExists('media_folders');
    }
};
