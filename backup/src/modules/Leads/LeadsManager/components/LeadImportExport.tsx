import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  FileSpreadsheet,
  FileCheck,
  FileX
} from 'lucide-react';
import { LeadImportTemplate, LeadImportValidation } from '../../types';

interface LeadImportExportProps {
  onImportComplete?: (result: any) => void;
  onExportComplete?: (result: any) => void;
}

const LeadImportExport: React.FC<LeadImportExportProps> = ({
  onImportComplete,
  onExportComplete
}) => {
  const {
    importTemplate,
    exportTemplate,
    validation,
    loading,
    error,
    getImportTemplate,
    getExportTemplate,
    validateImport
  } = useLeadImportExport();

  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<LeadImportValidation | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowValidation(false);
      setValidationResult(null);
    }
  };

  const handleValidateFile = async () => {
    if (!selectedFile) return;

    const result = await validateImport(selectedFile);
    if (result) {
      setValidationResult(result);
      setShowValidation(true);
    }
  };

  const handleDownloadTemplate = () => {
    if (importTemplate?.download_url) {
      const link = document.createElement('a');
      link.href = importTemplate.download_url;
      link.download = importTemplate.filename || 'lead_import_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadExportTemplate = () => {
    if (exportTemplate?.download_url) {
      const link = document.createElement('a');
      link.href = exportTemplate.download_url;
      link.download = exportTemplate.filename || 'lead_export_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      case 'csv':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Importar / Exportar Leads
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'import'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Importar
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Download className="w-4 h-4 inline mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'import' ? (
          <div className="space-y-6">
            {/* Template Download */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Template de Importação
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Baixe o template para importar leads corretamente
                  </p>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  disabled={!importTemplate}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Template
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um arquivo para importar
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Formatos suportados: .xlsx, .xls, .csv
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Selecionar Arquivo
                </button>
              </div>

              {/* Selected File */}
              {selectedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(selectedFile.name)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleValidateFile}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Validando...' : 'Validar'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setValidationResult(null);
                          setShowValidation(false);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Results */}
            {showValidation && validationResult && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  {getValidationIcon(validationResult.is_valid)}
                  <h4 className="text-sm font-medium text-gray-900">
                    Resultado da Validação
                  </h4>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {validationResult.valid_rows}
                    </p>
                    <p className="text-xs text-gray-500">Linhas Válidas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {validationResult.invalid_rows}
                    </p>
                    <p className="text-xs text-gray-500">Linhas Inválidas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {validationResult.total_rows}
                    </p>
                    <p className="text-xs text-gray-500">Total de Linhas</p>
                  </div>
                </div>

                {validationResult.errors && validationResult.errors.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      Erros Encontrados:
                    </h5>
                    <div className="max-h-32 overflow-y-auto">
                      {validationResult.errors.map((error, index) => (
                        <div key={index} className="text-xs text-red-600 mb-1">
                          Linha {error.row}: {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.is_valid && (
                  <div className="mt-4">
                    <button
                      onClick={() => onImportComplete?.(validationResult)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <FileCheck className="w-4 h-4 inline mr-2" />
                      Confirmar Importação
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Export Options */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-green-900">
                    Template de Exportação
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Baixe o template para exportar leads
                  </p>
                </div>
                <button
                  onClick={handleDownloadExportTemplate}
                  disabled={!exportTemplate}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Template
                </button>
              </div>
            </div>

            {/* Export Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato de Exportação
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="json">JSON (.json)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campos para Exportar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Nome', 'Email', 'Telefone', 'Empresa', 'Origem', 'Status', 'Score', 'Data de Criação'].map((field) => (
                    <label key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onExportComplete?.({})}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Exportar Leads
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FileX className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadImportExport;
