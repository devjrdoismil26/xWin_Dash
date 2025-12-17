<?php

namespace App\Domains\Users\Http\Controllers\Api;

use App\Domains\Core\Http\Controllers\Controller;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\RoleModel as Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the roles.
     */
    public function index(Request $request): JsonResponse
    {
        $roles = Role::all();

        return response()->json(['data' => $roles]);
    }
}
