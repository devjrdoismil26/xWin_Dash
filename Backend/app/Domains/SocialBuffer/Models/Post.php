<?php

namespace App\Domains\SocialBuffer\Models;

use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\PostModel;

/**
 * Alias para manter compatibilidade
 * Redireciona para o PostModel na camada Infrastructure.
 */
class Post extends PostModel
{
    // Este é apenas um proxy/alias para o PostModel
}
