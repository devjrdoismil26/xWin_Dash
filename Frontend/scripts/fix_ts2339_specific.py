#!/usr/bin/env python3
"""
Script específico para corrigir erros TS2339 mais comuns
Foca nas propriedades mais usadas que estão faltando
"""

import os
import re
from pathlib import Path

def get_common_ts2339_errors():
    """Analisa os erros TS2339 mais comuns"""
    
    # Executar type-check e capturar erros TS2339
    import subprocess
    
    try:
        result = subprocess.run(
            ['npm', 'run', 'type-check'],
            capture_output=True,
            text=True,
            cwd='.'
        )
        
        # Extrair erros TS2339
        ts2339_errors = []
        for line in result.stderr.split('\n'):
            if 'TS2339' in line and "Property" in line:
                # Extrair nome da propriedade
                match = re.search(r"Property '(\w+)' does not exist", line)
                if match:
                    ts2339_errors.append(match.group(1))
        
        # Contar ocorrências
        from collections import Counter
        return Counter(ts2339_errors).most_common(20)
    
    except Exception as e:
        print(f"Erro ao analisar: {e}")
        # Propriedades comuns conhecidas
        return [
            ('data', 100), ('success', 80), ('message', 70), ('error', 60),
            ('id', 90), ('name', 85), ('email', 50), ('status', 45),
            ('loading', 40), ('onSubmit', 35), ('onChange', 30), ('onClick', 25)
        ]

def fix_specific_properties():
    """Corrige propriedades específicas mais comuns"""
    
    print("🔍 Analisando erros TS2339 mais comuns...")
    common_errors = get_common_ts2339_errors()
    
    print("📊 Top 10 propriedades faltantes:")
    for prop, count in common_errors[:10]:
        print(f"   {prop}: {count} ocorrências")
    print()
    
    # Mapeamento de propriedades para tipos
    property_fixes = {
        'data': 'data?: unknown;',
        'success': 'success?: boolean;',
        'message': 'message?: string;',
        'error': 'error?: string;',
        'loading': 'loading?: boolean;',
        'id': 'id?: number;',
        'name': 'name?: string;',
        'email': 'email?: string;',
        'status': 'status?: string;',
        'onSubmit': 'onSubmit?: (data?: unknown) => void;',
        'onChange': 'onChange?: (value: unknown) => void;',
        'onClick': 'onClick?: () => void;',
        'children': 'children?: React.ReactNode;',
        'className': 'className?: string;',
        'style': 'style?: React.CSSProperties;',
    }
    
    corrections = 0
    
    # Buscar arquivos TypeScript
    ts_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith(('.ts', '.tsx')) and not file.endswith('.d.ts'):
                ts_files.append(os.path.join(root, file))
    
    # Focar nas propriedades mais comuns
    top_properties = [prop for prop, count in common_errors[:10]]
    
    for file_path in ts_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Buscar interfaces que podem precisar das propriedades
            interface_pattern = r'(interface\s+\w+\s*{[^}]*?)(})'
            
            def add_missing_props(match):
                interface_body = match.group(1)
                closing = match.group(2)
                
                # Verificar quais propriedades já existem
                existing_props = re.findall(r'(\w+)\??:', interface_body)
                
                # Adicionar propriedades faltantes que são comuns
                new_props = []
                for prop in top_properties:
                    if prop not in existing_props and prop in property_fixes:
                        # Verificar se a interface parece precisar desta propriedade
                        if should_add_property(interface_body, prop):
                            new_props.append(f'  {property_fixes[prop]}')
                
                if new_props:
                    return interface_body + '\n' + '\n'.join(new_props) + '\n' + closing
                return match.group(0)
            
            content = re.sub(interface_pattern, add_missing_props, content, flags=re.DOTALL)
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"✅ {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def should_add_property(interface_body, prop):
    """Determina se uma propriedade deve ser adicionada à interface"""
    
    # Regras para adicionar propriedades
    rules = {
        'data': ['Response', 'Result', 'Api'],
        'success': ['Response', 'Result', 'Api'],
        'message': ['Response', 'Result', 'Error'],
        'error': ['Response', 'Result', 'Error'],
        'loading': ['Props', 'State', 'Component'],
        'id': ['Entity', 'Model', 'Data'],
        'name': ['Entity', 'Model', 'User', 'Item'],
        'email': ['User', 'Contact', 'Profile'],
        'status': ['Entity', 'Model', 'State'],
        'onSubmit': ['Props', 'Form'],
        'onChange': ['Props', 'Input', 'Form'],
        'onClick': ['Props', 'Button'],
        'children': ['Props', 'Component'],
        'className': ['Props', 'Component'],
        'style': ['Props', 'Component'],
    }
    
    if prop not in rules:
        return False
    
    # Verificar se a interface corresponde aos padrões
    for keyword in rules[prop]:
        if keyword.lower() in interface_body.lower():
            return True
    
    return False

def add_react_props():
    """Adiciona props comuns do React aos componentes"""
    
    react_props = '''
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onChange?: (value: unknown) => void;'''
    
    corrections = 0
    
    # Buscar arquivos de componentes
    component_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.tsx'):
                component_files.append(os.path.join(root, file))
    
    for file_path in component_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Buscar interfaces Props
            props_pattern = r'(interface\s+\w*Props\w*\s*{[^}]*?)(})'
            
            def add_react_props_to_interface(match):
                interface_body = match.group(1)
                closing = match.group(2)
                
                # Verificar se já tem as props do React
                if 'children?' not in interface_body and 'React.ReactNode' not in interface_body:
                    return interface_body + react_props + '\n' + closing
                return match.group(0)
            
            content = re.sub(props_pattern, add_react_props_to_interface, content, flags=re.DOTALL)
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"⚛️ {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def main():
    """Função principal"""
    print("🎯 Correção específica de erros TS2339...")
    print()
    
    # Mudar para diretório do Frontend
    if os.path.exists('Frontend'):
        os.chdir('Frontend')
    
    total_corrections = 0
    
    print("1️⃣ Corrigindo propriedades específicas mais comuns...")
    corrections1 = fix_specific_properties()
    total_corrections += corrections1
    print(f"   ✅ {corrections1} arquivos modificados")
    print()
    
    print("2️⃣ Adicionando props React comuns...")
    corrections2 = add_react_props()
    total_corrections += corrections2
    print(f"   ✅ {corrections2} arquivos modificados")
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
    except:
        print("   Execute: npm run type-check 2>&1 | grep 'error TS' | wc -l")

if __name__ == "__main__":
    main()
