#!/usr/bin/env python3
"""
Script para corrigir erros de sintaxe
"""

import os
import re

def fix_adstool_services():
    """Corrige erros de sintaxe nos services do ADStool"""
    
    files_to_fix = [
        'src/modules/ADStool/services/adsAnalyticsService.ts',
        'src/modules/ADStool/services/adsCreativeService.ts'
    ]
    
    corrections = 0
    
    for file_path in files_to_fix:
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Corrigir problemas comuns de sintaxe
                # 1. Remover linhas vazias problemáticas
                lines = content.split('\n')
                fixed_lines = []
                
                for i, line in enumerate(lines):
                    # Pular linhas que causam problemas
                    if line.strip() == '' and i > 0 and i < len(lines) - 1:
                        prev_line = lines[i-1].strip()
                        next_line = lines[i+1].strip()
                        
                        # Se a linha anterior termina com } e a próxima começa com async
                        if prev_line.endswith('}') and next_line.startswith('async'):
                            fixed_lines.append('')  # Manter linha vazia
                        elif prev_line.endswith(';') and next_line.startswith('async'):
                            fixed_lines.append('')  # Manter linha vazia
                        else:
                            fixed_lines.append(line)
                    else:
                        fixed_lines.append(line)
                
                content = '\n'.join(fixed_lines)
                
                # 2. Garantir que métodos estão bem formatados
                content = re.sub(r'\n\s*async\s+(\w+)', r'\n\n  async \1', content)
                
                # 3. Garantir fechamento correto de classes
                content = re.sub(r'}\s*$', r'\n}', content)
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    corrections += 1
                    print(f"✅ {file_path}")
            
            except Exception as e:
                print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def main():
    """Função principal"""
    print("🔧 Corrigindo erros de sintaxe...")
    print()
    
    if os.path.exists('Frontend'):
        os.chdir('Frontend')
    
    corrections = fix_adstool_services()
    
    print(f"🎉 {corrections} arquivos corrigidos")
    print()
    
    # Verificar impacto
    print("📊 Verificando impacto...")
    import subprocess
    try:
        result = subprocess.run(
            ['npm', 'run', 'type-check'],
            capture_output=True,
            text=True,
            cwd='.'
        )
        
        error_count = result.stderr.count('error TS')
        print(f"   Erros atuais: {error_count}")
        
        if error_count < 100:
            print(f"   🎯 MENOS DE 100 ERROS! 🎉")
        if error_count < 50:
            print(f"   🎯 MENOS DE 50 ERROS! 🎉🎉")
        if error_count < 10:
            print(f"   🎯 MENOS DE 10 ERROS! 🎉🎉🎉")
    except:
        print("   Execute: npm run type-check")

if __name__ == "__main__":
    main()
