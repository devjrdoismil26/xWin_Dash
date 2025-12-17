<?php

namespace App\Domains\Media\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Model;

/**
 * MediaFile Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class MediaFile extends Model
{
    use BelongsToProject;

    protected $table = 'media'; // SECURITY FIX: Corrigido para usar a tabela correta

    protected $fillable = [
        'name',
        'file_name',
        'mime_type',
        'path',
        'size',
        'folder_id',
        'user_id',
        'project_id',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    // Relacionamento com a pasta
    // public function folder()
    // {
    //     return $this->belongsTo(MediaFolder::class, 'folder_id');
    // }

    // Relacionamento com o usuário
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }
}
