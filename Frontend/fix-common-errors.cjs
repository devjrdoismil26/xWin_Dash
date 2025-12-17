const fs = require('fs');
const path = require('path');

function fixCommonErrors() {
  console.log('🔧 Corrigindo erros comuns...');
  
  // 1. Corrigir imports inexistentes
  fixMissingImports();
  
  // 2. Corrigir schemas Zod
  fixZodSchemas();
  
  // 3. Corrigir event handlers
  fixEventHandlers();
  
  // 4. Corrigir props de componentes
  fixComponentProps();
  
  console.log('✅ Correções aplicadas!');
}

function fixMissingImports() {
  const files = findFiles('src', /\.(tsx?)$/);
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Corrigir imports do getErrorMessage
    if (content.includes("from '@/lib/utils'") && content.includes('getErrorMessage')) {
      content = content.replace(
        /import\s*{\s*([^}]*),?\s*getErrorMessage\s*([^}]*)\s*}\s*from\s*['"]@\/lib\/utils['"];?/g,
        'import { $1 $2 } from \'@/lib/utils\';\n// getErrorMessage removido - usar try/catch direto'
      );
      changed = true;
    }
    
    // Corrigir imports de componentes inexistentes
    if (content.includes('ProgressBar') && content.includes('AdvancedProgress')) {
      content = content.replace(/ProgressBar/g, 'Progress');
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Fixed imports in: ${file}`);
    }
  });
}

function fixZodSchemas() {
  const files = findFiles('src/schemas', /\.ts$/);
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Corrigir z.string() com required_error
    content = content.replace(
      /z\.string\(\s*{\s*required_error:\s*[^}]+\s*}\s*\)/g,
      'z.string()'
    );
    
    // Corrigir z.number() com argumentos antigos
    content = content.replace(
      /z\.number\(\s*{\s*required_error:\s*[^}]+\s*}\s*\)/g,
      'z.number()'
    );
    
    // Corrigir z.array() com um argumento
    content = content.replace(
      /z\.array\(\s*([^,)]+)\s*\)/g,
      'z.array($1)'
    );
    
    if (content !== fs.readFileSync(file, 'utf8')) {
      fs.writeFileSync(file, content);
      console.log(`Fixed Zod schemas in: ${file}`);
      changed = true;
    }
  });
}

function fixEventHandlers() {
  const files = findFiles('src', /\.tsx$/);
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Corrigir event handlers incompatíveis
    if (content.includes('ChangeEvent<HTMLInputElement>') && content.includes('HTMLSelectElement')) {
      content = content.replace(
        /\(e:\s*React\.ChangeEvent<HTMLInputElement>\)\s*=>/g,
        '(e: React.ChangeEvent<HTMLSelectElement>) =>'
      );
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Fixed event handlers in: ${file}`);
    }
  });
}

function fixComponentProps() {
  const files = findFiles('src', /\.tsx$/);
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Remover props inexistentes de componentes
    const propsToRemove = [
      'initialFocus',
      'asChild',
      'align',
      'delay',
      'animation',
      'initial',
      'animate',
      'transition'
    ];
    
    propsToRemove.forEach(prop => {
      const regex = new RegExp(`\\s*${prop}={[^}]*}`, 'g');
      if (content.match(regex)) {
        content = content.replace(regex, '');
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Fixed component props in: ${file}`);
    }
  });
}

function findFiles(dir, pattern) {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFiles(fullPath, pattern));
    } else if (pattern.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

fixCommonErrors();
