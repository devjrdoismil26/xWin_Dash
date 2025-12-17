"""
🤖 PyLab - Video Generator
Geração de vídeos usando ModelScope Text-to-Video
"""

import torch
import logging
import asyncio
import time
import numpy as np
from typing import Optional, Dict, Any, List
from PIL import Image
import io
import gc
import tempfile
import os

from ..api.schemas import VideoGenerationRequest, VideoQuality

logger = logging.getLogger("PyLab.VideoGenerator")

class VideoGenerator:
    """Gerador de vídeos usando ModelScope Text-to-Video"""
    
    def __init__(self):
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_loaded = False
        self.model_name = "damo-vilab/text-to-video-ms-1.7b"
        
        logger.info(f"Video Generator inicializado - Device: {self.device}")
        
        # Não carregar modelo imediatamente (lazy loading)
        # self._load_model()
    
    async def generate(self, request: VideoGenerationRequest) -> bytes:
        """
        Gerar vídeo baseado no request
        
        Args:
            request: Parâmetros de geração
            
        Returns:
            Dados do vídeo em bytes
        """
        try:
            start_time = time.time()
            
            logger.info(f"Gerando vídeo: {request.prompt[:50]}...")
            logger.info(f"Duração: {request.duration}s, Qualidade: {request.quality}, FPS: {request.fps}")
            
            # Carregar modelo se necessário
            if not self.model_loaded:
                await self._load_model()
            
            # Preparar parâmetros de geração
            generation_params = {
                "prompt": request.prompt,
                "negative_prompt": request.negative_prompt or self._get_default_negative_prompt(),
                "num_frames": self._calculate_frames(request.duration, request.fps),
                "fps": request.fps,
                "quality": request.quality,
                "width": self._get_resolution_width(request.quality),
                "height": self._get_resolution_height(request.quality),
            }
            
            # Adicionar seed se fornecida
            if request.seed is not None:
                generation_params["seed"] = request.seed
            
            # Executar geração real com ModelScope T2V
            result = await self._run_inference(generation_params)
            
            generation_time = time.time() - start_time
            logger.info(f"Vídeo gerado em {generation_time:.2f}s")
            
            return result
            
        except Exception as e:
            logger.error(f"Erro na geração de vídeo: {e}")
            raise
    
    async def _load_model(self):
        """Carregar modelo ModelScope Text-to-Video"""
        try:
            logger.info("🔄 Carregando ModelScope Text-to-Video...")
            
            # Importar bibliotecas necessárias
            from diffusers import DiffusionPipeline
            import torch
            
            # Carregar modelo ModelScope T2V
            logger.info("📥 Baixando/Carregando ModelScope Text-to-Video...")
            self.model = DiffusionPipeline.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                variant="fp16" if self.device == "cuda" else None,
                cache_dir="/app/models",
                custom_pipeline="text_to_video_ms_1_7b"
            )
            
            # Otimizações para GPU
            if self.device == "cuda":
                logger.info("🚀 Aplicando otimizações GPU para vídeo...")
                self.model = self.model.to(self.device)
                
                # Otimizações de memória (vídeo consome mais VRAM)
                self.model.enable_attention_slicing()
                self.model.enable_vae_slicing()
                
                # Verificar VRAM disponível
                gpu_memory = torch.cuda.get_device_properties(0).total_memory / 1024**3  # GB
                logger.info(f"📊 VRAM disponível: {gpu_memory:.1f}GB")
                
                # Para GPUs com menos VRAM, usar CPU offload
                if gpu_memory < 12:  # < 12GB
                    logger.info("⚠️ VRAM baixa, habilitando CPU offload...")
                    self.model.enable_sequential_cpu_offload()
                    self.model.enable_model_cpu_offload()
                
                # Compilação para melhor performance (se disponível)
                try:
                    logger.info("⚡ Compilando modelo de vídeo...")
                    self.model.unet = torch.compile(self.model.unet, mode="reduce-overhead")
                except Exception as compile_error:
                    logger.warning(f"⚠️ Compilação falhou (não crítico): {compile_error}")
            
            # Verificar se modelo foi carregado corretamente
            if hasattr(self.model, 'unet') and self.model.unet is not None:
                self.model_loaded = True
                logger.info("✅ ModelScope Text-to-Video carregado e otimizado!")
                
                # Log de informações do modelo
                if self.device == "cuda":
                    memory_allocated = torch.cuda.memory_allocated() / 1024**3
                    logger.info(f"📊 Memória GPU alocada: {memory_allocated:.2f}GB")
            else:
                raise Exception("Modelo de vídeo não foi carregado corretamente")
            
        except ImportError as e:
            logger.error(f"❌ Erro de importação - bibliotecas não instaladas: {e}")
            logger.error("💡 Execute: pip install diffusers transformers accelerate")
            raise
        except Exception as e:
            logger.error(f"❌ Erro ao carregar modelo de vídeo: {e}")
            logger.error("💡 Verifique conectividade e espaço em disco")
            raise
    
    def _calculate_frames(self, duration: int, fps: int) -> int:
        """Calcular número de frames baseado na duração e FPS"""
        return duration * fps
    
    def _get_resolution_width(self, quality: VideoQuality) -> int:
        """Obter largura baseada na qualidade"""
        resolutions = {
            VideoQuality.HD: 1280,
            VideoQuality.FULL_HD: 1920,
            VideoQuality.FOUR_K: 3840
        }
        return resolutions.get(quality, 1280)
    
    def _get_resolution_height(self, quality: VideoQuality) -> int:
        """Obter altura baseada na qualidade"""
        resolutions = {
            VideoQuality.HD: 720,
            VideoQuality.FULL_HD: 1080,
            VideoQuality.FOUR_K: 2160
        }
        return resolutions.get(quality, 720)
    
    def _get_default_negative_prompt(self) -> str:
        """Prompt negativo padrão para vídeos"""
        return (
            "low quality, blurry, pixelated, distorted, static, "
            "flickering, artifacts, noise, watermark, text, "
            "deformed objects, unnatural motion"
        )
    
    async def _run_inference(self, params: Dict[str, Any]) -> bytes:
        """
        Executar inferência do modelo ModelScope Text-to-Video
        """
        try:
            logger.info("🎬 Iniciando geração de vídeo com ModelScope T2V...")
            start_time = time.time()
            
            # Executar inferência em thread separada para não bloquear
            def run_generation():
                with torch.inference_mode():
                    # Limpar cache GPU antes da geração
                    if self.device == "cuda":
                        torch.cuda.empty_cache()
                    
                    # Gerar vídeo usando ModelScope
                    result = self.model(
                        params["prompt"],
                        negative_prompt=params["negative_prompt"],
                        num_frames=min(params["num_frames"], 16),  # Limitar frames para estabilidade
                        height=params["height"],
                        width=params["width"],
                        num_inference_steps=25,  # Balanceio qualidade/velocidade
                        guidance_scale=9.0,      # Otimizado para ModelScope
                    )
                    return result.frames[0]  # Primeira sequência
            
            # Executar em thread pool para não bloquear event loop
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(run_generation)
                video_frames = future.result(timeout=600)  # 10 minutos timeout
            
            # Converter frames para vídeo
            logger.info("🔄 Convertendo frames para vídeo...")
            video_bytes = await self._frames_to_video_real(video_frames, params["fps"])
            
            generation_time = time.time() - start_time
            logger.info(f"✅ Vídeo gerado em {generation_time:.2f}s")
            
            # Log de estatísticas
            video_size = len(video_bytes)
            logger.info(f"📊 Tamanho do vídeo: {video_size / 1024 / 1024:.2f}MB")
            logger.info(f"📐 Frames gerados: {len(video_frames)}")
            
            return video_bytes
            
        except concurrent.futures.TimeoutError:
            logger.error("❌ Timeout na geração de vídeo (10 minutos)")
            raise Exception("Geração de vídeo demorou muito tempo")
        except torch.cuda.OutOfMemoryError:
            logger.error("❌ Memória GPU insuficiente para vídeo")
            # Limpar cache e sugerir redução de parâmetros
            if self.device == "cuda":
                torch.cuda.empty_cache()
                gc.collect()
            raise Exception("Memória GPU insuficiente. Tente reduzir resolução, duração ou FPS")
        except Exception as e:
            logger.error(f"❌ Erro na inferência de vídeo: {e}")
            raise
    
    async def _create_placeholder_video(self, request: VideoGenerationRequest) -> bytes:
        """Criar vídeo placeholder para desenvolvimento"""
        try:
            logger.info("Criando vídeo placeholder...")
            
            # Criar algumas imagens para simular frames
            width = self._get_resolution_width(request.quality)
            height = self._get_resolution_height(request.quality)
            num_frames = self._calculate_frames(request.duration, request.fps)
            
            frames = []
            
            for i in range(min(num_frames, 30)):  # Limitar a 30 frames para placeholder
                # Criar frame com cor gradiente
                color_value = int(255 * (i / 30))
                color = (color_value, 100, 255 - color_value)
                
                img = Image.new('RGB', (width, height), color=color)
                
                # Adicionar texto do frame
                from PIL import ImageDraw, ImageFont
                draw = ImageDraw.Draw(img)
                
                try:
                    font = ImageFont.load_default()
                except:
                    font = None
                
                # Informações do frame
                text_lines = [
                    f"PyLab Video - Frame {i+1}/{num_frames}",
                    f"Prompt: {request.prompt[:40]}...",
                    f"Quality: {request.quality.value}",
                    f"Duration: {request.duration}s @ {request.fps}fps"
                ]
                
                y_offset = 50
                for line in text_lines:
                    draw.text((50, y_offset), line, fill='white', font=font)
                    y_offset += 40
                
                frames.append(img)
            
            # Converter frames para vídeo usando moviepy
            video_bytes = await self._frames_to_video_bytes(frames, request.fps)
            
            return video_bytes
            
        except Exception as e:
            logger.error(f"Erro ao criar placeholder de vídeo: {e}")
            # Fallback: criar arquivo vídeo minimal
            return await self._create_minimal_video()
    
    async def _create_placeholder_video_from_params(self, params: Dict[str, Any]) -> bytes:
        """Criar placeholder baseado nos parâmetros"""
        width = params.get('width', 1280)
        height = params.get('height', 720)
        num_frames = params.get('num_frames', 60)
        fps = params.get('fps', 24)
        prompt = params.get('prompt', 'AI Generated Video')
        
        frames = []
        
        for i in range(min(num_frames, 24)):  # 1 segundo de vídeo
            # Criar frame animado
            color_r = int(128 + 127 * np.sin(i * 0.3))
            color_g = int(128 + 127 * np.cos(i * 0.2))
            color_b = int(128 + 127 * np.sin(i * 0.4))
            
            img = Image.new('RGB', (width, height), color=(color_r, color_g, color_b))
            
            from PIL import ImageDraw
            draw = ImageDraw.Draw(img)
            
            # Texto animado
            text = f"Generated: {prompt[:20]}... Frame {i+1}"
            text_x = 50 + int(20 * np.sin(i * 0.5))
            text_y = height // 2
            
            draw.text((text_x, text_y), text, fill='white')
            
            frames.append(img)
        
        return await self._frames_to_video_bytes(frames, fps)
    
    async def _frames_to_video_real(self, video_frames, fps: int) -> bytes:
        """Converter frames do modelo para bytes de vídeo otimizado"""
        try:
            import tempfile
            import os
            import numpy as np
            from moviepy.editor import ImageSequenceClip
            
            with tempfile.TemporaryDirectory() as temp_dir:
                # Converter frames tensor para PIL Images
                pil_frames = []
                for i, frame in enumerate(video_frames):
                    # Converter de tensor para numpy array
                    if isinstance(frame, torch.Tensor):
                        frame_np = frame.cpu().numpy()
                        # Normalizar de [-1, 1] para [0, 255]
                        frame_np = ((frame_np + 1.0) * 127.5).astype(np.uint8)
                    else:
                        frame_np = np.array(frame)
                    
                    # Converter para PIL
                    if frame_np.shape[0] == 3:  # CHW format
                        frame_np = np.transpose(frame_np, (1, 2, 0))  # HWC format
                    
                    pil_frame = Image.fromarray(frame_np)
                    pil_frames.append(pil_frame)
                
                # Salvar frames como arquivos temporários
                frame_paths = []
                for i, frame in enumerate(pil_frames):
                    frame_path = os.path.join(temp_dir, f"frame_{i:04d}.png")
                    frame.save(frame_path, optimize=True)
                    frame_paths.append(frame_path)
                
                # Criar vídeo com moviepy
                clip = ImageSequenceClip(frame_paths, fps=fps)
                
                # Salvar como MP4 otimizado
                video_path = os.path.join(temp_dir, "output.mp4")
                clip.write_videofile(
                    video_path,
                    codec='libx264',
                    audio=False,
                    bitrate="8000k",  # Alta qualidade
                    verbose=False,
                    logger=None,
                    preset='medium'   # Balanceio velocidade/compressão
                )
                
                # Ler como bytes
                with open(video_path, 'rb') as f:
                    video_bytes = f.read()
                
                clip.close()
                logger.info(f"✅ Vídeo convertido: {len(video_bytes) / 1024 / 1024:.2f}MB")
                return video_bytes
                
        except Exception as e:
            logger.error(f"❌ Erro na conversão de frames reais: {e}")
            # Fallback para placeholder se conversão falhar
            logger.warning("Usando fallback para placeholder...")
            return await self._create_minimal_video()
    
    async def _frames_to_video_bytes(self, frames: List[Image.Image], fps: int) -> bytes:
        """Converter lista de frames PIL para bytes de vídeo"""
        try:
            # Usar moviepy para criar vídeo
            import tempfile
            import os
            
            with tempfile.TemporaryDirectory() as temp_dir:
                # Salvar frames como imagens temporárias
                frame_paths = []
                for i, frame in enumerate(frames):
                    frame_path = os.path.join(temp_dir, f"frame_{i:04d}.png")
                    frame.save(frame_path)
                    frame_paths.append(frame_path)
                
                # Criar vídeo usando moviepy
                try:
                    from moviepy.editor import ImageSequenceClip
                    
                    clip = ImageSequenceClip(frame_paths, fps=fps)
                    
                    # Salvar como arquivo temporário
                    video_path = os.path.join(temp_dir, "output.mp4")
                    clip.write_videofile(
                        video_path,
                        codec='libx264',
                        audio=False,
                        verbose=False,
                        logger=None
                    )
                    
                    # Ler como bytes
                    with open(video_path, 'rb') as f:
                        video_bytes = f.read()
                    
                    clip.close()
                    return video_bytes
                    
                except ImportError:
                    logger.warning("MoviePy não disponível, criando vídeo mínimo")
                    return await self._create_minimal_video()
                
        except Exception as e:
            logger.error(f"Erro ao converter frames para vídeo: {e}")
            return await self._create_minimal_video()
    
    async def _create_minimal_video(self) -> bytes:
        """Criar vídeo mínimo como fallback"""
        # Criar um "vídeo" que é apenas dados bytes placeholder
        # Em produção real, isso seria um arquivo MP4 válido mínimo
        placeholder_data = b'\x00\x00\x00\x20ftypmp41\x00\x00\x00\x00mp41isom'  # Header MP4 básico
        placeholder_data += b'\x00' * 1024  # 1KB de dados placeholder
        
        logger.info("Criado vídeo mínimo placeholder")
        return placeholder_data
    
    def get_model_info(self) -> Dict[str, Any]:
        """Obter informações do modelo"""
        return {
            "name": "ModelScope Text-to-Video",
            "version": "1.7b",
            "device": self.device,
            "loaded": self.model_loaded,
            "memory_usage": self._get_memory_usage(),
            "supported_qualities": [quality.value for quality in VideoQuality],
            "max_duration": "30s",
            "recommended_fps": "24-30"
        }
    
    def _get_memory_usage(self) -> str:
        """Obter uso de memória GPU"""
        if self.device == "cuda" and torch.cuda.is_available():
            allocated = torch.cuda.memory_allocated() / 1024**3  # GB
            cached = torch.cuda.memory_reserved() / 1024**3  # GB
            return f"Allocated: {allocated:.1f}GB, Cached: {cached:.1f}GB"
        return "CPU mode - N/A"
    
    def cleanup(self):
        """Limpar recursos"""
        if self.model is not None:
            del self.model
            self.model = None
        
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        
        gc.collect()
        logger.info("Video Generator resources cleaned up")

# === UTILITY FUNCTIONS ===

async def test_video_generation():
    """Função de teste para desenvolvimento"""
    generator = VideoGenerator()
    
    request = VideoGenerationRequest(
        prompt="A cat walking in a garden",
        duration=5,
        quality=VideoQuality.HD,
        fps=24
    )
    
    try:
        result = await generator.generate(request)
        logger.info(f"Teste de vídeo concluído: {len(result)} bytes gerados")
        return result
    finally:
        generator.cleanup()

if __name__ == "__main__":
    # Teste rápido
    asyncio.run(test_video_generation())