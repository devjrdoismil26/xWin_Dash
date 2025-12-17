"""
🎨 MEDIA GENERATOR - Unified Image & Video Generation

Gerador unificado que combina:
- Stable Diffusion XL para imagens
- ModelScope Text-to-Video para vídeos
"""

import torch
import logging
import asyncio
import time
from typing import Optional, Dict, Any, List, Union
from dataclasses import dataclass
from enum import Enum
import uuid

from .image_generator import ImageGenerator
from .video_generator import VideoGenerator
from ..api.schemas import (
    ImageGenerationRequest, VideoGenerationRequest, 
    MediaType, GenerationStatus
)

logger = logging.getLogger("PyLab.MediaGenerator")

@dataclass
class MediaGenerationRequest:
    """Request unificado para geração de mídia"""
    prompt: str
    media_type: MediaType
    negative_prompt: Optional[str] = None
    seed: Optional[int] = None
    
    # Parâmetros específicos de imagem
    style: Optional[str] = None
    width: Optional[int] = 1024
    height: Optional[int] = 1024
    steps: Optional[int] = 50
    guidance_scale: Optional[float] = 7.5
    batch_size: Optional[int] = 1
    
    # Parâmetros específicos de vídeo
    duration: Optional[int] = 10
    fps: Optional[int] = 24
    quality: Optional[str] = "hd"

@dataclass
class MediaGenerationResult:
    """Resultado unificado da geração"""
    task_id: str
    status: GenerationStatus
    media_type: MediaType
    file_data: Optional[bytes] = None
    file_url: Optional[str] = None
    filename: Optional[str] = None
    file_size: Optional[int] = None
    generation_time: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None

class MediaGenerator:
    """Gerador unificado de mídia (imagem e vídeo)"""
    
    def __init__(self):
        self.image_generator = ImageGenerator()
        self.video_generator = VideoGenerator()
        self.active_tasks = {}
        
        logger.info("🎨 Media Generator inicializado")
    
    async def generate(self, request: MediaGenerationRequest) -> MediaGenerationResult:
        """
        Gerar mídia baseada no tipo solicitado
        
        Args:
            request: Parâmetros de geração unificados
            
        Returns:
            Resultado da geração
        """
        task_id = str(uuid.uuid4())
        start_time = time.time()
        
        try:
            logger.info(f"🎯 Iniciando geração {request.media_type.value}: {request.prompt[:50]}...")
            
            # Registrar tarefa ativa
            self.active_tasks[task_id] = {
                'status': GenerationStatus.PROCESSING,
                'media_type': request.media_type,
                'start_time': start_time
            }
            
            # Gerar baseado no tipo
            if request.media_type == MediaType.IMAGE:
                file_data = await self._generate_image(request)
                filename = f"image_{task_id}.png"
            elif request.media_type == MediaType.VIDEO:
                file_data = await self._generate_video(request)
                filename = f"video_{task_id}.mp4"
            else:
                raise ValueError(f"Tipo de mídia não suportado: {request.media_type}")
            
            generation_time = time.time() - start_time
            file_size = len(file_data) if file_data else 0
            
            # Remover da lista de tarefas ativas
            self.active_tasks.pop(task_id, None)
            
            logger.info(f"✅ Mídia gerada em {generation_time:.2f}s - {file_size / 1024 / 1024:.2f}MB")
            
            return MediaGenerationResult(
                task_id=task_id,
                status=GenerationStatus.COMPLETED,
                media_type=request.media_type,
                file_data=file_data,
                filename=filename,
                file_size=file_size,
                generation_time=generation_time,
                metadata={
                    'prompt': request.prompt,
                    'negative_prompt': request.negative_prompt,
                    'seed': request.seed,
                    'model_used': self._get_model_name(request.media_type)
                }
            )
            
        except Exception as e:
            # Remover da lista de tarefas ativas
            self.active_tasks.pop(task_id, None)
            
            logger.error(f"❌ Erro na geração: {e}")
            
            return MediaGenerationResult(
                task_id=task_id,
                status=GenerationStatus.FAILED,
                media_type=request.media_type,
                error_message=str(e)
            )
    
    async def _generate_image(self, request: MediaGenerationRequest) -> bytes:
        """Gerar imagem usando SDXL"""
        from ..api.schemas import ImageStyle
        
        # Converter request unificado para request específico de imagem
        image_request = ImageGenerationRequest(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            style=ImageStyle(request.style) if request.style else ImageStyle.REALISTIC,
            width=request.width or 1024,
            height=request.height or 1024,
            steps=request.steps or 50,
            guidance_scale=request.guidance_scale or 7.5,
            seed=request.seed,
            batch_size=request.batch_size or 1
        )
        
        return await self.image_generator.generate(image_request)
    
    async def _generate_video(self, request: MediaGenerationRequest) -> bytes:
        """Gerar vídeo usando ModelScope T2V"""
        from ..api.schemas import VideoQuality
        
        # Converter request unificado para request específico de vídeo
        video_request = VideoGenerationRequest(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            duration=request.duration or 10,
            fps=request.fps or 24,
            quality=VideoQuality(request.quality) if request.quality else VideoQuality.HD,
            seed=request.seed
        )
        
        return await self.video_generator.generate(video_request)
    
    def _get_model_name(self, media_type: MediaType) -> str:
        """Obter nome do modelo usado"""
        if media_type == MediaType.IMAGE:
            return "Stable Diffusion XL"
        elif media_type == MediaType.VIDEO:
            return "ModelScope Text-to-Video"
        return "Unknown"
    
    def get_status(self, task_id: str) -> Dict[str, Any]:
        """Obter status de uma tarefa"""
        if task_id in self.active_tasks:
            task = self.active_tasks[task_id]
            elapsed = time.time() - task['start_time']
            
            return {
                'task_id': task_id,
                'status': task['status'].value,
                'media_type': task['media_type'].value,
                'elapsed_time': elapsed,
                'estimated_remaining': self._estimate_remaining_time(task['media_type'], elapsed)
            }
        
        return {
            'task_id': task_id,
            'status': 'not_found',
            'message': 'Tarefa não encontrada ou já concluída'
        }
    
    def _estimate_remaining_time(self, media_type: MediaType, elapsed: float) -> Optional[float]:
        """Estimar tempo restante baseado no tipo de mídia"""
        if media_type == MediaType.IMAGE:
            # Imagens geralmente levam 30-60 segundos
            avg_time = 45
        elif media_type == MediaType.VIDEO:
            # Vídeos geralmente levam 2-5 minutos
            avg_time = 180
        else:
            return None
        
        if elapsed < avg_time:
            return avg_time - elapsed
        
        return None
    
    def get_active_tasks(self) -> List[Dict[str, Any]]:
        """Obter lista de tarefas ativas"""
        tasks = []
        current_time = time.time()
        
        for task_id, task in self.active_tasks.items():
            elapsed = current_time - task['start_time']
            tasks.append({
                'task_id': task_id,
                'status': task['status'].value,
                'media_type': task['media_type'].value,
                'elapsed_time': elapsed
            })
        
        return tasks
    
    def get_model_info(self) -> Dict[str, Any]:
        """Obter informações dos modelos"""
        return {
            'image_model': self.image_generator.get_model_info(),
            'video_model': self.video_generator.get_model_info(),
            'unified_capabilities': {
                'supported_media_types': ['image', 'video'],
                'max_concurrent_tasks': 2,
                'queue_management': True,
                'progress_tracking': True
            }
        }
    
    def get_system_status(self) -> Dict[str, Any]:
        """Obter status geral do sistema"""
        return {
            'service': 'PyLab Media Generator',
            'version': '2.0.0',
            'active_tasks': len(self.active_tasks),
            'image_generator_loaded': self.image_generator.model_loaded,
            'video_generator_loaded': self.video_generator.model_loaded,
            'gpu_available': torch.cuda.is_available(),
            'gpu_memory': self._get_gpu_memory_info()
        }
    
    def _get_gpu_memory_info(self) -> Dict[str, Any]:
        """Obter informações de memória GPU"""
        if torch.cuda.is_available():
            return {
                'total_gb': torch.cuda.get_device_properties(0).total_memory / 1024**3,
                'allocated_gb': torch.cuda.memory_allocated() / 1024**3,
                'cached_gb': torch.cuda.memory_reserved() / 1024**3
            }
        
        return {'message': 'GPU not available'}
    
    async def batch_generate(self, requests: List[MediaGenerationRequest]) -> List[MediaGenerationResult]:
        """Gerar múltiplas mídias em lote"""
        logger.info(f"🔄 Iniciando geração em lote: {len(requests)} itens")
        
        # Separar por tipo para otimização
        image_requests = [r for r in requests if r.media_type == MediaType.IMAGE]
        video_requests = [r for r in requests if r.media_type == MediaType.VIDEO]
        
        results = []
        
        # Processar imagens em paralelo (mais rápido)
        if image_requests:
            logger.info(f"📸 Processando {len(image_requests)} imagens...")
            image_tasks = [self.generate(req) for req in image_requests]
            image_results = await asyncio.gather(*image_tasks, return_exceptions=True)
            results.extend(image_results)
        
        # Processar vídeos sequencialmente (uso intensivo de VRAM)
        if video_requests:
            logger.info(f"🎬 Processando {len(video_requests)} vídeos sequencialmente...")
            for req in video_requests:
                try:
                    result = await self.generate(req)
                    results.append(result)
                except Exception as e:
                    logger.error(f"Erro no vídeo em lote: {e}")
                    results.append(MediaGenerationResult(
                        task_id=str(uuid.uuid4()),
                        status=GenerationStatus.FAILED,
                        media_type=MediaType.VIDEO,
                        error_message=str(e)
                    ))
        
        logger.info(f"✅ Lote concluído: {len(results)} resultados")
        return results
    
    def cleanup(self):
        """Limpar recursos"""
        logger.info("🧹 Limpando recursos do Media Generator...")
        
        self.image_generator.cleanup()
        self.video_generator.cleanup()
        self.active_tasks.clear()
        
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        
        logger.info("✅ Recursos limpos")

# Instância global para uso na API
media_generator = MediaGenerator()

# Funções de conveniência para compatibilidade
async def generate_image(prompt: str, **kwargs) -> bytes:
    """Função de conveniência para gerar imagem"""
    request = MediaGenerationRequest(
        prompt=prompt,
        media_type=MediaType.IMAGE,
        **kwargs
    )
    result = await media_generator.generate(request)
    
    if result.status == GenerationStatus.FAILED:
        raise Exception(result.error_message)
    
    return result.file_data

async def generate_video(prompt: str, **kwargs) -> bytes:
    """Função de conveniência para gerar vídeo"""
    request = MediaGenerationRequest(
        prompt=prompt,
        media_type=MediaType.VIDEO,
        **kwargs
    )
    result = await media_generator.generate(request)
    
    if result.status == GenerationStatus.FAILED:
        raise Exception(result.error_message)
    
    return result.file_data

# Função de teste
async def test_unified_generation():
    """Teste do gerador unificado"""
    logger.info("🧪 Testando gerador unificado...")
    
    # Teste de imagem
    image_request = MediaGenerationRequest(
        prompt="A beautiful sunset over mountains",
        media_type=MediaType.IMAGE,
        width=1024,
        height=1024
    )
    
    image_result = await media_generator.generate(image_request)
    logger.info(f"Imagem: {image_result.status} - {image_result.file_size} bytes")
    
    # Teste de vídeo
    video_request = MediaGenerationRequest(
        prompt="A cat walking in a garden",
        media_type=MediaType.VIDEO,
        duration=5,
        fps=24
    )
    
    video_result = await media_generator.generate(video_request)
    logger.info(f"Vídeo: {video_result.status} - {video_result.file_size} bytes")
    
    logger.info("✅ Teste concluído")

if __name__ == "__main__":
    asyncio.run(test_unified_generation())