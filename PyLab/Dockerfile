# ============================================================================
# PyLab - AI Business Intelligence Laboratory
# Python 3.12 + FastAPI + PyTorch
# ============================================================================

FROM python:3.12-slim

WORKDIR /app

# ============================================================================
# SYSTEM DEPENDENCIES
# ============================================================================

RUN apt-get update && apt-get install -y \
    # Build essentials
    build-essential \
    gcc \
    g++ \
    # FFmpeg para processamento de vídeo/áudio
    ffmpeg \
    # Libsndfile para áudio
    libsndfile1 \
    # OpenCV dependencies
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    # Outros
    wget \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# ============================================================================
# PYTHON DEPENDENCIES
# ============================================================================

# Copiar requirements
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ============================================================================
# APPLICATION CODE
# ============================================================================

# Copiar código da aplicação
COPY . .

# Criar diretórios necessários
RUN mkdir -p output cache tmp logs

# ============================================================================
# CONFIGURATION
# ============================================================================

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYLAB_HOST=0.0.0.0 \
    PYLAB_PORT=8001 \
    MEDIA_OUTPUT_PATH=/app/output \
    CACHE_PATH=/app/cache \
    TEMP_PATH=/app/tmp

# Expor porta
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8001/ || exit 1

# ============================================================================
# STARTUP
# ============================================================================

# Comando para iniciar
CMD ["python", "app/main.py"]

# ============================================================================
# ALTERNATIVE: Uvicorn with workers
# ============================================================================
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "4"]

# ============================================================================
# GPU SUPPORT (opcional)
# ============================================================================
# Para suporte a GPU, use a imagem base:
# FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04
# E instale Python 3.12 manualmente
