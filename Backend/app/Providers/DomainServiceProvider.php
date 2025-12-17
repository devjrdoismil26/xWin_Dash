<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

class DomainServiceProvider extends ServiceProvider
{
    /**
     * Registra os serviços de qualquer domínio da aplicação.
     *
     * Este provedor é responsável por inicializar (bootstrapping) os domínios da aplicação.
     * Ele escaneia o diretório app/Domains e, para cada domínio encontrado, registra
     * um provedor de serviço específico, permitindo uma arquitetura modular.
     *
     * @return void
     */
    public function register(): void
    {
        $domainPath = app_path('Domains');
        
        // Verifica se o diretório de Domínios existe para evitar erros
        if (!File::isDirectory($domainPath)) {
            return;
        }

        $domains = File::directories($domainPath);

        foreach ($domains as $domain) {
            $domainName = basename($domain);
            
            // Procura por um ServiceProvider dentro do subdiretório Providers de cada domínio
            // Ex: app/Domains/Users/Providers/UsersServiceProvider.php
            $providerPath = $domain . '/Providers/' . $domainName . 'ServiceProvider.php';

            if (File::exists($providerPath)) {
                $providerClass = "App\\Domains\\{$domainName}\\Providers\\{$domainName}ServiceProvider";
                
                // Registra o provedor de serviço do domínio no Laravel
                if (class_exists($providerClass)) {
                    $this->app->register($providerClass);
                }
            }
        }
    }

    /**
     * Inicializa qualquer serviço da aplicação.
     *
     * @return void
     */
    public function boot(): void
    {
        //
    }
}
