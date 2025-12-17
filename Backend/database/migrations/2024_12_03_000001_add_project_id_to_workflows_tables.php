<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Add project_id to Workflows Tables
 * 
 * SECURITY FIX (MIG-001): Adiciona suporte multi-tenancy às tabelas de workflows
 * 
 * Tabelas afetadas:
 * - workflows
 * - workflow_steps  
 * - workflow_executions
 */
return new class extends Migration
{
    public function up(): void
    {
        // Adicionar project_id à tabela workflows
        Schema::table('workflows', function (Blueprint $table) {
            if (!Schema::hasColumn('workflows', 'project_id')) {
                $table->uuid('project_id')->nullable()->after('user_id');
                $table->index('project_id');
                
                // Foreign key - nullable para não quebrar dados existentes
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            }
        });

        // Adicionar project_id à tabela workflow_executions
        Schema::table('workflow_executions', function (Blueprint $table) {
            if (!Schema::hasColumn('workflow_executions', 'project_id')) {
                $table->uuid('project_id')->nullable()->after('workflow_id');
                $table->index('project_id');
                
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            }
        });

        // workflow_steps herda o project_id através do workflow_id,
        // mas adicionar para queries diretas se necessário
        if (Schema::hasTable('workflow_steps')) {
            Schema::table('workflow_steps', function (Blueprint $table) {
                if (!Schema::hasColumn('workflow_steps', 'project_id')) {
                    $table->uuid('project_id')->nullable()->after('workflow_id');
                    $table->index('project_id');
                    
                    $table->foreign('project_id')
                        ->references('id')
                        ->on('projects')
                        ->onDelete('cascade');
                }
            });
        }
    }

    public function down(): void
    {
        Schema::table('workflows', function (Blueprint $table) {
            if (Schema::hasColumn('workflows', 'project_id')) {
                $table->dropForeign(['project_id']);
                $table->dropIndex(['project_id']);
                $table->dropColumn('project_id');
            }
        });

        Schema::table('workflow_executions', function (Blueprint $table) {
            if (Schema::hasColumn('workflow_executions', 'project_id')) {
                $table->dropForeign(['project_id']);
                $table->dropIndex(['project_id']);
                $table->dropColumn('project_id');
            }
        });

        if (Schema::hasTable('workflow_steps')) {
            Schema::table('workflow_steps', function (Blueprint $table) {
                if (Schema::hasColumn('workflow_steps', 'project_id')) {
                    $table->dropForeign(['project_id']);
                    $table->dropIndex(['project_id']);
                    $table->dropColumn('project_id');
                }
            });
        }
    }
};
