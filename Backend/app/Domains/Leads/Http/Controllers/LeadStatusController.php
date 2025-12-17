<?php

namespace App\Domains\Leads\Http\Controllers;

use App\Domains\Leads\Contracts\LeadServiceInterface;
use App\Domains\Leads\Http\Requests\UpdateLeadStatusRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * 📊 Lead Status Controller
 *
 * Controller especializado para operações de status de leads
 * Responsável por gerenciar transições de status
 */
class LeadStatusController extends Controller
{
    protected LeadServiceInterface $leadService;

    public function __construct(LeadServiceInterface $leadService)
    {
        $this->leadService = $leadService;
    }

    /**
     * Atualizar status do lead
     */
    public function updateStatus(UpdateLeadStatusRequest $request, int $leadId): JsonResponse
    {
        try {
            $lead = $this->leadService->updateLeadStatus(
                $leadId,
                $request->validated()['status'],
                auth()->id()
            );

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead status updated successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update lead status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Qualificar lead
     */
    public function qualify(Request $request, int $leadId): JsonResponse
    {
        try {
            $lead = $this->leadService->qualifyLead($leadId, auth()->id());

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead qualified successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to qualify lead',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Desqualificar lead
     */
    public function disqualify(Request $request, int $leadId): JsonResponse
    {
        try {
            $reason = $request->get('reason', '');
            $lead = $this->leadService->disqualifyLead($leadId, $reason, auth()->id());

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead disqualified successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to disqualify lead',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Converter lead
     */
    public function convert(Request $request, int $leadId): JsonResponse
    {
        try {
            $conversionData = $request->only(['converted_to', 'conversion_value', 'conversion_date']);
            $lead = $this->leadService->convertLead($leadId, $conversionData, auth()->id());

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead converted successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to convert lead',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marcar lead como perdido
     */
    public function lose(Request $request, int $leadId): JsonResponse
    {
        try {
            $reason = $request->get('reason', '');
            $lead = $this->leadService->loseLead($leadId, $reason, auth()->id());

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead marked as lost successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to mark lead as lost',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marcar lead como contatado
     */
    public function contact(Request $request, int $leadId): JsonResponse
    {
        try {
            $contactData = $request->only(['contact_method', 'contact_notes', 'next_follow_up']);
            $lead = $this->leadService->contactLead($leadId, $contactData, auth()->id());

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead marked as contacted successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to mark lead as contacted',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marcar lead para negociação
     */
    public function negotiate(Request $request, int $leadId): JsonResponse
    {
        try {
            $negotiationData = $request->only(['negotiation_stage', 'negotiation_notes', 'expected_close_date']);
            $lead = $this->leadService->negotiateLead($leadId, $negotiationData, auth()->id());

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead marked for negotiation successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to mark lead for negotiation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marcar lead para follow-up
     */
    public function followUp(Request $request, int $leadId): JsonResponse
    {
        try {
            $followUpData = $request->only(['follow_up_date', 'follow_up_notes', 'follow_up_type']);
            $lead = $this->leadService->followUpLead($leadId, $followUpData, auth()->id());

            if (!$lead) {
                return response()->json([
                    'success' => false,
                    'error' => 'Lead not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead marked for follow-up successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to mark lead for follow-up',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter histórico de status
     */
    public function getStatusHistory(Request $request, int $leadId): JsonResponse
    {
        try {
            $history = $this->leadService->getLeadStatusHistory($leadId, auth()->id());

            return response()->json([
                'success' => true,
                'data' => $history
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch status history',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter estatísticas de status
     */
    public function getStatusStats(Request $request): JsonResponse
    {
        try {
            $stats = $this->leadService->getLeadStatusStats(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch status stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter taxa de conversão
     */
    public function getConversionRate(Request $request): JsonResponse
    {
        try {
            $rate = $this->leadService->getLeadConversionRate(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $rate
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch conversion rate',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads por status
     */
    public function getLeadsByStatus(Request $request, string $status): JsonResponse
    {
        try {
            $leads = $this->leadService->getLeadsByStatus($status, auth()->id());

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch leads by status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads que precisam de follow-up
     */
    public function getLeadsNeedingFollowUp(Request $request): JsonResponse
    {
        try {
            $leads = $this->leadService->getLeadsNeedingFollowUp(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch leads needing follow-up',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads em negociação
     */
    public function getLeadsInNegotiation(Request $request): JsonResponse
    {
        try {
            $leads = $this->leadService->getLeadsInNegotiation(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch leads in negotiation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads qualificados
     */
    public function getQualifiedLeads(Request $request): JsonResponse
    {
        try {
            $leads = $this->leadService->getQualifiedLeads(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch qualified leads',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter leads convertidos
     */
    public function getConvertedLeads(Request $request): JsonResponse
    {
        try {
            $leads = $this->leadService->getConvertedLeads(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $leads
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch converted leads',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
