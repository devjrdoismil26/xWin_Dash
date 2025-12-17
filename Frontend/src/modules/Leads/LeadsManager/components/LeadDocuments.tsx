/**
 * Componente LeadDocuments
 *
 * @description
 * Componente para exibir e gerenciar documentos de um lead específico.
 *
 * @module modules/Leads/LeadsManager/components/LeadDocuments
 * @since 1.0.0
 */

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { Plus, File, Download, Trash2, Clock } from 'lucide-react';
import { LeadDocument } from '@/types';

/**
 * Props do componente LeadDocuments
 *
 * @interface LeadDocumentsProps
 * @property {LeadDocument[]} documents - Lista de documentos do lead
 * @property {boolean} loading - Se está carregando
 * @property {number} leadId - ID do lead
 */
interface LeadDocumentsProps {
  documents: LeadDocument[];
  loading: boolean;
  leadId: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Formata tamanho de arquivo para exibição
 *
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} Tamanho formatado
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;};

/**
 * Obtém ícone baseado no tipo de arquivo
 *
 * @param {string} fileType - Tipo MIME do arquivo
 * @returns {JSX.Element} Ícone do arquivo
 */
const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) {
    return <File className="w-5 h-5 text-red-600 dark:text-red-400" />;
  }
  if (fileType.includes('image')) {
    return <File className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
  }
  if (fileType.includes('word') || fileType.includes('document')) {
    return <File className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
  }
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
    return <File className="w-5 h-5 text-green-600 dark:text-green-400" />;
  }
  return <File className="w-5 h-5 text-gray-600 dark:text-gray-400" />;};

/**
 * Componente LeadDocuments
 *
 * @description
 * Exibe uma lista de documentos do lead com opção de adicionar novos documentos.
 *
 * @param {LeadDocumentsProps} props - Props do componente
 * @returns {JSX.Element} Componente de documentos
 *
 * @example
 * ```tsx
 * <LeadDocuments
 *   documents={ documents }
 *   loading={ false }
 *   leadId={ 123 }
 * / />
 * ```
 */
export const LeadDocuments: React.FC<LeadDocumentsProps> = ({ documents, loading, leadId    }) => {
  const handleAddDocument = () => {};

  const handleDownload = (document: LeadDocument) => {
    window.open(document.url, '_blank');};

  const handleDelete = (documentId: number) => {};

  if (loading) {
    return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><LoadingSpinner size="md" / /></div></Card>);

  }

  return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center" />
          <File className="w-5 h-5 mr-2" />
          Documentos
        </h3>
        <Button onClick={handleAddDocument} variant="primary" size="sm" />
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Documento
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className=" ">$2</div><File className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum documento encontrado</p>
      </div>
    </>
  ) : (
        <div className="{(documents || []).map((document: unknown) => (">$2</div>
            <div
              key={ document.id }
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
           
        </div><div className=" ">$2</div><div className="{getFileIcon(document.file_type)}">$2</div>
                  <div className=" ">$2</div><h4 className="font-medium text-gray-900 dark:text-white truncate" />
                      {document.original_name}
                    </h4>
                    <div className=" ">$2</div><span>{formatFileSize(document.file_size)}</span>
                      <span className=" ">$2</span><Clock className="w-3 h-3 mr-1" />
                        {new Date(document.uploaded_at).toLocaleDateString('pt-BR')}
                      </span></div></div>
                <div className=" ">$2</div><Button
                    onClick={ () => handleDownload(document) }
                    variant="secondary"
                    size="sm"
                    title="Download"
                  >
                    <Download className="w-4 h-4" /></Button><Button
                    onClick={ () => handleDelete(document.id) }
                    variant="danger"
                    size="sm"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" /></Button></div>
    </div>
  ))}
        </div>
      )}
    </Card>);};

export default LeadDocuments;
