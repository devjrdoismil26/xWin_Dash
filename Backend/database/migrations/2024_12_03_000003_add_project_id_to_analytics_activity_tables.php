<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Add project_id to Analytics and Activity Tables
 * 
 * SECURITY FIX (MIG-003): Adiciona suporte multi-tenancy às tabelas de analytics e activity
 * 
 * Tabelas afetadas:
 * - analytics_data
 * - activity_log
 */
return new class extends Migration
{
    public function up(): void
    {
        // analytics_data
        Schema::table('analytics_data', function (Blueprint $table) {
            if (!Schema::hasColumn('analytics_data', 'project_id')) {
                $table->uuid('project_id')->nullable()->after('id');
                $table->index('project_id');
                
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            }
        });

        // activity_log
        Schema::table('activity_log', function (Blueprint $table) {
            if (!Schema::hasColumn('activity_log', 'project_id')) {
                $table->uuid('project_id')->nullable()->after('id');
                $table->index('project_id');
                
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        $tables = ['analytics_data', 'activity_log'];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'project_id')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropForeign(['project_id']);
                    $table->dropIndex(['project_id']);
                    $table->dropColumn('project_id');
                });
            }
        }
    }
};
