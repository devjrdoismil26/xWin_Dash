#!/usr/bin/env python3
"""
🤖 PyLab - Script de Download de Modelos IA
Baixa e configura os modelos necessários para o laboratório de IA
"""

import os
import sys
import torch
import logging
from pathlib import Path

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("ModelDownloader")

def check_system():
    """Verificar sistema e requisitos"""
    logger.info("🔍 Verificando sistema...")
    
    # Verificar CUDA
    cuda_available = torch.cuda.is_available()
    logger.info(f"CUDA disponível: {cuda_available}")
    
    if cuda_available:
        gpu_count = torch.cuda.device_count()
        for i in range(gpu_count):
            gpu_name = torch.cuda.get_device_name(i)
            gpu_memory = torch.cuda.get_device_properties(i).total_memory / 1024**3
            logger.info(f"GPU {i}: {gpu_name} ({gpu_memory:.1f}GB)")
    
    # Verificar espaço em disco
    models_dir = Path("/app/models")
    models_dir.mkdir(parents=True, exist_ok=True)
    
    # Estimar espaço necessário
    estimated_space = 12  # GB (SDXL ~6GB + ModelScope ~6GB)
    logger.info(f"💾 Espaço estimado necessário: {estimated_space}GB")
    
    return cuda_available

def download_stable_diffusion_xl():
    """Baixar Stable Diffusion XL"""
    try:
        logger.info("📥 Baixando Stable Diffusion XL...")
        
        from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler
        
        # Download do modelo principal
        logger.info("🔄 Baixando modelo SDXL base...")
        pipeline = StableDiffusionXLPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            torch_dtype=torch.float16,
            use_safetensors=True,
            variant="fp16",
            cache_dir="/app/models"
        )
        logger.info("✅ Stable Diffusion XL base baixado!")
        
        # Download do scheduler otimizado
        logger.info("🔄 Baixando scheduler DPM++...")
        scheduler = DPMSolverMultistepScheduler.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            subfolder="scheduler",
            cache_dir="/app/models"
        )
        logger.info("✅ Scheduler DPM++ baixado!")
        
        # Opcional: SDXL Refiner para qualidade extra
        logger.info("🔄 Baixando SDXL Refiner (opcional)...")
        try:
            refiner = StableDiffusionXLPipeline.from_pretrained(
                "stabilityai/stable-diffusion-xl-refiner-1.0",
                torch_dtype=torch.float16,
                use_safetensors=True,
                variant="fp16",
                cache_dir="/app/models"
            )
            logger.info("✅ SDXL Refiner baixado!")
        except Exception as e:
            logger.warning(f"⚠️ Refiner não baixado (não crítico): {e}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erro ao baixar Stable Diffusion XL: {e}")
        return False

def download_modelscope_t2v():
    """Baixar ModelScope Text-to-Video"""
    try:
        logger.info("📥 Baixando ModelScope Text-to-Video...")
        
        from diffusers import DiffusionPipeline
        
        # Download do modelo de vídeo
        logger.info("🔄 Baixando ModelScope T2V 1.7B...")
        video_pipeline = DiffusionPipeline.from_pretrained(
            "damo-vilab/text-to-video-ms-1.7b",
            torch_dtype=torch.float16,
            variant="fp16",
            cache_dir="/app/models",
            custom_pipeline="text_to_video_ms_1_7b"
        )
        logger.info("✅ ModelScope Text-to-Video baixado!")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erro ao baixar ModelScope T2V: {e}")
        return False

def verify_models():
    """Verificar se modelos foram baixados corretamente"""
    logger.info("🔍 Verificando modelos baixados...")
    
    models_dir = Path("/app/models")
    
    # Verificar estrutura de arquivos
    if not models_dir.exists():
        logger.error("❌ Diretório de modelos não existe")
        return False
    
    # Listar conteúdo
    total_size = 0
    for root, dirs, files in os.walk(models_dir):
        for file in files:
            file_path = Path(root) / file
            try:
                size = file_path.stat().st_size
                total_size += size
            except:
                pass
    
    total_size_gb = total_size / (1024**3)
    logger.info(f"📊 Total de modelos baixados: {total_size_gb:.2f}GB")
    
    # Verificar se há arquivos suficientes (estimativa)
    if total_size_gb < 3:  # Pelo menos 3GB
        logger.warning("⚠️ Tamanho dos modelos parece insuficiente")
        return False
    
    logger.info("✅ Verificação de modelos concluída!")
    return True

def cleanup_cache():
    """Limpar cache desnecessário"""
    logger.info("🧹 Limpando cache...")
    
    try:
        # Limpar cache do Hugging Face
        import shutil
        cache_dirs = [
            Path.home() / ".cache" / "huggingface",
            Path("/root/.cache/huggingface") if Path("/root").exists() else None
        ]
        
        for cache_dir in cache_dirs:
            if cache_dir and cache_dir.exists():
                # Manter apenas os modelos, remover cache temporário
                temp_dirs = cache_dir.glob("**/tmp*")
                for temp_dir in temp_dirs:
                    if temp_dir.is_dir():
                        shutil.rmtree(temp_dir, ignore_errors=True)
                        logger.info(f"🗑️ Removido: {temp_dir}")
        
        # Limpar cache PyTorch
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            logger.info("🗑️ Cache GPU limpo")
        
        logger.info("✅ Limpeza concluída!")
        
    except Exception as e:
        logger.warning(f"⚠️ Erro na limpeza (não crítico): {e}")

def main():
    """Função principal"""
    logger.info("🚀 Iniciando download de modelos PyLab...")
    
    # Verificar sistema
    cuda_available = check_system()
    
    success_count = 0
    total_models = 2
    
    # Download Stable Diffusion XL
    if download_stable_diffusion_xl():
        success_count += 1
    
    # Download ModelScope T2V
    if download_modelscope_t2v():
        success_count += 1
    
    # Verificar modelos
    models_ok = verify_models()
    
    # Limpar cache
    cleanup_cache()
    
    # Resultado final
    logger.info("=" * 50)
    if success_count == total_models and models_ok:
        logger.info("🎉 TODOS OS MODELOS BAIXADOS COM SUCESSO!")
        logger.info("✅ PyLab está pronto para gerar mídia de alta qualidade!")
        return 0
    else:
        logger.error(f"❌ Apenas {success_count}/{total_models} modelos baixados")
        logger.error("💡 Verifique conectividade e espaço em disco")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)