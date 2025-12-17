<?php

namespace App\Domains\Users\Application\Actions;

use App\Domains\Users\Application\Services\BulkUserService;
use Illuminate\Support\Facades\Validator;

class BulkImportUsersAction
{
    public function __construct(
        private BulkUserService $bulkService
    ) {}

    public function execute(array $users): array
    {
        $validated = [];
        $errors = [];

        foreach ($users as $index => $userData) {
            $validator = Validator::make($userData, [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                $errors[$index] = $validator->errors()->toArray();
            } else {
                $validated[] = $userData;
            }
        }

        $created = $this->bulkService->bulkCreate($validated);

        return [
            'created' => $created,
            'errors' => $errors,
            'total' => count($users),
        ];
    }
}
