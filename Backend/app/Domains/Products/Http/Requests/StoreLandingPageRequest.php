<?php

namespace App\Domains\Products\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLandingPageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization will be handled in the controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'slug' => 'nullable|string|max:255|unique:landing_pages,slug|regex:/^[a-z0-9\-]+$/',
            'title' => 'required|string|max:255',
            'meta_description' => 'nullable|string|max:160',
            'meta_keywords' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'hero_section' => 'nullable|array',
            'hero_section.title' => 'nullable|string|max:255',
            'hero_section.subtitle' => 'nullable|string|max:500',
            'hero_section.image' => 'nullable|string|max:500',
            'hero_section.cta' => 'nullable|array',
            'hero_section.cta.text' => 'nullable|string|max:100',
            'hero_section.cta.url' => 'nullable|string|max:500',
            'features_section' => 'nullable|array',
            'features_section.*.title' => 'nullable|string|max:255',
            'features_section.*.description' => 'nullable|string|max:500',
            'features_section.*.icon' => 'nullable|string|max:100',
            'testimonials_section' => 'nullable|array',
            'testimonials_section.*.name' => 'nullable|string|max:255',
            'testimonials_section.*.company' => 'nullable|string|max:255',
            'testimonials_section.*.text' => 'nullable|string|max:1000',
            'testimonials_section.*.rating' => 'nullable|integer|min:1|max:5',
            'pricing_section' => 'nullable|array',
            'pricing_section.title' => 'nullable|string|max:255',
            'pricing_section.subtitle' => 'nullable|string|max:500',
            'pricing_section.plans' => 'nullable|array',
            'pricing_section.plans.*.name' => 'nullable|string|max:255',
            'pricing_section.plans.*.price' => 'nullable|numeric|min:0',
            'pricing_section.plans.*.features' => 'nullable|array',
            'pricing_section.plans.*.highlighted' => 'nullable|boolean',
            'cta_section' => 'nullable|array',
            'cta_section.title' => 'nullable|string|max:255',
            'cta_section.subtitle' => 'nullable|string|max:500',
            'cta_section.button_text' => 'nullable|string|max:100',
            'cta_section.button_url' => 'nullable|string|max:500',
            'footer_section' => 'nullable|array',
            'footer_section.company_name' => 'nullable|string|max:255',
            'footer_section.description' => 'nullable|string|max:500',
            'footer_section.links' => 'nullable|array',
            'footer_section.links.*.title' => 'nullable|string|max:255',
            'footer_section.links.*.url' => 'nullable|string|max:500',
            'custom_css' => 'nullable|string',
            'custom_js' => 'nullable|string',
            'analytics_code' => 'nullable|string',
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'is_active' => 'boolean',
            'product_id' => 'nullable|string|exists:products,id',
            'lead_capture_form_id' => 'nullable|string|exists:lead_capture_forms,id',
            'project_id' => 'required|string|exists:projects,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The landing page name is required.',
            'name.max' => 'The landing page name may not be greater than 255 characters.',
            'slug.unique' => 'This slug is already in use.',
            'slug.regex' => 'The slug may only contain lowercase letters, numbers, and hyphens.',
            'title.required' => 'The page title is required.',
            'title.max' => 'The page title may not be greater than 255 characters.',
            'meta_description.max' => 'The meta description may not be greater than 160 characters.',
            'meta_keywords.max' => 'The meta keywords may not be greater than 255 characters.',
            'hero_section.array' => 'The hero section must be an array.',
            'hero_section.title.max' => 'The hero title may not be greater than 255 characters.',
            'hero_section.subtitle.max' => 'The hero subtitle may not be greater than 500 characters.',
            'hero_section.image.max' => 'The hero image URL may not be greater than 500 characters.',
            'hero_section.cta.array' => 'The hero CTA must be an array.',
            'hero_section.cta.text.max' => 'The CTA text may not be greater than 100 characters.',
            'hero_section.cta.url.max' => 'The CTA URL may not be greater than 500 characters.',
            'features_section.array' => 'The features section must be an array.',
            'features_section.*.title.max' => 'Each feature title may not be greater than 255 characters.',
            'features_section.*.description.max' => 'Each feature description may not be greater than 500 characters.',
            'features_section.*.icon.max' => 'Each feature icon may not be greater than 100 characters.',
            'testimonials_section.array' => 'The testimonials section must be an array.',
            'testimonials_section.*.name.max' => 'Each testimonial name may not be greater than 255 characters.',
            'testimonials_section.*.company.max' => 'Each testimonial company may not be greater than 255 characters.',
            'testimonials_section.*.text.max' => 'Each testimonial text may not be greater than 1000 characters.',
            'testimonials_section.*.rating.integer' => 'Each testimonial rating must be an integer.',
            'testimonials_section.*.rating.min' => 'Each testimonial rating must be at least 1.',
            'testimonials_section.*.rating.max' => 'Each testimonial rating may not be greater than 5.',
            'pricing_section.array' => 'The pricing section must be an array.',
            'pricing_section.title.max' => 'The pricing title may not be greater than 255 characters.',
            'pricing_section.subtitle.max' => 'The pricing subtitle may not be greater than 500 characters.',
            'pricing_section.plans.array' => 'The pricing plans must be an array.',
            'pricing_section.plans.*.name.max' => 'Each plan name may not be greater than 255 characters.',
            'pricing_section.plans.*.price.numeric' => 'Each plan price must be a number.',
            'pricing_section.plans.*.price.min' => 'Each plan price must be at least 0.',
            'pricing_section.plans.*.features.array' => 'Each plan features must be an array.',
            'pricing_section.plans.*.highlighted.boolean' => 'Each plan highlighted must be a boolean.',
            'cta_section.array' => 'The CTA section must be an array.',
            'cta_section.title.max' => 'The CTA title may not be greater than 255 characters.',
            'cta_section.subtitle.max' => 'The CTA subtitle may not be greater than 500 characters.',
            'cta_section.button_text.max' => 'The CTA button text may not be greater than 100 characters.',
            'cta_section.button_url.max' => 'The CTA button URL may not be greater than 500 characters.',
            'footer_section.array' => 'The footer section must be an array.',
            'footer_section.company_name.max' => 'The footer company name may not be greater than 255 characters.',
            'footer_section.description.max' => 'The footer description may not be greater than 500 characters.',
            'footer_section.links.array' => 'The footer links must be an array.',
            'footer_section.links.*.title.max' => 'Each footer link title may not be greater than 255 characters.',
            'footer_section.links.*.url.max' => 'Each footer link URL may not be greater than 500 characters.',
            'status.required' => 'The status is required.',
            'status.in' => 'The status must be draft, published, or archived.',
            'product_id.exists' => 'The selected product does not exist.',
            'lead_capture_form_id.exists' => 'The selected lead capture form does not exist.',
            'project_id.required' => 'The project ID is required.',
            'project_id.exists' => 'The selected project does not exist.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'meta_description' => 'meta description',
            'meta_keywords' => 'meta keywords',
            'hero_section' => 'hero section',
            'features_section' => 'features section',
            'testimonials_section' => 'testimonials section',
            'pricing_section' => 'pricing section',
            'cta_section' => 'CTA section',
            'footer_section' => 'footer section',
            'custom_css' => 'custom CSS',
            'custom_js' => 'custom JavaScript',
            'analytics_code' => 'analytics code',
            'is_active' => 'active status',
            'product_id' => 'product',
            'lead_capture_form_id' => 'lead capture form',
            'project_id' => 'project',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default values
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
            'status' => $this->input('status', 'draft'),
        ]);
    }
}