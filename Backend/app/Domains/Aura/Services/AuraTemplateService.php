<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Models\AuraTemplate;
use Illuminate\Support\Facades\DB;

class AuraTemplateService
{
    /**
     * Get all templates
     */
    public function getAllTemplates()
    {
        return AuraTemplate::all();
    }

    /**
     * Get template by ID
     */
    public function getTemplateById($id)
    {
        return AuraTemplate::findOrFail($id);
    }

    /**
     * Create a new template
     */
    public function createTemplate(array $data)
    {
        return AuraTemplate::create($data);
    }

    /**
     * Update template
     */
    public function updateTemplate($id, array $data)
    {
        $template = AuraTemplate::findOrFail($id);
        $template->update($data);
        return $template;
    }

    /**
     * Delete template
     */
    public function deleteTemplate($id)
    {
        $template = AuraTemplate::findOrFail($id);
        return $template->delete();
    }

    /**
     * Get templates by type
     */
    public function getTemplatesByType($type)
    {
        return AuraTemplate::where('type', $type)->get();
    }

    /**
     * Get active templates
     */
    public function getActiveTemplates()
    {
        return AuraTemplate::where('is_active', true)->get();
    }

    /**
     * Duplicate template
     */
    public function duplicateTemplate($id, $newName = null)
    {
        $template = AuraTemplate::findOrFail($id);
        $newTemplate = $template->replicate();

        if ($newName) {
            $newTemplate->name = $newName;
        } else {
            $newTemplate->name = $template->name . ' (Copy)';
        }

        $newTemplate->save();
        return $newTemplate;
    }

    /**
     * Get template statistics
     */
    public function getTemplateStats($id)
    {
        $template = AuraTemplate::findOrFail($id);

        return [
            'id' => $template->id,
            'name' => $template->name,
            'type' => $template->type,
            'usage_count' => $template->usage_count ?? 0,
            'last_used' => $template->last_used,
            'created_at' => $template->created_at,
            'updated_at' => $template->updated_at,
        ];
    }

    /**
     * Search templates
     */
    public function searchTemplates($query)
    {
        return AuraTemplate::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->orWhere('content', 'like', "%{$query}%")
            ->get();
    }

    /**
     * Get template categories
     */
    public function getTemplateCategories()
    {
        return AuraTemplate::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');
    }

    /**
     * Get templates by category
     */
    public function getTemplatesByCategory($category)
    {
        return AuraTemplate::where('category', $category)->get();
    }
}
