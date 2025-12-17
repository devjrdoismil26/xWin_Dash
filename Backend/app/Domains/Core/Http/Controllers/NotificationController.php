<?php

namespace App\Domains\Core\Http\Controllers;

use App\Domains\Core\Application\Actions\SendNotificationAction;
use App\Domains\Core\Application\DTOs\NotificationDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private SendNotificationAction $sendAction
    ) {}

    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    public function send(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|string',
        ]);

        $dto = new NotificationDTO(
            title: $request->title,
            message: $request->message,
            type: $request->type,
            data: $request->data ?? [],
            channels: $request->channels ?? ['database']
        );

        $this->sendAction->execute($request->user(), $dto);

        return response()->json([
            'success' => true,
            'message' => 'Notification sent',
        ]);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found',
            ], 404);
        }

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $count = $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => "Marked {$count} notifications as read",
            'count' => $count
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found',
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted',
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        $total = $user->notifications()->count();
        $unread = $user->unreadNotifications()->count();
        $read = $total - $unread;

        $byType = $user->notifications()
            ->selectRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.type')) as type, COUNT(*) as count")
            ->groupBy('type')
            ->get();

        $recent = $user->notifications()
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'unread' => $unread,
                'read' => $read,
                'by_type' => $byType,
                'recent' => $recent
            ]
        ]);
    }
}
