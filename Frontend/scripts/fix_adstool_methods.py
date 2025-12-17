#!/usr/bin/env python3
"""
Script direto para adicionar métodos específicos do ADStool
"""

import os

def fix_ads_analytics_service():
    """Adiciona métodos faltantes ao AdsAnalyticsService"""
    
    file_path = 'src/modules/ADStool/services/adsAnalyticsService.ts'
    
    if not os.path.exists(file_path):
        print(f"❌ Arquivo não encontrado: {file_path}")
        return False
    
    methods_to_add = """
  async getAnalyticsSummary(params?: unknown): Promise<unknown> {
    try {
      const response = await this.apiClient.get('/ads/analytics/summary', { params });
      return response.data as unknown;
    } catch (error) {
      console.error('getAnalyticsSummary error:', error);
      throw error;
    }
  }

  async getAnalyticsOverview(params?: unknown): Promise<unknown> {
    try {
      const response = await this.apiClient.get('/ads/analytics/overview', { params });
      return response.data as unknown;
    } catch (error) {
      console.error('getAnalyticsOverview error:', error);
      throw error;
    }
  }

  async getCampaignAnalytics(campaignId: number): Promise<unknown> {
    try {
      const response = await this.apiClient.get(`/ads/campaigns/${campaignId}/analytics`);
      return response.data as unknown;
    } catch (error) {
      console.error('getCampaignAnalytics error:', error);
      throw error;
    }
  }

  async getAccountAnalytics(accountId: number): Promise<unknown> {
    try {
      const response = await this.apiClient.get(`/ads/accounts/${accountId}/analytics`);
      return response.data as unknown;
    } catch (error) {
      console.error('getAccountAnalytics error:', error);
      throw error;
    }
  }

  async getCreativeAnalytics(creativeId: number): Promise<unknown> {
    try {
      const response = await this.apiClient.get(`/ads/creatives/${creativeId}/analytics`);
      return response.data as unknown;
    } catch (error) {
      console.error('getCreativeAnalytics error:', error);
      throw error;
    }
  }

  async getKeywordInsights(params?: unknown): Promise<unknown> {
    try {
      const response = await this.apiClient.get('/ads/keywords/insights', { params });
      return response.data as unknown;
    } catch (error) {
      console.error('getKeywordInsights error:', error);
      throw error;
    }
  }

  async getPerformanceInsights(params?: unknown): Promise<unknown> {
    try {
      const response = await this.apiClient.get('/ads/performance/insights', { params });
      return response.data as unknown;
    } catch (error) {
      console.error('getPerformanceInsights error:', error);
      throw error;
    }
  }

  async generateReport(params: unknown): Promise<unknown> {
    try {
      const response = await this.apiClient.post('/ads/reports/generate', params);
      return response.data as unknown;
    } catch (error) {
      console.error('generateReport error:', error);
      throw error;
    }
  }

  async getReportStatus(reportId: number): Promise<unknown> {
    try {
      const response = await this.apiClient.get(`/ads/reports/${reportId}/status`);
      return response.data as unknown;
    } catch (error) {
      console.error('getReportStatus error:', error);
      throw error;
    }
  }

  async downloadReport(reportId: number): Promise<unknown> {
    try {
      const response = await this.apiClient.get(`/ads/reports/${reportId}/download`);
      return response.data as unknown;
    } catch (error) {
      console.error('downloadReport error:', error);
      throw error;
    }
  }

  async getAvailableReports(): Promise<unknown> {
    try {
      const response = await this.apiClient.get('/ads/reports');
      return response.data as unknown;
    } catch (error) {
      console.error('getAvailableReports error:', error);
      throw error;
    }
  }

  async compareCampaigns(campaignIds: number[]): Promise<unknown> {
    try {
      const response = await this.apiClient.post('/ads/campaigns/compare', { campaignIds });
      return response.data as unknown;
    } catch (error) {
      console.error('compareCampaigns error:', error);
      throw error;
    }
  }

  async compareAccounts(accountIds: number[]): Promise<unknown> {
    try {
      const response = await this.apiClient.post('/ads/accounts/compare', { accountIds });
      return response.data as unknown;
    } catch (error) {
      console.error('compareAccounts error:', error);
      throw error;
    }
  }

  async compareTimePeriods(params: unknown): Promise<unknown> {
    try {
      const response = await this.apiClient.post('/ads/analytics/compare-periods', params);
      return response.data as unknown;
    } catch (error) {
      console.error('compareTimePeriods error:', error);
      throw error;
    }
  }"""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Adicionar métodos antes do fechamento da classe
        if 'class AdsAnalyticsService' in content:
            # Encontrar o final da classe
            lines = content.split('\n')
            new_lines = []
            
            for i, line in enumerate(lines):
                new_lines.append(line)
                # Se é o penúltimo } da classe, adicionar métodos
                if line.strip() == '}' and i > 0:
                    # Verificar se é realmente o final da classe
                    remaining_lines = lines[i+1:]
                    if not any('class ' in l for l in remaining_lines):
                        # Inserir métodos antes do }
                        new_lines.pop()  # Remove o }
                        new_lines.append(methods_to_add)
                        new_lines.append('}')
                        break
            
            new_content = '\n'.join(new_lines)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ {file_path}")
            return True
    
    except Exception as e:
        print(f"❌ Erro em {file_path}: {e}")
        return False

def fix_adstool_service():
    """Adiciona métodos faltantes ao ADStoolServiceClass"""
    
    file_path = 'src/modules/ADStool/services/adsToolService.ts'
    
    if not os.path.exists(file_path):
        print(f"❌ Arquivo não encontrado: {file_path}")
        return False
    
    methods_to_add = """
  async getAccounts(): Promise<unknown> {
    try {
      const response = await this.apiClient.get('/ads/accounts');
      return response.data as unknown;
    } catch (error) {
      console.error('getAccounts error:', error);
      throw error;
    }
  }

  async getCreatives(): Promise<unknown> {
    try {
      const response = await this.apiClient.get('/ads/creatives');
      return response.data as unknown;
    } catch (error) {
      console.error('getCreatives error:', error);
      throw error;
    }
  }

  async getAnalytics(): Promise<unknown> {
    try {
      const response = await this.apiClient.get('/ads/analytics');
      return response.data as unknown;
    } catch (error) {
      console.error('getAnalytics error:', error);
      throw error;
    }
  }"""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Adicionar métodos antes do fechamento da classe
        if 'class ADStoolServiceClass' in content or 'class AdsToolService' in content:
            lines = content.split('\n')
            new_lines = []
            
            for i, line in enumerate(lines):
                new_lines.append(line)
                if line.strip() == '}' and i > 0:
                    remaining_lines = lines[i+1:]
                    if not any('class ' in l for l in remaining_lines):
                        new_lines.pop()
                        new_lines.append(methods_to_add)
                        new_lines.append('}')
                        break
            
            new_content = '\n'.join(new_lines)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ {file_path}")
            return True
    
    except Exception as e:
        print(f"❌ Erro em {file_path}: {e}")
        return False

def fix_ads_creative_service():
    """Adiciona método resumeCreative ao AdsCreativeService"""
    
    file_path = 'src/modules/ADStool/services/adsCreativeService.ts'
    
    if not os.path.exists(file_path):
        print(f"❌ Arquivo não encontrado: {file_path}")
        return False
    
    method_to_add = """
  async resumeCreative(creativeId: number): Promise<unknown> {
    try {
      const response = await this.apiClient.post(`/ads/creatives/${creativeId}/resume`);
      return response.data as unknown;
    } catch (error) {
      console.error('resumeCreative error:', error);
      throw error;
    }
  }"""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'class AdsCreativeService' in content:
            lines = content.split('\n')
            new_lines = []
            
            for i, line in enumerate(lines):
                new_lines.append(line)
                if line.strip() == '}' and i > 0:
                    remaining_lines = lines[i+1:]
                    if not any('class ' in l for l in remaining_lines):
                        new_lines.pop()
                        new_lines.append(method_to_add)
                        new_lines.append('}')
                        break
            
            new_content = '\n'.join(new_lines)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ {file_path}")
            return True
    
    except Exception as e:
        print(f"❌ Erro em {file_path}: {e}")
        return False

def add_pagination_property():
    """Adiciona propriedade pagination onde necessário"""
    
    # Buscar interfaces que precisam de pagination
    interfaces_to_fix = [
        'src/modules/ADStool/types/adsAccountTypes.ts',
        'src/modules/ADStool/types/adsCampaignTypes.ts',
        'src/modules/ADStool/types/adsCreativeTypes.ts',
    ]
    
    corrections = 0
    
    for file_path in interfaces_to_fix:
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Adicionar pagination a interfaces Response
                if 'Response' in content and 'pagination' not in content:
                    # Buscar interfaces Response
                    import re
                    pattern = r'(interface\s+\w*Response\w*\s*{[^}]*?)(})'
                    
                    def add_pagination(match):
                        interface_body = match.group(1)
                        interface_end = match.group(2)
                        
                        if 'pagination' not in interface_body:
                            return interface_body + '\n  pagination?: { page?: number; limit?: number; total?: number; };\n' + interface_end
                        return match.group(0)
                    
                    content = re.sub(pattern, add_pagination, content, flags=re.DOTALL)
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    corrections += 1
                    print(f"🔧 {file_path}")
            
            except Exception as e:
                print(f"❌ Erro em {file_path}: {e}")
    
    return corrections

def main():
    """Função principal"""
    print("🎯 Corrigindo métodos específicos do ADStool...")
    print()
    
    if os.path.exists('Frontend'):
        os.chdir('Frontend')
    
    corrections = 0
    
    print("1️⃣ Corrigindo AdsAnalyticsService...")
    if fix_ads_analytics_service():
        corrections += 1
    
    print("2️⃣ Corrigindo ADStoolServiceClass...")
    if fix_adstool_service():
        corrections += 1
    
    print("3️⃣ Corrigindo AdsCreativeService...")
    if fix_ads_creative_service():
        corrections += 1
    
    print("4️⃣ Adicionando propriedade pagination...")
    corrections += add_pagination_property()
    
    print()
    print(f"🎉 Total: {corrections} arquivos corrigidos")
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
        
        previous_errors = 6330
        if error_count < previous_errors:
            reduction = previous_errors - error_count
            print(f"   Redução: -{reduction} erros ✅")
            
            if error_count < 6000:
                print(f"   🎯 META <6,000 ERROS ATINGIDA! 🎉")
        else:
            increase = error_count - previous_errors
            print(f"   Variação: +{increase} erros")
    except:
        print("   Execute: npm run type-check")

if __name__ == "__main__":
    main()
