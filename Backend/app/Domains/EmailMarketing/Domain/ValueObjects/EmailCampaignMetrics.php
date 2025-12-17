<?php

namespace App\Domains\EmailMarketing\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object para métricas de campanha de email
 */
class EmailCampaignMetrics
{
    private int $totalRecipients;
    private int $sentCount;
    private int $deliveredCount;
    private int $openedCount;
    private int $clickedCount;
    private int $unsubscribedCount;
    private int $bouncedCount;

    public function __construct(
        int $totalRecipients = 0,
        int $sentCount = 0,
        int $deliveredCount = 0,
        int $openedCount = 0,
        int $clickedCount = 0,
        int $unsubscribedCount = 0,
        int $bouncedCount = 0
    ) {
        $this->validateMetrics($totalRecipients, $sentCount, $deliveredCount, $openedCount, $clickedCount, $unsubscribedCount, $bouncedCount);

        $this->totalRecipients = $totalRecipients;
        $this->sentCount = $sentCount;
        $this->deliveredCount = $deliveredCount;
        $this->openedCount = $openedCount;
        $this->clickedCount = $clickedCount;
        $this->unsubscribedCount = $unsubscribedCount;
        $this->bouncedCount = $bouncedCount;
    }

    public function getTotalRecipients(): int
    {
        return $this->totalRecipients;
    }

    public function getSentCount(): int
    {
        return $this->sentCount;
    }

    public function getDeliveredCount(): int
    {
        return $this->deliveredCount;
    }

    public function getOpenedCount(): int
    {
        return $this->openedCount;
    }

    public function getClickedCount(): int
    {
        return $this->clickedCount;
    }

    public function getUnsubscribedCount(): int
    {
        return $this->unsubscribedCount;
    }

    public function getBouncedCount(): int
    {
        return $this->bouncedCount;
    }

    public function getOpenRate(): float
    {
        return $this->sentCount > 0 ? ($this->openedCount / $this->sentCount) * 100 : 0;
    }

    public function getClickRate(): float
    {
        return $this->sentCount > 0 ? ($this->clickedCount / $this->sentCount) * 100 : 0;
    }

    public function getBounceRate(): float
    {
        return $this->sentCount > 0 ? ($this->bouncedCount / $this->sentCount) * 100 : 0;
    }

    public function getUnsubscribeRate(): float
    {
        return $this->sentCount > 0 ? ($this->unsubscribedCount / $this->sentCount) * 100 : 0;
    }

    public function getDeliveryRate(): float
    {
        return $this->sentCount > 0 ? ($this->deliveredCount / $this->sentCount) * 100 : 0;
    }

    public function getClickToOpenRate(): float
    {
        return $this->openedCount > 0 ? ($this->clickedCount / $this->openedCount) * 100 : 0;
    }

    public function incrementSent(int $count = 1): self
    {
        return new self(
            $this->totalRecipients,
            $this->sentCount + $count,
            $this->deliveredCount,
            $this->openedCount,
            $this->clickedCount,
            $this->unsubscribedCount,
            $this->bouncedCount
        );
    }

    public function incrementDelivered(int $count = 1): self
    {
        return new self(
            $this->totalRecipients,
            $this->sentCount,
            $this->deliveredCount + $count,
            $this->openedCount,
            $this->clickedCount,
            $this->unsubscribedCount,
            $this->bouncedCount
        );
    }

    public function incrementOpened(int $count = 1): self
    {
        return new self(
            $this->totalRecipients,
            $this->sentCount,
            $this->deliveredCount,
            $this->openedCount + $count,
            $this->clickedCount,
            $this->unsubscribedCount,
            $this->bouncedCount
        );
    }

    public function incrementClicked(int $count = 1): self
    {
        return new self(
            $this->totalRecipients,
            $this->sentCount,
            $this->deliveredCount,
            $this->openedCount,
            $this->clickedCount + $count,
            $this->unsubscribedCount,
            $this->bouncedCount
        );
    }

    public function incrementUnsubscribed(int $count = 1): self
    {
        return new self(
            $this->totalRecipients,
            $this->sentCount,
            $this->deliveredCount,
            $this->openedCount,
            $this->clickedCount,
            $this->unsubscribedCount + $count,
            $this->bouncedCount
        );
    }

    public function incrementBounced(int $count = 1): self
    {
        return new self(
            $this->totalRecipients,
            $this->sentCount,
            $this->deliveredCount,
            $this->openedCount,
            $this->clickedCount,
            $this->unsubscribedCount,
            $this->bouncedCount + $count
        );
    }

    public function setTotalRecipients(int $totalRecipients): self
    {
        return new self(
            $totalRecipients,
            $this->sentCount,
            $this->deliveredCount,
            $this->openedCount,
            $this->clickedCount,
            $this->unsubscribedCount,
            $this->bouncedCount
        );
    }

    public function toArray(): array
    {
        return [
            'total_recipients' => $this->totalRecipients,
            'sent_count' => $this->sentCount,
            'delivered_count' => $this->deliveredCount,
            'opened_count' => $this->openedCount,
            'clicked_count' => $this->clickedCount,
            'unsubscribed_count' => $this->unsubscribedCount,
            'bounced_count' => $this->bouncedCount,
            'open_rate' => $this->getOpenRate(),
            'click_rate' => $this->getClickRate(),
            'bounce_rate' => $this->getBounceRate(),
            'unsubscribe_rate' => $this->getUnsubscribeRate(),
            'delivery_rate' => $this->getDeliveryRate(),
            'click_to_open_rate' => $this->getClickToOpenRate(),
        ];
    }

    public function equals(EmailCampaignMetrics $other): bool
    {
        return $this->totalRecipients === $other->getTotalRecipients() &&
               $this->sentCount === $other->getSentCount() &&
               $this->deliveredCount === $other->getDeliveredCount() &&
               $this->openedCount === $other->getOpenedCount() &&
               $this->clickedCount === $other->getClickedCount() &&
               $this->unsubscribedCount === $other->getUnsubscribedCount() &&
               $this->bouncedCount === $other->getBouncedCount();
    }

    private function validateMetrics(
        int $totalRecipients,
        int $sentCount,
        int $deliveredCount,
        int $openedCount,
        int $clickedCount,
        int $unsubscribedCount,
        int $bouncedCount
    ): void {
        if ($totalRecipients < 0) {
            throw new InvalidArgumentException('Total recipients cannot be negative');
        }

        if ($sentCount < 0) {
            throw new InvalidArgumentException('Sent count cannot be negative');
        }

        if ($deliveredCount < 0) {
            throw new InvalidArgumentException('Delivered count cannot be negative');
        }

        if ($openedCount < 0) {
            throw new InvalidArgumentException('Opened count cannot be negative');
        }

        if ($clickedCount < 0) {
            throw new InvalidArgumentException('Clicked count cannot be negative');
        }

        if ($unsubscribedCount < 0) {
            throw new InvalidArgumentException('Unsubscribed count cannot be negative');
        }

        if ($bouncedCount < 0) {
            throw new InvalidArgumentException('Bounced count cannot be negative');
        }

        if ($sentCount > $totalRecipients) {
            throw new InvalidArgumentException('Sent count cannot exceed total recipients');
        }

        if ($deliveredCount > $sentCount) {
            throw new InvalidArgumentException('Delivered count cannot exceed sent count');
        }

        if ($openedCount > $deliveredCount) {
            throw new InvalidArgumentException('Opened count cannot exceed delivered count');
        }

        if ($clickedCount > $openedCount) {
            throw new InvalidArgumentException('Clicked count cannot exceed opened count');
        }
    }

    public static function empty(): self
    {
        return new self();
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['total_recipients'] ?? 0,
            $data['sent_count'] ?? 0,
            $data['delivered_count'] ?? 0,
            $data['opened_count'] ?? 0,
            $data['clicked_count'] ?? 0,
            $data['unsubscribed_count'] ?? 0,
            $data['bounced_count'] ?? 0
        );
    }
}
