<?php

namespace App\Domains\Projects\Services;

use App\Domains\Projects\Models\Task;
use App\Domains\Projects\Models\Project;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskService
{
    /**
     * Create a new task.
     */
    public function createTask(array $data): Task
    {
        try {
            $task = Task::create($data);
            
            LoggerFacade::info('Task created', [
                'task_id' => $task->id,
                'project_id' => $task->project_id,
                'created_by' => $task->created_by
            ]);

            event(new \App\Domains\Projects\Events\TaskCreated($task));

            return $task;
        } catch (\Exception $e) {
            LoggerFacade::error('Error creating task', [
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to create task.', 0, $e);
        }
    }

    /**
     * Update a task.
     */
    public function updateTask(Task $task, array $data): Task
    {
        try {
            $oldData = $task->toArray();
            $task->update($data);
            
            LoggerFacade::info('Task updated', [
                'task_id' => $task->id,
                'changes' => array_diff_assoc($data, $oldData)
            ]);

            event(new \App\Domains\Projects\Events\TaskUpdated($task));

            return $task->fresh();
        } catch (\Exception $e) {
            LoggerFacade::error('Error updating task', [
                'task_id' => $task->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to update task.', 0, $e);
        }
    }

    /**
     * Delete a task.
     */
    public function deleteTask(Task $task): bool
    {
        try {
            LoggerFacade::info('Task deleted', [
                'task_id' => $task->id,
                'project_id' => $task->project_id
            ]);

            $result = $task->delete();
            
            if ($result) {
                event(new \App\Domains\Projects\Events\TaskDeleted($task));
            }

            return $result;
        } catch (\Exception $e) {
            LoggerFacade::error('Error deleting task', [
                'task_id' => $task->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to delete task.', 0, $e);
        }
    }

    /**
     * Start a task.
     */
    public function startTask(Task $task): bool
    {
        try {
            if (!$task->canBeStarted()) {
                throw new \Exception('Task cannot be started in current status');
            }

            $task->start();
            
            LoggerFacade::info('Task started', [
                'task_id' => $task->id,
                'started_at' => $task->started_at
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error starting task', [
                'task_id' => $task->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to start task.', 0, $e);
        }
    }

    /**
     * Complete a task.
     */
    public function completeTask(Task $task): bool
    {
        try {
            if (!$task->canBeCompleted()) {
                throw new \Exception('Task cannot be completed in current status');
            }

            $task->complete();
            
            LoggerFacade::info('Task completed', [
                'task_id' => $task->id,
                'completed_at' => $task->completed_at
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error completing task', [
                'task_id' => $task->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to complete task.', 0, $e);
        }
    }

    /**
     * Cancel a task.
     */
    public function cancelTask(Task $task): bool
    {
        try {
            if (!$task->canBeCancelled()) {
                throw new \Exception('Task cannot be cancelled in current status');
            }

            $task->cancel();
            
            LoggerFacade::info('Task cancelled', [
                'task_id' => $task->id
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error cancelling task', [
                'task_id' => $task->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to cancel task.', 0, $e);
        }
    }

    /**
     * Archive a task.
     */
    public function archiveTask(Task $task): bool
    {
        try {
            if (!$task->canBeArchived()) {
                throw new \Exception('Task cannot be archived in current status');
            }

            $task->archive();
            
            LoggerFacade::info('Task archived', [
                'task_id' => $task->id
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error archiving task', [
                'task_id' => $task->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to archive task.', 0, $e);
        }
    }

    /**
     * Update task progress.
     */
    public function updateTaskProgress(Task $task, float $progress): bool
    {
        try {
            if ($progress < 0 || $progress > 100) {
                throw new \Exception('Progress must be between 0 and 100');
            }

            $task->updateProgress($progress);
            
            LoggerFacade::info('Task progress updated', [
                'task_id' => $task->id,
                'progress' => $progress,
                'status' => $task->status
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error updating task progress', [
                'task_id' => $task->id,
                'progress' => $progress,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to update task progress.', 0, $e);
        }
    }

    /**
     * Assign task to user.
     */
    public function assignTask(Task $task, string $userId): bool
    {
        try {
            $task->assignTo($userId);
            
            LoggerFacade::info('Task assigned', [
                'task_id' => $task->id,
                'assigned_to' => $userId
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error assigning task', [
                'task_id' => $task->id,
                'assigned_to' => $userId,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to assign task.', 0, $e);
        }
    }

    /**
     * Unassign task.
     */
    public function unassignTask(Task $task): bool
    {
        try {
            $task->unassign();
            
            LoggerFacade::info('Task unassigned', [
                'task_id' => $task->id
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error unassigning task', [
                'task_id' => $task->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to unassign task.', 0, $e);
        }
    }

    /**
     * Get tasks by project.
     */
    public function getTasksByProject(string $projectId, array $filters = []): Collection
    {
        $query = Task::byProject($projectId);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        if (isset($filters['is_archived'])) {
            $query->where('is_archived', $filters['is_archived']);
        }

        if (isset($filters['overdue'])) {
            $query->overdue();
        }

        if (isset($filters['due_soon'])) {
            $days = $filters['due_soon_days'] ?? 3;
            $query->dueSoon($days);
        }

        // Sort
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->get();
    }

    /**
     * Get tasks by user.
     */
    public function getTasksByUser(string $userId, array $filters = []): Collection
    {
        $query = Task::where('assigned_to', $userId)
                    ->orWhere('created_by', $userId);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (isset($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }

        if (isset($filters['overdue'])) {
            $query->overdue();
        }

        if (isset($filters['due_soon'])) {
            $days = $filters['due_soon_days'] ?? 3;
            $query->dueSoon($days);
        }

        // Sort
        $sortBy = $filters['sort_by'] ?? 'due_date';
        $sortOrder = $filters['sort_order'] ?? 'asc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->get();
    }

    /**
     * Get overdue tasks.
     */
    public function getOverdueTasks(string $projectId = null): Collection
    {
        $query = Task::overdue();

        if ($projectId) {
            $query->byProject($projectId);
        }

        return $query->orderBy('due_date', 'asc')->get();
    }

    /**
     * Get tasks due soon.
     */
    public function getTasksDueSoon(int $days = 3, string $projectId = null): Collection
    {
        $query = Task::dueSoon($days);

        if ($projectId) {
            $query->byProject($projectId);
        }

        return $query->orderBy('due_date', 'asc')->get();
    }

    /**
     * Get task statistics for a project.
     */
    public function getTaskStatistics(string $projectId): array
    {
        $tasks = Task::byProject($projectId)->get();

        return [
            'total_tasks' => $tasks->count(),
            'pending_tasks' => $tasks->where('status', 'pending')->count(),
            'in_progress_tasks' => $tasks->where('status', 'in_progress')->count(),
            'completed_tasks' => $tasks->where('status', 'completed')->count(),
            'cancelled_tasks' => $tasks->where('status', 'cancelled')->count(),
            'overdue_tasks' => $tasks->filter(fn($task) => $task->is_overdue)->count(),
            'due_soon_tasks' => $tasks->filter(fn($task) => $task->is_due_soon)->count(),
            'high_priority_tasks' => $tasks->where('priority', 'high')->count(),
            'urgent_tasks' => $tasks->where('priority', 'urgent')->count(),
            'average_progress' => $tasks->avg('progress'),
            'total_estimated_hours' => $tasks->sum('estimated_hours'),
            'total_actual_hours' => $tasks->sum('actual_hours'),
        ];
    }

    /**
     * Get user task statistics.
     */
    public function getUserTaskStatistics(string $userId): array
    {
        $assignedTasks = Task::byAssignedTo($userId)->get();
        $createdTasks = Task::byCreatedBy($userId)->get();

        return [
            'assigned_tasks' => [
                'total' => $assignedTasks->count(),
                'pending' => $assignedTasks->where('status', 'pending')->count(),
                'in_progress' => $assignedTasks->where('status', 'in_progress')->count(),
                'completed' => $assignedTasks->where('status', 'completed')->count(),
                'overdue' => $assignedTasks->filter(fn($task) => $task->is_overdue)->count(),
            ],
            'created_tasks' => [
                'total' => $createdTasks->count(),
                'pending' => $createdTasks->where('status', 'pending')->count(),
                'in_progress' => $createdTasks->where('status', 'in_progress')->count(),
                'completed' => $createdTasks->where('status', 'completed')->count(),
            ],
        ];
    }

    /**
     * Create subtask.
     */
    public function createSubtask(Task $parentTask, array $data): Task
    {
        try {
            $data['parent_task_id'] = $parentTask->id;
            $data['project_id'] = $parentTask->project_id;
            
            $subtask = $this->createTask($data);
            
            LoggerFacade::info('Subtask created', [
                'subtask_id' => $subtask->id,
                'parent_task_id' => $parentTask->id
            ]);

            return $subtask;
        } catch (\Exception $e) {
            LoggerFacade::error('Error creating subtask', [
                'parent_task_id' => $parentTask->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to create subtask.', 0, $e);
        }
    }

    /**
     * Get subtasks.
     */
    public function getSubtasks(Task $parentTask): Collection
    {
        return $parentTask->subtasks()->orderBy('sort_order')->get();
    }

    /**
     * Bulk update task status.
     */
    public function bulkUpdateStatus(array $taskIds, string $status): int
    {
        try {
            $updated = Task::whereIn('id', $taskIds)->update(['status' => $status]);
            
            LoggerFacade::info('Tasks bulk status updated', [
                'task_ids' => $taskIds,
                'status' => $status,
                'updated_count' => $updated
            ]);

            return $updated;
        } catch (\Exception $e) {
            LoggerFacade::error('Error bulk updating task status', [
                'task_ids' => $taskIds,
                'status' => $status,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to bulk update task status.', 0, $e);
        }
    }

    /**
     * Bulk assign tasks.
     */
    public function bulkAssignTasks(array $taskIds, string $userId): int
    {
        try {
            $updated = Task::whereIn('id', $taskIds)->update(['assigned_to' => $userId]);
            
            LoggerFacade::info('Tasks bulk assigned', [
                'task_ids' => $taskIds,
                'assigned_to' => $userId,
                'updated_count' => $updated
            ]);

            return $updated;
        } catch (\Exception $e) {
            LoggerFacade::error('Error bulk assigning tasks', [
                'task_ids' => $taskIds,
                'assigned_to' => $userId,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to bulk assign tasks.', 0, $e);
        }
    }
}