/* eslint-env node */
/* eslint no-undef: "off" */
// Configuração de otimização de imagens
module.exports = {
  // Configuração para vite-plugin-imagemin
  imagemin: {
    gifsicle: { optimizationLevel: 7 },
    mozjpeg: { quality: 80 },
    pngquant: { quality: [0.65, 0.8] },
    svgo: {
      plugins: [
        { name: 'removeViewBox', active: false },
        { name: 'removeEmptyAttrs', active: false }
      ]
    }
  },
  
  // Configuração para next/image ou similar
  formats: ['webp', 'avif'],
  sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  
  // Lazy loading para imagens
  lazyLoading: {
    threshold: '200px',
    placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9zdmc+'
  }
};