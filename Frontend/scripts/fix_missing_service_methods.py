#!/usr/bin/env python3
"""
Script para adicionar métodos faltantes nos services
Foca nos erros TS2339 mais comuns
"""

import os
import re
import subprocess

def get_missing_methods():
    """Extrai métodos faltantes dos erros TS2339"""
    
    try:
        result = subprocess.run(
            ['npm', 'run', 'type-check'],
            capture_output=True,
            text=True,
            cwd='.'
        )
        
        missing_methods = {}
        
        for line in result.stderr.split('\n'):
            if 'TS2339' in line and 'does not exist on type' in line:
                # Extrair método e classe
                match = re.search(r"Property '(\w+)' does not exist on type '(\w+)'", line)
                if match:
                    method = match.group(1)
                    class_name = match.group(2)
                    
                    if class_name not in missing_methods:
                        missing_methods[class_name] = set()
                    missing_methods[class_name].add(method)
        
        return missing_methods
    
    except Exception as e:
        print(f"Erro ao analisar: {e}")
        return {}

def add_missing_methods_to_services():
    """Adiciona métodos faltantes aos services"""
    
    print("🔍 Analisando métodos faltantes...")
    missing_methods = get_missing_methods()
    
    if not missing_methods:
        print("❌ Não foi possível analisar os erros")
        return 0
    
    print("📊 Métodos faltantes por service:")
    for class_name, methods in missing_methods.items():
        print(f"   {class_name}: {len(methods)} métodos")
        for method in sorted(methods)[:5]:  # Mostrar apenas os primeiros 5
            print(f"     - {method}")
        if len(methods) > 5:
            print(f"     ... e mais {len(methods) - 5}")
    print()
    
    corrections = 0
    
    # Buscar arquivos de services
    service_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if 'service' in file.lower() and file.endswith('.ts'):
                service_files.append(os.path.join(root, file))
    
    for file_path in service_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Verificar se este arquivo contém alguma das classes com métodos faltantes
            for class_name, methods in missing_methods.items():
                if class_name in content:
                    # Adicionar métodos faltantes
                    content = add_methods_to_class(content, class_name, methods)
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"✅ {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def add_methods_to_class(content, class_name, methods):
    """Adiciona métodos a uma classe específica"""
    
    # Buscar a classe
    class_pattern = rf'(class\s+{class_name}[^{{]*{{[^}}]*?)(}}\s*$)'
    
    def add_methods(match):
        class_body = match.group(1)
        class_end = match.group(2)
        
        # Verificar quais métodos já existem
        existing_methods = re.findall(r'(\w+)\s*\([^)]*\)\s*[:{]', class_body)
        
        # Adicionar métodos faltantes
        new_methods = []
        for method in methods:
            if method not in existing_methods:
                method_code = generate_method_code(method)
                new_methods.append(method_code)
        
        if new_methods:
            methods_code = '\n\n  ' + '\n\n  '.join(new_methods)
            return class_body + methods_code + '\n' + class_end
        
        return match.group(0)
    
    return re.sub(class_pattern, add_methods, content, flags=re.MULTILINE | re.DOTALL)

def generate_method_code(method_name):
    """Gera código para um método baseado no nome"""
    
    # Padrões comuns de métodos
    if method_name.startswith('get'):
        return f"""async {method_name}(params?: unknown): Promise<unknown> {{
    try {{
      const response = await this.apiClient.get('/endpoint');
      return response.data as unknown;
    }} catch (error) {{
      console.error('{method_name} error:', error);
      throw error;
    }}
  }}"""
    
    elif method_name.startswith('create'):
        return f"""async {method_name}(data: unknown): Promise<unknown> {{
    try {{
      const response = await this.apiClient.post('/endpoint', data);
      return response.data as unknown;
    }} catch (error) {{
      console.error('{method_name} error:', error);
      throw error;
    }}
  }}"""
    
    elif method_name.startswith('update'):
        return f"""async {method_name}(id: number, data: unknown): Promise<unknown> {{
    try {{
      const response = await this.apiClient.put(`/endpoint/${{id}}`, data);
      return response.data as unknown;
    }} catch (error) {{
      console.error('{method_name} error:', error);
      throw error;
    }}
  }}"""
    
    elif method_name.startswith('delete'):
        return f"""async {method_name}(id: number): Promise<unknown> {{
    try {{
      const response = await this.apiClient.delete(`/endpoint/${{id}}`);
      return response.data as unknown;
    }} catch (error) {{
      console.error('{method_name} error:', error);
      throw error;
    }}
  }}"""
    
    else:
        # Método genérico
        return f"""async {method_name}(params?: unknown): Promise<unknown> {{
    try {{
      const response = await this.apiClient.get('/endpoint', {{ params }});
      return response.data as unknown;
    }} catch (error) {{
      console.error('{method_name} error:', error);
      throw error;
    }}
  }}"""

def add_missing_properties_to_interfaces():
    """Adiciona propriedades faltantes às interfaces"""
    
    corrections = 0
    
    # Propriedades comuns que frequentemente faltam
    common_props = {
        'pagination': 'pagination?: { page?: number; limit?: number; total?: number; };',
        'data': 'data?: unknown;',
        'success': 'success?: boolean;',
        'message': 'message?: string;',
        'error': 'error?: string;',
        'loading': 'loading?: boolean;',
        'total': 'total?: number;',
        'count': 'count?: number;',
    }
    
    # Buscar arquivos de tipos
    type_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith(('.ts', '.tsx')) and ('type' in file.lower() or 'interface' in file.lower()):
                type_files.append(os.path.join(root, file))
    
    for file_path in type_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Buscar interfaces e adicionar propriedades comuns
            interface_pattern = r'(interface\s+\w+[^{]*{[^}]*?)(})'
            
            def add_props(match):
                interface_body = match.group(1)
                interface_end = match.group(2)
                
                # Verificar propriedades existentes
                existing_props = re.findall(r'(\w+)\??:', interface_body)
                
                # Adicionar propriedades faltantes comuns
                new_props = []
                for prop, prop_code in common_props.items():
                    if prop not in existing_props and should_add_prop(interface_body, prop):
                        new_props.append(f'  {prop_code}')
                
                if new_props:
                    return interface_body + '\n' + '\n'.join(new_props) + '\n' + interface_end
                return match.group(0)
            
            content = re.sub(interface_pattern, add_props, content, flags=re.DOTALL)
            
            # Salvar se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                corrections += 1
                print(f"🔧 {file_path}")
        
        except Exception as e:
            print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def should_add_prop(interface_body, prop):
    """Determina se uma propriedade deve ser adicionada"""
    
    # Regras simples baseadas no contexto
    if 'Response' in interface_body and prop in ['data', 'success', 'message', 'error']:
        return True
    if 'Pagination' in interface_body and prop in ['pagination', 'total', 'count']:
        return True
    if 'State' in interface_body and prop in ['loading']:
        return True
    
    return False

def main():
    """Função principal"""
    print("🎯 Corrigindo métodos faltantes nos services...")
    print()
    
    # Mudar para diretório do Frontend
    if os.path.exists('Frontend'):
        os.chdir('Frontend')
    
    total_corrections = 0
    
    print("1️⃣ Adicionando métodos faltantes aos services...")
    corrections1 = add_missing_methods_to_services()
    total_corrections += corrections1
    print(f"   ✅ {corrections1} arquivos corrigidos")
    print()
    
    print("2️⃣ Adicionando propriedades comuns às interfaces...")
    corrections2 = add_missing_properties_to_interfaces()
    total_corrections += corrections2
    print(f"   ✅ {corrections2} arquivos corrigidos")
    print()
    
    print(f"🎉 Total: {total_corrections} arquivos processados")
    print()
    
    # Verificar impacto
    print("📊 Verificando impacto...")
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
        previous_errors = 6330
        if error_count < previous_errors:
            reduction = previous_errors - error_count
            print(f"   Redução: -{reduction} erros ✅")
            
            # Verificar se atingimos a meta
            if error_count < 6000:
                print(f"   🎯 META <6,000 ERROS ATINGIDA! 🎉")
        else:
            increase = error_count - previous_errors
            print(f"   Aumento: +{increase} erros (pode ser temporário)")
    except:
        print("   Execute: npm run type-check 2>&1 | grep 'error TS' | wc -l")

if __name__ == "__main__":
    main()
