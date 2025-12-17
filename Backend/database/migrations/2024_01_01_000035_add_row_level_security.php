<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class () extends Migration {
    /**
     * 🔒 ROW LEVEL SECURITY (RLS) - PostgreSQL.
     *
     * Implementa políticas de segurança em nível de linha para multi-tenancy.
     * Garante isolamento de dados entre projetos/tenants.
     */
    public function up(): void
    {
        // Função helper para obter user_id do contexto
        DB::statement("
            CREATE OR REPLACE FUNCTION current_user_id()
            RETURNS UUID AS $$
            BEGIN
                RETURN current_setting('app.current_user_id', true)::UUID;
            EXCEPTION
                WHEN OTHERS THEN
                    RETURN NULL;
            END;
            $$ LANGUAGE plpgsql STABLE;
        ");

        // === PROJECTS - Isolamento por membership ===
        DB::statement("ALTER TABLE projects ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY project_isolation ON projects
            FOR ALL
            USING (
                id IN (
                    SELECT project_id FROM project_members 
                    WHERE user_id = current_user_id()
                )
                OR owner_id = current_user_id()
            )
        ");

        // === LEADS - Isolamento por projeto ===
        DB::statement("ALTER TABLE leads ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY leads_isolation ON leads
            FOR ALL
            USING (
                project_id IN (
                    SELECT project_id FROM project_members 
                    WHERE user_id = current_user_id()
                )
            )
        ");

        // === EMAIL CAMPAIGNS - Isolamento por projeto ===
        DB::statement("ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY email_campaigns_isolation ON email_campaigns
            FOR ALL
            USING (
                project_id IN (
                    SELECT project_id FROM project_members 
                    WHERE user_id = current_user_id()
                )
            )
        ");

        // === AURA MESSAGES - Isolamento por projeto ===
        DB::statement("ALTER TABLE aura_messages ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY aura_messages_isolation ON aura_messages
            FOR ALL
            USING (
                connection_id IN (
                    SELECT id FROM aura_connections 
                    WHERE project_id IN (
                        SELECT project_id FROM project_members 
                        WHERE user_id = current_user_id()
                    )
                )
            )
        ");

        // === MEDIA FILES - Isolamento por projeto ===
        DB::statement("ALTER TABLE media_files ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY media_files_isolation ON media_files
            FOR ALL
            USING (
                project_id IN (
                    SELECT project_id FROM project_members 
                    WHERE user_id = current_user_id()
                )
            )
        ");

        // === PRODUCTS - Isolamento por projeto ===
        DB::statement("ALTER TABLE products ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY products_isolation ON products
            FOR ALL
            USING (
                project_id IN (
                    SELECT project_id FROM project_members 
                    WHERE user_id = current_user_id()
                )
            )
        ");

        // === WORKFLOWS - Isolamento por projeto ===
        DB::statement("ALTER TABLE workflows ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY workflows_isolation ON workflows
            FOR ALL
            USING (
                project_id IN (
                    SELECT project_id FROM project_members 
                    WHERE user_id = current_user_id()
                )
            )
        ");

        // === SOCIAL POSTS - Isolamento por projeto ===
        DB::statement("ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY social_posts_isolation ON social_posts
            FOR ALL
            USING (
                project_id IN (
                    SELECT project_id FROM project_members 
                    WHERE user_id = current_user_id()
                )
            )
        ");

        // === ANALYTICS REPORTS - Isolamento por projeto ===
        DB::statement("ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY analytics_reports_isolation ON analytics_reports
            FOR ALL
            USING (
                project_id IN (
                    SELECT project_id FROM project_members 
                    WHERE user_id = current_user_id()
                )
            )
        ");

        // === API CONFIGURATIONS - Isolamento por usuário ===
        DB::statement("ALTER TABLE user_api_configurations ENABLE ROW LEVEL SECURITY");
        
        DB::statement("
            CREATE POLICY api_configurations_isolation ON user_api_configurations
            FOR ALL
            USING (user_id = current_user_id())
        ");
    }

    public function down(): void
    {
        // Remover políticas
        DB::statement("DROP POLICY IF EXISTS project_isolation ON projects");
        DB::statement("DROP POLICY IF EXISTS leads_isolation ON leads");
        DB::statement("DROP POLICY IF EXISTS email_campaigns_isolation ON email_campaigns");
        DB::statement("DROP POLICY IF EXISTS aura_messages_isolation ON aura_messages");
        DB::statement("DROP POLICY IF EXISTS media_files_isolation ON media_files");
        DB::statement("DROP POLICY IF EXISTS products_isolation ON products");
        DB::statement("DROP POLICY IF EXISTS workflows_isolation ON workflows");
        DB::statement("DROP POLICY IF EXISTS social_posts_isolation ON social_posts");
        DB::statement("DROP POLICY IF EXISTS analytics_reports_isolation ON analytics_reports");
        DB::statement("DROP POLICY IF EXISTS api_configurations_isolation ON user_api_configurations");

        // Desabilitar RLS
        DB::statement("ALTER TABLE projects DISABLE ROW LEVEL SECURITY");
        DB::statement("ALTER TABLE leads DISABLE ROW LEVEL SECURITY");
        DB::statement("ALTER TABLE email_campaigns DISABLE ROW LEVEL SECURITY");
        DB::statement("ALTER TABLE aura_messages DISABLE ROW LEVEL SECURITY");
        DB::statement("ALTER TABLE media_files DISABLE ROW LEVEL SECURITY");
        DB::statement("ALTER TABLE products DISABLE ROW LEVEL SECURITY");
        DB::statement("ALTER TABLE workflows DISABLE ROW LEVEL SECURITY");
        DB::statement("ALTER TABLE social_posts DISABLE ROW LEVEL SECURITY");
        DB::statement("ALTER TABLE analytics_reports DISABLE ROW LEVEL SECURITY");
        DB::statement("ALTER TABLE user_api_configurations DISABLE ROW LEVEL SECURITY");

        // Remover função helper
        DB::statement("DROP FUNCTION IF EXISTS current_user_id()");
    }
};
