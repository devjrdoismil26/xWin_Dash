<?php

namespace App\Domains\Users\Http\Controllers;

use App\Domains\Users\Application\Actions\UpdateUserProfileAction;
use App\Domains\Users\Application\DTOs\UserProfileDTO;
use App\Domains\Users\Application\Services\UserProfileService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private UpdateUserProfileAction $updateProfileAction,
        private UserProfileService $profileService
    ) {}

    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string',
            'phone' => 'nullable|string',
            'timezone' => 'required|string',
            'preferences' => 'nullable|array',
        ]);

        $dto = new UserProfileDTO(
            user_id: $request->user()->id,
            avatar: $request->avatar,
            bio: $request->bio,
            phone: $request->phone,
            timezone: $request->timezone,
            preferences: $request->preferences ?? []
        );

        $this->updateProfileAction->execute($request->user(), $dto);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $path = $this->profileService->uploadAvatar($request->user(), $request->file('avatar'));

        return response()->json([
            'success' => true,
            'data' => ['avatar' => $path],
        ]);
    }
}
