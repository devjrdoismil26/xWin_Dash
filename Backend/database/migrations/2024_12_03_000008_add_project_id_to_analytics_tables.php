<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Add project_id to Analytics Tables
 * 
 * SECURITY FIX (MIG-008): Adiciona suporte multi-tenancy às tabelas de analytics
 * 
 * Tabelas afetadas:
 * - analytics_events
 * - analytics_metrics
 */
return new class extends Migration
{
    public function up(): void
    {
        // analytics_events
        if (Schema::hasTable('analytics_events')) {
            Schema::table('analytics_events', function (Blueprint $table) {
                if (!Schema::hasColumn('analytics_events', 'project_id')) {
                    $table->uuid('project_id')->nullable()->after('user_id');
                    $table->index('project_id');
                    
                    $table->foreign('project_id')
                        ->references('id')
                        ->on('projects')
                        ->onDelete('cascade');
                }
            });
        }

        // analytics_metrics
        if (Schema::hasTable('analytics_metrics')) {
            Schema::table('analytics_metrics', function (Blueprint $table) {
                if (!Schema::hasColumn('analytics_metrics', 'project_id')) {
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

    public function down(): void
    {
        $tables = ['analytics_events', 'analytics_metrics'];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'project_id')) {
                Schema::table($tableName, function (Blueprint $table) {
                    try {
                        $table->dropForeign(['project_id']);
                    } catch (\Exception $e) {
                        // Ignorar
                    }
                    try {
                        $table->dropIndex(['project_id']);
                    } catch (\Exception $e) {
                        // Ignorar
                    }
                    $table->dropColumn('project_id');
                });
            }
        }
    }
};
