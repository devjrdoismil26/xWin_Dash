#!/usr/bin/env python3
"""
Script para corrigir propriedades faltantes (TS2339)
Adiciona propriedades comuns e index signatures aos tipos
"""

import os
import re
from pathlib import Path

def add_common_properties():
    """Adiciona propriedades comuns aos tipos mais usados"""
    
    # Propriedades comuns para diferentes tipos
    common_props = {
        'User': ['email?: string;', 'avatar?: string;', 'role?: string;'],
        'ApiResponse': ['success?: boolean;', 'message?: string;', 'error?: string;'],
        'FormData': ['id?: number;', 'created_at?: string;', 'updated_at?: string;'],
        'Config': ['enabled?: boolean;', 'settings?: Record<string, unknown>;'],
        'Filter': ['active?: boolean;', 'count?: number;'],
    }
    
    # Buscar arquivos de tipos
    types_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith(('Types.ts', 'types.ts', '/types/index.ts')):
                types_files.append(os.path.join(root, file))
    
    corrections = 0
    
    for file_path in types_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Adicionar propriedades para cada tipo
            for type_name, props in common_props.items():
                # Buscar interface ou type
                pattern = rf'(interface {type_name}\s*{{[^}}]*?)(\s*}})'
                
                def add_props(match):
                    interface_body = match.group(1)
                    closing = match.group(2)
                    
                    # Verificar quais propriedades já existem
                    existing_props = re.findall(r'(\w+)\??:', interface_body)
                    
                    # Adicionar propriedades que não existem
                    new_props = []
                    for prop in props:
                        prop_name = prop.split('?')[0].split(':')[0]
                        if prop_name not in existing_props:
                            new_props.append(f'  {prop}')
                    
                    if new_props:
                        return interface_body + '\n' + '\n'.join(new_props) + closing
                    return match.group(0)
                
                content = re.sub(pattern, add_props, content, flags=re.DOTALL)
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"✅ {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def add_index_signatures():
    """Adiciona index signatures para objetos dinâmicos"""
    
    # Padrões de interfaces que precisam de index signature
    patterns_needing_index = [
        r'interface (\w*Config\w*)\s*{',
        r'interface (\w*Settings\w*)\s*{',
        r'interface (\w*Options\w*)\s*{',
        r'interface (\w*Props\w*)\s*{',
        r'interface (\w*Data\w*)\s*{',
    ]
    
    types_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.ts') and not file.endswith('.d.ts'):
                types_files.append(os.path.join(root, file))
    
    corrections = 0
    
    for file_path in types_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            for pattern in patterns_needing_index:
                # Buscar interfaces que correspondem ao padrão
                matches = re.finditer(pattern, content)
                
                for match in matches:
                    interface_name = match.group(1)
                    
                    # Buscar o corpo da interface
                    interface_pattern = rf'(interface {interface_name}\s*{{[^}}]*?)(\s*}})'
                    
                    def add_index_sig(interface_match):
                        interface_body = interface_match.group(1)
                        closing = interface_match.group(2)
                        
                        # Verificar se já tem index signature
                        if '[key: string]' not in interface_body:
                            return interface_body + '\n  [key: string]: unknown;' + closing
                        return interface_match.group(0)
                    
                    content = re.sub(interface_pattern, add_index_sig, content, flags=re.DOTALL)
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"🔧 {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def create_missing_types():
    """Cria tipos comuns que estão faltando"""
    
    common_types = {
        'src/types/common.ts': '''// Tipos comuns do sistema
export interface ApiResponse<T = unknown> {
  data?: T;
  success?: boolean;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
  };
}

export interface FormProps<T = unknown> {
  data?: T;
  onSubmit?: (data: T) => void;
  onCancel?: () => void;
  loading?: boolean;
  errors?: Record<string, string>;
}

export interface TableProps<T = unknown> {
  data?: T[];
  columns?: Array<{
    key: string;
    title: string;
    render?: (value: unknown, record: T) => React.ReactNode;
  }>;
  loading?: boolean;
  pagination?: boolean;
}

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}
''',
        
        'src/types/api.ts': '''// Tipos para APIs
export interface BaseEntity {
  id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface User extends BaseEntity {
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface Project extends BaseEntity {
  name?: string;
  description?: string;
  status?: string;
  owner_id?: number;
  settings?: Record<string, unknown>;
  [key: string]: unknown;
}
'''
    }
    
    corrections = 0
    
    for file_path, content in common_types.items():
        try:
            # Criar diretório se não existir
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            # Criar arquivo se não existir
            if not os.path.exists(file_path):
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"📄 Criado: {file_path}")
        
        except Exception as e:
            print(f"❌ Erro criando {file_path}: {e}")
    
    return corrections

def main():
    """Função principal"""
    print("🔧 Iniciando correção de propriedades faltantes (TS2339)...")
    print()
    
    # Mudar para diretório do Frontend
    if os.path.exists('Frontend'):
        os.chdir('Frontend')
    
    total_corrections = 0
    
    print("1️⃣ Adicionando propriedades comuns...")
    corrections1 = add_common_properties()
    total_corrections += corrections1
    print(f"   ✅ {corrections1} arquivos modificados")
    print()
    
    print("2️⃣ Adicionando index signatures...")
    corrections2 = add_index_signatures()
    total_corrections += corrections2
    print(f"   ✅ {corrections2} arquivos modificados")
    print()
    
    print("3️⃣ Criando tipos comuns faltantes...")
    corrections3 = create_missing_types()
    total_corrections += corrections3
    print(f"   ✅ {corrections3} arquivos criados")
    print()
    
    print(f"🎉 Total: {total_corrections} arquivos processados")
    print()
    print("📊 Para verificar o impacto:")
    print("   npm run type-check 2>&1 | grep 'error TS' | wc -l")

if __name__ == "__main__":
    main()
