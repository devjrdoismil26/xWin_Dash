const fs = require('fs');
const path = require('path');

function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTsFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const imports = [];
  const exports = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('import ') && !line.includes('//')) {
      imports.push({ line: i + 1, content: line });
    }
    
    if (line.startsWith('export ') && !line.includes('//')) {
      exports.push({ line: i + 1, content: line });
    }
  }
  
  return { imports, exports, totalLines: lines.length };
}

const srcDir = './src';
const files = findTsFiles(srcDir);

console.log('=== RELATÓRIO DE ANÁLISE DE CÓDIGO ===\n');
console.log(`Total de arquivos TypeScript: ${files.length}\n`);

let totalImports = 0;
let totalExports = 0;
let totalLines = 0;

const moduleStats = {};

files.forEach(file => {
  const analysis = analyzeFile(file);
  totalImports += analysis.imports.length;
  totalExports += analysis.exports.length;
  totalLines += analysis.totalLines;
  
  const module = file.split('/')[2] || 'root';
  if (!moduleStats[module]) {
    moduleStats[module] = { files: 0, imports: 0, exports: 0, lines: 0 };
  }
  
  moduleStats[module].files++;
  moduleStats[module].imports += analysis.imports.length;
  moduleStats[module].exports += analysis.exports.length;
  moduleStats[module].lines += analysis.totalLines;
});

console.log('=== ESTATÍSTICAS POR MÓDULO ===');
Object.entries(moduleStats)
  .sort((a, b) => b[1].lines - a[1].lines)
  .forEach(([module, stats]) => {
    console.log(`${module}:`);
    console.log(`  Arquivos: ${stats.files}`);
    console.log(`  Imports: ${stats.imports}`);
    console.log(`  Exports: ${stats.exports}`);
    console.log(`  Linhas: ${stats.lines}`);
    console.log('');
  });

console.log('=== RESUMO GERAL ===');
console.log(`Total de imports: ${totalImports}`);
console.log(`Total de exports: ${totalExports}`);
console.log(`Total de linhas: ${totalLines}`);
console.log(`Média de imports por arquivo: ${(totalImports / files.length).toFixed(2)}`);
console.log(`Média de linhas por arquivo: ${(totalLines / files.length).toFixed(2)}`);
