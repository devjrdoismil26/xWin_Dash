<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Add project_id to AI and Universe Tables
 * 
 * SECURITY FIX (MIG-004): Adiciona suporte multi-tenancy às tabelas de AI e Universe
 * 
 * Tabelas afetadas:
 * - ai_generations
 * - ai_providers
 * - chat_conversations
 * - chat_messages
 * - universe_instances
 * - universe_templates
 * - universe_snapshots
 */
return new class extends Migration
{
    public function up(): void
    {
        // AI Tables
        $aiTables = ['ai_generations', 'chat_conversations', 'chat_messages'];
        
        foreach ($aiTables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    if (!Schema::hasColumn($tableName, 'project_id')) {
                        $table->uuid('project_id')->nullable()->after('id');
                        $table->index('project_id');
                        
                        $table->foreign('project_id')
                            ->references('id')
                            ->on('projects')
                            ->onDelete('cascade');
                    }
                });
            }
        }

        // ai_providers - pode ser global ou por projeto
        if (Schema::hasTable('ai_providers')) {
            Schema::table('ai_providers', function (Blueprint $table) {
                if (!Schema::hasColumn('ai_providers', 'project_id')) {
                    $table->uuid('project_id')->nullable()->after('id');
                    $table->index('project_id');
                    
                    // Nullable porque pode haver providers globais
                    $table->foreign('project_id')
                        ->references('id')
                        ->on('projects')
                        ->onDelete('set null');
                }
            });
        }

        // Universe Tables
        $universeTables = ['universe_instances', 'universe_templates', 'universe_snapshots'];
        
        foreach ($universeTables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    if (!Schema::hasColumn($tableName, 'project_id')) {
                        $table->uuid('project_id')->nullable()->after('id');
                        $table->index('project_id');
                        
                        $table->foreign('project_id')
                            ->references('id')
                            ->on('projects')
                            ->onDelete('cascade');
                    }
                });
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'ai_generations',
            'ai_providers',
            'chat_conversations',
            'chat_messages',
            'universe_instances',
            'universe_templates',
            'universe_snapshots',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'project_id')) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    // Determinar o nome da foreign key
                    $foreignKeyName = $tableName . '_project_id_foreign';
                    
                    try {
                        $table->dropForeign([$foreignKeyName]);
                    } catch (\Exception $e) {
                        // Tentar nome alternativo
                        try {
                            $table->dropForeign(['project_id']);
                        } catch (\Exception $e2) {
                            // Ignorar se não existir
                        }
                    }
                    
                    $table->dropIndex(['project_id']);
                    $table->dropColumn('project_id');
                });
            }
        }
    }
};
