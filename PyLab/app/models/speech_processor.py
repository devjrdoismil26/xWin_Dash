"""
🎤 SPEECH PROCESSOR - Whisper para Business Intelligence

Capacidades:
- Transcrição de áudio em múltiplos idiomas
- Análise de sentimento de fala
- Extração de insights de reuniões
- Análise de chamadas de vendas
- Processamento de feedback por voz
- Detecção de emoções na fala
- Resumo automático de conversas
"""

import whisper
import torch
import librosa
import numpy as np
import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from enum import Enum
import json
import base64
import io
import tempfile
import os
from datetime import datetime, timedelta
import wave
import webrtcvad
from pydub import AudioSegment
from pydub.silence import split_on_silence
import openai

# Configure logging
logger = logging.getLogger(__name__)

class SpeechAnalysisType(Enum):
    TRANSCRIPTION = "transcription"
    MEETING_ANALYSIS = "meeting_analysis"
    SALES_CALL_ANALYSIS = "sales_call_analysis"
    CUSTOMER_FEEDBACK = "customer_feedback"
    SENTIMENT_ANALYSIS = "sentiment_analysis"
    EMOTION_DETECTION = "emotion_detection"
    SPEAKER_IDENTIFICATION = "speaker_identification"
    CONVERSATION_SUMMARY = "conversation_summary"

class AudioFormat(Enum):
    WAV = "wav"
    MP3 = "mp3"
    M4A = "m4a"
    FLAC = "flac"
    OGG = "ogg"

@dataclass
class SpeechAnalysisRequest:
    audio_data: str  # Base64 encoded audio
    analysis_type: SpeechAnalysisType
    language: Optional[str] = None  # Auto-detect se None
    context: Optional[Dict[str, Any]] = None
    business_domain: Optional[str] = None
    speaker_names: Optional[List[str]] = None

@dataclass
class TranscriptionSegment:
    start_time: float
    end_time: float
    text: str
    confidence: float
    speaker: Optional[str] = None
    language: Optional[str] = None

@dataclass
class SpeechAnalysisResult:
    analysis_type: SpeechAnalysisType
    transcription: List[TranscriptionSegment]
    insights: Dict[str, Any]
    summary: str
    confidence_score: float
    recommendations: List[str]
    metadata: Dict[str, Any]
    processing_time: float

class SpeechProcessor:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Inicializando SpeechProcessor no device: {self.device}")
        
        # Carregar modelos
        self._load_models()
        
        # Configurar VAD (Voice Activity Detection)
        self.vad = webrtcvad.Vad(2)  # Agressividade média
        
        # Cliente OpenAI para análises avançadas
        self.openai_client = openai.AsyncOpenAI()

    def _load_models(self):
        """Carrega os modelos necessários"""
        try:
            # Whisper para transcrição
            self.whisper_model = whisper.load_model("large-v3", device=self.device)
            logger.info("✅ Whisper large-v3 carregado")
            
            # Modelo menor para análises rápidas
            self.whisper_base = whisper.load_model("base", device=self.device)
            logger.info("✅ Whisper base carregado")
            
        except Exception as e:
            logger.error(f"Erro ao carregar modelos: {e}")
            raise

    async def analyze(self, request: SpeechAnalysisRequest) -> SpeechAnalysisResult:
        """Analisa áudio usando Whisper e outros modelos"""
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Carregar e preprocessar áudio
            audio_path = await self._load_audio(request.audio_data)
            
            # Transcrição base
            transcription = await self._transcribe_audio(
                audio_path, 
                request.language,
                request.analysis_type
            )
            
            # Análises específicas
            insights = await self._perform_specialized_analysis(
                transcription, 
                request.analysis_type,
                request.context,
                request.business_domain
            )
            
            # Gerar recomendações
            recommendations = await self._generate_recommendations(
                insights, 
                request.analysis_type,
                request.business_domain
            )
            
            # Limpeza
            os.unlink(audio_path)
            
            processing_time = asyncio.get_event_loop().time() - start_time
            
            return SpeechAnalysisResult(
                analysis_type=request.analysis_type,
                transcription=transcription,
                insights=insights,
                summary=await self._generate_summary(insights, request.analysis_type),
                confidence_score=np.mean([seg.confidence for seg in transcription]),
                recommendations=recommendations,
                metadata={
                    "models_used": ["Whisper", "GPT-4"],
                    "device": self.device,
                    "language_detected": transcription[0].language if transcription else None,
                    "duration": insights.get("audio_duration", 0)
                },
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Erro na análise de áudio: {e}")
            raise

    async def _load_audio(self, audio_data: str) -> str:
        """Carrega áudio de base64 e salva temporariamente"""
        try:
            # Decodificar base64
            audio_bytes = base64.b64decode(audio_data)
            
            # Criar arquivo temporário
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
                tmp_file.write(audio_bytes)
                return tmp_file.name
                
        except Exception as e:
            logger.error(f"Erro ao carregar áudio: {e}")
            raise

    async def _transcribe_audio(
        self, 
        audio_path: str, 
        language: Optional[str] = None,
        analysis_type: SpeechAnalysisType = SpeechAnalysisType.TRANSCRIPTION
    ) -> List[TranscriptionSegment]:
        """Transcreve áudio usando Whisper"""
        try:
            # Escolher modelo baseado no tipo de análise
            model = self.whisper_model if analysis_type in [
                SpeechAnalysisType.MEETING_ANALYSIS,
                SpeechAnalysisType.SALES_CALL_ANALYSIS,
                SpeechAnalysisType.CONVERSATION_SUMMARY
            ] else self.whisper_base
            
            # Transcrever com timestamps
            result = model.transcribe(
                audio_path,
                language=language,
                task="transcribe",
                word_timestamps=True,
                condition_on_previous_text=False
            )
            
            # Converter para segmentos
            segments = []
            for segment in result["segments"]:
                segments.append(TranscriptionSegment(
                    start_time=segment["start"],
                    end_time=segment["end"],
                    text=segment["text"].strip(),
                    confidence=segment.get("avg_logprob", 0.0),
                    language=result.get("language")
                ))
            
            return segments
            
        except Exception as e:
            logger.error(f"Erro na transcrição: {e}")
            return []

    async def _perform_specialized_analysis(
        self,
        transcription: List[TranscriptionSegment],
        analysis_type: SpeechAnalysisType,
        context: Optional[Dict[str, Any]],
        business_domain: Optional[str]
    ) -> Dict[str, Any]:
        """Realiza análise especializada baseada no tipo"""
        
        # Texto completo da transcrição
        full_text = " ".join([seg.text for seg in transcription])
        
        # Duração total
        total_duration = transcription[-1].end_time if transcription else 0
        
        base_insights = {
            "audio_duration": total_duration,
            "word_count": len(full_text.split()),
            "speaking_rate": len(full_text.split()) / (total_duration / 60) if total_duration > 0 else 0,
            "segment_count": len(transcription)
        }
        
        if analysis_type == SpeechAnalysisType.MEETING_ANALYSIS:
            specialized = await self._analyze_meeting(full_text, transcription, context)
        elif analysis_type == SpeechAnalysisType.SALES_CALL_ANALYSIS:
            specialized = await self._analyze_sales_call(full_text, transcription, context)
        elif analysis_type == SpeechAnalysisType.CUSTOMER_FEEDBACK:
            specialized = await self._analyze_customer_feedback(full_text, context)
        elif analysis_type == SpeechAnalysisType.SENTIMENT_ANALYSIS:
            specialized = await self._analyze_sentiment(full_text)
        elif analysis_type == SpeechAnalysisType.EMOTION_DETECTION:
            specialized = await self._detect_emotions(full_text, transcription)
        elif analysis_type == SpeechAnalysisType.CONVERSATION_SUMMARY:
            specialized = await self._summarize_conversation(full_text, context)
        else:
            specialized = {}
        
        return {**base_insights, **specialized}

    async def _analyze_meeting(
        self, 
        full_text: str, 
        transcription: List[TranscriptionSegment],
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Análise específica de reuniões"""
        try:
            prompt = f"""
            Analise esta transcrição de reunião e extraia insights de Business Intelligence:

            Transcrição: {full_text}

            Retorne um JSON com:
            {{
                "meeting_type": "brainstorm|status|decisão|planejamento|outro",
                "key_decisions": ["decisão1", "decisão2"],
                "action_items": [
                    {{"task": "tarefa", "assignee": "responsável", "deadline": "prazo"}}
                ],
                "main_topics": ["tópico1", "tópico2"],
                "participants_engagement": "alta|média|baixa",
                "meeting_effectiveness": "alta|média|baixa",
                "next_steps": ["próximo passo 1", "próximo passo 2"],
                "risks_identified": ["risco1", "risco2"],
                "opportunities": ["oportunidade1", "oportunidade2"],
                "sentiment_overall": "positivo|neutro|negativo"
            }}
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Erro na análise de reunião: {e}")
            return {"error": str(e)}

    async def _analyze_sales_call(
        self, 
        full_text: str, 
        transcription: List[TranscriptionSegment],
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Análise específica de chamadas de vendas"""
        try:
            prompt = f"""
            Analise esta transcrição de chamada de vendas:

            Transcrição: {full_text}

            Retorne um JSON com:
            {{
                "call_stage": "prospecção|apresentação|objeção|fechamento|follow_up",
                "customer_interest_level": "alto|médio|baixo",
                "objections_raised": ["objeção1", "objeção2"],
                "pain_points_identified": ["dor1", "dor2"],
                "buying_signals": ["sinal1", "sinal2"],
                "next_action_recommended": "string",
                "deal_probability": 0-100,
                "key_quotes": ["frase importante 1", "frase importante 2"],
                "competitor_mentions": ["concorrente1", "concorrente2"],
                "budget_discussed": true/false,
                "decision_maker_present": true/false,
                "timeline_mentioned": "string ou null"
            }}
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Erro na análise de vendas: {e}")
            return {"error": str(e)}

    async def _analyze_customer_feedback(
        self, 
        full_text: str,
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Análise de feedback de clientes"""
        try:
            prompt = f"""
            Analise este feedback de cliente:

            Feedback: {full_text}

            Retorne um JSON com:
            {{
                "satisfaction_score": 1-10,
                "sentiment": "muito_positivo|positivo|neutro|negativo|muito_negativo",
                "main_issues": ["issue1", "issue2"],
                "praised_aspects": ["aspecto1", "aspecto2"],
                "improvement_suggestions": ["sugestão1", "sugestão2"],
                "urgency_level": "alta|média|baixa",
                "category": "produto|serviço|suporte|preço|entrega|outro",
                "actionable_insights": ["insight1", "insight2"],
                "churn_risk": "alto|médio|baixo",
                "upsell_opportunity": true/false
            }}
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Erro na análise de feedback: {e}")
            return {"error": str(e)}

    async def _analyze_sentiment(self, full_text: str) -> Dict[str, Any]:
        """Análise de sentimento detalhada"""
        try:
            prompt = f"""
            Faça uma análise detalhada de sentimento:

            Texto: {full_text}

            Retorne um JSON com:
            {{
                "overall_sentiment": "muito_positivo|positivo|neutro|negativo|muito_negativo",
                "sentiment_score": -1.0 to 1.0,
                "emotions_detected": ["alegria", "raiva", "medo", "tristeza", "surpresa"],
                "emotion_intensities": {{"alegria": 0.0-1.0, "raiva": 0.0-1.0}},
                "key_phrases": ["frase positiva", "frase negativa"],
                "sentiment_progression": ["início", "meio", "fim"],
                "confidence": 0.0-1.0
            }}
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.2
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Erro na análise de sentimento: {e}")
            return {"error": str(e)}

    async def _detect_emotions(
        self, 
        full_text: str, 
        transcription: List[TranscriptionSegment]
    ) -> Dict[str, Any]:
        """Detecção de emoções na fala"""
        try:
            # Análise por segmentos temporais
            emotion_timeline = []
            
            for segment in transcription[:10]:  # Primeiros 10 segmentos
                prompt = f"""
                Analise as emoções neste trecho de fala:
                
                Texto: "{segment.text}"
                Tempo: {segment.start_time:.1f}s - {segment.end_time:.1f}s
                
                Retorne JSON:
                {{
                    "primary_emotion": "alegria|raiva|medo|tristeza|surpresa|neutro",
                    "intensity": 0.0-1.0,
                    "secondary_emotions": ["emoção1", "emoção2"]
                }}
                """
                
                response = await self.openai_client.chat.completions.create(
                    model="gpt-4-turbo-preview",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                    temperature=0.2
                )
                
                emotion_data = json.loads(response.choices[0].message.content)
                emotion_timeline.append({
                    "start_time": segment.start_time,
                    "end_time": segment.end_time,
                    **emotion_data
                })
            
            return {
                "emotion_timeline": emotion_timeline,
                "dominant_emotion": max(emotion_timeline, key=lambda x: x["intensity"])["primary_emotion"] if emotion_timeline else "neutro"
            }
            
        except Exception as e:
            logger.error(f"Erro na detecção de emoções: {e}")
            return {"error": str(e)}

    async def _summarize_conversation(
        self, 
        full_text: str,
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Resumo inteligente de conversas"""
        try:
            prompt = f"""
            Crie um resumo executivo desta conversa:

            Conversa: {full_text}

            Retorne um JSON com:
            {{
                "executive_summary": "Resumo de 2-3 frases",
                "key_points": ["ponto1", "ponto2", "ponto3"],
                "decisions_made": ["decisão1", "decisão2"],
                "follow_up_actions": ["ação1", "ação2"],
                "participants_mentioned": ["pessoa1", "pessoa2"],
                "topics_covered": ["tópico1", "tópico2"],
                "conversation_outcome": "bem-sucedida|inconclusiva|conflituosa",
                "next_meeting_needed": true/false,
                "priority_level": "alta|média|baixa"
            }}
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Erro no resumo de conversa: {e}")
            return {"error": str(e)}

    async def _generate_recommendations(
        self,
        insights: Dict[str, Any],
        analysis_type: SpeechAnalysisType,
        business_domain: Optional[str]
    ) -> List[str]:
        """Gera recomendações baseadas nos insights"""
        recommendations = []
        
        # Recomendações baseadas na taxa de fala
        speaking_rate = insights.get("speaking_rate", 0)
        if speaking_rate > 180:
            recommendations.append("Reduzir velocidade de fala para melhor compreensão")
        elif speaking_rate < 120:
            recommendations.append("Aumentar dinamismo na apresentação")
        
        # Recomendações específicas por tipo
        if analysis_type == SpeechAnalysisType.SALES_CALL_ANALYSIS:
            deal_prob = insights.get("deal_probability", 0)
            if deal_prob < 30:
                recommendations.append("Focar em identificar e resolver objeções")
            elif deal_prob > 70:
                recommendations.append("Acelerar processo de fechamento")
        
        elif analysis_type == SpeechAnalysisType.MEETING_ANALYSIS:
            effectiveness = insights.get("meeting_effectiveness", "média")
            if effectiveness == "baixa":
                recommendations.append("Melhorar estrutura e agenda das reuniões")
        
        return recommendations

    async def _generate_summary(
        self,
        insights: Dict[str, Any],
        analysis_type: SpeechAnalysisType
    ) -> str:
        """Gera resumo da análise"""
        duration = insights.get("audio_duration", 0)
        word_count = insights.get("word_count", 0)
        
        return f"Análise {analysis_type.value}: {duration:.1f}s de áudio, {word_count} palavras processadas."

    async def batch_transcribe(self, audio_files: List[str]) -> List[SpeechAnalysisResult]:
        """Transcrição em lote"""
        tasks = []
        for audio_data in audio_files:
            request = SpeechAnalysisRequest(
                audio_data=audio_data,
                analysis_type=SpeechAnalysisType.TRANSCRIPTION
            )
            tasks.append(self.analyze(request))
        
        return await asyncio.gather(*tasks)

    def extract_audio_features(self, audio_path: str) -> Dict[str, Any]:
        """Extrai características técnicas do áudio"""
        try:
            # Carregar áudio
            y, sr = librosa.load(audio_path)
            
            # Extrair features
            features = {
                "duration": float(librosa.get_duration(y=y, sr=sr)),
                "sample_rate": int(sr),
                "tempo": float(librosa.beat.tempo(y=y, sr=sr)[0]),
                "spectral_centroid": float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))),
                "spectral_rolloff": float(np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr))),
                "zero_crossing_rate": float(np.mean(librosa.feature.zero_crossing_rate(y))),
                "rms_energy": float(np.mean(librosa.feature.rms(y=y)))
            }
            
            # MFCC features
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            features["mfcc_mean"] = mfcc.mean(axis=1).tolist()
            features["mfcc_std"] = mfcc.std(axis=1).tolist()
            
            return features
            
        except Exception as e:
            logger.error(f"Erro na extração de features: {e}")
            return {}

# Instância global
speech_processor = SpeechProcessor()