<?php

namespace App\Domains\Users\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Traits\HasAuraPermissions;
use App\Shared\Traits\OptimizedQueries;
use App\Shared\ValueObjects\Email;
use App\Shared\ValueObjects\UserStatus;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

/**
 * App\Domains\Users\Models\User.
 *
 * @property string                                                                              $id
 * @property string                                                                              $name
 * @property Email                                                                               $email
 * @property \Illuminate\Support\Carbon|null                                                     $email_verified_at
 * @property string                                                                              $password
 * @property string|null                                                                         $avatar_url
 * @property UserStatus                                                                          $status
 * @property string|null                                                                         $last_login
 * @property string|null                                                                         $current_project_id
 * @property string|null                                                                         $remember_token
 * @property string|null                                                                         $whatsapp
 * @property \Illuminate\Support\Carbon|null                                                     $created_at
 * @property \Illuminate\Support\Carbon|null                                                     $updated_at
 * @property \Illuminate\Notifications\DatabaseNotificationCollection<int, DatabaseNotification> $notifications
 * @property int|null                                                                            $notifications_count
 * @property \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property int|null                                                                            $permissions_count
 * @property \App\Domains\Users\Models\UserPreference|null                                       $preferences
 * @property \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role>       $roles
 * @property int|null                                                                            $roles_count
 * @property \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property int|null                                                                            $tokens_count
 *
 * @method static \Database\Factories\Users\UserFactory      factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|User permission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User role($roles, $guard = null)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereAvatarUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLastLogin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|User withoutTrashed()
 * @method static static find($id, $columns = ['*'])
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class UserModel extends Authenticatable implements MustVerifyEmail
{
    use HasUuids;
    use HasFactory;
    use Notifiable;
    use HasApiTokens;
    use SoftDeletes;
    use OptimizedQueries;
    use HasAuraPermissions;
    use HasRoles;

    /**
     * @var array<int, string>
     */
    protected array $defaultEagerLoad = ['preferences', 'roles'];

    protected static function newFactory(): \Database\Factories\Users\UserFactory
    {
        return \Database\Factories\Users\UserFactory::new();
    }

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'whatsapp',
        'current_project_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'status' => UserStatus::class,
        ];
    }

    /**
     * Get the user's email as an Email Value Object.
     *
     * @param string $value
     *
     * @return Email
     */
    public function getEmailAttribute(string $value): Email
    {
        return new Email($value);
    }

    /**
     * Set the user's email from an Email Value Object or string.
     *
     * @param string|Email $value
     */
    public function setEmailAttribute(string|Email $value): void
    {
        $this->attributes['email'] = $value instanceof Email ? $value->getValue() : $value;
    }

    /**
     * Get the preferences associated with the user.
     */
    public function preferences(): HasOne
    {
        return $this->hasOne(UserPreferenceModel::class, 'user_id');
    }

    /**
     * Get the notifications for the user.
     */
    public function notifications(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable');
    }

    public function markEmailAsVerified(): bool
    {
        if (is_null($this->email_verified_at)) {
            $this->forceFill(['email_verified_at' => now()])->save();

            return true;
        }

        return false;
    }

    public function activate(?string $actorId = null): void
    {
        $this->forceFill(['status' => UserStatus::ACTIVE])->save();
        event(new \App\Domains\Users\Events\UserActivated($this, $actorId ?? 'system'));
    }

    public function deactivate(?string $actorId = null): void
    {
        $this->forceFill(['status' => UserStatus::INACTIVE])->save();
        event(new \App\Domains\Users\Events\UserDeactivated($this, $actorId ?? 'system'));
    }

    public function updateAvatarUrl(string $url): void
    {
        $this->forceFill(['avatar_url' => $url])->save();
    }

    public function updateLastLogin(): void
    {
        $this->forceFill(['last_login' => now()])->save();
    }

    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->hasRole(['admin', 'super-admin']);
    }

    /**
     * Check if the user is a manager.
     *
     * @return bool
     */
    public function isManager(): bool
    {
        return $this->hasRole(['manager', 'admin', 'super-admin']);
    }

    /**
     * Check if the user is active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status === UserStatus::ACTIVE;
    }

    /**
     * Get the currently selected project for the user.
     */
    public function getCurrentProjectAttribute(): ?\App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel
    {
        if ($this->current_project_id) {
            // Injetar ProjectRepository aqui ou passá-lo como dependência
            // Por simplicidade, vamos instanciar diretamente para esta refatoração
            $projectRepository = new \App\Domains\Projects\Repositories\ProjectRepository();

            /** @var \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel|null $project */
            $project = $projectRepository->findById($this->current_project_id);
            return $project;
        }

        return null;
    }

    /**
     * Get the current project relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|null
     */
    public function currentProject(): ?BelongsTo
    {
        return $this->belongsTo(\App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::class, 'current_project_id');
    }

    /**
     * Verifica se usuário tem acesso a um módulo específico
     *
     * @param string $moduleType
     * @return bool
     */
    public function hasModuleAccess(string $moduleType): bool
    {
        return true; // Temporário para testing - implementar lógica real aqui
    }

    /**
     * Obter instâncias do universo
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function universeInstances()
    {
        return $this->hasMany(\App\Domains\Universe\Models\UniverseInstance::class);
    }

    /**
     * Obter quota máxima de instâncias do universo
     *
     * @return int
     */
    public function getMaxUniverseInstancesQuota(): int
    {
        return 10; // Valor padrão - implementar lógica baseada no plano do usuário
    }
}
