<?php

namespace App\Domains\EmailMarketing\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmailListResource extends JsonResource
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
            'description' => $this->description,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            // Adicione relacionamentos carregados, se necessário
            // 'subscribers_count' => $this->subscribers->count(),
        ];
    }
}
