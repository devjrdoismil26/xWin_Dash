"""
🤖 PyLab - API Routes
Endpoints para geração de mídia com IA
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import JSONResponse
import asyncio
import uuid
import time
import logging
from typing import Dict, Any

from .schemas import (
    ImageGenerationRequest, VideoGenerationRequest,
    GenerationResponse, GenerationProgress, SystemStatus,
    MediaType, GenerationStatus, SuccessResponse
)

logger = logging.getLogger("PyLab.API")

# Router principal
router = APIRouter()

# Storage temporário para tasks (em produção usar Redis)
active_tasks: Dict[str, Dict[str, Any]] = {}

# === DEPENDENCY INJECTIONS ===

async def get_image_generator():
    """Dependency injection para o gerador de imagens"""
    # Import aqui para evitar circular imports
    from ..models.image_generator import ImageGenerator
    return ImageGenerator()

async def get_video_generator():
    """Dependency injection para o gerador de vídeos"""
    from ..models.video_generator import VideoGenerator
    return VideoGenerator()

async def get_storage_manager():
    """Dependency injection para o storage manager"""
    from ..utils.storage import StorageManager
    return StorageManager()

# === ENDPOINTS PRINCIPAIS ===

@router.post("/generate-image", response_model=GenerationResponse)
async def generate_image(
    request: ImageGenerationRequest,
    background_tasks: BackgroundTasks,
    image_generator = Depends(get_image_generator),
    storage_manager = Depends(get_storage_manager)
):
    """
    🎨 Gerar imagem usando Stable Diffusion XL
    
    - **prompt**: Descrição da imagem desejada
    - **style**: Estilo artístico
    - **width/height**: Dimensões da imagem
    - **steps**: Qualidade (mais steps = melhor qualidade)
    """
    try:
        # Gerar ID único da tarefa
        task_id = str(uuid.uuid4())
        
        logger.info(f"Nova geração de imagem: {task_id}")
        logger.info(f"Prompt: {request.prompt}")
        
        # Registrar task
        active_tasks[task_id] = {
            "type": "image",
            "status": GenerationStatus.PENDING,
            "created_at": time.time(),
            "request": request.dict()
        }
        
        # Iniciar geração em background
        background_tasks.add_task(
            _process_image_generation,
            task_id,
            request,
            image_generator,
            storage_manager
        )
        
        return GenerationResponse(
            task_id=task_id,
            status=GenerationStatus.PENDING,
            media_type=MediaType.IMAGE
        )
        
    except Exception as e:
        logger.error(f"Erro ao iniciar geração de imagem: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-video", response_model=GenerationResponse)
async def generate_video(
    request: VideoGenerationRequest,
    background_tasks: BackgroundTasks,
    video_generator = Depends(get_video_generator),
    storage_manager = Depends(get_storage_manager)
):
    """
    🎬 Gerar vídeo usando ModelScope Text-to-Video
    
    - **prompt**: Descrição do vídeo desejado
    - **duration**: Duração em segundos
    - **quality**: Qualidade do vídeo (HD, Full HD, 4K)
    - **fps**: Frames por segundo
    """
    try:
        # Gerar ID único da tarefa
        task_id = str(uuid.uuid4())
        
        logger.info(f"Nova geração de vídeo: {task_id}")
        logger.info(f"Prompt: {request.prompt}")
        
        # Registrar task
        active_tasks[task_id] = {
            "type": "video",
            "status": GenerationStatus.PENDING,
            "created_at": time.time(),
            "request": request.dict()
        }
        
        # Iniciar geração em background
        background_tasks.add_task(
            _process_video_generation,
            task_id,
            request,
            video_generator,
            storage_manager
        )
        
        return GenerationResponse(
            task_id=task_id,
            status=GenerationStatus.PENDING,
            media_type=MediaType.VIDEO
        )
        
    except Exception as e:
        logger.error(f"Erro ao iniciar geração de vídeo: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# === ENDPOINTS DE STATUS ===

@router.get("/status/{task_id}", response_model=GenerationResponse)
async def get_generation_status(task_id: str):
    """
    📊 Verificar status de uma geração
    
    Retorna o status atual, progresso e arquivos gerados
    """
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task não encontrada")
    
    task = active_tasks[task_id]
    
    return GenerationResponse(
        task_id=task_id,
        status=task["status"],
        media_type=MediaType.IMAGE if task["type"] == "image" else MediaType.VIDEO,
        filename=task.get("filename"),
        file_url=task.get("file_url"),
        file_size=task.get("file_size"),
        generation_time=task.get("generation_time"),
        metadata=task.get("metadata"),
        error_message=task.get("error_message")
    )

@router.get("/progress/{task_id}", response_model=GenerationProgress)
async def get_generation_progress(task_id: str):
    """
    ⏳ Obter progresso em tempo real de uma geração
    
    Para uso com WebSockets no frontend
    """
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task não encontrada")
    
    task = active_tasks[task_id]
    
    return GenerationProgress(
        task_id=task_id,
        status=task["status"],
        progress_percent=task.get("progress_percent", 0),
        current_step=task.get("current_step", 0),
        total_steps=task.get("total_steps", 100),
        estimated_time_remaining=task.get("eta"),
        message=task.get("message")
    )

@router.get("/system-status", response_model=SystemStatus)
async def get_system_status():
    """
    🖥️ Status completo do sistema
    
    Informações sobre modelos, recursos e estatísticas
    """
    import psutil
    import torch
    
    # Contar tasks ativas
    active_count = len([t for t in active_tasks.values() if t["status"] == GenerationStatus.PROCESSING])
    pending_count = len([t for t in active_tasks.values() if t["status"] == GenerationStatus.PENDING])
    
    # Informações dos modelos (placeholder)
    models = []
    
    # Recursos do sistema
    memory = psutil.virtual_memory()
    cpu_percent = psutil.cpu_percent(interval=1)
    
    gpu_info = {}
    if torch.cuda.is_available():
        for i in range(torch.cuda.device_count()):
            gpu_memory_used = torch.cuda.memory_allocated(i) / 1024**3  # GB
            gpu_memory_total = torch.cuda.get_device_properties(i).total_memory / 1024**3  # GB
            gpu_info[f"gpu_{i}"] = {
                "name": torch.cuda.get_device_name(i),
                "memory_used": f"{gpu_memory_used:.1f}GB",
                "memory_total": f"{gpu_memory_total:.1f}GB",
                "utilization": f"{(gpu_memory_used/gpu_memory_total)*100:.1f}%"
            }
    
    return SystemStatus(
        service_name="PyLab AI Laboratory",
        version="1.0.0",
        uptime="Running",  # Calcular uptime real
        total_generations=len(active_tasks),
        active_tasks=active_count,
        queue_size=pending_count,
        available_models=models,
        system_resources={
            "cpu_usage": f"{cpu_percent}%",
            "memory_usage": f"{memory.percent}%",
            "memory_available": f"{memory.available / 1024**3:.1f}GB",
            "gpu_info": gpu_info
        }
    )

# === ENDPOINTS DE GERENCIAMENTO ===

@router.delete("/cancel/{task_id}", response_model=SuccessResponse)
async def cancel_generation(task_id: str):
    """
    ❌ Cancelar uma geração em andamento
    """
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task não encontrada")
    
    task = active_tasks[task_id]
    
    if task["status"] == GenerationStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Task já foi completada")
    
    # Marcar como cancelada
    active_tasks[task_id]["status"] = GenerationStatus.FAILED
    active_tasks[task_id]["error_message"] = "Cancelado pelo usuário"
    
    logger.info(f"Task cancelada: {task_id}")
    
    return SuccessResponse(
        message=f"Geração {task_id} cancelada com sucesso"
    )

@router.delete("/cleanup", response_model=SuccessResponse)
async def cleanup_completed_tasks():
    """
    🧹 Limpar tasks antigas e completadas
    """
    current_time = time.time()
    old_tasks = []
    
    for task_id, task in active_tasks.items():
        # Remover tasks antigas (mais de 1 hora)
        if current_time - task["created_at"] > 3600:
            old_tasks.append(task_id)
    
    for task_id in old_tasks:
        del active_tasks[task_id]
    
    logger.info(f"Limpeza: {len(old_tasks)} tasks removidas")
    
    return SuccessResponse(
        message=f"{len(old_tasks)} tasks antigas removidas"
    )

# === BACKGROUND TASKS ===

async def _process_image_generation(
    task_id: str,
    request: ImageGenerationRequest,
    image_generator,
    storage_manager
):
    """Processar geração de imagem em background"""
    try:
        logger.info(f"Iniciando geração de imagem: {task_id}")
        
        # Atualizar status
        active_tasks[task_id]["status"] = GenerationStatus.PROCESSING
        active_tasks[task_id]["progress_percent"] = 10
        
        start_time = time.time()
        
        # Gerar imagem (placeholder - implementação real nos models)
        logger.info("Chamando gerador de imagem...")
        
        # Simular progresso
        for i in range(10, 90, 10):
            active_tasks[task_id]["progress_percent"] = i
            active_tasks[task_id]["current_step"] = i
            active_tasks[task_id]["total_steps"] = 100
            await asyncio.sleep(0.5)  # Simular processamento
        
        # Gerar filename único
        filename = f"img_{task_id[:8]}_{int(time.time())}.png"
        
        # Aqui seria chamado o gerador real:
        # result = await image_generator.generate(request)
        # filename = await storage_manager.save_image(result, filename)
        
        # Simular resultado por enquanto
        file_path = f"/var/shared_media/{filename}"
        file_url = f"/storage/media/{filename}"
        
        generation_time = time.time() - start_time
        
        # Atualizar task com resultado
        active_tasks[task_id].update({
            "status": GenerationStatus.COMPLETED,
            "filename": filename,
            "file_url": file_url,
            "file_size": 1024000,  # 1MB simulado
            "generation_time": generation_time,
            "progress_percent": 100,
            "metadata": {
                "prompt": request.prompt,
                "style": request.style.value,
                "resolution": f"{request.width}x{request.height}",
                "steps": request.steps
            }
        })
        
        logger.info(f"Imagem gerada com sucesso: {task_id} -> {filename}")
        
    except Exception as e:
        logger.error(f"Erro na geração de imagem {task_id}: {e}")
        active_tasks[task_id].update({
            "status": GenerationStatus.FAILED,
            "error_message": str(e)
        })

async def _process_video_generation(
    task_id: str,
    request: VideoGenerationRequest,
    video_generator,
    storage_manager
):
    """Processar geração de vídeo em background"""
    try:
        logger.info(f"Iniciando geração de vídeo: {task_id}")
        
        # Atualizar status
        active_tasks[task_id]["status"] = GenerationStatus.PROCESSING
        active_tasks[task_id]["progress_percent"] = 5
        
        start_time = time.time()
        
        # Gerar vídeo (placeholder)
        logger.info("Chamando gerador de vídeo...")
        
        # Simular progresso mais lento para vídeo
        for i in range(5, 95, 5):
            active_tasks[task_id]["progress_percent"] = i
            active_tasks[task_id]["current_step"] = i
            active_tasks[task_id]["total_steps"] = 100
            await asyncio.sleep(1.0)  # Vídeo demora mais
        
        # Gerar filename único
        filename = f"vid_{task_id[:8]}_{int(time.time())}.mp4"
        
        # Aqui seria chamado o gerador real:
        # result = await video_generator.generate(request)
        # filename = await storage_manager.save_video(result, filename)
        
        file_path = f"/var/shared_media/{filename}"
        file_url = f"/storage/media/{filename}"
        
        generation_time = time.time() - start_time
        
        # Atualizar task com resultado
        active_tasks[task_id].update({
            "status": GenerationStatus.COMPLETED,
            "filename": filename,
            "file_url": file_url,
            "file_size": 5120000,  # 5MB simulado
            "generation_time": generation_time,
            "progress_percent": 100,
            "metadata": {
                "prompt": request.prompt,
                "duration": request.duration,
                "quality": request.quality.value,
                "fps": request.fps
            }
        })
        
        logger.info(f"Vídeo gerado com sucesso: {task_id} -> {filename}")
        
    except Exception as e:
        logger.error(f"Erro na geração de vídeo {task_id}: {e}")
        active_tasks[task_id].update({
            "status": GenerationStatus.FAILED,
            "error_message": str(e)
        })