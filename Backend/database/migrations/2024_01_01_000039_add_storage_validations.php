<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * 📦 STORAGE VALIDATIONS & QUOTAS.
     *
     * Adiciona validações, quotas e políticas de retenção para storage.
     */
    public function up(): void
    {
        // === STORAGE QUOTAS ===
        Schema::create('storage_quotas', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('project_id')->constrained()->onDelete('cascade');
            $table->bigInteger('max_storage_bytes')->default(10737418240); // 10GB default
            $table->bigInteger('used_storage_bytes')->default(0);
            $table->integer('max_files')->default(10000);
            $table->integer('used_files')->default(0);
            $table->timestamps();

            $table->index('project_id');
        });

        // === FILE VALIDATIONS ===
        Schema::create('file_validation_rules', function (Blueprint $table) {
            $table->id();
            $table->string('file_type'); // image, video, document, audio
            $table->json('allowed_extensions'); // ['jpg', 'png', 'gif']
            $table->bigInteger('max_size_bytes'); // Tamanho máximo
            $table->json('mime_types'); // ['image/jpeg', 'image/png']
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('file_type');
        });

        // === STORAGE CLEANUP LOGS ===
        Schema::create('storage_cleanup_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('project_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('cleanup_type'); // orphaned, expired, deleted
            $table->integer('files_removed')->default(0);
            $table->bigInteger('bytes_freed')->default(0);
            $table->timestamp('executed_at')->useCurrent();
            $table->json('details')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'executed_at']);
        });

        // Adicionar campos de validação na tabela media_files
        Schema::table('media_files', function (Blueprint $table) {
            $table->bigInteger('size_bytes')->nullable()->after('size');
            $table->timestamp('expires_at')->nullable()->after('updated_at');
            $table->boolean('is_orphaned')->default(false)->after('expires_at');
            $table->timestamp('last_accessed_at')->nullable()->after('is_orphaned');
            
            $table->index('expires_at');
            $table->index(['is_orphaned', 'created_at']);
        });

        // Inserir regras padrão de validação
        DB::table('file_validation_rules')->insert([
            [
                'file_type' => 'image',
                'allowed_extensions' => json_encode(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']),
                'max_size_bytes' => 10485760, // 10MB
                'mime_types' => json_encode(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'file_type' => 'video',
                'allowed_extensions' => json_encode(['mp4', 'mov', 'avi', 'webm']),
                'max_size_bytes' => 524288000, // 500MB
                'mime_types' => json_encode(['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'file_type' => 'document',
                'allowed_extensions' => json_encode(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']),
                'max_size_bytes' => 52428800, // 50MB
                'mime_types' => json_encode([
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'text/plain'
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'file_type' => 'audio',
                'allowed_extensions' => json_encode(['mp3', 'wav', 'ogg', 'm4a']),
                'max_size_bytes' => 104857600, // 100MB
                'mime_types' => json_encode(['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::table('media_files', function (Blueprint $table) {
            $table->dropColumn(['size_bytes', 'expires_at', 'is_orphaned', 'last_accessed_at']);
        });

        Schema::dropIfExists('storage_cleanup_logs');
        Schema::dropIfExists('file_validation_rules');
        Schema::dropIfExists('storage_quotas');
    }
};
