<?php

namespace App\Domains\Core\Services;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Envia notificação para um usuário específico.
     *
     * @param User $user
     * @param Notification $notification
     * @return bool
     */
    public function notifyUser(User $user, Notification $notification): bool
    {
        try {
            $user->notify($notification);
            Log::info("Notification sent to user {$user->id}: " . get_class($notification));
            return true;
        } catch (\Exception $e) {
            Log::error("Failed to send notification to user {$user->id}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Envia notificação para múltiplos usuários.
     *
     * @param iterable $users
     * @param Notification $notification
     * @return array Statistics about sent notifications
     */
    public function notifyUsers(iterable $users, Notification $notification): array
    {
        $sent = 0;
        $failed = 0;

        foreach ($users as $user) {
            if ($this->notifyUser($user, $notification)) {
                $sent++;
            } else {
                $failed++;
            }
        }

        Log::info("Bulk notification sent. Success: {$sent}, Failed: {$failed}");

        return [
            'sent' => $sent,
            'failed' => $failed,
            'total' => $sent + $failed,
        ];
    }

    /**
     * Envia notificação para todos os administradores.
     *
     * @param Notification $notification
     * @return array
     */
    public function notifyAdmins(Notification $notification): array
    {
        $admins = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'super-admin']);
        })->get();

        return $this->notifyUsers($admins, $notification);
    }

    /**
     * Envia notificação para todos os managers.
     *
     * @param Notification $notification
     * @return array
     */
    public function notifyManagers(Notification $notification): array
    {
        $managers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['manager', 'admin', 'super-admin']);
        })->get();

        return $this->notifyUsers($managers, $notification);
    }

    /**
     * Cria notificação simples no banco de dados.
     *
     * @param User $user
     * @param string $title
     * @param string $message
     * @param string $type
     * @param array $data
     * @return bool
     */
    public function createDatabaseNotification(
        User $user,
        string $title,
        string $message,
        string $type = 'info',
        array $data = []
    ): bool {
        try {
            $user->notifications()->create([
                'id' => \Illuminate\Support\Str::uuid(),
                'type' => 'App\Notifications\DatabaseNotification',
                'data' => array_merge([
                    'title' => $title,
                    'message' => $message,
                    'type' => $type,
                ], $data),
                'read_at' => null,
            ]);

            Log::info("Database notification created for user {$user->id}: {$title}");
            return true;
        } catch (\Exception $e) {
            Log::error("Failed to create database notification for user {$user->id}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Marca todas as notificações de um usuário como lidas.
     *
     * @param User $user
     * @return int Number of notifications marked as read
     */
    public function markAllAsRead(User $user): int
    {
        try {
            $count = $user->unreadNotifications()->update(['read_at' => now()]);
            Log::info("Marked {$count} notifications as read for user {$user->id}");
            return $count;
        } catch (\Exception $e) {
            Log::error("Failed to mark notifications as read for user {$user->id}: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Obtém estatísticas de notificações de um usuário.
     *
     * @param User $user
     * @return array
     */
    public function getUserNotificationStats(User $user): array
    {
        try {
            return [
                'total' => $user->notifications()->count(),
                'unread' => $user->unreadNotifications()->count(),
                'read' => $user->readNotifications()->count(),
            ];
        } catch (\Exception $e) {
            Log::error("Failed to get notification stats for user {$user->id}: " . $e->getMessage());
            return [
                'total' => 0,
                'unread' => 0,
                'read' => 0,
            ];
        }
    }
}
