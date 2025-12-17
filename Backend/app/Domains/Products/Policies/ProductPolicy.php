<?php

namespace App\Domains\Products\Policies;

use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel as Product;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any products.
     */
    public function viewAny(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('view products', $project);
    }

    /**
     * Determine whether the user can view the product.
     */
    public function view(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('view product', $product);
    }

    /**
     * Determine whether the user can create products.
     */
    public function create(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('create product', $project);
    }

    /**
     * Determine whether the user can update the product.
     */
    public function update(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('update product', $product);
    }

    /**
     * Determine whether the user can delete the product.
     */
    public function delete(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('delete product', $product);
    }

    public function restore(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('restore product', $product);
    }

    public function forceDelete(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('force delete product', $product);
    }
}
