/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_API_URL: string
  readonly VITE_LARAVEL_APP_URL: string
  readonly VITE_WEBSOCKET_URL: string
  // adicione mais variáveis de ambiente aqui conforme necessário
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
