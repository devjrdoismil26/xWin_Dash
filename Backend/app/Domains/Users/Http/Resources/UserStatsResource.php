<?php

namespace App\Domains\Users\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserStatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    /**
     * @param \Illuminate\Http\Request $request
     * @return array<string, int>
     */
    public function toArray($request)
    {
        return [
            'total_users' => $this['total_users'] ?? 0,
            'active_users' => $this['active_users'] ?? 0,
            'inactive_users' => $this['inactive_users'] ?? 0,
            'admin_users' => $this['admin_users'] ?? 0,
            'regular_users' => $this['regular_users'] ?? 0,
            'users_this_month' => $this['users_this_month'] ?? 0,
        ];
    }
}
