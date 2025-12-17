const fs = require('fs');
const path = require('path');

function fixJSXErrors() {
  console.log('🔧 Corrigindo erros JSX...');
  
  const files = findFiles('src', /\.tsx$/);
  let totalFixed = 0;
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Corrigir chaves extras em JSX
    content = content.replace(/(\w+)}}(\s*)/g, '$1$2');
    
    // Corrigir tags não fechadas
    content = content.replace(/<(\w+)([^>]*?)>\s*$/gm, '<$1$2>');
    
    // Corrigir motion components com props inválidas
    content = content.replace(/initial=\{[^}]*\}/g, '');
    content = content.replace(/animate=\{[^}]*\}/g, '');
    content = content.replace(/transition=\{[^}]*\}/g, '');
    content = content.replace(/whileHover=\{[^}]*\}/g, '');
    content = content.replace(/whileTap=\{[^}]*\}/g, '');
    
    // Corrigir props de componentes que não existem
    const invalidProps = [
      'asChild', 'align', 'side', 'sideOffset', 'alignOffset',
      'avoidCollisions', 'collisionBoundary', 'collisionPadding',
      'sticky', 'hideWhenDetached', 'updatePositionStrategy'
    ];
    
    invalidProps.forEach(prop => {
      const regex = new RegExp(`\\s*${prop}=\\{[^}]*\\}`, 'g');
      content = content.replace(regex, '');
    });
    
    // Corrigir componentes motion sem importação
    if (content.includes('motion.') && !content.includes('framer-motion')) {
      content = content.replace(/motion\./g, '');
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`Fixed JSX in: ${file}`);
      totalFixed++;
    }
  });
  
  console.log(`✅ ${totalFixed} arquivos corrigidos!`);
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

fixJSXErrors();
