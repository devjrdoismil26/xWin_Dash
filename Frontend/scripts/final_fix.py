#!/usr/bin/env python3

import os

def fix_creative_service():
    file_path = 'src/modules/ADStool/services/adsCreativeService.ts'
    
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Corrigir o problema específico
        content = content.replace(
            '''      return {
        success: false,
        error: errorMessage
      };

  async resumeCreative''',
            '''      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async resumeCreative'''
        )
        
        with open(file_path, 'w') as f:
            f.write(content)
        
        print(f"✅ {file_path}")
    except Exception as e:
        print(f"❌ {e}")

if __name__ == "__main__":
    if os.path.exists('Frontend'):
        os.chdir('Frontend')
    fix_creative_service()
