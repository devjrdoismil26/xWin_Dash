<?php

namespace App\Domains\Products\Application\Actions;

use App\Domains\Products\Application\Services\ProductCatalogService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SyncProductCatalogAction
{
    public function __construct(
        private ProductCatalogService $catalogService
    ) {}

    public function execute(array $products): int
    {
        $synced = 0;

        foreach ($products as $productData) {
            $validator = Validator::make($productData, [
                'name' => 'required|string',
                'price' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                continue;
            }

            DB::table('products')->updateOrInsert(
                ['name' => $productData['name']],
                array_merge($productData, ['updated_at' => now()])
            );

            $synced++;
        }

        return $synced;
    }
}
