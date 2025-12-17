<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Http\Requests\StoreEmailSubscriberRequest;
use App\Domains\EmailMarketing\Http\Requests\UpdateEmailSubscriberRequest; // Supondo que este serviço exista
use App\Domains\EmailMarketing\Services\EmailSubscriberService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailSubscriberController extends Controller
{
    protected EmailSubscriberService $emailSubscriberService;

    public function __construct(EmailSubscriberService $emailSubscriberService)
    {
        $this->emailSubscriberService = $emailSubscriberService;
    }

    /**
     * Display a listing of the email subscribers.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $subscribers = $this->emailSubscriberService->getAllSubscribers($request->get('per_page', 15));
        return response()->json($subscribers);
    }

    /**
     * Store a newly created email subscriber in storage.
     *
     * @param StoreEmailSubscriberRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreEmailSubscriberRequest $request): JsonResponse
    {
        $subscriber = $this->emailSubscriberService->createSubscriber($request->validated());
        return response()->json($subscriber, 201);
    }

    /**
     * Display the specified email subscriber.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $subscriber = $this->emailSubscriberService->getSubscriberById($id);
        if (!$subscriber) {
            return response()->json(['message' => 'Email subscriber not found.'], 404);
        }
        return response()->json($subscriber);
    }

    /**
     * Update the specified email subscriber in storage.
     *
     * @param UpdateEmailSubscriberRequest $request
     * @param int                          $id
     *
     * @return JsonResponse
     */
    public function update(UpdateEmailSubscriberRequest $request, int $id): JsonResponse
    {
        $subscriber = $this->emailSubscriberService->updateSubscriber($id, $request->validated());
        if (!$subscriber) {
            return response()->json(['message' => 'Email subscriber not found.'], 404);
        }
        return response()->json($subscriber);
    }

    /**
     * Remove the specified email subscriber from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->emailSubscriberService->deleteSubscriber($id);
        if (!$success) {
            return response()->json(['message' => 'Email subscriber not found.'], 404);
        }
        return response()->json(['message' => 'Email subscriber deleted successfully.']);
    }
}
