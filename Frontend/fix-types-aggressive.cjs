const fs = require('fs');
const path = require('path');

function fixTypesInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let changes = 0;
  
  // Substituições mais específicas
  const replacements = [
    [/: any\[\]/g, ': unknown[]'],
    [/: any;/g, ': unknown;'],
    [/: any\)/g, ': unknown)'],
    [/: any,/g, ': unknown,'],
    [/: any =/g, ': unknown ='],
    [/Promise<any>/g, 'Promise<unknown>'],
    [/Record<string, any>/g, 'Record<string, unknown>'],
    [/Array<any>/g, 'Array<unknown>'],
    [/\| any/g, '| unknown'],
    [/any \|/g, 'unknown |'],
    [/\(.*?: any\)/g, (match) => match.replace(': any', ': unknown')],
  ];
  
  replacements.forEach(([pattern, replacement]) => {
    const before = newContent;
    newContent = newContent.replace(pattern, replacement);
    if (before !== newContent) changes++;
  });
  
  if (changes > 0) {
    fs.writeFileSync(filePath, newContent);
    return changes;
  }
  
  return 0;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let totalChanges = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      totalChanges += processDirectory(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const changes = fixTypesInFile(fullPath);
      if (changes > 0) {
        console.log(`Fixed ${changes} issues in: ${fullPath}`);
        totalChanges += changes;
      }
    }
  }
  
  return totalChanges;
}

console.log('🔧 Aplicando correções agressivas de tipos...');
const totalChanges = processDirectory('./src');
console.log(`✅ ${totalChanges} correções aplicadas!`);
