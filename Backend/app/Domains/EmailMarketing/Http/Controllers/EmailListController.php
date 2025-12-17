<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Http\Requests\StoreEmailListRequest;
use App\Domains\EmailMarketing\Http\Requests\UpdateEmailListRequest; // Supondo que este serviço exista
use App\Domains\EmailMarketing\Services\EmailListService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailListController extends Controller
{
    protected EmailListService $emailListService;

    public function __construct(EmailListService $emailListService)
    {
        $this->emailListService = $emailListService;
    }

    /**
     * Display a listing of the email lists.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $lists = $this->emailListService->getAllEmailLists(auth()->id(), $request->get('per_page', 15));
        return response()->json($lists);
    }

    /**
     * Store a newly created email list in storage.
     *
     * @param StoreEmailListRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreEmailListRequest $request): JsonResponse
    {
        $list = $this->emailListService->createEmailList(auth()->id(), $request->validated());
        return response()->json($list, 201);
    }

    /**
     * Display the specified email list.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $list = $this->emailListService->getEmailListById($id);
        if (!$list) {
            return response()->json(['message' => 'Email list not found.'], 404);
        }
        return response()->json($list);
    }

    /**
     * Update the specified email list in storage.
     *
     * @param UpdateEmailListRequest $request
     * @param int                    $id
     *
     * @return JsonResponse
     */
    public function update(UpdateEmailListRequest $request, int $id): JsonResponse
    {
        $list = $this->emailListService->updateEmailList($id, $request->validated());
        if (!$list) {
            return response()->json(['message' => 'Email list not found.'], 404);
        }
        return response()->json($list);
    }

    /**
     * Remove the specified email list from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->emailListService->deleteEmailList($id);
        if (!$success) {
            return response()->json(['message' => 'Email list not found.'], 404);
        }
        return response()->json(['message' => 'Email list deleted successfully.']);
    }
}
