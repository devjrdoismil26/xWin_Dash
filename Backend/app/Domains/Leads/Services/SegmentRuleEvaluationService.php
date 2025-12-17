<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Segment;
use App\Domains\Leads\Domain\Lead;
use Illuminate\Support\Facades\Log;

class SegmentRuleEvaluationService
{
    protected LeadRepositoryInterface $leadRepository;

    public function __construct(LeadRepositoryInterface $leadRepository)
    {
        $this->leadRepository = $leadRepository;
    }

    /**
     * Avalia as regras de um segmento e retorna os leads correspondentes.
     *
     * @param Segment $segment
     * @return array<Lead>
     */
    public function evaluateSegmentRules(Segment $segment): array
    {
        try {
            Log::info("Avaliando regras para o segmento: {$segment->name}", ['segment_id' => $segment->id]);
            $matchingLeads = [];

            // Obter todos os leads (cuidado com grandes volumes)
            $allLeads = $this->leadRepository->getAllPaginated(9999)->items();

            foreach ($allLeads as $lead) {
                if ($this->leadMatchesSegmentRules($lead, $segment)) {
                    $matchingLeads[] = $lead;
                }
            }

            Log::info("Segmento avaliado", [
                'segment_id' => $segment->id,
                'total_leads' => count($allLeads),
                'matching_leads' => count($matchingLeads)
            ]);

            return $matchingLeads;
        } catch (\Exception $e) {
            Log::error("Erro ao avaliar regras do segmento", [
                'segment_id' => $segment->id,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Verifica se um lead corresponde às regras de um segmento.
     *
     * @param Lead $lead
     * @param Segment $segment
     * @return bool
     */
    public function leadMatchesSegmentRules(Lead $lead, Segment $segment): bool
    {
        try {
            foreach ($segment->rules as $rule) {
                if (!$this->evaluateRule($lead, $rule)) {
                    return false;
                }
            }
            return true;
        } catch (\Exception $e) {
            Log::error("Erro ao verificar correspondência do lead com segmento", [
                'lead_id' => $lead->id,
                'segment_id' => $segment->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Avalia uma única regra de segmento.
     *
     * @param Lead $lead
     * @param array $rule
     * @return bool
     */
    protected function evaluateRule(Lead $lead, array $rule): bool
    {
        try {
            $fieldValue = $lead->{$rule['field']} ?? null;
            $operator = $rule['operator'];
            $ruleValue = $rule['value'];

            return $this->evaluateRuleValue($fieldValue, $operator, $ruleValue);
        } catch (\Exception $e) {
            Log::error("Erro ao avaliar regra", [
                'lead_id' => $lead->id,
                'rule' => $rule,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Avalia uma regra com base no valor do campo, operador e valor da regra.
     *
     * @param mixed $fieldValue
     * @param string $operator
     * @param mixed $ruleValue
     * @return bool
     */
    protected function evaluateRuleValue($fieldValue, string $operator, $ruleValue): bool
    {
        switch ($operator) {
            case '=':
                return $fieldValue == $ruleValue;
            case '!=':
                return $fieldValue != $ruleValue;
            case '>':
                return $fieldValue > $ruleValue;
            case '>=':
                return $fieldValue >= $ruleValue;
            case '<':
                return $fieldValue < $ruleValue;
            case '<=':
                return $fieldValue <= $ruleValue;
            case 'contains':
                return is_string($fieldValue) && str_contains($fieldValue, $ruleValue);
            case 'not_contains':
                return is_string($fieldValue) && !str_contains($fieldValue, $ruleValue);
            case 'starts_with':
                return is_string($fieldValue) && str_starts_with($fieldValue, $ruleValue);
            case 'ends_with':
                return is_string($fieldValue) && str_ends_with($fieldValue, $ruleValue);
            case 'in':
                return is_array($ruleValue) && in_array($fieldValue, $ruleValue);
            case 'not_in':
                return is_array($ruleValue) && !in_array($fieldValue, $ruleValue);
            case 'is_null':
                return is_null($fieldValue);
            case 'is_not_null':
                return !is_null($fieldValue);
            case 'is_empty':
                return empty($fieldValue);
            case 'is_not_empty':
                return !empty($fieldValue);
            case 'regex':
                return is_string($fieldValue) && preg_match($ruleValue, $fieldValue);
            case 'date_equals':
                return $this->compareDates($fieldValue, $ruleValue, '=');
            case 'date_after':
                return $this->compareDates($fieldValue, $ruleValue, '>');
            case 'date_before':
                return $this->compareDates($fieldValue, $ruleValue, '<');
            case 'date_between':
                return $this->compareDateRange($fieldValue, $ruleValue);
            default:
                Log::warning("Operador de regra não reconhecido", ['operator' => $operator]);
                return false;
        }
    }

    /**
     * Compara datas.
     *
     * @param mixed $fieldValue
     * @param mixed $ruleValue
     * @param string $operator
     * @return bool
     */
    protected function compareDates($fieldValue, $ruleValue, string $operator): bool
    {
        try {
            $fieldDate = is_string($fieldValue) ? \DateTime::createFromFormat('Y-m-d H:i:s', $fieldValue) : $fieldValue;
            $ruleDate = is_string($ruleValue) ? \DateTime::createFromFormat('Y-m-d H:i:s', $ruleValue) : $ruleValue;

            if (!$fieldDate || !$ruleDate) {
                return false;
            }

            switch ($operator) {
                case '=':
                    return $fieldDate->format('Y-m-d') === $ruleDate->format('Y-m-d');
                case '>':
                    return $fieldDate > $ruleDate;
                case '<':
                    return $fieldDate < $ruleDate;
                default:
                    return false;
            }
        } catch (\Exception $e) {
            Log::error("Erro ao comparar datas", [
                'field_value' => $fieldValue,
                'rule_value' => $ruleValue,
                'operator' => $operator,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Compara se uma data está entre um intervalo.
     *
     * @param mixed $fieldValue
     * @param array $ruleValue
     * @return bool
     */
    protected function compareDateRange($fieldValue, array $ruleValue): bool
    {
        try {
            if (!isset($ruleValue['start']) || !isset($ruleValue['end'])) {
                return false;
            }

            $fieldDate = is_string($fieldValue) ? \DateTime::createFromFormat('Y-m-d H:i:s', $fieldValue) : $fieldValue;
            $startDate = is_string($ruleValue['start']) ? \DateTime::createFromFormat('Y-m-d H:i:s', $ruleValue['start']) : $ruleValue['start'];
            $endDate = is_string($ruleValue['end']) ? \DateTime::createFromFormat('Y-m-d H:i:s', $ruleValue['end']) : $ruleValue['end'];

            if (!$fieldDate || !$startDate || !$endDate) {
                return false;
            }

            return $fieldDate >= $startDate && $fieldDate <= $endDate;
        } catch (\Exception $e) {
            Log::error("Erro ao comparar intervalo de datas", [
                'field_value' => $fieldValue,
                'rule_value' => $ruleValue,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Obtém leads que correspondem a múltiplos segmentos.
     *
     * @param array $segments
     * @return array<Lead>
     */
    public function getLeadsMatchingMultipleSegments(array $segments): array
    {
        try {
            $matchingLeads = [];
            $allLeads = $this->leadRepository->getAllPaginated(9999)->items();

            foreach ($allLeads as $lead) {
                $matchesCount = 0;
                foreach ($segments as $segment) {
                    if ($this->leadMatchesSegmentRules($lead, $segment)) {
                        $matchesCount++;
                    }
                }
                if ($matchesCount > 0) {
                    $matchingLeads[] = [
                        'lead' => $lead,
                        'matching_segments_count' => $matchesCount
                    ];
                }
            }

            return $matchingLeads;
        } catch (\Exception $e) {
            Log::error("Erro ao obter leads de múltiplos segmentos", [
                'segments_count' => count($segments),
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }
}
