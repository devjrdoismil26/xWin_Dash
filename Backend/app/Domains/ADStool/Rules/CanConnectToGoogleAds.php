<?php

namespace App\Domains\ADStool\Rules;

use App\Domains\ADStool\Services\ExternalApi\GoogleAdsService;
use Illuminate\Contracts\Validation\Rule;

// Supondo que este serviço exista

/**
 * Regra de validação que verifica se as credenciais fornecidas podem se conectar com sucesso à API do Google Ads.
 */
class CanConnectToGoogleAds implements Rule
{
    /**
     * Os dados das credenciais a serem testadas.
     *
     * @var array<string, mixed>
     */
    protected array $credentials;

    /**
     * Create a new rule instance.
     *
     * @param array<string, mixed> $credentials
     */
    public function __construct(array $credentials)
    {
        $this->credentials = $credentials;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed  $value
     *
     * @return bool
     */
    public function passes($attribute, $value)
    {
        try {
            // Em um cenário real, o GoogleAdsService usaria as credenciais
            // para tentar uma operação simples, como listar contas acessíveis.
            $googleAdsService = new GoogleAdsService($this->credentials);
            return $googleAdsService->canConnect();
        } catch (\Exception $e) {
            // Se qualquer exceção for lançada, a conexão falhou.
            return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Não foi possível conectar à API do Google Ads com as credenciais fornecidas. Verifique se elas estão corretas.';
    }
}
