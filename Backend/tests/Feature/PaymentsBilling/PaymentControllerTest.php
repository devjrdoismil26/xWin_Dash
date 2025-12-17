<?php

namespace Tests\Feature\PaymentsBilling;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PaymentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Setup comum para todos os testes
    }

    /** @test */
    public function it_requires_authentication_for_all_routes()
    {
        $routes = $this->getProtectedRoutes();

        foreach ($routes as $method => $route) {
            $response = $this->{$method}($route);

            $response->assertRedirect(route('login'));
        }
    }

    /** @test */
    public function authenticated_user_can_access_index()
    {
        $user = $this->actingAsUser();

        $response = $this->get($this->getIndexRoute());

        $response->assertOk();
        $response->assertViewIs($this->getIndexView());
    }

    /** @test */
    public function it_displays_paginated_results_on_index()
    {
        $user = $this->actingAsUser();
        $this->createMultipleTestRecords(15);

        $response = $this->get($this->getIndexRoute());

        $response->assertOk();
        $response->assertViewHas('items');
    }

    /** @test */
    public function it_can_search_and_filter_results()
    {
        $user = $this->actingAsUser();
        $this->createTestRecord(['name' => 'Searchable Item']);
        $this->createTestRecord(['name' => 'Other Item']);

        $response = $this->get($this->getIndexRoute() . '?search=Searchable');

        $response->assertOk();
        $response->assertSee('Searchable Item');
        $response->assertDontSee('Other Item');
    }

    /** @test */
    public function it_can_show_create_form()
    {
        $user = $this->actingAsUser();

        $response = $this->get($this->getCreateRoute());

        $response->assertOk();
        $response->assertViewIs($this->getCreateView());
    }

    /** @test */
    public function it_can_store_new_record_with_valid_data()
    {
        $user = $this->actingAsUser();
        $data = $this->getValidCreationData();

        $response = $this->post($this->getStoreRoute(), $data);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas($this->getTableName(), [
            'name' => $data['name'],
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_storing()
    {
        $user = $this->actingAsUser();

        $response = $this->post($this->getStoreRoute(), []);

        $response->assertSessionHasErrors($this->getRequiredFields());
    }

    /** @test */
    public function it_can_show_single_record()
    {
        $user = $this->actingAsUser();
        $record = $this->createTestRecord();

        $response = $this->get($this->getShowRoute($record->id));

        $response->assertOk();
        $response->assertViewIs($this->getShowView());
        $response->assertViewHas('item', $record);
    }

    /** @test */
    public function it_returns_404_for_non_existent_record()
    {
        $user = $this->actingAsUser();

        $response = $this->get($this->getShowRoute('non-existent-id'));

        $response->assertNotFound();
    }

    /** @test */
    public function it_can_show_edit_form()
    {
        $user = $this->actingAsUser();
        $record = $this->createTestRecord();

        $response = $this->get($this->getEditRoute($record->id));

        $response->assertOk();
        $response->assertViewIs($this->getEditView());
        $response->assertViewHas('item', $record);
    }

    /** @test */
    public function it_can_update_existing_record()
    {
        $user = $this->actingAsUser();
        $record = $this->createTestRecord();
        $updateData = $this->getValidUpdateData();

        $response = $this->put($this->getUpdateRoute($record->id), $updateData);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas($this->getTableName(), [
            'id' => $record->id,
            'name' => $updateData['name'],
        ]);
    }

    /** @test */
    public function it_validates_data_when_updating()
    {
        $user = $this->actingAsUser();
        $record = $this->createTestRecord();

        $response = $this->put($this->getUpdateRoute($record->id), []);

        $response->assertSessionHasErrors($this->getRequiredFields());
    }

    /** @test */
    public function it_can_soft_delete_record()
    {
        $user = $this->actingAsUser();
        $record = $this->createTestRecord();

        $response = $this->delete($this->getDestroyRoute($record->id));

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertSoftDeleted($record);
    }

    /** @test */
    public function admin_can_access_all_actions()
    {
        $admin = $this->actingAsAdmin();
        $record = $this->createTestRecord();

        // Testar todas as rotas principais
        $this->get($this->getIndexRoute())->assertOk();
        $this->get($this->getCreateRoute())->assertOk();
        $this->get($this->getShowRoute($record->id))->assertOk();
        $this->get($this->getEditRoute($record->id))->assertOk();
    }

    /** @test */
    public function it_handles_ajax_requests_properly()
    {
        $user = $this->actingAsUser();

        $response = $this->ajax('GET', $this->getIndexRoute());

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/json; charset=UTF-8');
    }

    // Métodos auxiliares - devem ser customizados por domínio
    private function getProtectedRoutes(): array
    {
        return [
            'get' => $this->getIndexRoute(),
            'get' => $this->getCreateRoute(),
        ];
    }

    private function getIndexRoute(): string
    {
        return '/admin/items';
    }

    private function getCreateRoute(): string
    {
        return '/admin/items/create';
    }

    private function getStoreRoute(): string
    {
        return '/admin/items';
    }

    private function getShowRoute($id): string
    {
        return "/admin/items/{$id}";
    }

    private function getEditRoute($id): string
    {
        return "/admin/items/{$id}/edit";
    }

    private function getUpdateRoute($id): string
    {
        return "/admin/items/{$id}";
    }

    private function getDestroyRoute($id): string
    {
        return "/admin/items/{$id}";
    }

    private function getIndexView(): string
    {
        return 'admin.items.index';
    }

    private function getCreateView(): string
    {
        return 'admin.items.create';
    }

    private function getShowView(): string
    {
        return 'admin.items.show';
    }

    private function getEditView(): string
    {
        return 'admin.items.edit';
    }

    private function getTableName(): string
    {
        return 'items';
    }

    private function getRequiredFields(): array
    {
        return ['name'];
    }

    private function getValidCreationData(): array
    {
        return ['name' => 'Test Item', 'description' => 'Test Description'];
    }

    private function getValidUpdateData(): array
    {
        return ['name' => 'Updated Item', 'description' => 'Updated Description'];
    }

    private function createTestRecord(array $attributes = [])
    {
        // Deve ser implementado para cada domínio específico
        return null;
    }

    private function createMultipleTestRecords(int $count): void
    {
        for ($i = 0; $i < $count; ++$i) {
            $this->createTestRecord();
        }
    }
}
