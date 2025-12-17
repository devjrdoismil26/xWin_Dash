<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class () extends Migration {
    /**
     * 🚀 OTIMIZAÇÃO DE ÍNDICES.
     *
     * Remove índices redundantes e adiciona índices compostos estratégicos.
     */
    public function up(): void
    {
        // === ÍNDICES COMPOSTOS ESTRATÉGICOS ===
        
        // Leads: Busca por projeto + status + score (comum em dashboards)
        Schema::table('leads', function (Blueprint $table) {
            $table->index(['project_id', 'status', 'score', 'created_at'], 'idx_leads_dashboard');
        });

        // Email Campaigns: Busca por projeto + status + scheduled
        Schema::table('email_campaigns', function (Blueprint $table) {
            $table->index(['project_id', 'status', 'scheduled_at'], 'idx_campaigns_schedule');
        });

        // Workflows: Busca por projeto + status + última execução
        Schema::table('workflows', function (Blueprint $table) {
            $table->index(['project_id', 'status', 'last_executed_at'], 'idx_workflows_execution');
        });

        // Tasks: Busca por projeto + status + prioridade + due_date
        Schema::table('tasks', function (Blueprint $table) {
            $table->index(['project_id', 'status', 'priority', 'due_date'], 'idx_tasks_priority');
        });

        // Social Posts: Busca por projeto + status + scheduled
        Schema::table('social_posts', function (Blueprint $table) {
            $table->index(['project_id', 'status', 'scheduled_at'], 'idx_social_schedule');
        });

        // Media Files: Busca por projeto + tipo + created
        Schema::table('media_files', function (Blueprint $table) {
            $table->index(['project_id', 'type', 'created_at'], 'idx_media_type');
        });

        // Products: Busca por projeto + status + categoria
        Schema::table('products', function (Blueprint $table) {
            $table->index(['project_id', 'status', 'category_id'], 'idx_products_category');
        });

        // Activity Logs: Busca por projeto + entity + created
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->index(['subject_type', 'subject_id', 'created_at'], 'idx_activity_subject');
        });

        // Universe Instances: Busca por user + active + accessed
        Schema::table('universe_instances', function (Blueprint $table) {
            $table->index(['user_id', 'is_active', 'last_accessed_at'], 'idx_universe_access');
        });

        // Aura Messages: Busca por connection + created (chat history)
        Schema::table('aura_messages', function (Blueprint $table) {
            $table->index(['connection_id', 'created_at', 'direction'], 'idx_aura_chat');
        });

        // === ÍNDICES PARCIAIS (PostgreSQL) ===
        
        // Índice apenas para registros ativos
        DB::statement("
            CREATE INDEX IF NOT EXISTS idx_leads_active 
            ON leads (project_id, score DESC) 
            WHERE status = 'active'
        ");

        DB::statement("
            CREATE INDEX IF NOT EXISTS idx_workflows_active 
            ON workflows (project_id, last_executed_at DESC) 
            WHERE status = 'active'
        ");

        DB::statement("
            CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled 
            ON email_campaigns (scheduled_at) 
            WHERE status = 'scheduled'
        ");

        // === ÍNDICES FULL-TEXT SEARCH ===
        
        // Busca textual em leads
        DB::statement("
            CREATE INDEX IF NOT EXISTS idx_leads_search 
            ON leads USING gin(to_tsvector('portuguese', 
                coalesce(name, '') || ' ' || 
                coalesce(email, '') || ' ' || 
                coalesce(company, '')
            ))
        ");

        // Busca textual em products
        DB::statement("
            CREATE INDEX IF NOT EXISTS idx_products_search 
            ON products USING gin(to_tsvector('portuguese', 
                coalesce(name, '') || ' ' || 
                coalesce(description, '')
            ))
        ");

        // === ÍNDICES PARA PERFORMANCE ===
        
        // Covering index para queries comuns
        DB::statement("
            CREATE INDEX IF NOT EXISTS idx_project_members_covering 
            ON project_members (project_id, user_id) 
            INCLUDE (role, is_active)
        ");
    }

    public function down(): void
    {
        // Remover índices compostos
        Schema::table('leads', function (Blueprint $table) {
            $table->dropIndex('idx_leads_dashboard');
        });

        Schema::table('email_campaigns', function (Blueprint $table) {
            $table->dropIndex('idx_campaigns_schedule');
        });

        Schema::table('workflows', function (Blueprint $table) {
            $table->dropIndex('idx_workflows_execution');
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('idx_tasks_priority');
        });

        Schema::table('social_posts', function (Blueprint $table) {
            $table->dropIndex('idx_social_schedule');
        });

        Schema::table('media_files', function (Blueprint $table) {
            $table->dropIndex('idx_media_type');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_category');
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex('idx_activity_subject');
        });

        Schema::table('universe_instances', function (Blueprint $table) {
            $table->dropIndex('idx_universe_access');
        });

        Schema::table('aura_messages', function (Blueprint $table) {
            $table->dropIndex('idx_aura_chat');
        });

        // Remover índices parciais
        DB::statement("DROP INDEX IF EXISTS idx_leads_active");
        DB::statement("DROP INDEX IF EXISTS idx_workflows_active");
        DB::statement("DROP INDEX IF EXISTS idx_campaigns_scheduled");

        // Remover índices full-text
        DB::statement("DROP INDEX IF EXISTS idx_leads_search");
        DB::statement("DROP INDEX IF EXISTS idx_products_search");

        // Remover covering index
        DB::statement("DROP INDEX IF EXISTS idx_project_members_covering");
    }
};
