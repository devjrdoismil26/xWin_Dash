<?php

namespace App\Domains\ADStool\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'platform' => $this->resource->platform,
            'platform_account_id' => $this->resource->platform_account_id,
            'created_at' => $this->resource->created_at->toIso8601String(),
        ];
    }
}
