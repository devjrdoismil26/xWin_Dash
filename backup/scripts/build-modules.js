#!/usr/bin/env node

/**
 * Script de build modular para xWin-Dash
 * Resolve o problema de travamento dividindo o build em módulos
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando build modular...');

// Módulos principais para build
const MODULES = [
  'AI',
  'Leads', 
  'Products',
  'Workflows',
  'Dashboard',
  'Settings',
  'Users',
  'EmailMarketing',
  'SocialBuffer',
  'ADStool',
  'Analytics',
  'Aura',
  'MediaLibrary',
  'Projects',
  'Activity'
];

// Configuração de memória por módulo
const MEMORY_PER_MODULE = 2048; // 2GB por módulo

async function buildModule(moduleName) {
  try {
    console.log(`📦 Construindo módulo: ${moduleName}`);
    
    // Criar configuração específica para o módulo
    const configContent = `
import path from 'path';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envDir: '../Backend/',
  plugins: [
    laravel({
      input: ['src/main.tsx', 'src/css/app.css'],
      refresh: true,
      publicDirectory: '../Backend/public',
      buildDirectory: 'build',
      ssr: false,
    }),
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  build: {
    target: 'es2015',
    outDir: \`dist/modules/${moduleName}\`,
    sourcemap: false,
    minify: false,
    rollupOptions: {
      input: \`src/modules/${moduleName}/index.tsx\`,
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      },
      external: (id) => {
        // Excluir outros módulos para evitar dependências circulares
        const allModules = ['AI', 'Leads', 'Products', 'Workflows', 'Dashboard', 'Settings', 'Users', 'EmailMarketing', 'SocialBuffer', 'ADStool', 'Analytics', 'Aura', 'MediaLibrary', 'Projects', 'Activity'];
        return allModules.some(module => 
          id.includes(\`/modules/\${module}/\`) && module !== '${moduleName}'
        );
      }
    },
    chunkSizeWarningLimit: 5000,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@inertiajs/react', 'axios'],
  },
  define: {
    global: 'globalThis',
  },
});
`;

    // Escrever configuração temporária
    const configPath = `vite.config.${moduleName}.js`;
    fs.writeFileSync(configPath, configContent);

    // Executar build do módulo
    const command = `NODE_OPTIONS="--max-old-space-size=${MEMORY_PER_MODULE}" npx vite build --config ${configPath}`;
    
    console.log(`⚡ Executando: ${command}`);
    execSync(command, { 
      stdio: 'inherit',
      timeout: 300000 // 5 minutos por módulo
    });

    // Limpar configuração temporária
    fs.unlinkSync(configPath);

    console.log(`✅ Módulo ${moduleName} construído com sucesso!`);
    return true;

  } catch (error) {
    console.error(`❌ Erro ao construir módulo ${moduleName}:`, error.message);
    return false;
  }
}

async function buildAllModules() {
  console.log(`📋 Construindo ${MODULES.length} módulos...`);
  
  const results = [];
  
  for (const module of MODULES) {
    const success = await buildModule(module);
    results.push({ module, success });
    
    if (!success) {
      console.log(`⚠️ Módulo ${module} falhou, continuando com os próximos...`);
    }
  }
  
  // Relatório final
  console.log('\n📊 Relatório Final:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Sucessos: ${successful.length}/${MODULES.length}`);
  successful.forEach(r => console.log(`  - ${r.module}`));
  
  if (failed.length > 0) {
    console.log(`❌ Falhas: ${failed.length}/${MODULES.length}`);
    failed.forEach(r => console.log(`  - ${r.module}`));
  }
  
  // Criar index principal
  if (successful.length > 0) {
    createMainIndex(successful.map(r => r.module));
  }
}

function createMainIndex(modules) {
  console.log('📝 Criando index principal...');
  
  const indexContent = `
// Index principal gerado automaticamente
export const modules = {
${modules.map(module => `  ${module}: () => import('./modules/${module}/index.js')`).join(',\n')}
};

export default modules;
`;

  fs.writeFileSync('dist/index.js', indexContent);
  console.log('✅ Index principal criado!');
}

// Executar build
buildAllModules().catch(console.error);