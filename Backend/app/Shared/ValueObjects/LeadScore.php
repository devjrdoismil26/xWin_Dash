<?php

namespace App\Shared\ValueObjects;

use InvalidArgumentException;

class LeadScore
{
    private int $score;

    public function __construct(int $score = 0)
    {
        if ($score < 0) {
            throw new InvalidArgumentException('A pontuação do lead não pode ser negativa.');
        }
        $this->score = $score;
    }

    public function getValue(): int
    {
        return $this->score;
    }

    public function increment(int $amount = 1): self
    {
        return new self($this->score + $amount);
    }

    public function decrement(int $amount = 1): self
    {
        $newScore = $this->score - $amount;

        return new self(max(0, $newScore)); // Garante que a pontuação não seja negativa
    }

    public function equals(LeadScore $other): bool
    {
        return $this->score === $other->score;
    }

    public function __toString(): string
    {
        return (string) $this->score;
    }
}
