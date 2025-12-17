<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class () extends Migration {
    /**
     * ✅ CONSTRAINTS E VALIDAÇÕES.
     *
     * Adiciona check constraints e validações em nível de banco.
     */
    public function up(): void
    {
        // === EMAIL VALIDATIONS ===
        DB::statement("
            ALTER TABLE users 
            ADD CONSTRAINT check_email_format 
            CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
        ");

        DB::statement("
            ALTER TABLE leads 
            ADD CONSTRAINT check_lead_email_format 
            CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
        ");

        // === SCORE VALIDATIONS ===
        DB::statement("
            ALTER TABLE leads 
            ADD CONSTRAINT check_lead_score_range 
            CHECK (score >= 0 AND score <= 100)
        ");

        // === STATUS VALIDATIONS ===
        DB::statement("
            ALTER TABLE workflows 
            ADD CONSTRAINT check_workflow_status 
            CHECK (status IN ('draft', 'active', 'paused', 'archived'))
        ");

        DB::statement("
            ALTER TABLE email_campaigns 
            ADD CONSTRAINT check_campaign_status 
            CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled'))
        ");

        // === DATE VALIDATIONS ===
        DB::statement("
            ALTER TABLE tasks 
            ADD CONSTRAINT check_task_dates 
            CHECK (due_date IS NULL OR due_date >= created_at)
        ");

        DB::statement("
            ALTER TABLE email_campaigns 
            ADD CONSTRAINT check_campaign_dates 
            CHECK (scheduled_at IS NULL OR scheduled_at >= created_at)
        ");

        // === NUMERIC VALIDATIONS ===
        DB::statement("
            ALTER TABLE products 
            ADD CONSTRAINT check_product_price 
            CHECK (price >= 0)
        ");

        DB::statement("
            ALTER TABLE storage_quotas 
            ADD CONSTRAINT check_storage_positive 
            CHECK (max_storage_bytes > 0 AND used_storage_bytes >= 0)
        ");

        DB::statement("
            ALTER TABLE storage_quotas 
            ADD CONSTRAINT check_storage_usage 
            CHECK (used_storage_bytes <= max_storage_bytes)
        ");

        // === PHONE VALIDATIONS ===
        DB::statement("
            ALTER TABLE leads 
            ADD CONSTRAINT check_lead_phone_format 
            CHECK (phone IS NULL OR phone ~* '^[+]?[0-9]{10,15}$')
        ");

        // === URL VALIDATIONS ===
        DB::statement("
            ALTER TABLE projects 
            ADD CONSTRAINT check_project_website 
            CHECK (website IS NULL OR website ~* '^https?://')
        ");

        // === JSON VALIDATIONS ===
        DB::statement("
            ALTER TABLE workflows 
            ADD CONSTRAINT check_workflow_definition 
            CHECK (definition IS NULL OR json_typeof(definition) = 'object')
        ");

        // === UNIQUE CONSTRAINTS COMPOSTOS ===
        DB::statement("
            CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_project_member 
            ON project_members (project_id, user_id) 
            WHERE deleted_at IS NULL
        ");

        DB::statement("
            CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_lead_email_project 
            ON leads (project_id, email) 
            WHERE email IS NOT NULL AND deleted_at IS NULL
        ");

        // === TRIGGERS PARA AUDITORIA ===
        
        // Trigger para atualizar updated_at automaticamente
        DB::statement("
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        ");

        // Aplicar trigger em tabelas principais
        $tables = [
            'users', 'projects', 'leads', 'workflows', 'email_campaigns',
            'products', 'tasks', 'social_posts', 'media_files'
        ];

        foreach ($tables as $table) {
            DB::statement("
                DROP TRIGGER IF EXISTS trigger_update_{$table}_updated_at ON {$table};
                CREATE TRIGGER trigger_update_{$table}_updated_at
                BEFORE UPDATE ON {$table}
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            ");
        }

        // === TRIGGER PARA STORAGE QUOTA ===
        DB::statement("
            CREATE OR REPLACE FUNCTION check_storage_quota()
            RETURNS TRIGGER AS $$
            DECLARE
                current_quota RECORD;
            BEGIN
                SELECT * INTO current_quota 
                FROM storage_quotas 
                WHERE project_id = NEW.project_id;
                
                IF current_quota.used_storage_bytes + NEW.size_bytes > current_quota.max_storage_bytes THEN
                    RAISE EXCEPTION 'Storage quota exceeded for project %', NEW.project_id;
                END IF;
                
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        ");

        DB::statement("
            CREATE TRIGGER trigger_check_storage_quota
            BEFORE INSERT ON media_files
            FOR EACH ROW
            EXECUTE FUNCTION check_storage_quota();
        ");
    }

    public function down(): void
    {
        // Remover constraints
        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS check_email_format");
        DB::statement("ALTER TABLE leads DROP CONSTRAINT IF EXISTS check_lead_email_format");
        DB::statement("ALTER TABLE leads DROP CONSTRAINT IF EXISTS check_lead_score_range");
        DB::statement("ALTER TABLE workflows DROP CONSTRAINT IF EXISTS check_workflow_status");
        DB::statement("ALTER TABLE email_campaigns DROP CONSTRAINT IF EXISTS check_campaign_status");
        DB::statement("ALTER TABLE tasks DROP CONSTRAINT IF EXISTS check_task_dates");
        DB::statement("ALTER TABLE email_campaigns DROP CONSTRAINT IF EXISTS check_campaign_dates");
        DB::statement("ALTER TABLE products DROP CONSTRAINT IF EXISTS check_product_price");
        DB::statement("ALTER TABLE storage_quotas DROP CONSTRAINT IF EXISTS check_storage_positive");
        DB::statement("ALTER TABLE storage_quotas DROP CONSTRAINT IF EXISTS check_storage_usage");
        DB::statement("ALTER TABLE leads DROP CONSTRAINT IF EXISTS check_lead_phone_format");
        DB::statement("ALTER TABLE projects DROP CONSTRAINT IF EXISTS check_project_website");
        DB::statement("ALTER TABLE workflows DROP CONSTRAINT IF EXISTS check_workflow_definition");

        // Remover índices únicos
        DB::statement("DROP INDEX IF EXISTS idx_unique_project_member");
        DB::statement("DROP INDEX IF EXISTS idx_unique_lead_email_project");

        // Remover triggers
        $tables = [
            'users', 'projects', 'leads', 'workflows', 'email_campaigns',
            'products', 'tasks', 'social_posts', 'media_files'
        ];

        foreach ($tables as $table) {
            DB::statement("DROP TRIGGER IF EXISTS trigger_update_{$table}_updated_at ON {$table}");
        }

        DB::statement("DROP TRIGGER IF EXISTS trigger_check_storage_quota ON media_files");

        // Remover funções
        DB::statement("DROP FUNCTION IF EXISTS update_updated_at_column()");
        DB::statement("DROP FUNCTION IF EXISTS check_storage_quota()");
    }
};
