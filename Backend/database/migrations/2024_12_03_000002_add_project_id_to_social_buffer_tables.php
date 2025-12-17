<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Add project_id to Social Buffer Tables
 * 
 * SECURITY FIX (MIG-002): Adiciona suporte multi-tenancy às tabelas de social buffer
 * 
 * Tabelas afetadas:
 * - social_accounts
 * - social_posts
 * - social_schedules
 * - hashtag_groups
 * - shortened_links
 * - social_analytics
 * - social_interactions
 * - social_media
 */
return new class extends Migration
{
    public function up(): void
    {
        // social_accounts
        Schema::table('social_accounts', function (Blueprint $table) {
            if (!Schema::hasColumn('social_accounts', 'project_id')) {
                $table->uuid('project_id')->nullable()->after('user_id');
                $table->index('project_id');
                
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            }
        });

        // social_posts
        Schema::table('social_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('social_posts', 'project_id')) {
                $table->uuid('project_id')->nullable()->after('user_id');
                $table->index('project_id');
                
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            }
        });

        // social_schedules
        Schema::table('social_schedules', function (Blueprint $table) {
            if (!Schema::hasColumn('social_schedules', 'project_id')) {
                $table->uuid('project_id')->nullable()->after('user_id');
                $table->index('project_id');
                
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            }
        });

        // hashtag_groups
        Schema::table('hashtag_groups', function (Blueprint $table) {
            if (!Schema::hasColumn('hashtag_groups', 'project_id')) {
                $table->uuid('project_id')->nullable()->after('user_id');
                $table->index('project_id');
                
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            }
        });

        // shortened_links
        Schema::table('shortened_links', function (Blueprint $table) {
            if (!Schema::hasColumn('shortened_links', 'project_id')) {
                $table->uuid('project_id')->nullable()->after('user_id');
                $table->index('project_id');
                
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            }
        });

        // social_analytics (se existir)
        if (Schema::hasTable('social_analytics')) {
            Schema::table('social_analytics', function (Blueprint $table) {
                if (!Schema::hasColumn('social_analytics', 'project_id')) {
                    $table->uuid('project_id')->nullable()->after('id');
                    $table->index('project_id');
                    
                    $table->foreign('project_id')
                        ->references('id')
                        ->on('projects')
                        ->onDelete('cascade');
                }
            });
        }

        // social_interactions (se existir)
        if (Schema::hasTable('social_interactions')) {
            Schema::table('social_interactions', function (Blueprint $table) {
                if (!Schema::hasColumn('social_interactions', 'project_id')) {
                    $table->uuid('project_id')->nullable()->after('id');
                    $table->index('project_id');
                    
                    $table->foreign('project_id')
                        ->references('id')
                        ->on('projects')
                        ->onDelete('cascade');
                }
            });
        }

        // social_media (se existir)
        if (Schema::hasTable('social_media')) {
            Schema::table('social_media', function (Blueprint $table) {
                if (!Schema::hasColumn('social_media', 'project_id')) {
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
        $tables = [
            'social_accounts',
            'social_posts',
            'social_schedules',
            'hashtag_groups',
            'shortened_links',
            'social_analytics',
            'social_interactions',
            'social_media',
        ];

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
