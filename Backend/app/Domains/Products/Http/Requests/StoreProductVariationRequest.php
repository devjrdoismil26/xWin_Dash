<?php

namespace App\Domains\Products\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductVariationRequest extends FormRequest
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
            'product_id' => 'required|string|exists:products,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'sku' => 'required|string|max:100|unique:product_variations,sku',
            'price' => 'required|numeric|min:0|max:999999.99',
            'compare_price' => 'nullable|numeric|min:0|max:999999.99|gt:price',
            'cost_price' => 'nullable|numeric|min:0|max:999999.99',
            'stock_quantity' => 'required|integer|min:0',
            'track_inventory' => 'boolean',
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'weight' => 'nullable|numeric|min:0|max:999.99',
            'dimensions' => 'nullable|array',
            'dimensions.width' => 'nullable|numeric|min:0|max:999.99',
            'dimensions.height' => 'nullable|numeric|min:0|max:999.99',
            'dimensions.depth' => 'nullable|numeric|min:0|max:999.99',
            'images' => 'nullable|array',
            'images.*' => 'string|max:500',
            'attributes' => 'nullable|array',
            'variation_options' => 'nullable|array',
            'is_default' => 'boolean',
            'sort_order' => 'integer|min:0|max:9999',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'The product ID is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'name.required' => 'The variation name is required.',
            'name.max' => 'The variation name may not be greater than 255 characters.',
            'sku.required' => 'The SKU is required.',
            'sku.unique' => 'This SKU is already in use.',
            'price.required' => 'The price is required.',
            'price.numeric' => 'The price must be a number.',
            'price.min' => 'The price must be at least 0.',
            'compare_price.gt' => 'The compare price must be greater than the regular price.',
            'stock_quantity.required' => 'The stock quantity is required.',
            'stock_quantity.integer' => 'The stock quantity must be an integer.',
            'stock_quantity.min' => 'The stock quantity must be at least 0.',
            'status.required' => 'The status is required.',
            'status.in' => 'The status must be either active or inactive.',
            'weight.numeric' => 'The weight must be a number.',
            'weight.min' => 'The weight must be at least 0.',
            'dimensions.array' => 'The dimensions must be an array.',
            'images.array' => 'The images must be an array.',
            'images.*.string' => 'Each image must be a string.',
            'attributes.array' => 'The attributes must be an array.',
            'variation_options.array' => 'The variation options must be an array.',
            'sort_order.integer' => 'The sort order must be an integer.',
            'sort_order.min' => 'The sort order must be at least 0.',
            'sort_order.max' => 'The sort order may not be greater than 9999.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'product_id' => 'product',
            'compare_price' => 'compare price',
            'cost_price' => 'cost price',
            'stock_quantity' => 'stock quantity',
            'track_inventory' => 'track inventory',
            'is_default' => 'default variation',
            'sort_order' => 'sort order',
            'variation_options' => 'variation options',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default values
        $this->merge([
            'track_inventory' => $this->boolean('track_inventory', true),
            'is_default' => $this->boolean('is_default', false),
            'sort_order' => $this->integer('sort_order', 0),
            'status' => $this->input('status', 'active'),
        ]);
    }
}