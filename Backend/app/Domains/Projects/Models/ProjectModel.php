<?php

namespace App\Domains\Projects\Models;

/**
 * Alias para manter compatibilidade
 * Redireciona para o modelo real na estrutura DDD.
 */
class ProjectModel extends \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel
{
    // Este é apenas um proxy/alias para o modelo real
}
