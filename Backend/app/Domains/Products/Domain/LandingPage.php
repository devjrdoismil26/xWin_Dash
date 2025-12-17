<?php

namespace App\Domains\Products\Domain;

use DateTime;

class LandingPage
{
    public ?string $id;
    public string $name;
    public ?string $description;
    public string $slug;
    public string $title;
    public ?string $metaDescription;
    public ?string $metaKeywords;
    public ?string $content;
    public ?array $heroSection;
    public ?array $featuresSection;
    public ?array $testimonialsSection;
    public ?array $pricingSection;
    public ?array $ctaSection;
    public ?array $footerSection;
    public ?string $customCss;
    public ?string $customJs;
    public ?string $analyticsCode;
    public string $status;
    public bool $isActive;
    public int $viewsCount;
    public int $conversionsCount;
    public float $conversionRate;
    public ?string $productId;
    public ?string $leadCaptureFormId;
    public string $projectId;
    public string $createdBy;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;
    public ?DateTime $deletedAt;

    public function __construct(
        string $name,
        string $slug,
        string $title,
        string $projectId,
        string $createdBy,
        ?string $description = null,
        ?string $metaDescription = null,
        ?string $metaKeywords = null,
        ?string $content = null,
        ?array $heroSection = null,
        ?array $featuresSection = null,
        ?array $testimonialsSection = null,
        ?array $pricingSection = null,
        ?array $ctaSection = null,
        ?array $footerSection = null,
        ?string $customCss = null,
        ?string $customJs = null,
        ?string $analyticsCode = null,
        string $status = 'draft',
        bool $isActive = true,
        int $viewsCount = 0,
        int $conversionsCount = 0,
        float $conversionRate = 0.00,
        ?string $productId = null,
        ?string $leadCaptureFormId = null,
        ?string $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
        ?DateTime $deletedAt = null
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->slug = $slug;
        $this->title = $title;
        $this->metaDescription = $metaDescription;
        $this->metaKeywords = $metaKeywords;
        $this->content = $content;
        $this->heroSection = $heroSection;
        $this->featuresSection = $featuresSection;
        $this->testimonialsSection = $testimonialsSection;
        $this->pricingSection = $pricingSection;
        $this->ctaSection = $ctaSection;
        $this->footerSection = $footerSection;
        $this->customCss = $customCss;
        $this->customJs = $customJs;
        $this->analyticsCode = $analyticsCode;
        $this->status = $status;
        $this->isActive = $isActive;
        $this->viewsCount = $viewsCount;
        $this->conversionsCount = $conversionsCount;
        $this->conversionRate = $conversionRate;
        $this->productId = $productId;
        $this->leadCaptureFormId = $leadCaptureFormId;
        $this->projectId = $projectId;
        $this->createdBy = $createdBy;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->deletedAt = $deletedAt;
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'],
            $data['slug'],
            $data['title'],
            $data['project_id'],
            $data['created_by'],
            $data['description'] ?? null,
            $data['meta_description'] ?? null,
            $data['meta_keywords'] ?? null,
            $data['content'] ?? null,
            $data['hero_section'] ?? null,
            $data['features_section'] ?? null,
            $data['testimonials_section'] ?? null,
            $data['pricing_section'] ?? null,
            $data['cta_section'] ?? null,
            $data['footer_section'] ?? null,
            $data['custom_css'] ?? null,
            $data['custom_js'] ?? null,
            $data['analytics_code'] ?? null,
            $data['status'] ?? 'draft',
            $data['is_active'] ?? true,
            $data['views_count'] ?? 0,
            $data['conversions_count'] ?? 0,
            $data['conversion_rate'] ?? 0.00,
            $data['product_id'] ?? null,
            $data['lead_capture_form_id'] ?? null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
            isset($data['deleted_at']) ? new DateTime($data['deleted_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'slug' => $this->slug,
            'title' => $this->title,
            'meta_description' => $this->metaDescription,
            'meta_keywords' => $this->metaKeywords,
            'content' => $this->content,
            'hero_section' => $this->heroSection,
            'features_section' => $this->featuresSection,
            'testimonials_section' => $this->testimonialsSection,
            'pricing_section' => $this->pricingSection,
            'cta_section' => $this->ctaSection,
            'footer_section' => $this->footerSection,
            'custom_css' => $this->customCss,
            'custom_js' => $this->customJs,
            'analytics_code' => $this->analyticsCode,
            'status' => $this->status,
            'is_active' => $this->isActive,
            'views_count' => $this->viewsCount,
            'conversions_count' => $this->conversionsCount,
            'conversion_rate' => $this->conversionRate,
            'product_id' => $this->productId,
            'lead_capture_form_id' => $this->leadCaptureFormId,
            'project_id' => $this->projectId,
            'created_by' => $this->createdBy,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
            'deleted_at' => $this->deletedAt ? $this->deletedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    /**
     * Verifica se a landing page está publicada.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->isActive;
    }

    /**
     * Obtém a URL da landing page.
     */
    public function getUrl(): string
    {
        return url("/landing/{$this->slug}");
    }

    /**
     * Obtém a taxa de conversão formatada.
     */
    public function getFormattedConversionRate(): string
    {
        return number_format($this->conversionRate, 2) . '%';
    }

    /**
     * Incrementa o contador de visualizações.
     */
    public function incrementViews(): void
    {
        $this->viewsCount++;
        $this->updateConversionRate();
    }

    /**
     * Incrementa o contador de conversões.
     */
    public function incrementConversions(): void
    {
        $this->conversionsCount++;
        $this->updateConversionRate();
    }

    /**
     * Atualiza a taxa de conversão.
     */
    private function updateConversionRate(): void
    {
        if ($this->viewsCount > 0) {
            $this->conversionRate = ($this->conversionsCount / $this->viewsCount) * 100;
        } else {
            $this->conversionRate = 0.00;
        }
    }
}
