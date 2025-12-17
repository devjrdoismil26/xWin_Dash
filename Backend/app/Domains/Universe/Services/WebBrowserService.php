<?php

namespace App\Domains\Universe\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use DOMDocument;
use DOMXPath;

class WebBrowserService
{
    protected array $defaultHeaders;
    protected int $timeout;
    protected bool $followRedirects;

    public function __construct()
    {
        $this->defaultHeaders = [
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.5',
            'Accept-Encoding' => 'gzip, deflate',
            'DNT' => '1',
            'Connection' => 'keep-alive',
            'Upgrade-Insecure-Requests' => '1',
        ];

        $this->timeout = config('universe.browser.timeout', 30);
        $this->followRedirects = config('universe.browser.follow_redirects', true);
    }

    /**
     * Visita uma URL e retorna o conteúdo HTML.
     *
     * @param string $url a URL a ser visitada
     * @param array $headers headers HTTP adicionais
     *
     * @return string o conteúdo HTML da página
     *
     * @throws \Exception se a requisição falhar
     */
    public function visitUrl(string $url, array $headers = []): string
    {
        Log::info("Visitando URL: {$url}");

        try {
            // Validar URL
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                throw new InvalidArgumentException("URL inválida: {$url}");
            }

            $allHeaders = array_merge($this->defaultHeaders, $headers);

            $response = Http::withHeaders($allHeaders)
                ->timeout($this->timeout)
                ->when($this->followRedirects, function ($http) {
                    return $http->withOptions(['allow_redirects' => true]);
                })
                ->get($url);

            if (!$response->successful()) {
                throw new \Exception("HTTP Error {$response->status()}: {$response->reason()}");
            }

            $htmlContent = $response->body();

            Log::info("Visita à URL {$url} bem-sucedida. Conteúdo obtido: " . strlen($htmlContent) . " bytes");
            return $htmlContent;
        } catch (\Exception $e) {
            Log::error("Falha ao visitar URL {$url}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Preenche e envia um formulário em uma URL.
     *
     * @param string $url          a URL da página com o formulário
     * @param array<string, mixed>  $formData     os dados do formulário (campo => valor)
     * @param string $method       método HTTP (POST/GET)
     *
     * @return string o conteúdo HTML da página resultante após o envio do formulário
     *
     * @throws \Exception se o formulário não for encontrado ou o envio falhar
     */
    public function fillForm(string $url, array $formData, string $method = 'POST'): string
    {
        Log::info("Preenchendo formulário em URL: {$url}");

        try {
            // Para implementação simples, enviaremos os dados diretamente
            $allHeaders = array_merge($this->defaultHeaders, [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ]);

            $response = Http::withHeaders($allHeaders)
                ->timeout($this->timeout)
                ->when(strtoupper($method) === 'GET', function ($http) use ($formData) {
                    return $http->get($url, $formData);
                }, function ($http) use ($url, $formData) {
                    return $http->asForm()->post($url, $formData);
                });

            if (!$response->successful()) {
                throw new \Exception("Form submission failed with HTTP {$response->status()}: {$response->reason()}");
            }

            $htmlContent = $response->body();
            Log::info("Formulário em {$url} preenchido e enviado com sucesso.");
            return $htmlContent;
        } catch (\Exception $e) {
            Log::error("Falha ao preencher ou enviar formulário em {$url}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Extrai dados de uma página HTML usando XPath.
     *
     * @param string $url      a URL da página ou HTML content
     * @param string $selector o seletor XPath
     * @param bool $isUrl      se o primeiro parâmetro é URL ou HTML content
     *
     * @return array<string> os dados extraídos
     *
     * @throws \Exception se a extração falhar
     */
    public function extractData(string $urlOrHtml, string $selector, bool $isUrl = true): array
    {
        Log::info("Extraindo dados com seletor: {$selector}");

        try {
            // Obter HTML content
            $htmlContent = $isUrl ? $this->visitUrl($urlOrHtml) : $urlOrHtml;

            // Criar DOMDocument
            $dom = new DOMDocument();

            // Suprimir erros de HTML mal formado
            libxml_use_internal_errors(true);
            $dom->loadHTML($htmlContent, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
            libxml_clear_errors();

            // Criar DOMXPath
            $xpath = new DOMXPath($dom);

            // Executar query XPath
            $nodes = $xpath->query($selector);

            if ($nodes === false) {
                throw new InvalidArgumentException("Seletor XPath inválido: {$selector}");
            }

            $extractedData = [];
            foreach ($nodes as $node) {
                $extractedData[] = $node->textContent;
            }

            Log::info("Dados extraídos com sucesso. Total: " . count($extractedData) . " elementos.");
            return $extractedData;
        } catch (\Exception $e) {
            Log::error("Falha ao extrair dados: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Extrai dados usando seletor CSS simplificado.
     *
     * @param string $urlOrHtml
     * @param string $cssSelector
     * @param bool $isUrl
     * @return array<string>
     */
    public function extractDataByCss(string $urlOrHtml, string $cssSelector, bool $isUrl = true): array
    {
        // Conversão simples de CSS para XPath (casos básicos)
        $xpathSelector = $this->cssToXpath($cssSelector);
        return $this->extractData($urlOrHtml, $xpathSelector, $isUrl);
    }

    /**
     * Converte seletor CSS simples para XPath.
     */
    protected function cssToXpath(string $cssSelector): string
    {
        // Conversões básicas CSS para XPath
        $xpath = $cssSelector;

        // tag
        $xpath = preg_replace('/^(\w+)/', '//$1', $xpath);

        // #id
        $xpath = preg_replace('/#([\w-]+)/', '[@id="$1"]', $xpath);

        // .class
        $xpath = preg_replace('/\.([\w-]+)/', '[contains(@class,"$1")]', $xpath);

        // Fallback: se não foi convertido, assumir que é tag
        if (!str_starts_with($xpath, '//')) {
            $xpath = '//' . $xpath;
        }

        return $xpath;
    }
}
