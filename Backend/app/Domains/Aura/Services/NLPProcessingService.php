<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\ValueObjects\IntentRecognition;
use App\Domains\Aura\ValueObjects\SentimentAnalysis;

class NLPProcessingService
{
    public function detectIntent(string $message): IntentRecognition
    {
        $message = strtolower(trim($message));
        
        // Intents simples baseados em keywords
        $intents = [
            'greeting' => ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'hey'],
            'farewell' => ['tchau', 'até logo', 'até mais', 'adeus', 'bye'],
            'help' => ['ajuda', 'help', 'socorro', 'não entendi', 'como funciona'],
            'purchase' => ['comprar', 'quero', 'preço', 'quanto custa', 'valor'],
            'complaint' => ['reclamar', 'problema', 'não funciona', 'ruim', 'péssimo'],
            'thanks' => ['obrigado', 'obrigada', 'valeu', 'thanks', 'agradeço'],
        ];

        foreach ($intents as $intent => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($message, $keyword)) {
                    return new IntentRecognition($intent, 0.85, ['keyword' => $keyword]);
                }
            }
        }

        return new IntentRecognition('unknown', 0.3, []);
    }

    public function analyzeSentiment(string $message): SentimentAnalysis
    {
        $message = strtolower($message);
        
        $positiveWords = ['bom', 'ótimo', 'excelente', 'maravilhoso', 'perfeito', 'adorei', 'amei'];
        $negativeWords = ['ruim', 'péssimo', 'horrível', 'terrível', 'odeio', 'problema'];
        
        $positiveCount = 0;
        $negativeCount = 0;

        foreach ($positiveWords as $word) {
            if (str_contains($message, $word)) $positiveCount++;
        }

        foreach ($negativeWords as $word) {
            if (str_contains($message, $word)) $negativeCount++;
        }

        if ($positiveCount > $negativeCount) {
            return new SentimentAnalysis('positive', 0.7 + ($positiveCount * 0.1));
        } elseif ($negativeCount > $positiveCount) {
            return new SentimentAnalysis('negative', 0.7 + ($negativeCount * 0.1));
        }

        return new SentimentAnalysis('neutral', 0.5);
    }

    public function extractEntities(string $message): array
    {
        $entities = [];

        // Email
        if (preg_match('/[\w\.-]+@[\w\.-]+\.\w+/', $message, $matches)) {
            $entities[] = ['type' => 'email', 'value' => $matches[0]];
        }

        // Phone
        if (preg_match('/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/', $message, $matches)) {
            $entities[] = ['type' => 'phone', 'value' => $matches[0]];
        }

        // CPF
        if (preg_match('/\d{3}\.\d{3}\.\d{3}-\d{2}/', $message, $matches)) {
            $entities[] = ['type' => 'cpf', 'value' => $matches[0]];
        }

        return $entities;
    }
}
