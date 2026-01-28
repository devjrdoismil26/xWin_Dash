#!/usr/bin/env node

/**
 * Script de Build Unificado - xWin-Dash Frontend
 * Executa todos os módulos em ordem, evitando problemas de dependência
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const modulesDir = path.join(projectRoot, 'src', 'modules');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Ordem de execução dos módulos (baseada em dependências)
const MODULE_ORDER = [
  // Core modules first
  'Users',
  'Settings',
  'Dashboard',
  
  // Business modules
  'Projects',
  'Leads',
  'Products',
  'Analytics',
  
  // Advanced modules
  'AI',
  'EmailMarketing',
  'SocialBuffer',
  'Workflows',
  
  // Specialized modules
  'ADStool',
  'Activity',
  'Aura',
  'MediaLibrary'
];

function getAvailableModules() {
  try {
    const modules = fs.readdirSync(modulesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => 
        !name.startsWith('.') && 
        name !== 'Markdowns' &&
        name !== 'index.ts' &&
        name !== 'README.md' &&
        name !== 'MODULES_REFACTORING_CHECKLIST.md'
      );
    
    return modules;
  } catch (error) {
    log(`Erro ao ler diretório de módulos: ${error.message}`, 'red');
    return [];
  }
}

function createModuleConfig(moduleName) {
  const configContent = `/* eslint-env node */
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist/${moduleName}',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      input: {
        '${moduleName}': 'src/modules/${moduleName}/index.tsx'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'utils-vendor': ['framer-motion', 'lucide-react', 'date-fns']
        }
      },
      external: (id) => {
        return id.includes('.test.') || 
               id.includes('.spec.') || 
               id.includes('/tests/') ||
               id.includes('/__tests__/') ||
               id.includes('.md') ||
               id.includes('README') ||
               id.includes('MODULES_REFACTORING_CHECKLIST');
      }
    },
    chunkSizeWarningLimit: 2000,
    reportCompressedSize: false,
  },
  define: {
    global: 'globalThis',
  },
});`;

  const configPath = path.join(projectRoot, `vite.config.${moduleName}.js`);
  fs.writeFileSync(configPath, configContent);
  return configPath;
}

function createCoreConfig() {
  const configContent = `/* eslint-env node */
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist/core',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      input: {
        main: 'src/main.tsx',
        app: 'src/App.tsx'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', '@inertiajs/react'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'utils-vendor': ['framer-motion', 'lucide-react', 'date-fns', 'axios']
        }
      },
      external: (id) => {
        return id.includes('.test.') || 
               id.includes('.spec.') || 
               id.includes('/tests/') ||
               id.includes('/__tests__/') ||
               id.includes('.md') ||
               id.includes('/modules/');
      }
    },
    chunkSizeWarningLimit: 2000,
    reportCompressedSize: false,
  },
  define: {
    global: 'globalThis',
  },
});`;

  const configPath = path.join(projectRoot, 'vite.config.core.js');
  fs.writeFileSync(configPath, configContent);
  return configPath;
}

function buildModule(moduleName) {
  log(`🔨 Construindo módulo: ${moduleName}`, 'cyan');
  
  try {
    // Verificar se o módulo tem index.tsx
    const moduleIndexPath = path.join(modulesDir, moduleName, 'index.tsx');
    if (!fs.existsSync(moduleIndexPath)) {
      log(`⚠️  Módulo ${moduleName} não possui index.tsx, pulando...`, 'yellow');
      return { success: false, reason: 'No index.tsx' };
    }

    // Criar configuração Vite específica para o módulo
    const configPath = createModuleConfig(moduleName);
    
    // Executar build
    const buildCommand = `npx vite build --config ${path.basename(configPath)}`;
    log(`   Executando: ${buildCommand}`, 'blue');
    
    execSync(buildCommand, { 
      cwd: projectRoot, 
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    // Limpar arquivo de configuração temporário
    fs.removeSync(configPath);
    
    log(`✅ Módulo ${moduleName} construído com sucesso!`, 'green');
    return { success: true };
    
  } catch (error) {
    log(`❌ Erro ao construir módulo ${moduleName}: ${error.message}`, 'red');
    return { success: false, reason: error.message };
  }
}

function buildCore() {
  log(`🔨 Construindo core da aplicação...`, 'cyan');
  
  try {
    const configPath = createCoreConfig();
    
    const buildCommand = `npx vite build --config vite.config.core.js`;
    log(`   Executando: ${buildCommand}`, 'blue');
    
    execSync(buildCommand, { 
      cwd: projectRoot, 
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    fs.removeSync(configPath);
    log(`✅ Core construído com sucesso!`, 'green');
    return { success: true };
    
  } catch (error) {
    log(`❌ Erro ao construir core: ${error.message}`, 'red');
    return { success: false, reason: error.message };
  }
}

function generateManifest(results) {
  log(`📝 Gerando manifesto dos módulos...`, 'cyan');
  
  const manifest = {
    buildDate: new Date().toISOString(),
    core: {
      built: results.core.success,
      path: 'dist/core/main.js'
    },
    modules: results.modules.map(result => ({
      name: result.module,
      built: result.success,
      path: `dist/${result.module}/${result.module}.js`,
      reason: result.reason || null
    })),
    summary: {
      totalModules: results.modules.length,
      successfulModules: results.modules.filter(r => r.success).length,
      failedModules: results.modules.filter(r => !r.success).length,
      coreBuilt: results.core.success
    }
  };

  const manifestPath = path.join(projectRoot, 'dist', 'build-manifest.json');
  fs.ensureDirSync(path.dirname(manifestPath));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  log(`✅ Manifesto gerado: ${manifestPath}`, 'green');
  return manifest;
}

function calculateSizes() {
  const distPath = path.join(projectRoot, 'dist');
  if (!fs.existsSync(distPath)) return null;
  
  try {
    const stats = {};
    const items = fs.readdirSync(distPath, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory()) {
        const itemPath = path.join(distPath, item.name);
        const size = execSync(`du -sh "${itemPath}"`, { encoding: 'utf8' }).trim().split('\t')[0];
        stats[item.name] = size;
      }
    }
    
    return stats;
  } catch (error) {
    return null;
  }
}

async function main() {
  log('🚀 Build Unificado - xWin-Dash Frontend', 'bright');
  log('=' .repeat(60), 'blue');
  
  const startTime = Date.now();
  const availableModules = getAvailableModules();
  
  // Filtrar módulos disponíveis pela ordem definida
  const orderedModules = MODULE_ORDER.filter(module => availableModules.includes(module));
  const unorderedModules = availableModules.filter(module => !MODULE_ORDER.includes(module));
  const finalModuleOrder = [...orderedModules, ...unorderedModules];
  
  log(`📦 Módulos encontrados: ${availableModules.length}`, 'magenta');
  log(`📋 Ordem de execução: ${finalModuleOrder.join(' → ')}`, 'blue');
  
  // Limpar dist anterior
  const distPath = path.join(projectRoot, 'dist');
  if (fs.existsSync(distPath)) {
    log(`\n🧹 Limpando build anterior...`, 'yellow');
    fs.removeSync(distPath);
  }
  
  // Construir core primeiro
  const coreResult = buildCore();
  
  // Construir módulos em ordem
  const moduleResults = [];
  for (const module of finalModuleOrder) {
    const result = buildModule(module);
    moduleResults.push({ module, ...result });
  }
  
  // Gerar manifesto
  const manifest = generateManifest({
    core: coreResult,
    modules: moduleResults
  });
  
  // Calcular tamanhos
  const sizes = calculateSizes();
  
  // Relatório final
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  log('\n' + '=' .repeat(60), 'blue');
  log('📊 RELATÓRIO FINAL', 'bright');
  log('=' .repeat(60), 'blue');
  
  log(`⏱️  Tempo total: ${duration}s`, 'cyan');
  log(`📦 Total de módulos: ${manifest.summary.totalModules}`, 'cyan');
  log(`✅ Módulos construídos: ${manifest.summary.successfulModules}`, 'green');
  log(`❌ Módulos com erro: ${manifest.summary.failedModules}`, 'red');
  log(`🔧 Core construído: ${manifest.summary.coreBuilt ? 'Sim' : 'Não'}`, manifest.summary.coreBuilt ? 'green' : 'red');
  
  if (sizes) {
    log(`\n📏 Tamanhos dos builds:`, 'blue');
    Object.entries(sizes).forEach(([name, size]) => {
      log(`   ${name}: ${size}`, 'blue');
    });
  }
  
  if (manifest.summary.failedModules > 0) {
    log(`\n❌ Módulos com erro:`, 'red');
    moduleResults.filter(r => !r.success).forEach(r => {
      log(`   - ${r.module}: ${r.reason}`, 'red');
    });
  }
  
  log(`\n📁 Arquivos gerados em: ${distPath}`, 'blue');
  log(`📄 Manifesto: dist/build-manifest.json`, 'blue');
  
  if (manifest.summary.coreBuilt && manifest.summary.successfulModules > 0) {
    log('\n🎉 Build unificado concluído com sucesso!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Build concluído com alguns erros.', 'yellow');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log(`💥 Erro fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

export { main };