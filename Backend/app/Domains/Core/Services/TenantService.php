<?php

namespace App\Domains\Core\Services;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;

class TenantService
{
    public function __construct()
    {
    }

    public function getTenantByIdentifier(string $identifier): ?object
    {
        // For simplicity, use Project as tenant
        return ProjectModel::where('uuid', $identifier)->orWhere('id', $identifier)->first();
    }
}
