<?php

namespace App\Domains\Users\Http\Controllers\Api;

use App\Domains\Users\Http\Requests\DeleteUserRequest;
use App\Domains\Users\Http\Requests\StoreUserRequest;
use App\Domains\Users\Http\Requests\UpdateUserRequest;
use App\Domains\Users\Services\UserService; // Supondo que este serviço exista
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the users.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $users = $this->userService->getAllUsers($request->get('per_page', 15));
        return response()->json($users);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param StoreUserRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());
        return response()->json($user, 201);
    }

    /**
     * Display the specified user.
     *
     * @param \App\Models\User $user
     *
     * @return JsonResponse
     */
    public function show(\App\Models\User $user): JsonResponse
    {
        return response()->json($user);
    }

    /**
     * Update the specified user in storage.
     *
     * @param UpdateUserRequest $request
     * @param \App\Models\User  $user
     *
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, \App\Models\User $user): JsonResponse
    {
        try {
            $updatedUser = $this->userService->updateUser($user->id, $request->validated());
            return response()->json($updatedUser);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    }

    /**
     * Remove the specified user from storage.
     *
     * @param DeleteUserRequest $request
     * @param \App\Models\User  $user
     *
     * @return JsonResponse
     */
    public function destroy(DeleteUserRequest $request, \App\Models\User $user): JsonResponse
    {
        $success = $this->userService->deleteUser($user->id);
        if (!$success) {
            return response()->json(['message' => 'User not found.'], 404);
        }
        return response()->json(['message' => 'User deleted successfully.']);
    }
}
