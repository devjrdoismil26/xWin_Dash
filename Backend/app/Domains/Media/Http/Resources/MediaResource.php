<?php

namespace App\Domains\Media\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
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
            'file_name' => $this->file_name,
            'mime_type' => $this->mime_type,
            'path' => $this->path,
            'url' => $this->url ?? null,
            'size' => $this->size,
            'folder_id' => $this->folder_id,
            'user_id' => $this->user_id,
            'alt_text' => $this->alt_text,
            'description' => $this->description,
            'metadata' => $this->metadata ?? [],
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            // Relacionamentos carregados, se necessário
            'folder' => new FolderResource($this->whenLoaded('folder')),
        ];
    }
}
