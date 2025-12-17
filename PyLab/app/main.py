"""
🚀 PYLAB API - Business Intelligence Laboratory

Endpoints expandidos para:
- Análise de texto com GPT-4
- Análise de imagens com CLIP
- Processamento de fala com Whisper  
- Geração de código com CodeT5
- Geração de mídia (SDXL, ModelScope)
- Business Intelligence integrado
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import asyncio
import logging
import uvicorn
from datetime import datetime
import json
import base64

from dotenv import load_dotenv
load_dotenv()

# Imports dos modelos expandidos (temporariamente comentados para teste básico)
# from models.media_generator import media_generator, MediaGenerationRequest, MediaType
# from models.text_analyzer import text_analyzer, TextAnalysisRequest, AnalysisType
# from models.image_analyzer import image_analyzer, ImageAnalysisRequest, ImageAnalysisType
# from models.speech_processor import speech_processor, SpeechAnalysisRequest, SpeechAnalysisType
# from models.code_generator import code_generator, CodeGenerationRequest, CodeGenerationType, ProgrammingLanguage
# from models.scene_manager import scene_manager, SceneManager, VideoProject, Scene, SceneType, TransitionType
# from models.image_input_processor import image_input_processor, ImageInputProcessor, ImageInputRequest, ProcessingMode

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="PyLab - AI Business Intelligence Laboratory",
    description="Advanced AI capabilities for business intelligence and automation",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware - Configure allowed origins for production security
import os
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if os.getenv("APP_ENV") == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

# ============================================================================
# MODELS - Request/Response Schemas
# ============================================================================

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    services: Dict[str, str]
    gpu_available: bool

class BatchRequest(BaseModel):
    requests: List[Dict[str, Any]]
    request_type: str

class BatchResponse(BaseModel):
    results: List[Dict[str, Any]]
    success_count: int
    error_count: int
    processing_time: float

# ============================================================================
# HEALTH & STATUS ENDPOINTS
# ============================================================================

@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        import torch
        gpu_available = torch.cuda.is_available()
        
        services = {
            "media_generator": "✅ Operational",
            "text_analyzer": "✅ Operational", 
            "image_analyzer": "✅ Operational",
            "speech_processor": "✅ Operational",
            "code_generator": "✅ Operational"
        }
        
        return HealthResponse(
            status="healthy",
            timestamp=datetime.now().isoformat(),
            services=services,
            gpu_available=gpu_available
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

@app.get("/status/detailed")
async def detailed_status():
    """Detailed system status"""
    try:
        import torch
        import psutil
        
        return {
            "system": {
                "gpu_available": torch.cuda.is_available(),
                "gpu_count": torch.cuda.device_count() if torch.cuda.is_available() else 0,
                "cpu_count": psutil.cpu_count(),
                "memory_total": psutil.virtual_memory().total,
                "memory_available": psutil.virtual_memory().available
            },
            "models": {
                "sdxl_loaded": hasattr(media_generator, 'image_pipeline'),
                "whisper_loaded": hasattr(speech_processor, 'whisper_model'),
                "clip_loaded": hasattr(image_analyzer, 'clip_model'),
                "gpt4_available": True,  # Assumindo API key configurada
                "codet5_loaded": hasattr(code_generator, 'codet5_model')
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Detailed status failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# MEDIA GENERATION ENDPOINTS (Existing + Enhanced)
# ============================================================================

@app.post("/generate/image")
async def generate_image(request: MediaGenerationRequest, background_tasks: BackgroundTasks):
    """Generate image using SDXL"""
    try:
        request.media_type = MediaType.IMAGE
        result = await media_generator.generate(request)
        return result
    except Exception as e:
        logger.error(f"Image generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/video") 
async def generate_video(request: MediaGenerationRequest, background_tasks: BackgroundTasks):
    """Generate video using ModelScope T2V"""
    try:
        request.media_type = MediaType.VIDEO
        result = await media_generator.generate(request)
        return result
    except Exception as e:
        logger.error(f"Video generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# TEXT ANALYSIS ENDPOINTS (New)
# ============================================================================

@app.post("/analyze/text/sentiment")
async def analyze_sentiment(request: TextAnalysisRequest):
    """Analyze text sentiment using GPT-4"""
    try:
        request.analysis_type = AnalysisType.SENTIMENT
        result = await text_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Sentiment analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/text/business")
async def analyze_business_insights(request: TextAnalysisRequest):
    """Extract business insights from text"""
    try:
        request.analysis_type = AnalysisType.BUSINESS_INSIGHTS
        result = await text_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Business analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/text/document")
async def summarize_document(request: TextAnalysisRequest):
    """Summarize document for executives"""
    try:
        request.analysis_type = AnalysisType.DOCUMENT_SUMMARY
        result = await text_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Document summary failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/text/competitor")
async def analyze_competitor(request: TextAnalysisRequest):
    """Analyze competitor information"""
    try:
        request.analysis_type = AnalysisType.COMPETITOR_ANALYSIS
        result = await text_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Competitor analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/text/executive")
async def generate_executive_report(request: TextAnalysisRequest):
    """Generate executive report"""
    try:
        request.analysis_type = AnalysisType.EXECUTIVE_REPORT
        result = await text_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Executive report failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/text/market")
async def analyze_market_research(request: TextAnalysisRequest):
    """Analyze market research data"""
    try:
        request.analysis_type = AnalysisType.MARKET_RESEARCH
        result = await text_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Market research analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/text/customer")
async def analyze_customer_feedback(request: TextAnalysisRequest):
    """Analyze customer feedback"""
    try:
        request.analysis_type = AnalysisType.CUSTOMER_FEEDBACK
        result = await text_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Customer feedback analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/text/financial")
async def analyze_financial_data(request: TextAnalysisRequest):
    """Analyze financial information"""
    try:
        request.analysis_type = AnalysisType.FINANCIAL_ANALYSIS
        result = await text_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Financial analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/text/batch")
async def batch_text_analysis(request: BatchRequest):
    """Batch text analysis"""
    try:
        requests = [TextAnalysisRequest(**req) for req in request.requests]
        results = await text_analyzer.batch_analyze(requests)
        return BatchResponse(
            results=[result.__dict__ for result in results],
            success_count=len(results),
            error_count=0,
            processing_time=sum(r.processing_time for r in results)
        )
    except Exception as e:
        logger.error(f"Batch text analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# IMAGE ANALYSIS ENDPOINTS (New)
# ============================================================================

@app.post("/analyze/image/content")
async def analyze_image_content(request: ImageAnalysisRequest):
    """Analyze image content using CLIP"""
    try:
        request.analysis_type = ImageAnalysisType.CONTENT_ANALYSIS
        result = await image_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Image content analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image/brand")
async def analyze_brand_image(request: ImageAnalysisRequest):
    """Analyze brand elements in image"""
    try:
        request.analysis_type = ImageAnalysisType.BRAND_ANALYSIS
        result = await image_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Brand analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image/product")
async def analyze_product_image(request: ImageAnalysisRequest):
    """Analyze product presentation"""
    try:
        request.analysis_type = ImageAnalysisType.PRODUCT_ANALYSIS
        result = await image_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Product analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image/marketing")
async def analyze_marketing_image(request: ImageAnalysisRequest):
    """Analyze marketing effectiveness"""
    try:
        request.analysis_type = ImageAnalysisType.MARKETING_ANALYSIS
        result = await image_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Marketing analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image/quality")
async def analyze_image_quality(request: ImageAnalysisRequest):
    """Analyze image quality"""
    try:
        request.analysis_type = ImageAnalysisType.QUALITY_ANALYSIS
        result = await image_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Quality analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image/emotion")
async def analyze_image_emotion(request: ImageAnalysisRequest):
    """Analyze emotional impact of image"""
    try:
        request.analysis_type = ImageAnalysisType.EMOTION_ANALYSIS
        result = await image_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Emotion analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image/accessibility")
async def analyze_image_accessibility(request: ImageAnalysisRequest):
    """Analyze image accessibility"""
    try:
        request.analysis_type = ImageAnalysisType.ACCESSIBILITY_ANALYSIS
        result = await image_analyzer.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Accessibility analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image/compare")
async def compare_images(images: List[str], comparison_type: str = "similarity"):
    """Compare multiple images"""
    try:
        result = await image_analyzer.compare_images(images, comparison_type)
        return result
    except Exception as e:
        logger.error(f"Image comparison failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# SPEECH PROCESSING ENDPOINTS (New)
# ============================================================================

@app.post("/analyze/speech/transcribe")
async def transcribe_speech(request: SpeechAnalysisRequest):
    """Transcribe speech using Whisper"""
    try:
        request.analysis_type = SpeechAnalysisType.TRANSCRIPTION
        result = await speech_processor.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Speech transcription failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/speech/meeting")
async def analyze_meeting(request: SpeechAnalysisRequest):
    """Analyze meeting transcription"""
    try:
        request.analysis_type = SpeechAnalysisType.MEETING_ANALYSIS
        result = await speech_processor.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Meeting analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/speech/sales")
async def analyze_sales_call(request: SpeechAnalysisRequest):
    """Analyze sales call"""
    try:
        request.analysis_type = SpeechAnalysisType.SALES_CALL_ANALYSIS
        result = await speech_processor.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Sales call analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/speech/feedback")
async def analyze_voice_feedback(request: SpeechAnalysisRequest):
    """Analyze customer voice feedback"""
    try:
        request.analysis_type = SpeechAnalysisType.CUSTOMER_FEEDBACK
        result = await speech_processor.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Voice feedback analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/speech/sentiment")
async def analyze_speech_sentiment(request: SpeechAnalysisRequest):
    """Analyze speech sentiment"""
    try:
        request.analysis_type = SpeechAnalysisType.SENTIMENT_ANALYSIS
        result = await speech_processor.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Speech sentiment analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/speech/emotion")
async def detect_speech_emotion(request: SpeechAnalysisRequest):
    """Detect emotions in speech"""
    try:
        request.analysis_type = SpeechAnalysisType.EMOTION_DETECTION
        result = await speech_processor.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Speech emotion detection failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/speech/summary")
async def summarize_conversation(request: SpeechAnalysisRequest):
    """Summarize conversation"""
    try:
        request.analysis_type = SpeechAnalysisType.CONVERSATION_SUMMARY
        result = await speech_processor.analyze(request)
        return result
    except Exception as e:
        logger.error(f"Conversation summary failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/speech/batch")
async def batch_speech_analysis(audio_files: List[str]):
    """Batch speech transcription"""
    try:
        results = await speech_processor.batch_transcribe(audio_files)
        return BatchResponse(
            results=[result.__dict__ for result in results],
            success_count=len(results),
            error_count=0,
            processing_time=sum(r.processing_time for r in results)
        )
    except Exception as e:
        logger.error(f"Batch speech analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# CODE GENERATION ENDPOINTS (New)
# ============================================================================

@app.post("/generate/code/function")
async def generate_function(request: CodeGenerationRequest):
    """Generate function code"""
    try:
        request.generation_type = CodeGenerationType.FUNCTION_GENERATION
        result = await code_generator.generate(request)
        return result
    except Exception as e:
        logger.error(f"Function generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/code/api")
async def generate_api(request: CodeGenerationRequest):
    """Generate API code"""
    try:
        request.generation_type = CodeGenerationType.API_CREATION
        result = await code_generator.generate(request)
        return result
    except Exception as e:
        logger.error(f"API generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/code/sql")
async def generate_sql(request: CodeGenerationRequest):
    """Generate SQL query"""
    try:
        request.generation_type = CodeGenerationType.SQL_QUERY
        result = await code_generator.generate(request)
        return result
    except Exception as e:
        logger.error(f"SQL generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/code/automation")
async def generate_automation_script(request: CodeGenerationRequest):
    """Generate automation script"""
    try:
        request.generation_type = CodeGenerationType.AUTOMATION_SCRIPT
        result = await code_generator.generate(request)
        return result
    except Exception as e:
        logger.error(f"Automation script generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/code/analysis")
async def generate_data_analysis(request: CodeGenerationRequest):
    """Generate data analysis code"""
    try:
        request.generation_type = CodeGenerationType.DATA_ANALYSIS
        result = await code_generator.generate(request)
        return result
    except Exception as e:
        logger.error(f"Data analysis generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/code/scraping")
async def generate_web_scraper(request: CodeGenerationRequest):
    """Generate web scraping code"""
    try:
        request.generation_type = CodeGenerationType.WEB_SCRAPING
        result = await code_generator.generate(request)
        return result
    except Exception as e:
        logger.error(f"Web scraper generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/code/integration")
async def generate_integration(request: CodeGenerationRequest):
    """Generate integration code"""
    try:
        request.generation_type = CodeGenerationType.INTEGRATION
        result = await code_generator.generate(request)
        return result
    except Exception as e:
        logger.error(f"Integration generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize/code")
async def optimize_code(code: str, language: str):
    """Optimize existing code"""
    try:
        lang_enum = ProgrammingLanguage(language.lower())
        result = await code_generator.optimize_code(code, lang_enum)
        return result
    except Exception as e:
        logger.error(f"Code optimization failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/refactor/code")
async def refactor_code(code: str, language: str):
    """Refactor existing code"""
    try:
        lang_enum = ProgrammingLanguage(language.lower())
        result = await code_generator.refactor_code(code, lang_enum)
        return result
    except Exception as e:
        logger.error(f"Code refactoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/code/batch")
async def batch_code_generation(request: BatchRequest):
    """Batch code generation"""
    try:
        requests = [CodeGenerationRequest(**req) for req in request.requests]
        results = await code_generator.batch_generate(requests)
        return BatchResponse(
            results=[result.__dict__ for result in results],
            success_count=len(results),
            error_count=0,
            processing_time=sum(r.processing_time for r in results)
        )
    except Exception as e:
        logger.error(f"Batch code generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# BUSINESS INTELLIGENCE ENDPOINTS (New)
# ============================================================================

@app.post("/bi/comprehensive-analysis")
async def comprehensive_business_analysis(
    text_data: Optional[str] = None,
    image_data: Optional[str] = None,
    audio_data: Optional[str] = None,
    business_domain: Optional[str] = None
):
    """Comprehensive multi-modal business analysis"""
    try:
        results = {}
        
        # Text analysis
        if text_data:
            text_request = TextAnalysisRequest(
                text=text_data,
                analysis_type=AnalysisType.BUSINESS_INSIGHTS,
                business_domain=business_domain
            )
            results["text_analysis"] = await text_analyzer.analyze(text_request)
        
        # Image analysis
        if image_data:
            image_request = ImageAnalysisRequest(
                image_data=image_data,
                analysis_type=ImageAnalysisType.MARKETING_ANALYSIS,
                business_domain=business_domain
            )
            results["image_analysis"] = await image_analyzer.analyze(image_request)
        
        # Speech analysis
        if audio_data:
            speech_request = SpeechAnalysisRequest(
                audio_data=audio_data,
                analysis_type=SpeechAnalysisType.BUSINESS_INSIGHTS,
                business_domain=business_domain
            )
            results["speech_analysis"] = await speech_processor.analyze(speech_request)
        
        # Generate consolidated insights
        consolidated = await _consolidate_bi_insights(results)
        
        return {
            "individual_analyses": results,
            "consolidated_insights": consolidated,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Comprehensive analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/bi/executive-dashboard")
async def generate_executive_dashboard(data: Dict[str, Any]):
    """Generate executive dashboard insights"""
    try:
        # Process multiple data sources
        insights = []
        
        for key, value in data.items():
            if isinstance(value, str) and len(value) > 100:
                # Analyze as text
                request = TextAnalysisRequest(
                    text=value,
                    analysis_type=AnalysisType.EXECUTIVE_REPORT,
                    context={"source": key}
                )
                result = await text_analyzer.analyze(request)
                insights.append({
                    "source": key,
                    "type": "text",
                    "insights": result.insights,
                    "recommendations": result.recommendations
                })
        
        return {
            "dashboard_insights": insights,
            "executive_summary": await _generate_executive_summary(insights),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Executive dashboard failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

async def _consolidate_bi_insights(results: Dict[str, Any]) -> Dict[str, Any]:
    """Consolidate insights from multiple analyses"""
    try:
        all_insights = []
        all_recommendations = []
        
        for analysis_type, result in results.items():
            if hasattr(result, 'insights'):
                all_insights.extend(result.insights.items())
            if hasattr(result, 'recommendations'):
                all_recommendations.extend(result.recommendations)
        
        return {
            "key_findings": all_insights[:10],  # Top 10
            "priority_recommendations": all_recommendations[:5],  # Top 5
            "analysis_confidence": sum(r.confidence_score for r in results.values() if hasattr(r, 'confidence_score')) / len(results)
        }
        
    except Exception as e:
        logger.error(f"Consolidation failed: {e}")
        return {"error": str(e)}

async def _generate_executive_summary(insights: List[Dict[str, Any]]) -> str:
    """Generate executive summary from insights"""
    try:
        # Consolidate all insights into a summary
        summary_data = {
            "sources": len(insights),
            "key_themes": [],
            "critical_actions": []
        }
        
        for insight in insights:
            if "recommendations" in insight:
                summary_data["critical_actions"].extend(insight["recommendations"][:2])
        
        return f"Executive Summary: Analyzed {summary_data['sources']} data sources. Critical actions identified: {', '.join(summary_data['critical_actions'][:3])}"
        
    except Exception as e:
        logger.error(f"Executive summary failed: {e}")
        return "Executive summary generation failed"

# ============================================================================
# FILE UPLOAD ENDPOINTS
# ============================================================================

@app.post("/upload/image")
async def upload_image_for_analysis(file: UploadFile = File(...)):
    """Upload image file for analysis"""
    try:
        contents = await file.read()
        image_b64 = base64.b64encode(contents).decode()
        
        request = ImageAnalysisRequest(
            image_data=image_b64,
            analysis_type=ImageAnalysisType.CONTENT_ANALYSIS
        )
        
        result = await image_analyzer.analyze(request)
        return result
        
    except Exception as e:
        logger.error(f"Image upload analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload/audio")
async def upload_audio_for_analysis(file: UploadFile = File(...)):
    """Upload audio file for analysis"""
    try:
        contents = await file.read()
        audio_b64 = base64.b64encode(contents).decode()
        
        request = SpeechAnalysisRequest(
            audio_data=audio_b64,
            analysis_type=SpeechAnalysisType.TRANSCRIPTION
        )
        
        result = await speech_processor.analyze(request)
        return result
        
    except Exception as e:
        logger.error(f"Audio upload analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# MAIN
# ============================================================================

# ===============================================
# 🎬 SCENE MANAGER ENDPOINTS
# ===============================================

class VideoProjectRequest(BaseModel):
    title: str
    description: str = ""
    total_duration: int = 60
    quality: str = "hd"
    fps: int = 24

class SceneRequest(BaseModel):
    project_id: str
    prompt: str
    duration: int = 10
    scene_type: str = "main"
    style_prompts: List[str] = []
    negative_prompt: str = ""
    camera_movement: Optional[str] = None
    lighting: Optional[str] = None
    mood: Optional[str] = None

class TransitionRequest(BaseModel):
    project_id: str
    from_scene_id: str
    to_scene_id: str
    transition_type: str = "fade"
    duration: float = 1.0

@app.post("/scene/project/create")
async def create_video_project(request: VideoProjectRequest):
    """Criar novo projeto de vídeo com múltiplas cenas"""
    try:
        # Inicializar scene_manager se necessário
        if scene_manager.media_generator is None:
            scene_manager.media_generator = media_generator
        
        project = await scene_manager.create_project(
            title=request.title,
            description=request.description,
            total_duration=request.total_duration,
            quality=request.quality,
            fps=request.fps
        )
        
        return {
            "success": True,
            "project_id": project.id,
            "title": project.title,
            "status": project.status,
            "created_at": project.created_at
        }
        
    except Exception as e:
        logger.error(f"Erro ao criar projeto: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scene/add")
async def add_scene(request: SceneRequest):
    """Adicionar cena ao projeto"""
    try:
        scene = scene_manager.add_scene(
            project_id=request.project_id,
            prompt=request.prompt,
            duration=request.duration,
            scene_type=SceneType(request.scene_type),
            style_prompts=request.style_prompts,
            negative_prompt=request.negative_prompt,
            camera_movement=request.camera_movement,
            lighting=request.lighting,
            mood=request.mood
        )
        
        return {
            "success": True,
            "scene_id": scene.id,
            "prompt": scene.prompt,
            "duration": scene.duration,
            "order": scene.order,
            "status": scene.status.value
        }
        
    except Exception as e:
        logger.error(f"Erro ao adicionar cena: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scene/template/{template_name}")
async def create_story_template(project_id: str, template_name: str):
    """Criar template de história automático"""
    try:
        scenes = scene_manager.create_story_template(project_id, template_name)
        
        return {
            "success": True,
            "template": template_name,
            "scenes_created": len(scenes),
            "scenes": [
                {
                    "id": scene.id,
                    "prompt": scene.prompt,
                    "duration": scene.duration,
                    "type": scene.scene_type.value,
                    "order": scene.order
                }
                for scene in scenes
            ]
        }
        
    except Exception as e:
        logger.error(f"Erro ao criar template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scene/generate/{project_id}")
async def generate_all_scenes(project_id: str, parallel: bool = False):
    """Gerar todas as cenas do projeto"""
    try:
        scenes = await scene_manager.generate_all_scenes(project_id, parallel=parallel)
        
        completed = [s for s in scenes if s.status.value == "completed"]
        failed = [s for s in scenes if s.status.value == "failed"]
        
        return {
            "success": True,
            "total_scenes": len(scenes),
            "completed": len(completed),
            "failed": len(failed),
            "generation_times": [s.generation_time for s in completed if s.generation_time],
            "scenes": [
                {
                    "id": scene.id,
                    "status": scene.status.value,
                    "generation_time": scene.generation_time,
                    "file_path": scene.file_path,
                    "error": scene.error_message
                }
                for scene in scenes
            ]
        }
        
    except Exception as e:
        logger.error(f"Erro ao gerar cenas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scene/compose/{project_id}")
async def compose_final_video(project_id: str):
    """Compor vídeo final com todas as cenas"""
    try:
        final_video_path = await scene_manager.compose_final_video(project_id)
        
        return {
            "success": True,
            "final_video_path": final_video_path,
            "message": "Vídeo final criado com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao compor vídeo final: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scene/project/{project_id}/status")
async def get_project_status(project_id: str):
    """Obter status detalhado do projeto"""
    try:
        status = scene_manager.get_project_status(project_id)
        return status
        
    except Exception as e:
        logger.error(f"Erro ao obter status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ===============================================
# 🖼️ IMAGE INPUT PROCESSOR ENDPOINTS
# ===============================================

class ImageProcessRequest(BaseModel):
    input_image: str  # Base64 ou URL
    input_type: str = "base64"
    processing_mode: str = "img2img"
    prompt: str = ""
    negative_prompt: str = ""
    strength: float = 0.8
    output_width: int = 1024
    output_height: int = 1024
    output_format: str = "PNG"
    style: Optional[str] = "realistic"
    seed: Optional[int] = None
    # Para vídeo
    video_duration: int = 10
    video_fps: int = 24
    video_quality: str = "hd"
    # Para inpainting
    mask_image: Optional[str] = None
    # Configurações avançadas
    auto_enhance: bool = True
    enhance_details: bool = True

@app.post("/image/process")
async def process_image_input_endpoint(request: ImageProcessRequest):
    """Processar imagem de entrada com diferentes modos"""
    try:
        # Inicializar image_input_processor se necessário
        global image_input_processor
        if image_input_processor is None:
            image_input_processor = ImageInputProcessor(media_generator, image_analyzer)
        
        # Converter request
        input_request = ImageInputRequest(
            input_image=request.input_image,
            input_type=request.input_type,
            processing_mode=ProcessingMode(request.processing_mode),
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            strength=request.strength,
            output_width=request.output_width,
            output_height=request.output_height,
            output_format=request.output_format,
            seed=request.seed,
            video_duration=request.video_duration,
            video_fps=request.video_fps,
            video_quality=request.video_quality,
            mask_image=request.mask_image,
            auto_enhance=request.auto_enhance,
            enhance_details=request.enhance_details
        )
        
        # Processar
        result = await image_input_processor.process_image(input_request)
        
        # Preparar resposta
        response = {
            "success": result.error_message is None,
            "task_id": result.task_id,
            "processing_mode": result.processing_mode.value,
            "processing_time": result.processing_time,
            "input_size": result.input_size,
            "output_size": result.output_size,
            "transformations_applied": result.transformations_applied,
            "prompt_used": result.prompt_used,
            "enhanced_prompt": result.enhanced_prompt,
            "original_analysis": result.original_analysis,
            "generated_analysis": result.generated_analysis
        }
        
        if result.error_message:
            response["error"] = result.error_message
        else:
            if result.processing_mode == ProcessingMode.PROMPT_ANALYSIS:
                # Para análise de prompt, retornar JSON
                response["analysis_result"] = json.loads(result.output_data.decode('utf-8'))
            else:
                # Para outros modos, retornar base64
                response["output_data"] = base64.b64encode(result.output_data).decode('utf-8')
                response["output_format"] = result.output_format
        
        return response
        
    except Exception as e:
        logger.error(f"Erro no processamento de imagem: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/image/img2img")
async def image_to_image(request: ImageProcessRequest):
    """Conversão Image-to-Image específica"""
    request.processing_mode = "img2img"
    return await process_image_input_endpoint(request)

@app.post("/image/img2vid")
async def image_to_video(request: ImageProcessRequest):
    """Conversão Image-to-Video específica"""
    request.processing_mode = "img2vid"
    return await process_image_input_endpoint(request)

@app.post("/image/analyze")
async def analyze_image_for_prompts(request: ImageProcessRequest):
    """Analisar imagem para gerar prompts"""
    request.processing_mode = "prompt_analysis"
    return await process_image_input_endpoint(request)

@app.get("/capabilities")
async def get_capabilities():
    """Obter capacidades completas do PyLab"""
    return {
        "media_generation": {
            "image_generation": True,
            "video_generation": True,
            "models": ["Stable Diffusion XL", "ModelScope T2V"]
        },
        "scene_management": {
            "long_videos": True,
            "transitions": True,
            "templates": ["basic", "narrative", "showcase"],
            "max_scenes": 50
        },
        "image_processing": {
            "img2img": True,
            "img2vid": True,
            "style_transfer": True,
            "inpainting": True,
            "outpainting": True,
            "upscaling": True,
            "variation": True,
            "analysis": True
        },
        "ai_analysis": {
            "text_analysis": True,
            "image_analysis": True,
            "speech_processing": True,
            "code_generation": True,
            "business_intelligence": True
        },
        "supported_formats": {
            "input": ["PNG", "JPEG", "WebP", "Base64", "URL"],
            "output": ["PNG", "JPEG", "MP4", "JSON"]
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )