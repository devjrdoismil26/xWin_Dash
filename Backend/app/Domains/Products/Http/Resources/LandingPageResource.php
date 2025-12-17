<?php

namespace App\Domains\Products\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LandingPageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'slug' => $this->slug,
            'title' => $this->title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'content' => $this->content,
            'hero_section' => $this->hero_section,
            'features_section' => $this->features_section,
            'testimonials_section' => $this->testimonials_section,
            'pricing_section' => $this->pricing_section,
            'cta_section' => $this->cta_section,
            'footer_section' => $this->footer_section,
            'custom_css' => $this->custom_css,
            'custom_js' => $this->custom_js,
            'analytics_code' => $this->analytics_code,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'is_active' => $this->is_active,
            'is_published' => $this->is_published,
            'views_count' => $this->views_count,
            'conversions_count' => $this->conversions_count,
            'conversion_rate' => $this->conversion_rate,
            'formatted_conversion_rate' => $this->formatted_conversion_rate,
            'url' => $this->url,
            'product_id' => $this->product_id,
            'lead_capture_form_id' => $this->lead_capture_form_id,
            'project_id' => $this->project_id,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,

            // Relationships
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'sku' => $this->product->sku,
                    'price' => $this->product->price,
                    'formatted_price' => $this->product->formatted_price,
                ];
            }),
            'lead_capture_form' => $this->whenLoaded('leadCaptureForm', function () {
                return [
                    'id' => $this->leadCaptureForm->id,
                    'name' => $this->leadCaptureForm->name,
                    'slug' => $this->leadCaptureForm->slug,
                    'fields_count' => $this->leadCaptureForm->fields_count,
                    'submissions_count' => $this->leadCaptureForm->submissions_count,
                ];
            }),
            'project' => $this->whenLoaded('project', function () {
                return [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                ];
            }),
            'created_by_user' => $this->whenLoaded('createdBy', function () {
                return [
                    'id' => $this->createdBy->id,
                    'name' => $this->createdBy->name,
                    'email' => $this->createdBy->email,
                ];
            }),

            // Computed fields
            'performance_metrics' => [
                'views_count' => $this->views_count,
                'conversions_count' => $this->conversions_count,
                'conversion_rate' => $this->conversion_rate,
                'formatted_conversion_rate' => $this->formatted_conversion_rate,
                'is_high_converting' => $this->conversion_rate > 10,
                'is_low_converting' => $this->conversion_rate < 2,
            ],
            'seo_data' => [
                'title' => $this->title,
                'meta_description' => $this->meta_description,
                'meta_keywords' => $this->meta_keywords,
                'slug' => $this->slug,
                'url' => $this->url,
            ],
            'sections_summary' => [
                'has_hero' => !empty($this->hero_section),
                'has_features' => !empty($this->features_section),
                'has_testimonials' => !empty($this->testimonials_section),
                'has_pricing' => !empty($this->pricing_section),
                'has_cta' => !empty($this->cta_section),
                'has_footer' => !empty($this->footer_section),
                'has_custom_css' => !empty($this->custom_css),
                'has_custom_js' => !empty($this->custom_js),
                'has_analytics' => !empty($this->analytics_code),
            ],
            'hero_data' => $this->when($this->hero_section, function () {
                return [
                    'title' => $this->hero_section['title'] ?? null,
                    'subtitle' => $this->hero_section['subtitle'] ?? null,
                    'image' => $this->hero_section['image'] ?? null,
                    'cta_text' => $this->hero_section['cta']['text'] ?? null,
                    'cta_url' => $this->hero_section['cta']['url'] ?? null,
                ];
            }),
            'cta_data' => $this->when($this->cta_section, function () {
                return [
                    'title' => $this->cta_section['title'] ?? null,
                    'subtitle' => $this->cta_section['subtitle'] ?? null,
                    'button_text' => $this->cta_section['button_text'] ?? null,
                    'button_url' => $this->cta_section['button_url'] ?? null,
                ];
            }),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString(),
            ],
        ];
    }
}