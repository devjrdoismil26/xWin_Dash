#!/bin/bash

# ============================================================================
# xWin_Dash Frontend - Docker Multi-Stage Build
# ============================================================================

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   xWin_Dash Frontend - Docker Multi-Stage Build          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado!"
    exit 1
fi

echo -e "${BLUE}▶ Construindo imagem Docker (multi-stage)...${NC}"
echo ""

# Build da imagem
docker build \
    --target production \
    --tag xwin-frontend:latest \
    --tag xwin-frontend:$(date +%Y%m%d-%H%M%S) \
    --progress=plain \
    .

echo ""
echo -e "${GREEN}✅ Build concluído!${NC}"
echo ""
echo "Para executar o container:"
echo "  docker run -p 80:80 xwin-frontend:latest"
echo ""
echo "Para verificar a imagem:"
echo "  docker images xwin-frontend"
echo ""
