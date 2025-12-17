#!/usr/bin/env python3
"""
Corrige fechamento de métodos
"""

import os

def fix_ads_analytics_service():
    """Corrige o fechamento do método no AdsAnalyticsService"""
    
    file_path = 'src/modules/ADStool/services/adsAnalyticsService.ts'
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Corrigir o problema específico
        content = content.replace(
            '''      return {
        success: false,
        error: errorMessage
      };

  async getAnalyticsSummary''',
            '''      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async getAnalyticsSummary'''
        )
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {file_path}")
        return True
    
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    if os.path.exists('Frontend'):
        os.chdir('Frontend')
    
    print("🔧 Corrigindo fechamento de métodos...")
    
    if fix_ads_analytics_service():
        print("✅ Correção aplicada")
    
    # Verificar
    import subprocess
    try:
        result = subprocess.run(['npm', 'run', 'type-check'], capture_output=True, text=True)
        error_count = result.stderr.count('error TS')
        print(f"📊 Erros atuais: {error_count}")
    except:
        pass

if __name__ == "__main__":
    main()
