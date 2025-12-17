const fs = require('fs');
const path = require('path');

function findAndReplaceAny(dir) {
  const files = fs.readdirSync(dir);
  let fixes = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixes += findAndReplaceAny(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      
      // Substituições comuns
      newContent = newContent.replace(/: any\[\]/g, ': unknown[]');
      newContent = newContent.replace(/: any;/g, ': unknown;');
      newContent = newContent.replace(/: any\)/g, ': unknown)');
      newContent = newContent.replace(/: any,/g, ': unknown,');
      newContent = newContent.replace(/Record<string, any>/g, 'Record<string, unknown>');
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        fixes++;
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
  
  return fixes;
}

console.log('🔧 Aplicando correções automáticas...');
const totalFixes = findAndReplaceAny('./src');
console.log(`✅ ${totalFixes} arquivos corrigidos!`);
