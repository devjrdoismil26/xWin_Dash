<?php

namespace Database\Factories;

use App\Models\ShoppingCart;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShoppingCartFactory extends Factory
{
    protected $model = ShoppingCart::class;

    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 10, 500);
        $taxAmount = $subtotal * 0.18; // 18% tax
        $shippingAmount = $this->faker->randomFloat(2, 0, 50);
        $discountAmount = $this->faker->randomFloat(2, 0, $subtotal * 0.2);
        $totalAmount = $subtotal + $taxAmount + $shippingAmount - $discountAmount;

        return [
            'id' => $this->faker->uuid(),
            'session_id' => $this->faker->optional(0.3)->uuid(),
            'user_id' => $this->faker->optional(0.7)->randomElement([\App\Models\User::factory()]),
            'currency' => $this->faker->randomElement(['BRL', 'USD', 'EUR']),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'applied_coupons' => $this->faker->optional(0.3)->randomElements([
                ['code' => 'SAVE10', 'discount' => 10.00],
                ['code' => 'WELCOME', 'discount' => 5.00],
            ]),
            'shipping_address' => $this->faker->optional(0.6)->randomElements([
                'street' => $this->faker->streetAddress(),
                'city' => $this->faker->city(),
                'state' => $this->faker->state(),
                'postal_code' => $this->faker->postcode(),
                'country' => $this->faker->countryCode(),
            ]),
            'billing_address' => $this->faker->optional(0.6)->randomElements([
                'street' => $this->faker->streetAddress(),
                'city' => $this->faker->city(),
                'state' => $this->faker->state(),
                'postal_code' => $this->faker->postcode(),
                'country' => $this->faker->countryCode(),
            ]),
            'status' => $this->faker->randomElement(['active', 'abandoned', 'converted']),
            'last_activity_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'abandoned_at' => $this->faker->optional(0.3)->dateTimeBetween('-7 days', 'now'),
            'project_id' => \App\Models\Project::factory(),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'abandoned_at' => null,
        ]);
    }

    public function abandoned(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'abandoned',
            'abandoned_at' => $this->faker->dateTimeBetween('-7 days', '-1 hour'),
        ]);
    }

    public function converted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'converted',
            'abandoned_at' => null,
        ]);
    }
}
