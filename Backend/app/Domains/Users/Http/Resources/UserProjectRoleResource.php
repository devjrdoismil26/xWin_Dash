<?php

namespace App\Domains\Users\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserProjectRoleResource extends JsonResource
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
        /** @var object $model */
        $model = $this->resource;
        return [
            'user_id' => $model->user_id ?? null,
            'project_id' => $model->project_id ?? null,
            'role' => $model->role ?? null,
            'created_at' => isset($model->created_at) && is_object($model->created_at) && method_exists($model->created_at, 'toDateTimeString') ? $model->created_at->toDateTimeString() : null,
            'updated_at' => isset($model->updated_at) && is_object($model->updated_at) && method_exists($model->updated_at, 'toDateTimeString') ? $model->updated_at->toDateTimeString() : null,
            // Adicione o relacionamento com o usuário e projeto, se carregados
            // 'user' => new UserResource($this->whenLoaded('user')),
            // 'project' => new ProjectResource($this->whenLoaded('project')),
        ];
    }
}
