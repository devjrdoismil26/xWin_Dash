"""
🧠 TEXT ANALYZER - GPT-4 para Business Intelligence

Capacidades:
- Análise de sentimento avançada
- Extração de insights de negócios
- Resumo inteligente de documentos
- Análise de concorrentes
- Geração de relatórios executivos
"""

import openai
import asyncio
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import json
import re
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

class AnalysisType(Enum):
    SENTIMENT = "sentiment"
    BUSINESS_INSIGHTS = "business_insights"
    DOCUMENT_SUMMARY = "document_summary"
    COMPETITOR_ANALYSIS = "competitor_analysis"
    EXECUTIVE_REPORT = "executive_report"
    MARKET_RESEARCH = "market_research"
    CUSTOMER_FEEDBACK = "customer_feedback"
    FINANCIAL_ANALYSIS = "financial_analysis"

@dataclass
class TextAnalysisRequest:
    text: str
    analysis_type: AnalysisType
    context: Optional[Dict[str, Any]] = None
    language: str = "pt-BR"
    business_domain: Optional[str] = None

@dataclass
class TextAnalysisResult:
    analysis_type: AnalysisType
    insights: Dict[str, Any]
    summary: str
    confidence_score: float
    recommendations: List[str]
    metadata: Dict[str, Any]
    processing_time: float

class TextAnalyzer:
    def __init__(self):
        self.client = openai.AsyncOpenAI()
        self.model = "gpt-4-turbo-preview"
        
        # Prompts especializados para cada tipo de análise
        self.prompts = {
            AnalysisType.SENTIMENT: self._get_sentiment_prompt(),
            AnalysisType.BUSINESS_INSIGHTS: self._get_business_insights_prompt(),
            AnalysisType.DOCUMENT_SUMMARY: self._get_document_summary_prompt(),
            AnalysisType.COMPETITOR_ANALYSIS: self._get_competitor_analysis_prompt(),
            AnalysisType.EXECUTIVE_REPORT: self._get_executive_report_prompt(),
            AnalysisType.MARKET_RESEARCH: self._get_market_research_prompt(),
            AnalysisType.CUSTOMER_FEEDBACK: self._get_customer_feedback_prompt(),
            AnalysisType.FINANCIAL_ANALYSIS: self._get_financial_analysis_prompt(),
        }

    async def analyze(self, request: TextAnalysisRequest) -> TextAnalysisResult:
        """Analisa texto usando GPT-4 especializado"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Preparar prompt especializado
            system_prompt = self.prompts[request.analysis_type]
            user_prompt = self._prepare_user_prompt(request)
            
            # Chamar GPT-4
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,  # Mais determinístico para análises
                max_tokens=2000,
                response_format={"type": "json_object"}
            )
            
            # Processar resposta
            result_data = json.loads(response.choices[0].message.content)
            processing_time = asyncio.get_event_loop().time() - start_time
            
            return TextAnalysisResult(
                analysis_type=request.analysis_type,
                insights=result_data.get("insights", {}),
                summary=result_data.get("summary", ""),
                confidence_score=result_data.get("confidence_score", 0.0),
                recommendations=result_data.get("recommendations", []),
                metadata={
                    "model_used": self.model,
                    "language": request.language,
                    "business_domain": request.business_domain,
                    "tokens_used": response.usage.total_tokens if response.usage else 0
                },
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Erro na análise de texto: {e}")
            raise

    def _prepare_user_prompt(self, request: TextAnalysisRequest) -> str:
        """Prepara prompt do usuário com contexto"""
        prompt = f"""
        Texto para análise:
        {request.text}
        
        Contexto adicional:
        - Idioma: {request.language}
        - Domínio de negócio: {request.business_domain or 'Geral'}
        """
        
        if request.context:
            prompt += f"\n- Contexto específico: {json.dumps(request.context, indent=2)}"
            
        return prompt

    def _get_sentiment_prompt(self) -> str:
        return """
        Você é um especialista em análise de sentimento para Business Intelligence.
        
        Analise o texto fornecido e retorne um JSON com:
        {
            "insights": {
                "sentiment_overall": "positivo|neutro|negativo",
                "sentiment_score": 0.0-1.0,
                "emotions_detected": ["alegria", "frustração", etc],
                "key_themes": ["tema1", "tema2"],
                "urgency_level": "baixa|média|alta"
            },
            "summary": "Resumo da análise de sentimento",
            "confidence_score": 0.0-1.0,
            "recommendations": ["ação1", "ação2"]
        }
        
        Foque em insights acionáveis para negócios.
        """

    def _get_business_insights_prompt(self) -> str:
        return """
        Você é um consultor de Business Intelligence especializado em extrair insights estratégicos.
        
        Analise o texto e identifique:
        {
            "insights": {
                "opportunities": ["oportunidade1", "oportunidade2"],
                "threats": ["ameaça1", "ameaça2"],
                "market_trends": ["tendência1", "tendência2"],
                "competitive_advantages": ["vantagem1", "vantagem2"],
                "pain_points": ["dor1", "dor2"],
                "success_factors": ["fator1", "fator2"]
            },
            "summary": "Resumo executivo dos insights",
            "confidence_score": 0.0-1.0,
            "recommendations": ["recomendação estratégica 1", "recomendação 2"]
        }
        
        Seja específico e acionável.
        """

    def _get_document_summary_prompt(self) -> str:
        return """
        Você é um especialista em síntese de documentos para executivos.
        
        Crie um resumo estruturado:
        {
            "insights": {
                "main_topics": ["tópico1", "tópico2"],
                "key_decisions": ["decisão1", "decisão2"],
                "action_items": ["ação1", "ação2"],
                "stakeholders": ["pessoa1", "pessoa2"],
                "deadlines": ["prazo1", "prazo2"],
                "budget_impact": "alto|médio|baixo|nenhum"
            },
            "summary": "Resumo executivo do documento",
            "confidence_score": 0.0-1.0,
            "recommendations": ["próximos passos"]
        }
        
        Foque no que é mais importante para tomada de decisão.
        """

    def _get_competitor_analysis_prompt(self) -> str:
        return """
        Você é um analista de inteligência competitiva.
        
        Analise informações sobre concorrentes:
        {
            "insights": {
                "competitive_strengths": ["força1", "força2"],
                "competitive_weaknesses": ["fraqueza1", "fraqueza2"],
                "market_positioning": "líder|desafiador|seguidor|nicho",
                "pricing_strategy": "premium|competitivo|baixo_custo",
                "innovation_level": "alto|médio|baixo",
                "customer_satisfaction": "alta|média|baixa",
                "market_share_trend": "crescendo|estável|declinando"
            },
            "summary": "Análise competitiva resumida",
            "confidence_score": 0.0-1.0,
            "recommendations": ["estratégias para competir"]
        }
        """

    def _get_executive_report_prompt(self) -> str:
        return """
        Você é um consultor executivo criando relatórios para C-level.
        
        Estruture um relatório executivo:
        {
            "insights": {
                "executive_summary": "Resumo para CEO/CTO",
                "key_metrics": {"métrica1": "valor1", "métrica2": "valor2"},
                "critical_issues": ["issue1", "issue2"],
                "strategic_priorities": ["prioridade1", "prioridade2"],
                "resource_requirements": ["recurso1", "recurso2"],
                "risk_assessment": "alto|médio|baixo",
                "timeline": "urgente|curto_prazo|longo_prazo"
            },
            "summary": "Mensagem principal para executivos",
            "confidence_score": 0.0-1.0,
            "recommendations": ["decisões executivas necessárias"]
        }
        """

    def _get_market_research_prompt(self) -> str:
        return """
        Você é um analista de pesquisa de mercado.
        
        Analise dados de mercado:
        {
            "insights": {
                "market_size": "grande|médio|pequeno|emergente",
                "growth_rate": "alto|médio|baixo|negativo",
                "customer_segments": ["segmento1", "segmento2"],
                "buying_behavior": ["comportamento1", "comportamento2"],
                "market_barriers": ["barreira1", "barreira2"],
                "opportunities": ["oportunidade1", "oportunidade2"],
                "seasonal_trends": ["tendência1", "tendência2"]
            },
            "summary": "Visão geral do mercado",
            "confidence_score": 0.0-1.0,
            "recommendations": ["estratégias de entrada/expansão"]
        }
        """

    def _get_customer_feedback_prompt(self) -> str:
        return """
        Você é um especialista em análise de feedback de clientes.
        
        Analise feedback dos clientes:
        {
            "insights": {
                "satisfaction_level": "muito_alta|alta|média|baixa|muito_baixa",
                "common_complaints": ["reclamação1", "reclamação2"],
                "praised_features": ["feature1", "feature2"],
                "improvement_requests": ["melhoria1", "melhoria2"],
                "churn_risk": "alto|médio|baixo",
                "loyalty_indicators": ["indicador1", "indicador2"],
                "nps_sentiment": "promotor|neutro|detrator"
            },
            "summary": "Resumo do feedback dos clientes",
            "confidence_score": 0.0-1.0,
            "recommendations": ["ações para melhorar satisfação"]
        }
        """

    def _get_financial_analysis_prompt(self) -> str:
        return """
        Você é um analista financeiro especializado.
        
        Analise dados financeiros:
        {
            "insights": {
                "revenue_trend": "crescendo|estável|declinando",
                "profitability": "alta|média|baixa|negativa",
                "cost_structure": ["custo_principal1", "custo_principal2"],
                "cash_flow": "positivo|neutro|negativo",
                "investment_needs": ["investimento1", "investimento2"],
                "financial_risks": ["risco1", "risco2"],
                "growth_potential": "alto|médio|baixo"
            },
            "summary": "Análise financeira resumida",
            "confidence_score": 0.0-1.0,
            "recommendations": ["decisões financeiras recomendadas"]
        }
        """

    async def batch_analyze(self, requests: List[TextAnalysisRequest]) -> List[TextAnalysisResult]:
        """Análise em lote para maior eficiência"""
        tasks = [self.analyze(request) for request in requests]
        return await asyncio.gather(*tasks)

    async def analyze_conversation(self, messages: List[Dict[str, str]]) -> TextAnalysisResult:
        """Analisa uma conversa completa"""
        conversation_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
        
        request = TextAnalysisRequest(
            text=conversation_text,
            analysis_type=AnalysisType.BUSINESS_INSIGHTS,
            context={"type": "conversation", "message_count": len(messages)}
        )
        
        return await self.analyze(request)

# Instância global
text_analyzer = TextAnalyzer()