// ========================================
// ANALYTICS EXPORT - EXPORTAÇÃO DE DADOS
// ========================================
import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, FileImage, Calendar, Filter, Settings, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import { cn } from '@/lib/utils';

interface AnalyticsExportProps {
  onExport??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const AnalyticsExport: React.FC<AnalyticsExportProps> = ({ onExport,
  className
   }) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xlsx' | 'pdf' | 'json'>('csv');

  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeRawData: false,
    dateRange: '30d',
    customDateRange: { start: '', end: '' },
    filters: {
      status: [] as string[],
      origin: [] as string[],
      scoreRange: { min: 0, max: 100 } });

  const [isExporting, setIsExporting] = useState(false);

  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    setIsExporting(true);

    setExportStatus('idle');

    try {
      // Simular processo de exportação
      await new Promise(resolve => setTimeout(resolve, 2000));

      onExport?.(selectedFormat);

      setExportStatus('success');

    } catch (error) {
      setExportStatus('error');

    } finally {
      setIsExporting(false);

    } ;

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: <FileSpreadsheet className="w-4 h-4" />, description: 'Dados tabulares' },
    { value: 'xlsx', label: 'Excel', icon: <FileSpreadsheet className="w-4 h-4" />, description: 'Planilha Excel' },
    { value: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" />, description: 'Relatório PDF' },
    { value: 'json', label: 'JSON', icon: <FileText className="w-4 h-4" />, description: 'Dados estruturados' }
  ];

  return (
        <>
      <Card className={cn("p-6", className) } />
      <div className=" ">$2</div><Download className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Exportar Analytics</h3></div><div className="{/* Format Selection */}">$2</div>
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-3" />
            Formato de Exportação
          </label>
          <div className="{(formatOptions || []).map((format: unknown) => (">$2</div>
              <button
                key={ format.value }
                onClick={ () => setSelectedFormat(format.value as 'csv' | 'xlsx' | 'pdf' | 'json') }
                className={cn(
                  "p-3 border rounded-lg text-left transition-colors",
                  selectedFormat === format.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                )  }>
                <div className="{format.icon}">$2</div>
                  <span className="font-medium text-gray-900">{format.label}</span></div><div className="text-xs text-gray-600">{format.description}</div>
      </button>
    </>
  ))}
          </div>

        {/* Export Options */}
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-3" />
            Opções de Exportação
          </label>
          <div className=" ">$2</div><label className="flex items-center gap-2" />
              <input
                type="checkbox"
                checked={ exportOptions.includeCharts }
                onChange={(e: unknown) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Incluir gráficos e visualizações</span></label><label className="flex items-center gap-2" />
              <input
                type="checkbox"
                checked={ exportOptions.includeRawData }
                onChange={(e: unknown) => setExportOptions(prev => ({ ...prev, includeRawData: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Incluir dados brutos</span></label></div>

        {/* Date Range */}
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-3" />
            Período
          </label>
          <select
            value={ exportOptions.dateRange }
            onChange={(e: unknown) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
            <option value="custom">Período personalizado</option>
          </select>
          {exportOptions.dateRange === 'custom' && (
            <div className=" ">$2</div><input
                type="date"
                value={ exportOptions.customDateRange.start }
                onChange={ (e: unknown) => setExportOptions(prev => ({
                  ...prev,
                  customDateRange: { ...prev.customDateRange, start: e.target.value  } ))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Data inicial" />
              <input
                type="date"
                value={ exportOptions.customDateRange.end }
                onChange={ (e: unknown) => setExportOptions(prev => ({
                  ...prev,
                  customDateRange: { ...prev.customDateRange, end: e.target.value  } ))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Data final" />
            </div>
          )}
        </div>

        {/* Export Status */}
        { exportStatus !== 'idle' && (
          <div className={cn(
            "p-3 rounded-lg flex items-center gap-2",
            exportStatus === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )  }>
        </div>{exportStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="{exportStatus === 'success' ">$2</span>
                ? 'Exportação concluída com sucesso!' 
                : 'Erro na exportação. Tente novamente.'
              }
            </span>
      </div>
    </>
  )}

        {/* Export Button */}
        <Button
          onClick={ handleExport }
          disabled={ isExporting }
          className="w-full" />
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Exportar {formatOptions.find(f => f.value === selectedFormat)?.label}
            </>
          )}
        </Button></div></Card>);};

export default AnalyticsExport;