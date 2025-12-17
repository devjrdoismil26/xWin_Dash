<?php

namespace App\Domains\AI\Infrastructure\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static string chat(string $message, array $history = [])
 * @method static array getChatHistory(string $chatId)
 * @method static bool canConnect()
 *
 * @see \App\Domains\AI\Services\GeminiService
 */
class Gemini extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'gemini.service'; // O nome do binding no Service Container
    }
}
