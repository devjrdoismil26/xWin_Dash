<?php

namespace App\Domains\ADStool\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Model para configurações de API.
 */
class ApiSettingModel extends Model
{
    use HasFactory;

    protected $table = 'api_settings';

    protected $fillable = [
        'user_id',
        'platform',
        'credentials',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'user_id' => 'integer',
    ];
}
