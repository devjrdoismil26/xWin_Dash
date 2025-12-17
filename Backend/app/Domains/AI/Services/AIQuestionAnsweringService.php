<?php

namespace App\Domains\AI\Services;

class AIQuestionAnsweringService
{
    /**
     * @param string $question
     * @param string|null $context
     * @param int|null $userId
     * @return string
     */
    public function answer(string $question, ?string $context = null, ?int $userId = null): string
    {
        // Simple stubbed implementation
        $baseAnswer = 'This is a stubbed answer for: ' . $question;

        if ($context) {
            $baseAnswer .= ' (considering context: ' . substr($context, 0, 50) . '...)';
        }

        return $baseAnswer;
    }

    /**
     * @param string $question
     * @param string|null $context
     * @param int|null $userId
     * @return array<string, mixed>
     */
    public function answerWithMetadata(string $question, ?string $context = null, ?int $userId = null): array
    {
        return [
            'answer' => $this->answer($question, $context, $userId),
            'context_used' => $context,
            'user_id' => $userId,
            'confidence' => 0.85,
        ];
    }
}
