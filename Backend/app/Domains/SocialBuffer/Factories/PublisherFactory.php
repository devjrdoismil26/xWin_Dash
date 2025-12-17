<?php

namespace App\Domains\SocialBuffer\Factories;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Publishers\FacebookPublisher;
use App\Domains\SocialBuffer\Publishers\InstagramPublisher;
use App\Domains\SocialBuffer\Publishers\LinkedInPublisher;
use App\Domains\SocialBuffer\Publishers\NullPublisher;
use App\Domains\SocialBuffer\Publishers\PinterestPublisher;
use App\Domains\SocialBuffer\Publishers\TikTokPublisher;
use App\Domains\SocialBuffer\Publishers\TwitterPublisher;
use InvalidArgumentException;

class PublisherFactory
{
    /**
     * Cria uma instância de um publicador de rede social.
     *
     * @param string $platform o nome da plataforma (ex: 'facebook', 'twitter')
     *
     * @return PublisherInterface
     *
     * @throws InvalidArgumentException se a plataforma não for suportada
     */
    public static function create(string $platform): PublisherInterface
    {
        switch (strtolower($platform)) {
            case 'facebook':
                return app(FacebookPublisher::class);
            case 'twitter':
                return app(TwitterPublisher::class);
            case 'instagram':
                return app(InstagramPublisher::class);
            case 'linkedin':
                return app(LinkedInPublisher::class);
            case 'pinterest':
                return app(PinterestPublisher::class);
            case 'tiktok':
                return app(TikTokPublisher::class);
            case 'null': // Para testes ou quando a publicação não é desejada
                return app(NullPublisher::class);
            default:
                throw new InvalidArgumentException("Plataforma de publicação não suportada: {$platform}");
        }
    }
}
