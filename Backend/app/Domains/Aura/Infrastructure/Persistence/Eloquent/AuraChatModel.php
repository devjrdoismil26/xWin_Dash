<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * AuraChatModel
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 * 
 * @property string $id
 * @property string $connection_id
 * @property string $phone_number
 * @property string|null $contact_name
 * @property array $metadata
 * @property bool $is_active
 * @property string $status
 * @property string|null $assigned_to_user_id
 * @property \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel|null $assignedUser
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class AuraChatModel extends Model
{
    use HasFactory;
    use HasUuids;
    use BelongsToProject;

    protected $table = 'aura_chats';

    protected $fillable = [
        'connection_id',
        'contact_phone',
        'contact_name',
        'contact_avatar',
        'status',
        'last_message_at',
        'unread_count',
        'contact_info',
        'labels',
        'is_business',
        'is_group',
        'group_name',
        'group_participants',
        'assigned_to',
        'lead_id',
        'project_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'contact_info' => 'array',
        'labels' => 'array',
        'group_participants' => 'array',
        'is_business' => 'boolean',
        'is_group' => 'boolean',
        'last_message_at' => 'datetime',
        'unread_count' => 'integer',
    ];

    /**
     * @return BelongsTo<AuraConnectionModel, AuraChatModel>
     */
    public function connection(): BelongsTo
    {
        return $this->belongsTo(AuraConnectionModel::class, 'connection_id');
    }

    /**
     * @return HasMany<AuraMessageModel>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(AuraMessageModel::class, 'chat_id');
    }

    /**
     * @return BelongsTo<UserModel, AuraChatModel>
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'assigned_to');
    }

    /**
     * @return BelongsTo<\App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel, AuraChatModel>
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel::class, 'lead_id');
    }
}
