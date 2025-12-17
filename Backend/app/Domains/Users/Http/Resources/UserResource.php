<?php

namespace App\Domains\Users\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array<string, mixed>
     */
    /**
     * @param \Illuminate\Http\Request $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        /** @var object $user */
        $user = $this->resource;
        return [
            'id' => $user->id ?? null,
            'name' => $user->name ?? null,
            'email' => $user->email ?? null,
            'email_verified_at' => isset($user->email_verified_at) && is_object($user->email_verified_at) && method_exists($user->email_verified_at, 'toDateTimeString') ? $user->email_verified_at->toDateTimeString() : null,
            'created_at' => isset($user->created_at) && is_object($user->created_at) && method_exists($user->created_at, 'toDateTimeString') ? $user->created_at->toDateTimeString() : null,
            'updated_at' => isset($user->updated_at) && is_object($user->updated_at) && method_exists($user->updated_at, 'toDateTimeString') ? $user->updated_at->toDateTimeString() : null,
            // Adicione outros campos relevantes do usuário, como roles ou preferências
            // 'roles' => RoleResource::collection($this->whenLoaded('roles')),
            // 'preferences' => new UserPreferenceResource($this->whenLoaded('preferences')),
        ];
    }
}
