<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Ensure project_id exists in widgets table
 * 
 * SECURITY FIX (MIG-007): Garante que a coluna project_id existe na tabela widgets
 * Esta migração é idempotente e pode ser executada múltiplas vezes com segurança
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('widgets')) {
            Schema::table('widgets', function (Blueprint $table) {
                // Verificar se a coluna não existe antes de adicionar
                if (!Schema::hasColumn('widgets', 'project_id')) {
                    $table->uuid('project_id')->nullable()->after('id');
                    $table->index('project_id');
                    
                    // Adicionar foreign key apenas se não existir
                    try {
                        $table->foreign('project_id')
                            ->references('id')
                            ->on('projects')
                            ->onDelete('cascade');
                    } catch (\Exception $e) {
                        // Foreign key já existe ou tabela projects não existe
                        // Continuar sem erro
                    }
                }
            });
            
            // O índice já é criado automaticamente pelo Schema::table acima
            // Não é necessário criar manualmente
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('widgets') && Schema::hasColumn('widgets', 'project_id')) {
            Schema::table('widgets', function (Blueprint $table) {
                try {
                    $table->dropForeign(['project_id']);
                } catch (\Exception $e) {
                    // Foreign key não existe, continuar
                }
                try {
                    $table->dropIndex(['project_id']);
                } catch (\Exception $e) {
                    // Índice não existe, continuar
                }
                $table->dropColumn('project_id');
            });
        }
    }
};
