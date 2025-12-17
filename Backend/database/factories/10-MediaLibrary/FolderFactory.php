<?php

namespace Database\Factories\Media;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class FolderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Folder::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'project_id' => Project::factory(),
            'user_id' => User::factory(),
            'parent_id' => null, // Default to no parent
            'name' => $this->faker->unique()->word() . ' Folder',
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Folder $folder) {
            // Create some child folders for demonstration
            if ($this->faker->boolean(30)) { // 30% chance to have children
                Folder::factory()->count(rand(1, 3))->create(['parent_id' => $folder->id, 'project_id' => $folder->project_id, 'user_id' => $folder->user_id]);
            }
        });
    }
}
