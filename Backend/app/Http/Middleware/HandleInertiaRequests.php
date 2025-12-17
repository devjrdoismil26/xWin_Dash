<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded when a request first arrives.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared to the frontend.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => method_exists($user, 'getRoleNames') ? $user->getRoleNames()->toArray() : [],
                    'permissions' => method_exists($user, 'getAllPermissions') ? 
                        $user->getAllPermissions()->pluck('name')->toArray() : [],
                    'is_active' => $user->is_active ?? true,
                    'current_project_id' => $user->current_project_id ?? null
                ] : null,
            ],
            'projects' => [
                'active' => $this->getActiveProject($user),
                'list' => $this->getUserProjects($user)
            ],
            'flash' => [
                'message' => $request->session()->get('message'),
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy())->toArray(),
                'location' => $request->url(),
            ],
            'app_name' => config('app.name', 'xWin Dash'),
            'app_env' => config('app.env', 'local'),
            'api_url' => config('app.url') . '/api',
            'csrf_token' => null,
        ]);
    }

    private function getActiveProject($user)
    {
        if (!$user || !$user->current_project_id) {
            return null;
        }
        
        try {
            $project = \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::find($user->current_project_id);
            
            if (!$project) {
                return null;
            }
            
            return [
                'id' => $project->id,
                'name' => $project->name,
                'slug' => $project->slug,
                'is_active' => $project->is_active,
                'is_owner' => $project->owner_id === $user->id
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erro ao buscar projeto ativo: ' . $e->getMessage());
            return null;
        }
    }

    private function getUserProjects($user)
    {
        if (!$user) {
            return [];
        }
        
        try {
            // Buscar projetos onde o usuário é dono ou membro
            $projects = \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::query()
                ->where(function ($query) use ($user) {
                    $query->where('owner_id', $user->id)
                          ->orWhereHas('users', function ($q) use ($user) {
                              $q->where('user_id', $user->id);
                          });
                })
                ->where('is_active', true)
                ->select(['id', 'name', 'slug', 'owner_id'])
                ->orderBy('name')
                ->get();
            
            return $projects->map(function ($project) use ($user) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'slug' => $project->slug,
                    'is_owner' => $project->owner_id === $user->id
                ];
            })->toArray();
            
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erro ao buscar projetos do usuário: ' . $e->getMessage());
            return [];
        }
    }
}
