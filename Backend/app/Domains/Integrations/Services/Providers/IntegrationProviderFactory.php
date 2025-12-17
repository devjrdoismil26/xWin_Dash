<?php

namespace App\Domains\Integrations\Services\Providers;

use App\Domains\Integrations\Models\Integration;

class IntegrationProviderFactory
{
    public function make(string $provider, Integration $integration): IntegrationProviderInterface
    {
        return match($provider) {
            'google' => new GoogleProvider($integration),
            'facebook' => new FacebookProvider($integration),
            'whatsapp' => new WhatsAppProvider($integration),
            'mailchimp' => new MailchimpProvider($integration),
            'stripe' => new StripeProvider($integration),
            'webhook' => new WebhookProvider($integration),
            default => throw new \InvalidArgumentException("Provider {$provider} not supported")
        };
    }

    public function supports(string $provider): bool
    {
        return in_array($provider, [
            'google', 'facebook', 'whatsapp', 
            'mailchimp', 'stripe', 'webhook'
        ]);
    }
}
