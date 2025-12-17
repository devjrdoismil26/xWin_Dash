<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorizationSeeder extends Seeder
{
    /**
     * Seed categorization system with default categories
     */
    public function run(): void
    {
        $categories = [
            // Product Categories
            [
                'id' => Str::uuid(),
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Electronic devices and accessories',
                'type' => 'product',
                'icon' => 'laptop',
                'color' => '#3B82F6',
                'parent_id' => null,
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Clothing',
                'slug' => 'clothing',
                'description' => 'Apparel and fashion items',
                'type' => 'product',
                'icon' => 'shirt',
                'color' => '#8B5CF6',
                'parent_id' => null,
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Home & Garden',
                'slug' => 'home-garden',
                'description' => 'Home improvement and garden supplies',
                'type' => 'product',
                'icon' => 'home',
                'color' => '#10B981',
                'parent_id' => null,
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Lead Categories
            [
                'id' => Str::uuid(),
                'name' => 'Hot Lead',
                'slug' => 'hot-lead',
                'description' => 'High priority leads ready to convert',
                'type' => 'lead',
                'icon' => 'fire',
                'color' => '#EF4444',
                'parent_id' => null,
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Warm Lead',
                'slug' => 'warm-lead',
                'description' => 'Interested leads requiring nurturing',
                'type' => 'lead',
                'icon' => 'thermometer',
                'color' => '#F59E0B',
                'parent_id' => null,
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Cold Lead',
                'slug' => 'cold-lead',
                'description' => 'Early stage leads',
                'type' => 'lead',
                'icon' => 'snowflake',
                'color' => '#3B82F6',
                'parent_id' => null,
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Content Categories
            [
                'id' => Str::uuid(),
                'name' => 'Blog Post',
                'slug' => 'blog-post',
                'description' => 'Blog articles and posts',
                'type' => 'content',
                'icon' => 'file-text',
                'color' => '#6366F1',
                'parent_id' => null,
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Video',
                'slug' => 'video',
                'description' => 'Video content',
                'type' => 'content',
                'icon' => 'video',
                'color' => '#EC4899',
                'parent_id' => null,
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Infographic',
                'slug' => 'infographic',
                'description' => 'Visual information graphics',
                'type' => 'content',
                'icon' => 'image',
                'color' => '#14B8A6',
                'parent_id' => null,
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // General Categories
            [
                'id' => Str::uuid(),
                'name' => 'Important',
                'slug' => 'important',
                'description' => 'High priority items',
                'type' => 'general',
                'icon' => 'star',
                'color' => '#F59E0B',
                'parent_id' => null,
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Archived',
                'slug' => 'archived',
                'description' => 'Archived items',
                'type' => 'general',
                'icon' => 'archive',
                'color' => '#6B7280',
                'parent_id' => null,
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('categories')->insert($categories);

        $this->command->info('✅ Categorization seeded successfully!');
        $this->command->info('   - ' . count($categories) . ' categories created');
    }
}
