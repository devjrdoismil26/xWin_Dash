<?php

namespace App\Domains\ADStool\Http\Controllers;

use App\Domains\ADStool\Http\Requests\StoreAccountRequest;
use App\Domains\ADStool\Http\Requests\UpdateAccountRequest;
use App\Domains\ADStool\Http\Resources\AccountResource;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\AccountModel;
use App\Domains\ADStool\Services\AccountService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    protected AccountService $accountService;

    public function __construct(AccountService $accountService)
    {
        $this->accountService = $accountService;
    }

    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $userId = Auth::id();
        if ($userId === null) {
            abort(401, 'Unauthenticated');
        }
        $accounts = $this->accountService->getAccountsForUser((string) $userId);
        return AccountResource::collection($accounts);
    }

    public function store(StoreAccountRequest $request): AccountResource
    {
        $account = $this->accountService->createAccount($request->validated());
        return new AccountResource($account);
    }

    public function show(AccountModel $account): AccountResource
    {
        $this->authorize('view', $account);
        return new AccountResource($account);
    }

    public function update(UpdateAccountRequest $request, AccountModel $account): \Illuminate\Http\JsonResponse
    {
        $success = $this->accountService->updateAccount($account->id, $request->validated());
        return new \Illuminate\Http\JsonResponse(['success' => $success]);
    }

    public function destroy(AccountModel $account): \Illuminate\Http\Response
    {
        $this->authorize('delete', $account);
        $this->accountService->deleteAccount($account->id);
        return new \Illuminate\Http\Response('', 204);
    }
}
