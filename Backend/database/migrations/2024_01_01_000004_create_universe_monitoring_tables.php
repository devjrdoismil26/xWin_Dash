<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tabela para métricas de monitoramento
        Schema::create('universe_monitoring_metrics', function (Blueprint $table) {
            $table->id();
            $table->timestamp('timestamp');
            $table->string('environment')->default('production');
            $table->json('metrics');
            $table->json('alerts')->nullable();
            $table->timestamps();

            $table->index(['timestamp', 'environment']);
            $table->index('created_at');
        });

        // Tabela para alertas
        Schema::create('universe_monitoring_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('severity'); // critical, warning, info
            $table->string('message');
            $table->json('context')->nullable();
            $table->boolean('resolved')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->string('resolved_by')->nullable();
            $table->timestamps();

            $table->index(['type', 'severity']);
            $table->index(['resolved', 'created_at']);
        });

        // Tabela para configurações de monitoramento
        Schema::create('universe_monitoring_config', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Inserir configurações padrão
        DB::table('universe_monitoring_config')->insert([
            [
                'key' => 'memory_threshold',
                'value' => json_encode(['warning' => 80, 'critical' => 90]),
                'description' => 'Thresholds de uso de memória em porcentagem',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'key' => 'response_time_threshold',
                'value' => json_encode(['warning' => 2.0, 'critical' => 5.0]),
                'description' => 'Thresholds de tempo de resposta em segundos',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'key' => 'error_rate_threshold',
                'value' => json_encode(['warning' => 5.0, 'critical' => 10.0]),
                'description' => 'Thresholds de taxa de erro em porcentagem',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'key' => 'notification_settings',
                'value' => json_encode([
                    'email_enabled' => true,
                    'slack_enabled' => true,
                    'email_recipients' => ['admin@xwin-dash.com'],
                    'slack_webhook_url' => null
                ]),
                'description' => 'Configurações de notificações',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('universe_monitoring_config');
        Schema::dropIfExists('universe_monitoring_alerts');
        Schema::dropIfExists('universe_monitoring_metrics');
    }
};