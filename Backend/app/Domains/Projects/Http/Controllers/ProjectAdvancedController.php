<?php

namespace App\Domains\Projects\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProjectAdvancedController extends Controller
{
    // ===== MILESTONES =====
    
    public function getMilestones($projectId)
    {
        $milestones = DB::table('project_milestones')
            ->where('project_id', $projectId)
            ->orderBy('due_date', 'asc')
            ->get();

        return response()->json($milestones);
    }

    public function createMilestone(Request $request, $projectId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'status' => 'nullable|in:pending,in_progress,completed,cancelled'
        ]);

        $id = DB::table('project_milestones')->insertGetId([
            'project_id' => $projectId,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'],
            'status' => $validated['status'] ?? 'pending',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $milestone = DB::table('project_milestones')->find($id);
        return response()->json($milestone, 201);
    }

    public function updateMilestone(Request $request, $projectId, $milestoneId)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,in_progress,completed,cancelled'
        ]);

        DB::table('project_milestones')
            ->where('id', $milestoneId)
            ->where('project_id', $projectId)
            ->update(array_merge($validated, ['updated_at' => now()]));

        $milestone = DB::table('project_milestones')->find($milestoneId);
        return response()->json($milestone);
    }

    public function deleteMilestone($projectId, $milestoneId)
    {
        DB::table('project_milestones')
            ->where('id', $milestoneId)
            ->where('project_id', $projectId)
            ->delete();

        return response()->json(['message' => 'Milestone deleted successfully']);
    }

    // ===== RESOURCES =====
    
    public function getResources($projectId)
    {
        $resources = DB::table('project_resources')
            ->where('project_id', $projectId)
            ->get();

        return response()->json($resources);
    }

    public function createResource(Request $request, $projectId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:human,material,equipment,financial',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'nullable|string',
            'cost_per_unit' => 'nullable|numeric|min:0'
        ]);

        $id = DB::table('project_resources')->insertGetId([
            'project_id' => $projectId,
            'name' => $validated['name'],
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'unit' => $validated['unit'] ?? null,
            'cost_per_unit' => $validated['cost_per_unit'] ?? 0,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $resource = DB::table('project_resources')->find($id);
        return response()->json($resource, 201);
    }

    // ===== BUDGET =====
    
    public function getBudget($projectId)
    {
        $budget = DB::table('project_budgets')
            ->where('project_id', $projectId)
            ->first();

        if (!$budget) {
            return response()->json([
                'total_budget' => 0,
                'spent' => 0,
                'remaining' => 0,
                'categories' => []
            ]);
        }

        return response()->json($budget);
    }

    public function updateBudget(Request $request, $projectId)
    {
        $validated = $request->validate([
            'total_budget' => 'required|numeric|min:0',
            'spent' => 'nullable|numeric|min:0',
            'categories' => 'nullable|array'
        ]);

        $spent = $validated['spent'] ?? 0;
        $remaining = $validated['total_budget'] - $spent;

        DB::table('project_budgets')->updateOrInsert(
            ['project_id' => $projectId],
            [
                'total_budget' => $validated['total_budget'],
                'spent' => $spent,
                'remaining' => $remaining,
                'categories' => json_encode($validated['categories'] ?? []),
                'updated_at' => now()
            ]
        );

        $budget = DB::table('project_budgets')->where('project_id', $projectId)->first();
        return response()->json($budget);
    }

    // ===== RISKS =====
    
    public function getRisks($projectId)
    {
        $risks = DB::table('project_risks')
            ->where('project_id', $projectId)
            ->orderBy('severity', 'desc')
            ->get();

        return response()->json($risks);
    }

    public function createRisk(Request $request, $projectId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'severity' => 'required|in:low,medium,high,critical',
            'probability' => 'required|in:low,medium,high',
            'mitigation' => 'nullable|string',
            'status' => 'nullable|in:identified,analyzing,mitigating,resolved'
        ]);

        $id = DB::table('project_risks')->insertGetId([
            'project_id' => $projectId,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'severity' => $validated['severity'],
            'probability' => $validated['probability'],
            'mitigation' => $validated['mitigation'] ?? null,
            'status' => $validated['status'] ?? 'identified',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $risk = DB::table('project_risks')->find($id);
        return response()->json($risk, 201);
    }

    // ===== ANALYTICS =====
    
    public function getAnalytics($projectId)
    {
        $analytics = [
            'tasks_completed' => DB::table('tasks')->where('project_id', $projectId)->where('status', 'completed')->count(),
            'tasks_pending' => DB::table('tasks')->where('project_id', $projectId)->where('status', 'pending')->count(),
            'milestones_completed' => DB::table('project_milestones')->where('project_id', $projectId)->where('status', 'completed')->count(),
            'budget_utilization' => $this->calculateBudgetUtilization($projectId),
            'team_size' => DB::table('project_members')->where('project_id', $projectId)->count(),
            'active_risks' => DB::table('project_risks')->where('project_id', $projectId)->whereIn('status', ['identified', 'analyzing', 'mitigating'])->count()
        ];

        return response()->json($analytics);
    }

    private function calculateBudgetUtilization($projectId)
    {
        $budget = DB::table('project_budgets')->where('project_id', $projectId)->first();
        
        if (!$budget || $budget->total_budget == 0) {
            return 0;
        }

        return round(($budget->spent / $budget->total_budget) * 100, 2);
    }
}
