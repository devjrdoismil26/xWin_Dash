<?php

namespace App\Domains\Projects\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectStatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function toArray($request)
    {
        return [
            'total_projects' => $this['total_projects'] ?? 0,
            'projects_this_month' => $this['projects_this_month'] ?? 0,
            'active_projects' => $this['active_projects'] ?? 0,
            'inactive_projects' => $this['inactive_projects'] ?? 0,
        ];
    }
}
