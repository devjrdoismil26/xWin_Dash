<?php

namespace App\Domains\Media\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FolderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'path' => $this->path,
            'parent_id' => $this->parent_id,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            // Relacionamentos carregados, se necessário
            'media_count' => $this->whenLoaded('media', fn() => $this->media->count()),
            'subfolders_count' => $this->whenLoaded('subfolders', fn() => $this->subfolders->count()),
        ];
    }
}
