# ============================================================================
# xWin_Dash Frontend - Multi-Stage Dockerfile
# React 18 + TypeScript 5 + Vite 5
# ============================================================================

# ============================================================================
# STAGE 1: Dependencies
# ============================================================================
FROM node:18-alpine AS deps

WORKDIR /app

# Instalar dependências do sistema necessárias para compilação
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copiar apenas arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci --legacy-peer-deps && \
    npm cache clean --force

# ============================================================================
# STAGE 2: Validator (Type-check & Lint)
# ============================================================================
FROM node:18-alpine AS validator

WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte e configurações
COPY . .

# Validar TypeScript
RUN npm run type-check || (echo "❌ Type-check failed!" && exit 1)

# Validar ESLint
RUN npm run lint || (echo "❌ Lint failed!" && exit 1)

# ============================================================================
# STAGE 3: Builder
# ============================================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependências do stage deps
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Variáveis de ambiente para build
ARG VITE_APP_NAME=xWin_Dash
ARG VITE_APP_ENV=production
ARG VITE_API_URL=http://localhost:8000
ARG VITE_PYLAB_URL=http://localhost:8001

ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PYLAB_URL=$VITE_PYLAB_URL

# Build da aplicação para produção
RUN npm run build || (echo "❌ Build failed!" && exit 1)

# Verificar se o build foi criado
RUN test -d dist || (echo "❌ Build output not found!" && exit 1)

# ============================================================================
# STAGE 4: Production (Nginx)
# ============================================================================
FROM nginx:alpine AS production

WORKDIR /app

# Copiar build do stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - todas as rotas vão para index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

# ============================================================================
# STAGE 5: Development (Alternativo)
# ============================================================================
FROM node:18-alpine AS development

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copiar package files
COPY package.json package-lock.json* ./

# Instalar todas as dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 5173

# Comando para desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
