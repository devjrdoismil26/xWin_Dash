<?php

namespace App\Domains\EmailMarketing\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmailCampaignResource extends JsonResource
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
            'subject' => $this->subject,
            'content' => $this->content,
            'email_list_id' => $this->email_list_id,
            'user_id' => $this->user_id,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at ? $this->scheduled_at->toDateTimeString() : null,
            'sent_at' => $this->sent_at ? $this->sent_at->toDateTimeString() : null,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            // Adicione relacionamentos carregados, se necessário
            // 'email_list' => new EmailListResource($this->whenLoaded('emailList')),
        ];
    }
}
