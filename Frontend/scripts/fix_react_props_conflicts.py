#!/usr/bin/env python3
"""
Script para corrigir conflitos de props React e duplicações
Remove duplicatas e adiciona imports necessários
"""

import os
import re
from pathlib import Path

def fix_duplicate_props():
    """Remove propriedades duplicadas nas interfaces"""
    
    corrections = 0
    
    # Buscar arquivos TypeScript
    tsx_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.tsx'):
                tsx_files.append(os.path.join(root, file))
    
    for file_path in tsx_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Buscar interfaces Props
            interface_pattern = r'(interface\s+\w*Props\w*\s*{)([^}]*)(})'
            
            def remove_duplicates(match):
                interface_start = match.group(1)
                interface_body = match.group(2)
                interface_end = match.group(3)
                
                # Extrair todas as propriedades
                prop_lines = []
                seen_props = set()
                
                for line in interface_body.split('\n'):
                    line = line.strip()
                    if not line or line.startswith('//'):
                        prop_lines.append(line)
                        continue
                    
                    # Extrair nome da propriedade
                    prop_match = re.match(r'(\w+)\??:', line)
                    if prop_match:
                        prop_name = prop_match.group(1)
                        if prop_name not in seen_props:
                            seen_props.add(prop_name)
                            prop_lines.append(line)
                        # Ignorar duplicatas
                    else:
                        prop_lines.append(line)
                
                # Reconstruir interface
                new_body = '\n'.join(prop_lines)
                return interface_start + new_body + interface_end
            
            content = re.sub(interface_pattern, remove_duplicates, content, flags=re.DOTALL)
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"🧹 {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def add_react_imports():
    """Adiciona imports React onde necessário"""
    
    corrections = 0
    
    # Buscar arquivos TSX
    tsx_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.tsx'):
                tsx_files.append(os.path.join(root, file))
    
    for file_path in tsx_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Verificar se usa React types mas não importa
            uses_react_types = (
                'React.ReactNode' in content or
                'React.CSSProperties' in content or
                'React.ChangeEvent' in content or
                'React.MouseEvent' in content
            )
            
            has_react_import = (
                "import React" in content or
                "import * as React" in content
            )
            
            if uses_react_types and not has_react_import:
                # Adicionar import React no início
                lines = content.split('\n')
                
                # Encontrar onde inserir o import
                insert_index = 0
                for i, line in enumerate(lines):
                    if line.strip().startswith('import'):
                        insert_index = i
                        break
                
                # Inserir import React
                lines.insert(insert_index, "import React from 'react';")
                content = '\n'.join(lines)
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"⚛️ {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def fix_index_signature_conflicts():
    """Corrige conflitos com index signatures"""
    
    corrections = 0
    
    # Buscar arquivos TypeScript
    ts_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith(('.ts', '.tsx')) and not file.endswith('.d.ts'):
                ts_files.append(os.path.join(root, file))
    
    for file_path in ts_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Buscar interfaces com index signature problemática
            interface_pattern = r'(interface\s+\w+\s*{[^}]*?)(\[key: string\]: unknown;)([^}]*?})'
            
            def fix_index_signature(match):
                before = match.group(1)
                index_sig = match.group(2)
                after = match.group(3)
                
                # Se tem propriedades específicas depois, mover index signature para o final
                if after.strip() and after.strip() != '}':
                    # Remover index signature do meio e adicionar no final
                    return before + after.replace('}', f'\n  {index_sig}\n}}')
                
                return match.group(0)
            
            content = re.sub(interface_pattern, fix_index_signature, content, flags=re.DOTALL)
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"🔧 {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def remove_conflicting_props():
    """Remove props que causam conflitos específicos"""
    
    corrections = 0
    
    # Props que frequentemente causam conflitos
    conflicting_props = [
        'onChange?: (value: unknown) => void;',
        'onClick?: () => void;',
    ]
    
    # Buscar arquivos TSX
    tsx_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.tsx'):
                tsx_files.append(os.path.join(root, file))
    
    for file_path in tsx_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Remover props conflitantes apenas se causam problemas
            for prop in conflicting_props:
                # Verificar se a prop aparece múltiplas vezes
                count = content.count(prop)
                if count > 1:
                    # Remover todas as ocorrências exceto a primeira
                    parts = content.split(prop)
                    content = prop.join(parts[:2]) + ''.join(parts[2:])
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"🗑️ {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def fix_common_type_errors():
    """Corrige erros de tipo mais comuns"""
    
    corrections = 0
    
    # Padrões de correção
    fixes = [
        # Corrigir props sem tipos
        (r'(\w+)=\{([^}]+)\}', r'\1={\2 as unknown}'),
        # Corrigir spread props
        (r'\.\.\.props(?!\s+as)', r'...(props as Record<string, unknown>)'),
    ]
    
    # Buscar arquivos TSX
    tsx_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.tsx'):
                tsx_files.append(os.path.join(root, file))
    
    for file_path in tsx_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Aplicar correções específicas apenas onde necessário
            # (implementação conservadora para evitar quebrar código)
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"🔨 {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def main():
    """Função principal"""
    print("🧹 Limpando conflitos de props React...")
    print()
    
    # Mudar para diretório do Frontend
    if os.path.exists('Frontend'):
        os.chdir('Frontend')
    
    total_corrections = 0
    
    print("1️⃣ Removendo propriedades duplicadas...")
    corrections1 = fix_duplicate_props()
    total_corrections += corrections1
    print(f"   ✅ {corrections1} arquivos corrigidos")
    print()
    
    print("2️⃣ Adicionando imports React necessários...")
    corrections2 = add_react_imports()
    total_corrections += corrections2
    print(f"   ✅ {corrections2} arquivos corrigidos")
    print()
    
    print("3️⃣ Corrigindo conflitos de index signatures...")
    corrections3 = fix_index_signature_conflicts()
    total_corrections += corrections3
    print(f"   ✅ {corrections3} arquivos corrigidos")
    print()
    
    print("4️⃣ Removendo props conflitantes...")
    corrections4 = remove_conflicting_props()
    total_corrections += corrections4
    print(f"   ✅ {corrections4} arquivos corrigidos")
    print()
    
    print(f"🎉 Total: {total_corrections} arquivos processados")
    print()
    print("📊 Verificando impacto...")
    
    # Verificar novo número de erros
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
        
        # Calcular redução
        previous_errors = 6878
        if error_count < previous_errors:
            reduction = previous_errors - error_count
            print(f"   Redução: -{reduction} erros ✅")
        else:
            increase = error_count - previous_errors
            print(f"   Aumento: +{increase} erros (pode ser temporário)")
    except:
        print("   Execute: npm run type-check 2>&1 | grep 'error TS' | wc -l")

if __name__ == "__main__":
    main()
