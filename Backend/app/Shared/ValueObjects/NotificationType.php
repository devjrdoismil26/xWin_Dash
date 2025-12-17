<?php

namespace App\Shared\ValueObjects;

enum NotificationType: string
{
    case INFO = 'info';
    case SUCCESS = 'success';
    case WARNING = 'warning';
    case ERROR = 'error';
    case SYSTEM = 'system';
    case WORKFLOW = 'workflow';
    case CAMPAIGN = 'campaign';
    case LEAD = 'lead';
    case PROJECT = 'project';
    case AI_GENERATION = 'ai_generation';

    public function getLabel(): string
    {
        return match ($this) {
            self::INFO => 'Informação',
            self::SUCCESS => 'Sucesso',
            self::WARNING => 'Aviso',
            self::ERROR => 'Erro',
            self::SYSTEM => 'Sistema',
            self::WORKFLOW => 'Workflow',
            self::CAMPAIGN => 'Campanha',
            self::LEAD => 'Lead',
            self::PROJECT => 'Projeto',
            self::AI_GENERATION => 'Geração IA',
        };
    }

    public function getIcon(): string
    {
        return match ($this) {
            self::INFO => 'info-circle',
            self::SUCCESS => 'check-circle',
            self::WARNING => 'exclamation-triangle',
            self::ERROR => 'times-circle',
            self::SYSTEM => 'cog',
            self::WORKFLOW => 'sitemap',
            self::CAMPAIGN => 'bullhorn',
            self::LEAD => 'user',
            self::PROJECT => 'folder',
            self::AI_GENERATION => 'robot',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::INFO => 'blue',
            self::SUCCESS => 'green',
            self::WARNING => 'yellow',
            self::ERROR => 'red',
            self::SYSTEM => 'gray',
            self::WORKFLOW => 'purple',
            self::CAMPAIGN => 'orange',
            self::LEAD => 'indigo',
            self::PROJECT => 'teal',
            self::AI_GENERATION => 'pink',
        };
    }
}
