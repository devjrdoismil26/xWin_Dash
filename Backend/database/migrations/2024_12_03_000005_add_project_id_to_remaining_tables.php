<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Add project_id to Remaining Tables
 * 
 * SECURITY FIX (MIG-005): Adiciona suporte multi-tenancy às tabelas restantes
 * 
 * Tabelas afetadas:
 * - products
 * - product_variations
 * - leads
 * - lead_status_history
 * - tags
 * - integrations
 * - widgets
 * - dashboard_layouts
 * - dashboard_shares
 * - ads_accounts
 * - ads_campaigns
 * - ads_creatives
 */
return new class extends Migration
{
    public function up(): void
    {
        // Products Tables
        $productTables = ['products', 'product_variations'];
        foreach ($productTables as $tableName) {
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

        // Leads Tables
        $leadsTables = ['leads', 'lead_status_history'];
        foreach ($leadsTables as $tableName) {
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

        // Tags
        if (Schema::hasTable('tags')) {
            Schema::table('tags', function (Blueprint $table) {
                if (!Schema::hasColumn('tags', 'project_id')) {
                    $table->uuid('project_id')->nullable()->after('id');
                    $table->index('project_id');
                    
                    $table->foreign('project_id')
                        ->references('id')
                        ->on('projects')
                        ->onDelete('cascade');
                }
            });
        }

        // Integrations
        if (Schema::hasTable('integrations')) {
            Schema::table('integrations', function (Blueprint $table) {
                if (!Schema::hasColumn('integrations', 'project_id')) {
                    $table->uuid('project_id')->nullable()->after('id');
                    $table->index('project_id');
                    
                    $table->foreign('project_id')
                        ->references('id')
                        ->on('projects')
                        ->onDelete('cascade');
                }
            });
        }

        // Dashboard Tables
        $dashboardTables = ['widgets', 'dashboard_layouts', 'dashboard_shares'];
        foreach ($dashboardTables as $tableName) {
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

        // ADStool Tables
        $adsTables = ['ads_accounts', 'ads_campaigns', 'ads_creatives'];
        foreach ($adsTables as $tableName) {
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

        // Settings (pode ter settings por projeto)
        if (Schema::hasTable('settings')) {
            Schema::table('settings', function (Blueprint $table) {
                if (!Schema::hasColumn('settings', 'project_id')) {
                    $table->uuid('project_id')->nullable()->after('id');
                    $table->index('project_id');
                    
                    // Nullable para settings globais
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
        $tables = [
            'products',
            'product_variations',
            'leads',
            'lead_status_history',
            'tags',
            'integrations',
            'widgets',
            'dashboard_layouts',
            'dashboard_shares',
            'ads_accounts',
            'ads_campaigns',
            'ads_creatives',
            'settings',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'project_id')) {
                Schema::table($tableName, function (Blueprint $table) {
                    try {
                        $table->dropForeign(['project_id']);
                    } catch (\Exception $e) {
                        // Ignorar
                    }
                    $table->dropIndex(['project_id']);
                    $table->dropColumn('project_id');
                });
            }
        }
    }
};
