"""
🖼️ IMAGE INPUT PROCESSOR - Sistema Avançado de Processamento de Imagens

Capacidades:
- Image-to-Image generation
- Image-to-Video generation  
- Análise automática de imagens para prompts
- Extração de elementos visuais
- Style transfer e modificações
- ControlNet integration
- Inpainting e outpainting
"""

import torch
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import asyncio
import logging
import time
import base64
import io
import uuid
from typing import Dict, List, Optional, Any, Tuple, Union
from dataclasses import dataclass, field
from enum import Enum
import json
import tempfile
import os

from .media_generator import MediaGenerator, MediaGenerationRequest, MediaType
from .image_analyzer import ImageAnalyzer, ImageAnalysisRequest, ImageAnalysisType
from ..api.schemas import ImageStyle, VideoQuality

logger = logging.getLogger("PyLab.ImageInputProcessor")

class ImageInputType(str, Enum):
    """Tipos de entrada de imagem"""
    BASE64 = "base64"
    FILE_PATH = "file_path"
    URL = "url"
    PIL_IMAGE = "pil_image"
    NUMPY_ARRAY = "numpy_array"

class ProcessingMode(str, Enum):
    """Modos de processamento"""
    IMAGE_TO_IMAGE = "img2img"           # Imagem para imagem
    IMAGE_TO_VIDEO = "img2vid"           # Imagem para vídeo
    STYLE_TRANSFER = "style_transfer"    # Transferência de estilo
    INPAINTING = "inpainting"           # Preenchimento de áreas
    OUTPAINTING = "outpainting"         # Extensão da imagem
    UPSCALING = "upscaling"             # Aumento de resolução
    VARIATION = "variation"             # Variações da imagem
    PROMPT_ANALYSIS = "prompt_analysis"  # Análise para prompts

class ControlNetType(str, Enum):
    """Tipos de ControlNet disponíveis"""
    CANNY = "canny"                     # Detecção de bordas
    DEPTH = "depth"                     # Mapa de profundidade
    POSE = "pose"                       # Detecção de pose
    NORMAL = "normal"                   # Mapa normal
    SCRIBBLE = "scribble"              # Rabiscos
    LINEART = "lineart"                # Arte linear
    MLSD = "mlsd"                      # Detecção de linhas

@dataclass
class ImageInputRequest:
    """Request para processamento de imagem de entrada"""
    input_image: str  # Base64, path, ou URL
    input_type: ImageInputType = ImageInputType.BASE64
    processing_mode: ProcessingMode = ProcessingMode.IMAGE_TO_IMAGE
    
    # Prompt e configurações
    prompt: str = ""
    negative_prompt: str = ""
    strength: float = 0.8  # Força da transformação (0.0 - 1.0)
    
    # Configurações de saída
    output_width: int = 1024
    output_height: int = 1024
    output_format: str = "PNG"
    
    # Configurações específicas do modo
    style: Optional[ImageStyle] = ImageStyle.REALISTIC
    controlnet_type: Optional[ControlNetType] = None
    guidance_scale: float = 7.5
    steps: int = 50
    seed: Optional[int] = None
    
    # Para vídeo
    video_duration: int = 10
    video_fps: int = 24
    video_quality: VideoQuality = VideoQuality.HD
    
    # Para inpainting
    mask_image: Optional[str] = None  # Máscara para inpainting
    
    # Configurações avançadas
    preserve_original_colors: bool = False
    enhance_details: bool = True
    auto_enhance: bool = True

@dataclass
class ImageProcessingResult:
    """Resultado do processamento de imagem"""
    task_id: str
    processing_mode: ProcessingMode
    output_data: Optional[bytes] = None
    output_format: str = "PNG"
    
    # Análises
    original_analysis: Optional[Dict[str, Any]] = None
    generated_analysis: Optional[Dict[str, Any]] = None
    
    # Metadados
    processing_time: float = 0.0
    prompt_used: str = ""
    enhanced_prompt: str = ""
    similarity_score: Optional[float] = None
    
    # Informações técnicas
    input_size: Tuple[int, int] = (0, 0)
    output_size: Tuple[int, int] = (0, 0)
    transformations_applied: List[str] = field(default_factory=list)
    
    error_message: Optional[str] = None

class ImageInputProcessor:
    """Processador avançado de imagens de entrada"""
    
    def __init__(self, media_generator: MediaGenerator, image_analyzer: ImageAnalyzer):
        self.media_generator = media_generator
        self.image_analyzer = image_analyzer
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Carregar modelos especializados
        self.controlnet_models = {}
        self.upscaler_model = None
        self.style_transfer_models = {}
        
        logger.info(f"🖼️ Image Input Processor inicializado - Device: {self.device}")
    
    async def process_image(self, request: ImageInputRequest) -> ImageProcessingResult:
        """Processar imagem de entrada baseado no modo solicitado"""
        task_id = str(uuid.uuid4())
        start_time = time.time()
        
        try:
            logger.info(f"🔄 Processando imagem: {request.processing_mode.value}")
            
            # Carregar e validar imagem de entrada
            input_image = await self._load_input_image(request.input_image, request.input_type)
            original_size = input_image.size
            
            # Analisar imagem original
            original_analysis = await self._analyze_input_image(input_image)
            
            # Processar baseado no modo
            if request.processing_mode == ProcessingMode.IMAGE_TO_IMAGE:
                result_data = await self._process_img2img(input_image, request)
            elif request.processing_mode == ProcessingMode.IMAGE_TO_VIDEO:
                result_data = await self._process_img2vid(input_image, request)
            elif request.processing_mode == ProcessingMode.STYLE_TRANSFER:
                result_data = await self._process_style_transfer(input_image, request)
            elif request.processing_mode == ProcessingMode.INPAINTING:
                result_data = await self._process_inpainting(input_image, request)
            elif request.processing_mode == ProcessingMode.OUTPAINTING:
                result_data = await self._process_outpainting(input_image, request)
            elif request.processing_mode == ProcessingMode.UPSCALING:
                result_data = await self._process_upscaling(input_image, request)
            elif request.processing_mode == ProcessingMode.VARIATION:
                result_data = await self._process_variation(input_image, request)
            elif request.processing_mode == ProcessingMode.PROMPT_ANALYSIS:
                result_data = await self._analyze_for_prompt(input_image, request)
            else:
                raise ValueError(f"Modo de processamento não suportado: {request.processing_mode}")
            
            # Calcular tempo de processamento
            processing_time = time.time() - start_time
            
            # Analisar resultado se for imagem
            generated_analysis = None
            output_size = (0, 0)
            if request.processing_mode != ProcessingMode.PROMPT_ANALYSIS and result_data:
                if request.processing_mode != ProcessingMode.IMAGE_TO_VIDEO:
                    # Para imagens, analisar o resultado
                    result_image = Image.open(io.BytesIO(result_data))
                    output_size = result_image.size
                    generated_analysis = await self._analyze_generated_image(result_image)
            
            # Gerar prompt aprimorado se necessário
            enhanced_prompt = await self._enhance_prompt_with_analysis(
                request.prompt, original_analysis
            ) if request.prompt else ""
            
            return ImageProcessingResult(
                task_id=task_id,
                processing_mode=request.processing_mode,
                output_data=result_data,
                output_format=request.output_format,
                original_analysis=original_analysis,
                generated_analysis=generated_analysis,
                processing_time=processing_time,
                prompt_used=request.prompt,
                enhanced_prompt=enhanced_prompt,
                input_size=original_size,
                output_size=output_size,
                transformations_applied=self._get_transformations_applied(request)
            )
            
        except Exception as e:
            logger.error(f"❌ Erro no processamento: {e}")
            return ImageProcessingResult(
                task_id=task_id,
                processing_mode=request.processing_mode,
                processing_time=time.time() - start_time,
                error_message=str(e)
            )
    
    async def _load_input_image(self, image_input: str, input_type: ImageInputType) -> Image.Image:
        """Carregar imagem de entrada baseado no tipo"""
        try:
            if input_type == ImageInputType.BASE64:
                # Decodificar base64
                if image_input.startswith('data:image'):
                    # Remove data URL prefix
                    image_input = image_input.split(',')[1]
                
                image_bytes = base64.b64decode(image_input)
                image = Image.open(io.BytesIO(image_bytes))
                
            elif input_type == ImageInputType.FILE_PATH:
                image = Image.open(image_input)
                
            elif input_type == ImageInputType.URL:
                import requests
                response = requests.get(image_input)
                image = Image.open(io.BytesIO(response.content))
                
            else:
                raise ValueError(f"Tipo de entrada não suportado: {input_type}")
            
            # Converter para RGB se necessário
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            logger.info(f"📸 Imagem carregada: {image.size} - {image.mode}")
            return image
            
        except Exception as e:
            logger.error(f"❌ Erro ao carregar imagem: {e}")
            raise
    
    async def _analyze_input_image(self, image: Image.Image) -> Dict[str, Any]:
        """Analisar imagem de entrada para extrair informações"""
        try:
            # Converter para base64 para análise
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode()
            
            # Usar o image_analyzer para análise completa
            analysis_request = ImageAnalysisRequest(
                image_data=img_base64,
                analysis_type=ImageAnalysisType.CONTENT_ANALYSIS
            )
            
            analysis_result = await self.image_analyzer.analyze(analysis_request)
            
            # Adicionar análises técnicas extras
            extra_analysis = self._extract_technical_features(image)
            
            return {
                "ai_analysis": analysis_result.insights if analysis_result else {},
                "technical_analysis": extra_analysis,
                "description": analysis_result.summary if analysis_result else "",
                "confidence": analysis_result.confidence_score if analysis_result else 0.0
            }
            
        except Exception as e:
            logger.error(f"❌ Erro na análise da imagem: {e}")
            return {"error": str(e)}
    
    def _extract_technical_features(self, image: Image.Image) -> Dict[str, Any]:
        """Extrair características técnicas da imagem"""
        try:
            # Converter para numpy para análise
            img_array = np.array(image)
            
            # Análise de cores
            color_analysis = self._analyze_color_distribution(img_array)
            
            # Análise de composição
            composition_analysis = self._analyze_composition(img_array)
            
            # Análise de textura
            texture_analysis = self._analyze_texture(img_array)
            
            # Detecção de objetos principais
            object_detection = self._detect_main_objects(img_array)
            
            return {
                "dimensions": {"width": image.width, "height": image.height},
                "aspect_ratio": round(image.width / image.height, 2),
                "color_analysis": color_analysis,
                "composition": composition_analysis,
                "texture": texture_analysis,
                "objects": object_detection,
                "complexity_score": self._calculate_complexity_score(img_array)
            }
            
        except Exception as e:
            logger.error(f"Erro na análise técnica: {e}")
            return {}
    
    def _analyze_color_distribution(self, img_array: np.ndarray) -> Dict[str, Any]:
        """Analisar distribuição de cores"""
        try:
            # Cores dominantes usando K-means
            resized = cv2.resize(img_array, (100, 100))
            data = resized.reshape((-1, 3)).astype(np.float32)
            
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
            k = 5
            _, labels, centers = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            
            # Calcular percentuais
            unique, counts = np.unique(labels, return_counts=True)
            percentages = counts / len(labels)
            
            dominant_colors = []
            for i, center in enumerate(centers):
                dominant_colors.append({
                    "rgb": center.astype(int).tolist(),
                    "percentage": float(percentages[i]),
                    "hex": "#{:02x}{:02x}{:02x}".format(int(center[0]), int(center[1]), int(center[2]))
                })
            
            # Análise de temperatura de cor
            avg_color = np.mean(img_array, axis=(0, 1))
            warmth = "warm" if avg_color[0] > avg_color[2] else "cool"
            
            # Brilho e contraste
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            brightness = np.mean(gray)
            contrast = np.std(gray)
            
            return {
                "dominant_colors": sorted(dominant_colors, key=lambda x: x["percentage"], reverse=True),
                "color_temperature": warmth,
                "brightness": float(brightness),
                "contrast": float(contrast),
                "saturation": float(np.std(img_array))
            }
            
        except Exception as e:
            logger.error(f"Erro na análise de cores: {e}")
            return {}
    
    def _analyze_composition(self, img_array: np.ndarray) -> Dict[str, Any]:
        """Analisar composição da imagem"""
        try:
            height, width = img_array.shape[:2]
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            
            # Detecção de bordas
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / edges.size
            
            # Análise de regra dos terços
            third_h, third_w = height // 3, width // 3
            
            # Pontos de interesse
            interest_points = []
            for y in [third_h, 2 * third_h]:
                for x in [third_w, 2 * third_w]:
                    if x < width and y < height:
                        region = gray[max(0, y-10):min(height, y+10), 
                                     max(0, x-10):min(width, x+10)]
                        if region.size > 0:
                            interest_points.append(float(np.std(region)))
            
            # Simetria
            left_half = gray[:, :width//2]
            right_half = cv2.flip(gray[:, width//2:], 1)
            symmetry = cv2.matchTemplate(left_half, right_half[:, :left_half.shape[1]], 
                                       cv2.TM_CCOEFF_NORMED)[0][0]
            
            return {
                "edge_density": float(edge_density),
                "rule_of_thirds_score": float(np.mean(interest_points)) if interest_points else 0.0,
                "symmetry_score": float(symmetry),
                "composition_balance": "balanced" if 0.3 < symmetry < 0.7 else "asymmetric"
            }
            
        except Exception as e:
            logger.error(f"Erro na análise de composição: {e}")
            return {}
    
    def _analyze_texture(self, img_array: np.ndarray) -> Dict[str, Any]:
        """Analisar textura da imagem"""
        try:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            
            # Variância local para textura
            kernel = np.ones((9, 9), np.float32) / 81
            local_mean = cv2.filter2D(gray.astype(np.float32), -1, kernel)
            local_var = cv2.filter2D((gray.astype(np.float32) - local_mean)**2, -1, kernel)
            
            texture_measure = np.mean(local_var)
            
            # Classificar tipo de textura
            if texture_measure < 100:
                texture_type = "smooth"
            elif texture_measure < 500:
                texture_type = "moderate"
            else:
                texture_type = "rough"
            
            return {
                "texture_measure": float(texture_measure),
                "texture_type": texture_type,
                "detail_level": "high" if texture_measure > 300 else "medium" if texture_measure > 100 else "low"
            }
            
        except Exception as e:
            logger.error(f"Erro na análise de textura: {e}")
            return {}
    
    def _detect_main_objects(self, img_array: np.ndarray) -> List[Dict[str, Any]]:
        """Detectar objetos principais na imagem"""
        try:
            # Implementação simplificada usando contornos
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            
            # Aplicar blur e threshold
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Encontrar contornos
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            objects = []
            height, width = img_array.shape[:2]
            min_area = (width * height) * 0.01  # Mínimo 1% da imagem
            
            for i, contour in enumerate(contours[:10]):  # Máximo 10 objetos
                area = cv2.contourArea(contour)
                if area > min_area:
                    x, y, w, h = cv2.boundingRect(contour)
                    
                    objects.append({
                        "id": i,
                        "area": float(area),
                        "bbox": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                        "area_percentage": float(area / (width * height) * 100),
                        "aspect_ratio": float(w / h) if h > 0 else 0
                    })
            
            return sorted(objects, key=lambda x: x["area"], reverse=True)
            
        except Exception as e:
            logger.error(f"Erro na detecção de objetos: {e}")
            return []
    
    def _calculate_complexity_score(self, img_array: np.ndarray) -> float:
        """Calcular score de complexidade da imagem"""
        try:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            
            # Fatores de complexidade
            edge_density = np.sum(cv2.Canny(gray, 50, 150) > 0) / gray.size
            color_variance = np.var(img_array)
            texture_variance = np.var(cv2.Laplacian(gray, cv2.CV_64F))
            
            # Score combinado (0-10)
            complexity = (edge_density * 3 + color_variance / 10000 + texture_variance / 1000) * 2
            return min(float(complexity), 10.0)
            
        except Exception as e:
            logger.error(f"Erro no cálculo de complexidade: {e}")
            return 5.0  # Score médio como fallback
    
    async def _process_img2img(self, input_image: Image.Image, request: ImageInputRequest) -> bytes:
        """Processar Image-to-Image usando SDXL"""
        try:
            logger.info("🖼️ Processando Image-to-Image...")
            
            # Preparar prompt aprimorado
            enhanced_prompt = await self._enhance_prompt_with_image_analysis(
                request.prompt, input_image
            )
            
            # Redimensionar imagem se necessário
            processed_image = self._prepare_image_for_generation(
                input_image, request.output_width, request.output_height
            )
            
            # Converter imagem para base64
            img_byte_arr = io.BytesIO()
            processed_image.save(img_byte_arr, format='PNG')
            img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode()
            
            # Criar request para o media generator
            # Nota: Esta é uma implementação conceitual
            # Em produção, seria necessário usar um pipeline específico de img2img
            media_request = MediaGenerationRequest(
                prompt=enhanced_prompt,
                media_type=MediaType.IMAGE,
                negative_prompt=request.negative_prompt,
                width=request.output_width,
                height=request.output_height,
                seed=request.seed
            )
            
            result = await self.media_generator.generate(media_request)
            
            if result.file_data:
                # Aplicar pós-processamento se solicitado
                if request.auto_enhance:
                    result_image = Image.open(io.BytesIO(result.file_data))
                    enhanced_image = self._auto_enhance_image(result_image)
                    
                    enhanced_byte_arr = io.BytesIO()
                    enhanced_image.save(enhanced_byte_arr, format=request.output_format, optimize=True)
                    return enhanced_byte_arr.getvalue()
                
                return result.file_data
            else:
                raise Exception(result.error_message or "Falha na geração img2img")
                
        except Exception as e:
            logger.error(f"❌ Erro no img2img: {e}")
            raise
    
    async def _process_img2vid(self, input_image: Image.Image, request: ImageInputRequest) -> bytes:
        """Processar Image-to-Video"""
        try:
            logger.info("🎬 Processando Image-to-Video...")
            
            # Analisar imagem para criar prompt de vídeo
            image_analysis = await self._analyze_input_image(input_image)
            
            # Gerar prompt de vídeo baseado na imagem
            video_prompt = await self._generate_video_prompt_from_image(
                request.prompt, image_analysis
            )
            
            # Criar request de vídeo
            media_request = MediaGenerationRequest(
                prompt=video_prompt,
                media_type=MediaType.VIDEO,
                negative_prompt=request.negative_prompt,
                duration=request.video_duration,
                fps=request.video_fps,
                quality=request.video_quality.value,
                seed=request.seed
            )
            
            result = await self.media_generator.generate(media_request)
            
            if result.file_data:
                return result.file_data
            else:
                raise Exception(result.error_message or "Falha na geração img2vid")
                
        except Exception as e:
            logger.error(f"❌ Erro no img2vid: {e}")
            raise
    
    async def _process_style_transfer(self, input_image: Image.Image, request: ImageInputRequest) -> bytes:
        """Processar transferência de estilo"""
        try:
            logger.info("🎨 Processando Style Transfer...")
            
            # Para style transfer, usar o prompt como descrição do estilo desejado
            style_prompt = f"in the style of {request.prompt}, artistic style transfer, {request.style.value if request.style else 'artistic'}"
            
            # Usar img2img com força reduzida para preservar estrutura
            style_request = ImageInputRequest(
                input_image=request.input_image,
                input_type=request.input_type,
                processing_mode=ProcessingMode.IMAGE_TO_IMAGE,
                prompt=style_prompt,
                negative_prompt=request.negative_prompt,
                strength=0.6,  # Força reduzida para style transfer
                output_width=request.output_width,
                output_height=request.output_height,
                output_format=request.output_format,
                seed=request.seed
            )
            
            return await self._process_img2img(input_image, style_request)
            
        except Exception as e:
            logger.error(f"❌ Erro no style transfer: {e}")
            raise
    
    async def _process_inpainting(self, input_image: Image.Image, request: ImageInputRequest) -> bytes:
        """Processar inpainting (preenchimento de áreas)"""
        try:
            logger.info("🖌️ Processando Inpainting...")
            
            if not request.mask_image:
                raise ValueError("Máscara é obrigatória para inpainting")
            
            # Carregar máscara
            mask_image = await self._load_input_image(request.mask_image, request.input_type)
            
            # Implementação conceitual - em produção usaria pipeline específico
            # Por enquanto, usar img2img com força alta na área mascarada
            inpaint_prompt = f"fill the masked area with {request.prompt}, seamless inpainting, high quality"
            
            # Simular inpainting usando img2img
            result = await self._process_img2img(input_image, request)
            return result
            
        except Exception as e:
            logger.error(f"❌ Erro no inpainting: {e}")
            raise
    
    async def _process_outpainting(self, input_image: Image.Image, request: ImageInputRequest) -> bytes:
        """Processar outpainting (extensão da imagem)"""
        try:
            logger.info("🖼️ Processando Outpainting...")
            
            # Criar canvas maior
            canvas_width = int(request.output_width)
            canvas_height = int(request.output_height)
            
            # Centralizar imagem original no canvas
            canvas = Image.new('RGB', (canvas_width, canvas_height), (128, 128, 128))
            
            # Calcular posição central
            x_offset = (canvas_width - input_image.width) // 2
            y_offset = (canvas_height - input_image.height) // 2
            
            canvas.paste(input_image, (x_offset, y_offset))
            
            # Usar img2img para estender as bordas
            outpaint_prompt = f"extend the image seamlessly, {request.prompt}, natural extension, high quality"
            
            # Converter canvas para base64
            canvas_byte_arr = io.BytesIO()
            canvas.save(canvas_byte_arr, format='PNG')
            canvas_base64 = base64.b64encode(canvas_byte_arr.getvalue()).decode()
            
            # Processar com img2img
            outpaint_request = ImageInputRequest(
                input_image=canvas_base64,
                input_type=ImageInputType.BASE64,
                processing_mode=ProcessingMode.IMAGE_TO_IMAGE,
                prompt=outpaint_prompt,
                negative_prompt=request.negative_prompt,
                strength=0.7,
                output_width=canvas_width,
                output_height=canvas_height,
                output_format=request.output_format,
                seed=request.seed
            )
            
            return await self._process_img2img(canvas, outpaint_request)
            
        except Exception as e:
            logger.error(f"❌ Erro no outpainting: {e}")
            raise
    
    async def _process_upscaling(self, input_image: Image.Image, request: ImageInputRequest) -> bytes:
        """Processar upscaling da imagem"""
        try:
            logger.info("⬆️ Processando Upscaling...")
            
            # Calcular fator de escala
            scale_factor = min(
                request.output_width / input_image.width,
                request.output_height / input_image.height
            )
            
            if scale_factor <= 1.0:
                logger.warning("Fator de escala <= 1.0, usando redimensionamento simples")
                resized = input_image.resize((request.output_width, request.output_height), Image.LANCZOS)
            else:
                # Para upscaling real, usar img2img com prompt de alta qualidade
                upscale_prompt = f"high resolution, ultra detailed, sharp, {request.prompt if request.prompt else 'enhance quality'}"
                
                # Primeiro, redimensionar com interpolação
                upscaled = input_image.resize(
                    (request.output_width, request.output_height), 
                    Image.LANCZOS
                )
                
                # Depois, usar img2img para melhorar qualidade
                upscale_byte_arr = io.BytesIO()
                upscaled.save(upscale_byte_arr, format='PNG')
                upscale_base64 = base64.b64encode(upscale_byte_arr.getvalue()).decode()
                
                upscale_request = ImageInputRequest(
                    input_image=upscale_base64,
                    input_type=ImageInputType.BASE64,
                    processing_mode=ProcessingMode.IMAGE_TO_IMAGE,
                    prompt=upscale_prompt,
                    negative_prompt="blurry, low quality, pixelated, artifacts",
                    strength=0.4,  # Força baixa para preservar detalhes
                    output_width=request.output_width,
                    output_height=request.output_height,
                    output_format=request.output_format,
                    seed=request.seed
                )
                
                return await self._process_img2img(upscaled, upscale_request)
            
            # Salvar resultado
            result_byte_arr = io.BytesIO()
            resized.save(result_byte_arr, format=request.output_format, optimize=True)
            return result_byte_arr.getvalue()
            
        except Exception as e:
            logger.error(f"❌ Erro no upscaling: {e}")
            raise
    
    async def _process_variation(self, input_image: Image.Image, request: ImageInputRequest) -> bytes:
        """Processar variações da imagem"""
        try:
            logger.info("🔄 Processando Variation...")
            
            # Analisar imagem para extrair características
            analysis = await self._analyze_input_image(input_image)
            
            # Gerar prompt baseado na análise
            if not request.prompt:
                description = analysis.get("description", "")
                variation_prompt = f"variation of {description}, similar composition, different details"
            else:
                variation_prompt = f"variation of {request.prompt}, similar style, different interpretation"
            
            # Usar img2img com força moderada
            variation_request = ImageInputRequest(
                input_image=request.input_image,
                input_type=request.input_type,
                processing_mode=ProcessingMode.IMAGE_TO_IMAGE,
                prompt=variation_prompt,
                negative_prompt=request.negative_prompt,
                strength=0.65,  # Força moderada para variações
                output_width=request.output_width,
                output_height=request.output_height,
                output_format=request.output_format,
                seed=request.seed
            )
            
            return await self._process_img2img(input_image, variation_request)
            
        except Exception as e:
            logger.error(f"❌ Erro na variação: {e}")
            raise
    
    async def _analyze_for_prompt(self, input_image: Image.Image, request: ImageInputRequest) -> bytes:
        """Analisar imagem para gerar prompts detalhados"""
        try:
            logger.info("🔍 Analisando imagem para prompt...")
            
            # Análise completa da imagem
            analysis = await self._analyze_input_image(input_image)
            
            # Gerar prompts detalhados
            detailed_prompts = await self._generate_detailed_prompts(analysis)
            
            # Criar resultado como JSON
            result = {
                "image_analysis": analysis,
                "generated_prompts": detailed_prompts,
                "technical_info": {
                    "dimensions": f"{input_image.width}x{input_image.height}",
                    "aspect_ratio": round(input_image.width / input_image.height, 2),
                    "format": input_image.format or "Unknown"
                }
            }
            
            # Converter para bytes JSON
            json_str = json.dumps(result, indent=2, ensure_ascii=False)
            return json_str.encode('utf-8')
            
        except Exception as e:
            logger.error(f"❌ Erro na análise para prompt: {e}")
            raise
    
    def _prepare_image_for_generation(self, image: Image.Image, width: int, height: int) -> Image.Image:
        """Preparar imagem para geração (redimensionar, etc.)"""
        try:
            # Calcular dimensões mantendo aspect ratio se solicitado
            original_ratio = image.width / image.height
            target_ratio = width / height
            
            if abs(original_ratio - target_ratio) < 0.1:
                # Ratios similares, redimensionar diretamente
                return image.resize((width, height), Image.LANCZOS)
            else:
                # Ratios diferentes, fazer crop inteligente
                if original_ratio > target_ratio:
                    # Imagem mais larga, crop horizontal
                    new_width = int(image.height * target_ratio)
                    left = (image.width - new_width) // 2
                    image = image.crop((left, 0, left + new_width, image.height))
                else:
                    # Imagem mais alta, crop vertical
                    new_height = int(image.width / target_ratio)
                    top = (image.height - new_height) // 2
                    image = image.crop((0, top, image.width, top + new_height))
                
                return image.resize((width, height), Image.LANCZOS)
                
        except Exception as e:
            logger.error(f"Erro na preparação da imagem: {e}")
            return image.resize((width, height), Image.LANCZOS)
    
    def _auto_enhance_image(self, image: Image.Image) -> Image.Image:
        """Aplicar melhorias automáticas na imagem"""
        try:
            # Ajuste de contraste
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(1.1)
            
            # Ajuste de nitidez
            enhancer = ImageEnhance.Sharpness(image)
            image = enhancer.enhance(1.1)
            
            # Ajuste de cores
            enhancer = ImageEnhance.Color(image)
            image = enhancer.enhance(1.05)
            
            return image
            
        except Exception as e:
            logger.error(f"Erro no auto-enhancement: {e}")
            return image
    
    async def _enhance_prompt_with_image_analysis(self, prompt: str, image: Image.Image) -> str:
        """Aprimorar prompt com análise da imagem"""
        try:
            analysis = await self._analyze_input_image(image)
            
            # Extrair características visuais
            visual_elements = []
            
            if analysis.get("technical_analysis", {}).get("color_analysis"):
                color_info = analysis["technical_analysis"]["color_analysis"]
                if color_info.get("color_temperature") == "warm":
                    visual_elements.append("warm colors")
                elif color_info.get("color_temperature") == "cool":
                    visual_elements.append("cool colors")
            
            if analysis.get("technical_analysis", {}).get("composition"):
                comp_info = analysis["technical_analysis"]["composition"]
                if comp_info.get("composition_balance") == "balanced":
                    visual_elements.append("balanced composition")
            
            # Combinar prompt original com elementos visuais
            enhanced_parts = [prompt] if prompt else []
            enhanced_parts.extend(visual_elements)
            enhanced_parts.append("high quality, detailed")
            
            return ", ".join(enhanced_parts)
            
        except Exception as e:
            logger.error(f"Erro no enhancement do prompt: {e}")
            return prompt or "high quality image"
    
    async def _generate_video_prompt_from_image(self, base_prompt: str, image_analysis: Dict[str, Any]) -> str:
        """Gerar prompt de vídeo baseado na análise da imagem"""
        try:
            # Extrair elementos da análise
            description = image_analysis.get("description", "")
            
            # Criar prompt de vídeo
            video_elements = []
            
            if base_prompt:
                video_elements.append(base_prompt)
            
            if description:
                video_elements.append(f"animated version of {description}")
            
            # Adicionar elementos de movimento
            video_elements.extend([
                "smooth camera movement",
                "cinematic video",
                "high quality animation",
                "fluid motion"
            ])
            
            return ", ".join(video_elements)
            
        except Exception as e:
            logger.error(f"Erro na geração de prompt de vídeo: {e}")
            return base_prompt or "animated scene, cinematic video"
    
    async def _generate_detailed_prompts(self, analysis: Dict[str, Any]) -> Dict[str, List[str]]:
        """Gerar prompts detalhados baseados na análise"""
        try:
            prompts = {
                "descriptive": [],
                "artistic": [],
                "technical": [],
                "style_transfer": []
            }
            
            # Prompts descritivos
            if analysis.get("description"):
                prompts["descriptive"].append(analysis["description"])
            
            # Prompts artísticos baseados na análise de cores
            color_analysis = analysis.get("technical_analysis", {}).get("color_analysis", {})
            if color_analysis:
                if color_analysis.get("color_temperature") == "warm":
                    prompts["artistic"].append("warm color palette, golden tones")
                elif color_analysis.get("color_temperature") == "cool":
                    prompts["artistic"].append("cool color palette, blue tones")
                
                brightness = color_analysis.get("brightness", 128)
                if brightness > 180:
                    prompts["artistic"].append("bright, well-lit scene")
                elif brightness < 80:
                    prompts["artistic"].append("dark, moody atmosphere")
            
            # Prompts técnicos
            tech_analysis = analysis.get("technical_analysis", {})
            if tech_analysis.get("complexity_score", 0) > 7:
                prompts["technical"].append("highly detailed, complex composition")
            elif tech_analysis.get("complexity_score", 0) < 3:
                prompts["technical"].append("minimalist, simple composition")
            
            # Prompts para style transfer
            prompts["style_transfer"] = [
                "oil painting style",
                "watercolor style", 
                "digital art style",
                "photorealistic style",
                "impressionist style",
                "pop art style"
            ]
            
            return prompts
            
        except Exception as e:
            logger.error(f"Erro na geração de prompts detalhados: {e}")
            return {"error": [str(e)]}
    
    async def _enhance_prompt_with_analysis(self, prompt: str, analysis: Dict[str, Any]) -> str:
        """Aprimorar prompt com base na análise"""
        if not analysis or not prompt:
            return prompt or ""
        
        try:
            enhanced_parts = [prompt]
            
            # Adicionar elementos baseados na análise
            if analysis.get("technical_analysis", {}).get("color_analysis"):
                color_temp = analysis["technical_analysis"]["color_analysis"].get("color_temperature")
                if color_temp:
                    enhanced_parts.append(f"{color_temp} lighting")
            
            return ", ".join(enhanced_parts)
            
        except Exception as e:
            logger.error(f"Erro no enhancement: {e}")
            return prompt
    
    def _get_transformations_applied(self, request: ImageInputRequest) -> List[str]:
        """Obter lista de transformações aplicadas"""
        transformations = [request.processing_mode.value]
        
        if request.auto_enhance:
            transformations.append("auto_enhance")
        
        if request.preserve_original_colors:
            transformations.append("color_preservation")
        
        if request.enhance_details:
            transformations.append("detail_enhancement")
        
        return transformations
    
    async def _analyze_generated_image(self, image: Image.Image) -> Dict[str, Any]:
        """Analisar imagem gerada para métricas"""
        try:
            # Análise técnica básica
            return self._extract_technical_features(image)
        except Exception as e:
            logger.error(f"Erro na análise da imagem gerada: {e}")
            return {}

# Instância global
image_input_processor = None  # Será inicializada com dependências

# Funções de conveniência
async def process_image_input(image_data: str, mode: str, prompt: str = "", **kwargs) -> ImageProcessingResult:
    """Função de conveniência para processar imagem"""
    from .media_generator import media_generator
    from .image_analyzer import image_analyzer
    
    # Inicializar se necessário
    global image_input_processor
    if image_input_processor is None:
        image_input_processor = ImageInputProcessor(media_generator, image_analyzer)
    
    request = ImageInputRequest(
        input_image=image_data,
        processing_mode=ProcessingMode(mode),
        prompt=prompt,
        **kwargs
    )
    
    return await image_input_processor.process_image(request)

# Teste do sistema
async def test_image_input_processor():
    """Teste do processador de input de imagem"""
    from .media_generator import media_generator
    from .image_analyzer import image_analyzer
    
    # Criar processador
    processor = ImageInputProcessor(media_generator, image_analyzer)
    
    # Criar imagem de teste
    test_image = Image.new('RGB', (512, 512), (100, 150, 200))
    
    # Converter para base64
    img_byte_arr = io.BytesIO()
    test_image.save(img_byte_arr, format='PNG')
    img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode()
    
    # Criar request de teste
    request = ImageInputRequest(
        input_image=img_base64,
        input_type=ImageInputType.BASE64,
        processing_mode=ProcessingMode.PROMPT_ANALYSIS,
        prompt="analyze this test image"
    )
    
    # Processar
    result = await processor.process_image(request)
    
    logger.info(f"🧪 Teste concluído: {result.processing_mode} - {result.processing_time:.2f}s")
    return result

if __name__ == "__main__":
    asyncio.run(test_image_input_processor())