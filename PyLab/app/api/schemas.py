"""
🤖 PyLab - Schemas Pydantic
Validação de dados de entrada e saída da API
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class GenerationStatus(str, Enum):
    """Status da geração"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class MediaType(str, Enum):
    """Tipo de mídia"""
    IMAGE = "image"
    VIDEO = "video"

class ImageStyle(str, Enum):
    """Estilos de imagem disponíveis"""
    REALISTIC = "realistic"
    ARTISTIC = "artistic"
    ANIME = "anime"
    CONCEPT_ART = "concept_art"
    PHOTOGRAPHY = "photography"

class VideoQuality(str, Enum):
    """Qualidades de vídeo disponíveis"""
    HD = "hd"
    FULL_HD = "full_hd"
    FOUR_K = "4k"

# === REQUEST SCHEMAS ===

class ImageGenerationRequest(BaseModel):
    """Request para geração de imagem"""
    prompt: str = Field(..., min_length=3, max_length=1000, description="Prompt para geração")
    negative_prompt: Optional[str] = Field(None, max_length=500, description="Prompt negativo")
    style: ImageStyle = Field(ImageStyle.REALISTIC, description="Estilo da imagem")
    width: int = Field(1024, ge=512, le=2048, description="Largura da imagem")
    height: int = Field(1024, ge=512, le=2048, description="Altura da imagem")
    steps: int = Field(50, ge=10, le=100, description="Número de steps")
    guidance_scale: float = Field(7.5, ge=1.0, le=20.0, description="Guidance scale")
    seed: Optional[int] = Field(None, description="Seed para reprodutibilidade")
    batch_size: int = Field(1, ge=1, le=4, description="Número de imagens")
    
    @validator('prompt')
    def validate_prompt(cls, v):
        if not v.strip():
            raise ValueError('Prompt não pode estar vazio')
        return v.strip()

class VideoGenerationRequest(BaseModel):
    """Request para geração de vídeo"""
    prompt: str = Field(..., min_length=3, max_length=1000, description="Prompt para geração")
    negative_prompt: Optional[str] = Field(None, max_length=500, description="Prompt negativo")
    duration: int = Field(10, ge=5, le=30, description="Duração em segundos")
    fps: int = Field(24, ge=12, le=60, description="Frames por segundo")
    quality: VideoQuality = Field(VideoQuality.HD, description="Qualidade do vídeo")
    seed: Optional[int] = Field(None, description="Seed para reprodutibilidade")
    
    @validator('prompt')
    def validate_prompt(cls, v):
        if not v.strip():
            raise ValueError('Prompt não pode estar vazio')
        return v.strip()

# === RESPONSE SCHEMAS ===

class HealthResponse(BaseModel):
    """Response do health check"""
    status: str
    timestamp: datetime
    system_info: Dict[str, Any]
    models_loaded: Dict[str, bool]

class GenerationResponse(BaseModel):
    """Response da geração"""
    task_id: str = Field(..., description="ID único da tarefa")
    status: GenerationStatus = Field(..., description="Status da geração")
    media_type: MediaType = Field(..., description="Tipo de mídia")
    filename: Optional[str] = Field(None, description="Nome do arquivo gerado")
    file_url: Optional[str] = Field(None, description="URL do arquivo")
    file_size: Optional[int] = Field(None, description="Tamanho do arquivo em bytes")
    generation_time: Optional[float] = Field(None, description="Tempo de geração em segundos")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadados da geração")
    error_message: Optional[str] = Field(None, description="Mensagem de erro")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GenerationProgress(BaseModel):
    """Progress da geração em tempo real"""
    task_id: str
    status: GenerationStatus
    progress_percent: int = Field(..., ge=0, le=100)
    current_step: int
    total_steps: int
    estimated_time_remaining: Optional[float] = None
    message: Optional[str] = None

class ModelInfo(BaseModel):
    """Informações do modelo"""
    name: str
    type: MediaType
    version: str
    description: str
    parameters: Dict[str, Any]
    memory_usage: str
    loaded: bool

class SystemStatus(BaseModel):
    """Status do sistema"""
    service_name: str
    version: str
    uptime: str
    total_generations: int
    active_tasks: int
    queue_size: int
    available_models: List[ModelInfo]
    system_resources: Dict[str, Any]

# === UTILITY SCHEMAS ===

class ErrorResponse(BaseModel):
    """Response de erro padrão"""
    error: str
    message: str
    timestamp: datetime
    details: Optional[Dict[str, Any]] = None

class SuccessResponse(BaseModel):
    """Response de sucesso padrão"""
    success: bool = True
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# === VALIDATION HELPERS ===

def validate_resolution(width: int, height: int) -> bool:
    """Valida se a resolução é suportada"""
    max_pixels = 2048 * 2048
    return (width * height) <= max_pixels

def validate_aspect_ratio(width: int, height: int) -> bool:
    """Valida se o aspect ratio é razoável"""
    ratio = max(width, height) / min(width, height)
    return ratio <= 2.0  # Máximo 2:1

# === CONFIG SCHEMAS ===

class ModelConfig(BaseModel):
    """Configuração do modelo"""
    model_name: str
    model_path: str
    device: str = "cuda"
    dtype: str = "float16"
    enable_attention_slicing: bool = True
    enable_xformers: bool = True
    enable_cpu_offload: bool = False