<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Add user_id to widgets table
 * 
 * SECURITY FIX (MIG-006): Adiciona user_id à tabela widgets para rastreamento de ownership
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('widgets')) {
            Schema::table('widgets', function (Blueprint $table) {
                if (!Schema::hasColumn('widgets', 'user_id')) {
                    $table->uuid('user_id')->nullable()->after('project_id');
                    $table->index('user_id');
                    
                    $table->foreign('user_id')
                        ->references('id')
                        ->on('users')
                        ->onDelete('cascade');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('widgets') && Schema::hasColumn('widgets', 'user_id')) {
            Schema::table('widgets', function (Blueprint $table) {
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                    // Ignorar
                }
                $table->dropIndex(['user_id']);
                $table->dropColumn('user_id');
            });
        }
    }
};
