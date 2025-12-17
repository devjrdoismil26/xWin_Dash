<?php

namespace App\Domains\Aura\Contracts;

/**
 * Interface para serviços de comunicação com a API do WhatsApp.
 * Define um contrato para o envio de mensagens, permitindo que o domínio
 * seja desacoplado de implementações concretas de provedores.
 */
interface WhatsAppServiceInterface
{
    /**
     * Envia uma mensagem de texto para um destinatário.
     *
     * @param string $connectionId o ID da conexão a ser usada para o envio
     * @param string $to           o número do destinatário
     * @param string $message      o conteúdo da mensagem
     */
    public function sendMessage(string $connectionId, string $to, string $message): void;
}
