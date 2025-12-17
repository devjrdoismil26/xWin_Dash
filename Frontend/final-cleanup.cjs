const fs = require('fs');
const path = require('path');

function finalCleanup() {
  console.log('🧹 Limpeza final...');
  
  const files = findFiles('src', /\.tsx?$/);
  let totalFixed = 0;
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Remover motion components problemáticos
    content = content.replace(/motion\./g, '');
    
    // Corrigir chaves JSX malformadas
    content = content.replace(/}}}+/g, '}');
    content = content.replace(/{{+/g, '{');
    
    // Remover AnimatePresence se não há framer-motion
    if (!content.includes('framer-motion')) {
      content = content.replace(/<AnimatePresence[^>]*>/g, '<div>');
      content = content.replace(/<\/AnimatePresence>/g, '</div>');
    }
    
    // Corrigir tags não fechadas
    content = content.replace(/<(\w+)([^>]*?)>\s*$/gm, '<$1$2></$1>');
    
    // Remover props inválidas comuns
    const invalidProps = [
      'exit=\\{[^}]*\\}',
      'variants=\\{[^}]*\\}',
      'custom=\\{[^}]*\\}',
      'layoutId="[^"]*"'
    ];
    
    invalidProps.forEach(prop => {
      const regex = new RegExp(`\\s*${prop}`, 'g');
      content = content.replace(regex, '');
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`Cleaned: ${file}`);
      totalFixed++;
    }
  });
  
  console.log(`✅ ${totalFixed} arquivos limpos!`);
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

finalCleanup();
