<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add missing fields to universe_instances
        Schema::table('universe_instances', function (Blueprint $table) {
            if (!Schema::hasColumn('universe_instances', 'blocks_config')) {
                $table->json('blocks_config')->nullable()->after('modules_config');
            }
            if (!Schema::hasColumn('universe_instances', 'canvas_state')) {
                $table->json('canvas_state')->nullable()->after('blocks_config');
            }
            if (!Schema::hasColumn('universe_instances', 'permissions')) {
                $table->json('permissions')->nullable()->after('canvas_state');
            }
            if (!Schema::hasColumn('universe_instances', 'quota_limits')) {
                $table->json('quota_limits')->nullable()->after('permissions');
            }
            if (!Schema::hasColumn('universe_instances', 'performance_config')) {
                $table->json('performance_config')->nullable()->after('quota_limits');
            }
        });

        // Add missing fields to universe_templates
        Schema::table('universe_templates', function (Blueprint $table) {
            if (!Schema::hasColumn('universe_templates', 'preview_image')) {
                $table->string('preview_image')->nullable()->after('icon');
            }
            if (!Schema::hasColumn('universe_templates', 'demo_url')) {
                $table->string('demo_url')->nullable()->after('preview_image');
            }
            if (!Schema::hasColumn('universe_templates', 'installation_count')) {
                $table->integer('installation_count')->default(0)->after('usage_count');
            }
            if (!Schema::hasColumn('universe_templates', 'compatibility')) {
                $table->json('compatibility')->nullable()->after('installation_count');
            }
            if (!Schema::hasColumn('universe_templates', 'average_rating')) {
                $table->decimal('average_rating', 3, 2)->default(0)->after('compatibility');
            }
            if (!Schema::hasColumn('universe_templates', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('is_public');
            }
            if (!Schema::hasColumn('universe_templates', 'blocks_config')) {
                $table->json('blocks_config')->nullable()->after('modules_config');
            }
        });

        // Add missing fields to universe_block_marketplace
        Schema::table('universe_block_marketplace', function (Blueprint $table) {
            if (!Schema::hasColumn('universe_block_marketplace', 'screenshots')) {
                $table->json('screenshots')->nullable()->after('preview');
            }
            if (!Schema::hasColumn('universe_block_marketplace', 'changelog')) {
                $table->json('changelog')->nullable()->after('screenshots');
            }
            if (!Schema::hasColumn('universe_block_marketplace', 'support_url')) {
                $table->string('support_url')->nullable()->after('changelog');
            }
            if (!Schema::hasColumn('universe_block_marketplace', 'documentation_url')) {
                $table->string('documentation_url')->nullable()->after('support_url');
            }
            if (!Schema::hasColumn('universe_block_marketplace', 'download_count')) {
                $table->integer('download_count')->default(0)->after('downloads');
            }
            if (!Schema::hasColumn('universe_block_marketplace', 'block_type')) {
                $table->string('block_type')->nullable()->after('category');
            }
            if (!Schema::hasColumn('universe_block_marketplace', 'icon')) {
                $table->string('icon')->nullable()->after('name');
            }
            if (!Schema::hasColumn('universe_block_marketplace', 'is_verified')) {
                $table->boolean('is_verified')->default(false)->after('is_active');
            }
            if (!Schema::hasColumn('universe_block_marketplace', 'default_config')) {
                $table->json('default_config')->nullable()->after('configuration');
            }
        });

        // Create universe_blocks table if not exists
        if (!Schema::hasTable('universe_blocks')) {
            Schema::create('universe_blocks', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('instance_id')->constrained('universe_instances')->onDelete('cascade');
                $table->foreignUuid('template_id')->nullable()->constrained('universe_templates')->onDelete('set null');
                $table->string('block_type');
                $table->json('config');
                $table->json('position')->default('{"x": 0, "y": 0}');
                $table->boolean('is_active')->default(true);
                $table->timestamps();

                $table->index(['instance_id', 'is_active']);
                $table->index('block_type');
            });
        }

        // Create block_connections table if not exists
        if (!Schema::hasTable('block_connections')) {
            Schema::create('block_connections', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('source_block_id')->constrained('universe_blocks')->onDelete('cascade');
                $table->foreignUuid('target_block_id')->constrained('universe_blocks')->onDelete('cascade');
                $table->string('connection_type')->default('data');
                $table->json('config')->nullable();
                $table->timestamps();

                $table->index(['source_block_id', 'target_block_id']);
            });
        }

        // Add performance indexes
        Schema::table('universe_instances', function (Blueprint $table) {
            if (!Schema::hasIndex('universe_instances', 'idx_user_active')) {
                $table->index(['user_id', 'is_active'], 'idx_user_active');
            }
        });

        Schema::table('universe_templates', function (Blueprint $table) {
            if (!Schema::hasIndex('universe_templates', 'idx_category_public')) {
                $table->index(['category', 'is_public'], 'idx_category_public');
            }
            if (!Schema::hasIndex('universe_templates', 'idx_featured')) {
                $table->index('is_featured', 'idx_featured');
            }
        });

        Schema::table('universe_block_marketplace', function (Blueprint $table) {
            if (!Schema::hasIndex('universe_block_marketplace', 'idx_category_verified')) {
                $table->index(['category', 'is_verified'], 'idx_category_verified');
            }
        });

        // Index already exists in previous migration
        // Schema::table('universe_block_installations', function (Blueprint $table) {
        //     $table->index(['installed_by', 'is_active'], 'idx_user_active');
        // });

        Schema::table('universe_analytics', function (Blueprint $table) {
            if (!Schema::hasIndex('universe_analytics', 'idx_instance_date')) {
                $table->index(['instance_id', 'date'], 'idx_instance_date');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('block_connections');
        Schema::dropIfExists('universe_blocks');

        Schema::table('universe_instances', function (Blueprint $table) {
            $table->dropColumn(['blocks_config', 'canvas_state', 'permissions', 'quota_limits', 'performance_config']);
        });

        Schema::table('universe_templates', function (Blueprint $table) {
            $table->dropColumn(['preview_image', 'demo_url', 'installation_count', 'compatibility', 'average_rating', 'is_featured', 'blocks_config']);
        });

        Schema::table('universe_block_marketplace', function (Blueprint $table) {
            $table->dropColumn(['screenshots', 'changelog', 'support_url', 'documentation_url', 'download_count', 'block_type', 'icon', 'is_verified', 'default_config']);
        });
    }
};
