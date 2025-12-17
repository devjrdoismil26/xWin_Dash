<?php

namespace App\Domains\Categorization\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Categorization/Index', [
            'categories' => [],
            'stats' => [
                'totalCategories' => 0,
                'activeCategories' => 0,
                'categorizedItems' => 0,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Categorization/Create', [
            'parentCategories' => []
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean'
        ]);

        try {
            $category = \App\Domains\Categorization\Models\Category::create([
                'name' => $request->name,
                'description' => $request->description,
                'parent_id' => $request->parent_id,
                'color' => $request->color ?? '#3B82F6',
                'icon' => $request->icon ?? 'folder',
                'is_active' => $request->is_active ?? true,
                'user_id' => auth()->id(),
                'project_id' => auth()->user()->current_project_id
            ]);

            return redirect()->route('categories.index')
                ->with('success', 'Categoria criada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Erro ao criar categoria: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        return Inertia::render('Categorization/Show', [
            'category' => [],
            'items' => []
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        return Inertia::render('Categorization/Edit', [
            'category' => [],
            'parentCategories' => []
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean'
        ]);

        try {
            $category = \App\Domains\Categorization\Models\Category::findOrFail($id);

            // Verificar se o usuário tem permissão para editar
            if ($category->user_id !== auth()->id()) {
                return redirect()->back()->with('error', 'Você não tem permissão para editar esta categoria.');
            }

            $category->update([
                'name' => $request->name,
                'description' => $request->description,
                'parent_id' => $request->parent_id,
                'color' => $request->color ?? $category->color,
                'icon' => $request->icon ?? $category->icon,
                'is_active' => $request->is_active ?? $category->is_active
            ]);

            return redirect()->route('categories.index')
                ->with('success', 'Categoria atualizada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Erro ao atualizar categoria: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $category = \App\Domains\Categorization\Models\Category::findOrFail($id);

            // Verificar se o usuário tem permissão para excluir
            if ($category->user_id !== auth()->id()) {
                return redirect()->back()->with('error', 'Você não tem permissão para excluir esta categoria.');
            }

            // Verificar se a categoria tem subcategorias
            $hasSubcategories = \App\Domains\Categorization\Models\Category::where('parent_id', $id)->exists();
            if ($hasSubcategories) {
                return redirect()->back()->with('error', 'Não é possível excluir uma categoria que possui subcategorias.');
            }

            // Verificar se a categoria está sendo usada
            $isInUse = \App\Domains\Categorization\Models\Taggable::where('category_id', $id)->exists();
            if ($isInUse) {
                return redirect()->back()->with('error', 'Não é possível excluir uma categoria que está sendo utilizada.');
            }

            $category->delete();

            return redirect()->route('categories.index')
                ->with('success', 'Categoria excluída com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro ao excluir categoria: ' . $e->getMessage());
        }
    }
}
