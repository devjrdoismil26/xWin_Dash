<?php

namespace App\Domains\EmailMarketing\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * 📊 Email List Metrics Value Object
 *
 * Value Object para métricas de lista de email
 * Encapsula cálculos e validações de métricas
 */
class EmailListMetrics
{
    private int $subscriberCount;
    private int $activeSubscriberCount;
    private int $unsubscribedCount;
    private int $bouncedCount;
    private float $averageOpenRate;
    private float $averageClickRate;
    private float $averageUnsubscribeRate;
    private float $averageBounceRate;
    private int $totalEmailsSent;
    private int $totalEmailsOpened;
    private int $totalEmailsClicked;
    private ?string $lastActivityAt;

    public function __construct(
        int $subscriberCount = 0,
        int $activeSubscriberCount = 0,
        int $unsubscribedCount = 0,
        int $bouncedCount = 0,
        float $averageOpenRate = 0.0,
        float $averageClickRate = 0.0,
        float $averageUnsubscribeRate = 0.0,
        float $averageBounceRate = 0.0,
        int $totalEmailsSent = 0,
        int $totalEmailsOpened = 0,
        int $totalEmailsClicked = 0,
        ?string $lastActivityAt = null
    ) {
        $this->validateMetrics($subscriberCount, $activeSubscriberCount, $unsubscribedCount, $bouncedCount);

        $this->subscriberCount = $subscriberCount;
        $this->activeSubscriberCount = $activeSubscriberCount;
        $this->unsubscribedCount = $unsubscribedCount;
        $this->bouncedCount = $bouncedCount;
        $this->averageOpenRate = $averageOpenRate;
        $this->averageClickRate = $averageClickRate;
        $this->averageUnsubscribeRate = $averageUnsubscribeRate;
        $this->averageBounceRate = $averageBounceRate;
        $this->totalEmailsSent = $totalEmailsSent;
        $this->totalEmailsOpened = $totalEmailsOpened;
        $this->totalEmailsClicked = $totalEmailsClicked;
        $this->lastActivityAt = $lastActivityAt;
    }

    /**
     * Validar métricas
     */
    private function validateMetrics(int $subscriberCount, int $activeSubscriberCount, int $unsubscribedCount, int $bouncedCount): void
    {
        if ($subscriberCount < 0) {
            throw new InvalidArgumentException('Subscriber count não pode ser negativo');
        }

        if ($activeSubscriberCount < 0) {
            throw new InvalidArgumentException('Active subscriber count não pode ser negativo');
        }

        if ($unsubscribedCount < 0) {
            throw new InvalidArgumentException('Unsubscribed count não pode ser negativo');
        }

        if ($bouncedCount < 0) {
            throw new InvalidArgumentException('Bounced count não pode ser negativo');
        }

        if ($activeSubscriberCount + $unsubscribedCount + $bouncedCount > $subscriberCount) {
            throw new InvalidArgumentException('Soma dos counts não pode ser maior que subscriber count');
        }
    }

    /**
     * Adicionar subscriber
     */
    public function addSubscriber(): self
    {
        return new self(
            $this->subscriberCount + 1,
            $this->activeSubscriberCount + 1,
            $this->unsubscribedCount,
            $this->bouncedCount,
            $this->averageOpenRate,
            $this->averageClickRate,
            $this->averageUnsubscribeRate,
            $this->averageBounceRate,
            $this->totalEmailsSent,
            $this->totalEmailsOpened,
            $this->totalEmailsClicked,
            now()->toISOString()
        );
    }

    /**
     * Remover subscriber
     */
    public function removeSubscriber(): self
    {
        $newSubscriberCount = max(0, $this->subscriberCount - 1);
        $newActiveCount = max(0, $this->activeSubscriberCount - 1);

        return new self(
            $newSubscriberCount,
            $newActiveCount,
            $this->unsubscribedCount,
            $this->bouncedCount,
            $this->averageOpenRate,
            $this->averageClickRate,
            $this->averageUnsubscribeRate,
            $this->averageBounceRate,
            $this->totalEmailsSent,
            $this->totalEmailsOpened,
            $this->totalEmailsClicked,
            now()->toISOString()
        );
    }

    /**
     * Unsubscribe subscriber
     */
    public function unsubscribeSubscriber(): self
    {
        $newActiveCount = max(0, $this->activeSubscriberCount - 1);
        $newUnsubscribedCount = $this->unsubscribedCount + 1;

        return new self(
            $this->subscriberCount,
            $newActiveCount,
            $newUnsubscribedCount,
            $this->bouncedCount,
            $this->averageOpenRate,
            $this->averageClickRate,
            $this->averageUnsubscribeRate,
            $this->averageBounceRate,
            $this->totalEmailsSent,
            $this->totalEmailsOpened,
            $this->totalEmailsClicked,
            now()->toISOString()
        );
    }

    /**
     * Bounce subscriber
     */
    public function bounceSubscriber(): self
    {
        $newActiveCount = max(0, $this->activeSubscriberCount - 1);
        $newBouncedCount = $this->bouncedCount + 1;

        return new self(
            $this->subscriberCount,
            $newActiveCount,
            $this->unsubscribedCount,
            $newBouncedCount,
            $this->averageOpenRate,
            $this->averageClickRate,
            $this->averageUnsubscribeRate,
            $this->averageBounceRate,
            $this->totalEmailsSent,
            $this->totalEmailsOpened,
            $this->totalEmailsClicked,
            now()->toISOString()
        );
    }

    /**
     * Registrar envio de email
     */
    public function recordEmailSent(int $count = 1): self
    {
        return new self(
            $this->subscriberCount,
            $this->activeSubscriberCount,
            $this->unsubscribedCount,
            $this->bouncedCount,
            $this->averageOpenRate,
            $this->averageClickRate,
            $this->averageUnsubscribeRate,
            $this->averageBounceRate,
            $this->totalEmailsSent + $count,
            $this->totalEmailsOpened,
            $this->totalEmailsClicked,
            now()->toISOString()
        );
    }

    /**
     * Registrar abertura de email
     */
    public function recordEmailOpened(int $count = 1): self
    {
        $newOpened = $this->totalEmailsOpened + $count;
        $newOpenRate = $this->totalEmailsSent > 0 ? ($newOpened / $this->totalEmailsSent) * 100 : 0;

        return new self(
            $this->subscriberCount,
            $this->activeSubscriberCount,
            $this->unsubscribedCount,
            $this->bouncedCount,
            $newOpenRate,
            $this->averageClickRate,
            $this->averageUnsubscribeRate,
            $this->averageBounceRate,
            $this->totalEmailsSent,
            $newOpened,
            $this->totalEmailsClicked,
            now()->toISOString()
        );
    }

    /**
     * Registrar clique em email
     */
    public function recordEmailClicked(int $count = 1): self
    {
        $newClicked = $this->totalEmailsClicked + $count;
        $newClickRate = $this->totalEmailsSent > 0 ? ($newClicked / $this->totalEmailsSent) * 100 : 0;

        return new self(
            $this->subscriberCount,
            $this->activeSubscriberCount,
            $this->unsubscribedCount,
            $this->bouncedCount,
            $this->averageOpenRate,
            $newClickRate,
            $this->averageUnsubscribeRate,
            $this->averageBounceRate,
            $this->totalEmailsSent,
            $this->totalEmailsOpened,
            $newClicked,
            now()->toISOString()
        );
    }

    /**
     * Obter contador de subscribers
     */
    public function getSubscriberCount(): int
    {
        return $this->subscriberCount;
    }

    /**
     * Obter contador de subscribers ativos
     */
    public function getActiveSubscriberCount(): int
    {
        return $this->activeSubscriberCount;
    }

    /**
     * Obter contador de unsubscribed
     */
    public function getUnsubscribedCount(): int
    {
        return $this->unsubscribedCount;
    }

    /**
     * Obter contador de bounced
     */
    public function getBouncedCount(): int
    {
        return $this->bouncedCount;
    }

    /**
     * Obter taxa média de abertura
     */
    public function getAverageOpenRate(): float
    {
        return $this->averageOpenRate;
    }

    /**
     * Obter taxa média de clique
     */
    public function getAverageClickRate(): float
    {
        return $this->averageClickRate;
    }

    /**
     * Obter taxa média de unsubscribe
     */
    public function getAverageUnsubscribeRate(): float
    {
        return $this->averageUnsubscribeRate;
    }

    /**
     * Obter taxa média de bounce
     */
    public function getAverageBounceRate(): float
    {
        return $this->averageBounceRate;
    }

    /**
     * Obter total de emails enviados
     */
    public function getTotalEmailsSent(): int
    {
        return $this->totalEmailsSent;
    }

    /**
     * Obter total de emails abertos
     */
    public function getTotalEmailsOpened(): int
    {
        return $this->totalEmailsOpened;
    }

    /**
     * Obter total de emails clicados
     */
    public function getTotalEmailsClicked(): int
    {
        return $this->totalEmailsClicked;
    }

    /**
     * Obter data da última atividade
     */
    public function getLastActivityAt(): ?string
    {
        return $this->lastActivityAt;
    }

    /**
     * Verificar se tem subscribers
     */
    public function hasSubscribers(): bool
    {
        return $this->subscriberCount > 0;
    }

    /**
     * Verificar se tem subscribers ativos
     */
    public function hasActiveSubscribers(): bool
    {
        return $this->activeSubscriberCount > 0;
    }

    /**
     * Verificar se tem unsubscribed
     */
    public function hasUnsubscribed(): bool
    {
        return $this->unsubscribedCount > 0;
    }

    /**
     * Verificar se tem bounced
     */
    public function hasBounced(): bool
    {
        return $this->bouncedCount > 0;
    }

    /**
     * Obter status das métricas
     */
    public function getStatus(): string
    {
        if ($this->subscriberCount === 0) {
            return 'empty';
        }

        if ($this->averageOpenRate >= 25 && $this->averageClickRate >= 3) {
            return 'excellent';
        } elseif ($this->averageOpenRate >= 20 && $this->averageClickRate >= 2) {
            return 'good';
        } elseif ($this->averageOpenRate >= 15 && $this->averageClickRate >= 1) {
            return 'fair';
        } else {
            return 'poor';
        }
    }

    /**
     * Obter cor do status
     */
    public function getStatusColor(): string
    {
        $colors = [
            'empty' => 'gray',
            'excellent' => 'green',
            'good' => 'blue',
            'fair' => 'yellow',
            'poor' => 'red'
        ];

        return $colors[$this->getStatus()] ?? 'gray';
    }

    /**
     * Obter resumo das métricas
     */
    public function getSummary(): array
    {
        return [
            'subscriber_count' => $this->subscriberCount,
            'active_subscriber_count' => $this->activeSubscriberCount,
            'unsubscribed_count' => $this->unsubscribedCount,
            'bounced_count' => $this->bouncedCount,
            'average_open_rate' => round($this->averageOpenRate, 2),
            'average_click_rate' => round($this->averageClickRate, 2),
            'average_unsubscribe_rate' => round($this->averageUnsubscribeRate, 2),
            'average_bounce_rate' => round($this->averageBounceRate, 2),
            'status' => $this->getStatus(),
            'status_color' => $this->getStatusColor(),
            'last_activity_at' => $this->lastActivityAt
        ];
    }

    /**
     * Criar métricas vazias
     */
    public static function empty(): self
    {
        return new self();
    }

    /**
     * Criar métricas com valores iniciais
     */
    public static function withValues(
        int $subscriberCount = 0,
        int $activeSubscriberCount = 0,
        int $unsubscribedCount = 0,
        int $bouncedCount = 0
    ): self {
        return new self($subscriberCount, $activeSubscriberCount, $unsubscribedCount, $bouncedCount);
    }

    /**
     * Serializar para array
     */
    public function toArray(): array
    {
        return [
            'subscriber_count' => $this->subscriberCount,
            'active_subscriber_count' => $this->activeSubscriberCount,
            'unsubscribed_count' => $this->unsubscribedCount,
            'bounced_count' => $this->bouncedCount,
            'average_open_rate' => $this->averageOpenRate,
            'average_click_rate' => $this->averageClickRate,
            'average_unsubscribe_rate' => $this->averageUnsubscribeRate,
            'average_bounce_rate' => $this->averageBounceRate,
            'total_emails_sent' => $this->totalEmailsSent,
            'total_emails_opened' => $this->totalEmailsOpened,
            'total_emails_clicked' => $this->totalEmailsClicked,
            'last_activity_at' => $this->lastActivityAt,
            'status' => $this->getStatus(),
            'status_color' => $this->getStatusColor()
        ];
    }
}
