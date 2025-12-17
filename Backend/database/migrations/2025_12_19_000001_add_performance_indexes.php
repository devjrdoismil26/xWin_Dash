<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Otimização: Adicionar índices estratégicos para melhorar performance de queries pesadas
     */
    public function up(): void
    {
        // Índices para Dashboard - Métricas agregadas
        if (Schema::hasTable('projects')) {
            Schema::table('projects', function (Blueprint $table) {
                if (!$this->hasIndex('projects', 'idx_projects_user_project')) {
                    $table->index(['user_id', 'id'], 'idx_projects_user_project');
                }
            });
        }

        if (Schema::hasTable('leads')) {
            Schema::table('leads', function (Blueprint $table) {
                if (!$this->hasIndex('leads', 'idx_leads_user_project')) {
                    $table->index(['user_id', 'project_id'], 'idx_leads_user_project');
                }
                if (!$this->hasIndex('leads', 'idx_leads_status')) {
                    $table->index(['status'], 'idx_leads_status');
                }
                if (!$this->hasIndex('leads', 'idx_leads_created_at')) {
                    $table->index(['created_at'], 'idx_leads_created_at');
                }
                if (!$this->hasIndex('leads', 'idx_leads_user_status')) {
                    $table->index(['user_id', 'status'], 'idx_leads_user_status');
                }
                if (!$this->hasIndex('leads', 'idx_leads_value')) {
                    $table->index(['value'], 'idx_leads_value');
                }
            });
        }

        if (Schema::hasTable('workflows')) {
            Schema::table('workflows', function (Blueprint $table) {
                if (!$this->hasIndex('workflows', 'idx_workflows_user_active')) {
                    $table->index(['user_id', 'is_active'], 'idx_workflows_user_active');
                }
                if (!$this->hasIndex('workflows', 'idx_workflows_project')) {
                    $table->index(['project_id'], 'idx_workflows_project');
                }
            });
        }

        // Índices para Analytics - Agregações temporais
        if (Schema::hasTable('analytics_events')) {
            Schema::table('analytics_events', function (Blueprint $table) {
                if (!$this->hasIndex('analytics_events', 'idx_analytics_event_at')) {
                    $table->index(['event_at'], 'idx_analytics_event_at');
                }
                if (!$this->hasIndex('analytics_events', 'idx_analytics_user_session')) {
                    $table->index(['user_id', 'session_id'], 'idx_analytics_user_session');
                }
                if (!$this->hasIndex('analytics_events', 'idx_analytics_category')) {
                    $table->index(['category'], 'idx_analytics_category');
                }
                if (!$this->hasIndex('analytics_events', 'idx_analytics_date_category')) {
                    $table->index(['event_at', 'category'], 'idx_analytics_date_category');
                }
            });
        }

        // Índices para Media - Listagem com filtros
        if (Schema::hasTable('media_files')) {
            Schema::table('media_files', function (Blueprint $table) {
                if (!$this->hasIndex('media_files', 'idx_media_user_created')) {
                    $table->index(['user_id', 'created_at'], 'idx_media_user_created');
                }
                if (!$this->hasIndex('media_files', 'idx_media_folder')) {
                    $table->index(['folder_id'], 'idx_media_folder');
                }
                if (!$this->hasIndex('media_files', 'idx_media_mime_type')) {
                    $table->index(['mime_type'], 'idx_media_mime_type');
                }
            });
        }

        // Índices para SocialBuffer - Busca de posts
        if (Schema::hasTable('social_posts')) {
            Schema::table('social_posts', function (Blueprint $table) {
                if (!$this->hasIndex('social_posts', 'idx_posts_user_status')) {
                    $table->index(['user_id', 'status'], 'idx_posts_user_status');
                }
                if (!$this->hasIndex('social_posts', 'idx_posts_scheduled_at')) {
                    $table->index(['scheduled_at'], 'idx_posts_scheduled_at');
                }
            });
        }

        // Índices para Activity Logs
        if (Schema::hasTable('activity_logs')) {
            Schema::table('activity_logs', function (Blueprint $table) {
                if (!$this->hasIndex('activity_logs', 'idx_activity_user_created')) {
                    $table->index(['user_id', 'created_at'], 'idx_activity_user_created');
                }
                if (!$this->hasIndex('activity_logs', 'idx_activity_project')) {
                    $table->index(['project_id'], 'idx_activity_project');
                }
            });
        }

        // Índices para Aura Connections
        if (Schema::hasTable('aura_connections')) {
            Schema::table('aura_connections', function (Blueprint $table) {
                if (!$this->hasIndex('aura_connections', 'idx_aura_user_status')) {
                    $table->index(['user_id', 'status'], 'idx_aura_user_status');
                }
                if (!$this->hasIndex('aura_connections', 'idx_aura_project')) {
                    $table->index(['project_id'], 'idx_aura_project');
                }
            });
        }

        // Índices para Integrations
        if (Schema::hasTable('integrations')) {
            Schema::table('integrations', function (Blueprint $table) {
                if (!$this->hasIndex('integrations', 'idx_integrations_user_status')) {
                    $table->index(['user_id', 'status'], 'idx_integrations_user_status');
                }
                if (!$this->hasIndex('integrations', 'idx_integrations_provider')) {
                    $table->index(['provider'], 'idx_integrations_provider');
                }
            });
        }

        // Índices para Email Logs (usado em EmailEngagementConditionNodeExecutor)
        if (Schema::hasTable('email_logs')) {
            Schema::table('email_logs', function (Blueprint $table) {
                if (!$this->hasIndex('email_logs', 'idx_email_lead_campaign')) {
                    $table->index(['lead_id', 'campaign_id'], 'idx_email_lead_campaign');
                }
                if (!$this->hasIndex('email_logs', 'idx_email_event_type')) {
                    $table->index(['event_type'], 'idx_email_event_type');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex('idx_projects_user_project');
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->dropIndex('idx_leads_user_project');
            $table->dropIndex('idx_leads_status');
            $table->dropIndex('idx_leads_created_at');
            $table->dropIndex('idx_leads_user_status');
            $table->dropIndex('idx_leads_value');
        });

        Schema::table('workflows', function (Blueprint $table) {
            $table->dropIndex('idx_workflows_user_active');
            $table->dropIndex('idx_workflows_project');
        });

        if (Schema::hasTable('analytics_events')) {
            Schema::table('analytics_events', function (Blueprint $table) {
                $table->dropIndex('idx_analytics_event_at');
                $table->dropIndex('idx_analytics_user_session');
                $table->dropIndex('idx_analytics_category');
                $table->dropIndex('idx_analytics_date_category');
            });
        }

        Schema::table('media_files', function (Blueprint $table) {
            $table->dropIndex('idx_media_user_created');
            $table->dropIndex('idx_media_folder');
            $table->dropIndex('idx_media_mime_type');
        });

        Schema::table('social_posts', function (Blueprint $table) {
            $table->dropIndex('idx_posts_user_status');
            $table->dropIndex('idx_posts_scheduled_at');
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex('idx_activity_user_created');
            $table->dropIndex('idx_activity_project');
        });

        Schema::table('aura_connections', function (Blueprint $table) {
            $table->dropIndex('idx_aura_user_status');
            $table->dropIndex('idx_aura_project');
        });

        Schema::table('integrations', function (Blueprint $table) {
            $table->dropIndex('idx_integrations_user_status');
            $table->dropIndex('idx_integrations_provider');
        });

        Schema::table('email_logs', function (Blueprint $table) {
            $table->dropIndex('idx_email_lead_campaign');
            $table->dropIndex('idx_email_event_type');
        });
    }

    /**
     * Verifica se um índice já existe
     */
    private function hasIndex(string $table, string $indexName): bool
    {
        if (!Schema::hasTable($table)) {
            return false;
        }
        
        $connection = Schema::getConnection();
        $driverName = $connection->getDriverName();
        
        try {
            if ($driverName === 'sqlite') {
                // Para SQLite, verificar na tabela sqlite_master
                $result = $connection->select(
                    "SELECT COUNT(*) as count 
                     FROM sqlite_master 
                     WHERE type = 'index' 
                     AND name = ? 
                     AND tbl_name = ?",
                    [$indexName, $table]
                );
            } else {
                // Para MySQL/PostgreSQL, usar information_schema
                $databaseName = $connection->getDatabaseName();
                $result = $connection->select(
                    "SELECT COUNT(*) as count 
                     FROM information_schema.statistics 
                     WHERE table_schema = ? 
                     AND table_name = ? 
                     AND index_name = ?",
                    [$databaseName, $table, $indexName]
                );
            }
            
            return isset($result[0]) && $result[0]->count > 0;
        } catch (\Exception $e) {
            return false;
        }
    }
};
