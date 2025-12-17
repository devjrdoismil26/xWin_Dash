"""
🤖 PyLab - Image Generator
Geração de imagens usando Stable Diffusion XL
"""

import torch
import logging
import asyncio
import time
from typing import Optional, Dict, Any, List
from PIL import Image
import io
import gc

from ..api.schemas import ImageGenerationRequest, ImageStyle

logger = logging.getLogger("PyLab.ImageGenerator")

class ImageGenerator:
    """Gerador de imagens usando Stable Diffusion XL"""
    
    def __init__(self):
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_loaded = False
        self.model_name = "stabilityai/stable-diffusion-xl-base-1.0"
        
        logger.info(f"Image Generator inicializado - Device: {self.device}")
        
        # Não carregar modelo imediatamente (lazy loading)
        # self._load_model()
    
    async def generate(self, request: ImageGenerationRequest) -> bytes:
        """
        Gerar imagem baseada no request
        
        Args:
            request: Parâmetros de geração
            
        Returns:
            Dados da imagem em bytes
        """
        try:
            start_time = time.time()
            
            logger.info(f"Gerando imagem: {request.prompt[:50]}...")
            logger.info(f"Estilo: {request.style}, Resolução: {request.width}x{request.height}")
            
            # Carregar modelo se necessário
            if not self.model_loaded:
                await self._load_model()
            
            # Preparar prompt baseado no estilo
            enhanced_prompt = self._enhance_prompt(request.prompt, request.style)
            
            # Configurar parâmetros
            generation_params = {
                "prompt": enhanced_prompt,
                "negative_prompt": request.negative_prompt or self._get_default_negative_prompt(),
                "width": request.width,
                "height": request.height,
                "num_inference_steps": request.steps,
                "guidance_scale": request.guidance_scale,
                "num_images_per_prompt": request.batch_size,
            }
            
            # Adicionar seed se fornecida
            if request.seed is not None:
                generator = torch.Generator(device=self.device).manual_seed(request.seed)
                generation_params["generator"] = generator
            
            # Executar geração real com SDXL
            result = await self._run_inference(generation_params)
            
            generation_time = time.time() - start_time
            logger.info(f"Imagem gerada em {generation_time:.2f}s")
            
            return result
            
        except Exception as e:
            logger.error(f"Erro na geração de imagem: {e}")
            raise
    
    async def _load_model(self):
        """Carregar modelo Stable Diffusion XL"""
        try:
            logger.info("🔄 Carregando Stable Diffusion XL...")
            
            # Importar bibliotecas necessárias
            from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler
            
            # Carregar modelo SDXL
            logger.info("📥 Baixando/Carregando Stable Diffusion XL...")
            self.model = StableDiffusionXLPipeline.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                use_safetensors=True,
                variant="fp16" if self.device == "cuda" else None,
                cache_dir="/app/models"
            )
            
            # Usar scheduler otimizado para melhor qualidade
            logger.info("⚙️ Configurando scheduler otimizado...")
            self.model.scheduler = DPMSolverMultistepScheduler.from_config(
                self.model.scheduler.config,
                use_karras_sigmas=True,
                algorithm_type="dpmsolver++"
            )
            
            # Otimizações para GPU
            if self.device == "cuda":
                logger.info("🚀 Aplicando otimizações GPU...")
                self.model = self.model.to(self.device)
                
                # Otimizações de memória
                self.model.enable_attention_slicing()
                self.model.enable_xformers_memory_efficient_attention()
                
                # Para GPUs com menos VRAM, descomente:
                # self.model.enable_sequential_cpu_offload()
                # self.model.enable_model_cpu_offload()
                
                # Compilação para melhor performance (PyTorch 2.0+)
                try:
                    logger.info("⚡ Compilando modelo para melhor performance...")
                    self.model.unet = torch.compile(self.model.unet, mode="reduce-overhead")
                except Exception as compile_error:
                    logger.warning(f"⚠️ Compilação falhou (não crítico): {compile_error}")
            
            # Verificar se modelo foi carregado corretamente
            if hasattr(self.model, 'unet') and self.model.unet is not None:
                self.model_loaded = True
                logger.info("✅ Stable Diffusion XL carregado e otimizado com sucesso!")
                
                # Log de informações do modelo
                if self.device == "cuda":
                    memory_allocated = torch.cuda.memory_allocated() / 1024**3
                    logger.info(f"📊 Memória GPU alocada: {memory_allocated:.2f}GB")
            else:
                raise Exception("Modelo não foi carregado corretamente")
            
        except ImportError as e:
            logger.error(f"❌ Erro de importação - bibliotecas não instaladas: {e}")
            logger.error("💡 Execute: pip install diffusers transformers accelerate")
            raise
        except Exception as e:
            logger.error(f"❌ Erro ao carregar modelo: {e}")
            logger.error("💡 Verifique se há espaço suficiente e conectividade com internet")
            raise
    
    def _enhance_prompt(self, prompt: str, style: ImageStyle) -> str:
        """Melhorar prompt baseado no estilo"""
        style_enhancements = {
            ImageStyle.REALISTIC: "photorealistic, high quality, detailed, 8k resolution",
            ImageStyle.ARTISTIC: "artistic, creative, expressive, masterpiece",
            ImageStyle.ANIME: "anime style, manga style, cel shading, vibrant colors",
            ImageStyle.CONCEPT_ART: "concept art, digital painting, matte painting, dramatic lighting",
            ImageStyle.PHOTOGRAPHY: "professional photography, DSLR, perfect lighting, sharp focus"
        }
        
        enhancement = style_enhancements.get(style, "high quality, detailed")
        return f"{prompt}, {enhancement}"
    
    def _get_default_negative_prompt(self) -> str:
        """Prompt negativo padrão para melhor qualidade"""
        return (
            "low quality, blurry, pixelated, distorted, deformed, "
            "ugly, bad anatomy, extra limbs, watermark, signature, "
            "text, letters, words, bad art, amateur"
        )
    
    async def _run_inference(self, params: Dict[str, Any]) -> bytes:
        """
        Executar inferência do modelo Stable Diffusion XL
        """
        try:
            logger.info("🎨 Iniciando geração de imagem com SDXL...")
            start_time = time.time()
            
            # Executar inferência em thread separada para não bloquear
            def run_generation():
                with torch.inference_mode():
                    # Limpar cache GPU antes da geração
                    if self.device == "cuda":
                        torch.cuda.empty_cache()
                    
                    # Gerar imagem
                    result = self.model(**params)
                    return result.images[0]
            
            # Executar em thread pool para não bloquear event loop
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(run_generation)
                image = future.result(timeout=300)  # 5 minutos timeout
            
            # Converter para bytes
            img_byte_arr = io.BytesIO()
            
            # Salvar com qualidade otimizada
            image.save(
                img_byte_arr, 
                format='PNG', 
                optimize=True,
                compress_level=6  # Balanceio entre qualidade e tamanho
            )
            
            generation_time = time.time() - start_time
            logger.info(f"✅ Imagem gerada em {generation_time:.2f}s")
            
            # Log de estatísticas
            image_size = len(img_byte_arr.getvalue())
            logger.info(f"📊 Tamanho da imagem: {image_size / 1024 / 1024:.2f}MB")
            logger.info(f"📐 Dimensões: {image.size}")
            
            return img_byte_arr.getvalue()
            
        except concurrent.futures.TimeoutError:
            logger.error("❌ Timeout na geração de imagem (5 minutos)")
            raise Exception("Geração de imagem demorou muito tempo")
        except torch.cuda.OutOfMemoryError:
            logger.error("❌ Memória GPU insuficiente")
            # Limpar cache e tentar novamente com configurações reduzidas
            if self.device == "cuda":
                torch.cuda.empty_cache()
                gc.collect()
            raise Exception("Memória GPU insuficiente. Tente reduzir resolução ou batch_size")
        except Exception as e:
            logger.error(f"❌ Erro na inferência: {e}")
            raise
    
    async def _create_placeholder_image(self, request: ImageGenerationRequest) -> bytes:
        """Criar imagem placeholder para desenvolvimento"""
        try:
            # Criar imagem colorida baseada no prompt
            img = Image.new('RGB', (request.width, request.height), color='lightblue')
            
            # Adicionar texto do prompt (simplificado)
            from PIL import ImageDraw, ImageFont
            draw = ImageDraw.Draw(img)
            
            # Usar fonte padrão
            try:
                font = ImageFont.load_default()
            except:
                font = None
            
            # Adicionar informações
            text_lines = [
                f"PyLab AI Generated",
                f"Style: {request.style.value}",
                f"Size: {request.width}x{request.height}",
                f"Prompt: {request.prompt[:50]}..."
            ]
            
            y_offset = 50
            for line in text_lines:
                draw.text((50, y_offset), line, fill='darkblue', font=font)
                y_offset += 30
            
            # Converter para bytes
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG', optimize=True)
            return img_byte_arr.getvalue()
            
        except Exception as e:
            logger.error(f"Erro ao criar placeholder: {e}")
            # Fallback: imagem mínima
            img = Image.new('RGB', (512, 512), color='gray')
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            return img_byte_arr.getvalue()
    
    async def _create_placeholder_image_from_params(self, params: Dict[str, Any]) -> bytes:
        """Criar placeholder baseado nos parâmetros de geração"""
        width = params.get('width', 1024)
        height = params.get('height', 1024)
        prompt = params.get('prompt', 'AI Generated Image')
        
        img = Image.new('RGB', (width, height), color='lightgreen')
        
        from PIL import ImageDraw
        draw = ImageDraw.Draw(img)
        
        # Adicionar texto centralizado
        text = f"Generated: {prompt[:30]}..."
        bbox = draw.textbbox((0, 0), text)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (width - text_width) // 2
        y = (height - text_height) // 2
        
        draw.text((x, y), text, fill='darkgreen')
        
        # Converter para bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG', optimize=True)
        return img_byte_arr.getvalue()
    
    def get_model_info(self) -> Dict[str, Any]:
        """Obter informações do modelo"""
        return {
            "name": "Stable Diffusion XL",
            "version": "1.0",
            "device": self.device,
            "loaded": self.model_loaded,
            "memory_usage": self._get_memory_usage(),
            "supported_styles": [style.value for style in ImageStyle],
            "max_resolution": "2048x2048",
            "recommended_steps": "20-50"
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
        logger.info("Image Generator resources cleaned up")

# === UTILITY FUNCTIONS ===

async def test_image_generation():
    """Função de teste para desenvolvimento"""
    generator = ImageGenerator()
    
    request = ImageGenerationRequest(
        prompt="A beautiful sunset over the ocean",
        style=ImageStyle.REALISTIC,
        width=1024,
        height=1024
    )
    
    try:
        result = await generator.generate(request)
        logger.info(f"Teste concluído: {len(result)} bytes gerados")
        return result
    finally:
        generator.cleanup()

if __name__ == "__main__":
    # Teste rápido
    asyncio.run(test_image_generation())