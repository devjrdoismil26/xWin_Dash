<?php

namespace App\Domains\Core\Patterns\Factory;

use InvalidArgumentException;

// Supondo que existam interfaces ou classes base para plataformas sociais
// interface SocialMediaPlatformInterface { public function post(string $message): bool; }
// class FacebookPlatform implements SocialMediaPlatformInterface { /* ... */ }
// class TwitterPlatform implements SocialMediaPlatformInterface { /* ... */ }

class SocialMediaFactory
{
    /**
     * Cria uma instância de uma plataforma de mídia social.
     *
     * @param string $platformType o tipo da plataforma (ex: 'facebook', 'twitter')
     * @param array  $credentials  as credenciais necessárias para a plataforma
     *
     * @return object uma instância da plataforma de mídia social
     *
     * @throws InvalidArgumentException se o tipo de plataforma for desconhecido
     */
    public static function create(string $platformType, array $credentials): object
    {
        switch (strtolower($platformType)) {
            case 'facebook':
                // return new FacebookPlatform($credentials);
                return (object)['name' => 'Facebook', 'credentials' => $credentials]; // Placeholder
            case 'twitter':
                // return new TwitterPlatform($credentials);
                return (object)['name' => 'Twitter', 'credentials' => $credentials]; // Placeholder
            case 'instagram':
                // return new InstagramPlatform($credentials);
                return (object)['name' => 'Instagram', 'credentials' => $credentials]; // Placeholder
            default:
                throw new InvalidArgumentException("Tipo de plataforma social desconhecido: {$platformType}");
        }
    }
}
