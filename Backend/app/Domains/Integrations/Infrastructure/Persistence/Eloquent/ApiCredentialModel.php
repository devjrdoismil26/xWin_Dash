<?php

namespace App\Domains\Integrations\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class ApiCredentialModel extends Model
{
    protected $fillable = ['user_id', 'integration_type', 'value'];

    protected $casts = [
        'value' => 'encrypted',
    ];
}
