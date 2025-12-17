import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, Save, Users, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputError from '@/shared/components/ui/InputError';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import Switch from '@/shared/components/ui/Switch';
import Progress from '@/shared/components/ui/Progress';
import { EmailList } from '@/types/emailTypes';
interface EmailListFormProps {
  list?: EmailList | null;
  onSave??: (e: any) => void;
  onCancel???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
interface FormData {
  name: string;
  description: string;
  type: string;
  is_active: boolean;
  allow_public_subscription: boolean;
  send_welcome_email: boolean;
  welcome_email_template_id: string;
  tags: string[]; }
interface FormErrors {
  name?: string;
  type?: string;
  [key: string]: string | undefined; }
const LIST_TYPES = [
  { value: 'subscribers', label: 'Assinantes' },
  { value: 'prospects', label: 'Prospects' },
  { value: 'customers', label: 'Clientes' },
  { value: 'vip', label: 'VIP' },
];
const EmailListForm: React.FC<EmailListFormProps> = ({ list = null, 
  onSave, 
  onCancel 
   }) => {
  const isEditing = Boolean(list);

  const [form, setForm] = useState<FormData>({
    name: list?.name || '',
    description: list?.description || '',
    type: list?.type || 'subscribers',
    is_active: list?.is_active ?? true,
    allow_public_subscription: list?.allow_public_subscription ?? false,
    send_welcome_email: list?.send_welcome_email ?? true,
    welcome_email_template_id: list?.welcome_email_template_id || '',
    tags: Array.isArray(list?.tags) ? list.tags : [],
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isEditing) {
      setForm((prev: unknown) => ({
        ...prev,
        name: list?.name || '',
        description: list?.description || '',
        type: list?.type || 'subscribers',
        is_active: list?.is_active ?? true,
        allow_public_subscription: list?.allow_public_subscription ?? false,
        send_welcome_email: list?.send_welcome_email ?? true,
        welcome_email_template_id: list?.welcome_email_template_id || '',
        tags: Array.isArray(list?.tags) ? list.tags : [],
      }));

    } , [isEditing, list]);

  const validate = useCallback((): boolean => {
    const nextErrors: FormErrors = {} as any;
    if (!form.name.trim()) nextErrors.name = 'Nome da lista é obrigatório';
    if (!form.type) nextErrors.type = 'Tipo é obrigatório';
    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const handleChange = useCallback((field: keyof FormData, value: unknown) => {
    setForm((prev: unknown) => ({ ...prev, [field]: value }));

    if (errors[field]) setErrors((e: unknown) => ({ ...e, [field]: undefined }));

  }, [errors]);

  const addTag = useCallback((newTag: string) => {
    const tag = String(newTag || '').trim();

    if (!tag) return;
    setForm((prev: unknown) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag],
    }));

  }, []);

  const removeTag = useCallback((index: number) => {
    setForm((prev: unknown) => ({
      ...prev,
      tags: (prev.tags || []).filter((_: unknown, i: unknown) => i !== index),
    }));

  }, []);

  const downloadTemplate = useCallback(() => {
    const csvContent = 'email,name,phone,company\nexample@email.com,João Silva,11999999999,Empresa XYZ\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = 'template_contatos.csv';
    link.click();

    window.URL.revokeObjectURL(url);

  }, []);

  const [uploading, setUploading] = useState<boolean>(false);

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    const ok = file.name.endsWith('.csv') || file.name.endsWith('.xlsx');

    if (!ok) {
      toast.error('Apenas arquivos CSV e XLSX são aceitos.');

      return;
    }
    // Placeholder de upload com barra de progresso fake
    setUploading(true);

    setUploadProgress(10);

    const id = setInterval(() => {
      setUploadProgress((p: unknown) => {
        if (p >= 100) {
          clearInterval(id);

          setUploading(false);

          toast.success('Importação simulada concluída.');

          return 100;
        }
        return p + 15;
      });

    }, 200);

  }, []);

  const getTypeIcon = useCallback((t: string): string => {
    switch (t) {
      case 'prospects': return '🎯';
      case 'customers': return '💰';
      case 'vip': return '⭐';
      case 'subscribers':
      default:
        return '📧';
    } , []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e?.preventDefault?.();

    if (!validate()) {
      toast.error('Corrija os erros do formulário.');

      return;
    }
    setLoading(true);

    try {
      onSave?.(form);

      toast.success(isEditing ? 'Lista atualizada com sucesso!' : 'Lista criada com sucesso!');

    } finally {
      setLoading(false);

    } , [form, isEditing, onSave, validate]);

  const tagsHelper = useMemo(() => form.tags || [], [form.tags]);

  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <div className=" ">$2</div><Card.Title className="flex items-center space-x-2" />
              <Mail className="w-5 h-5" />
              <span>{isEditing ? 'Editar Lista' : 'Nova Lista de Email'}</span>
            </Card.Title>
            <div className=" ">$2</div><Button onClick={onCancel} variant="outline" disabled={ loading } />
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex items-center space-x-2" />
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white">
          ) : (
        </div>
      <Save className="w-4 h-4" />
    </>
  )}
                <span>{loading ? 'Salvando...' : 'Salvar Lista'}</span></Button></div>
        </Card.Header>
        <Card.Content />
          <form onSubmit={handleSubmit} className="space-y-6" />
            <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="name">Nome da Lista *</InputLabel>
                <Input
                  id="name"
                  value={ form.name }
                  onChange={ (e: unknown) => handleChange('name', e.target.value) }
                  placeholder="Ex: Newsletter Semanal"
                  className={errors.name ? 'border-red-500' : '' } />
                <InputError text={errors.name} / /></div><div>
           
        </div><InputLabel htmlFor="type">Tipo da Lista *</InputLabel>
                <Select
                  id="type"
                  value={ form.type }
                  onChange={ (e: unknown) => handleChange('type', e.target.value) }
                  className={errors.type ? 'border-red-500' : ''  }>
                  {(LIST_TYPES || []).map((type: unknown) => (
                    <option key={type.value} value={ type.value } />
                      {getTypeIcon(type.value)} {type.label}
                    </option>
                  ))}
                </Select>
                <InputError text={errors.type} / /></div><div>
           
        </div><InputLabel htmlFor="description">Descrição</InputLabel>
              <Textarea
                id="description"
                value={ form.description }
                onChange={ (e: unknown) => handleChange('description', e.target.value) }
                placeholder="Descreva o propósito desta lista..." /></div><div className=" ">$2</div><h3 className="font-medium">Configurações</h3>
              <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h4 className="font-medium">Ativa</h4>
                    <p className="text-sm text-gray-600">Permite envio de campanhas para esta lista</p></div><Switch checked={form.is_active} onCheckedChange={ (v: unknown) => handleChange('is_active', v) } /></div><div className=" ">$2</div><div>
           
        </div><h4 className="font-medium">Inscrição pública</h4>
                    <p className="text-sm text-gray-600">Permite inscrições através de formulários públicos</p></div><Switch
                    checked={ form.allow_public_subscription }
                    onCheckedChange={ (v: unknown) => handleChange('allow_public_subscription', v) } /></div></div>
            <div className=" ">$2</div><div className=" ">$2</div><h4 className="font-medium text-blue-800">Enviar e-mail de boas-vindas</h4>
                <Switch
                  checked={ form.send_welcome_email }
                  onCheckedChange={ (v: unknown) => handleChange('send_welcome_email', v) } />
              </div>
              {form.send_welcome_email && (
                <div>
           
        </div><InputLabel htmlFor="welcome_email_template_id">Template de Boas-vindas</InputLabel>
                  <Select
                    id="welcome_email_template_id"
                    value={ form.welcome_email_template_id }
                    onChange={ (e: unknown) => handleChange('welcome_email_template_id', e.target.value)  }>
                    <option value="">Selecione um template</option></Select></div>
              )}
            </div>
            <div className=" ">$2</div><InputLabel>Tags</InputLabel>
              <div className=" ">$2</div><Input
                  placeholder="Adicionar tag..."
                  onKeyDown={ (e: unknown) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();

                      addTag(e.currentTarget.value);

                      e.currentTarget.value = '';
                     } } />
                <Button
                  type="button"
                  onClick={ (e: unknown) => {
                    const prev = e.currentTarget.previousElementSibling;
                    const input = prev && prev instanceof HTMLInputElement ? prev : null;
                    if (input) {
                      addTag(input.value);

                      input.value = '';
                     } }
  >
                  Adicionar
                </Button>
              </div>
              {tagsHelper.length > 0 && (
                <div className="{(tagsHelper || []).map((tag: unknown, index: unknown) => (">$2</div>
                    <div
                      key={`${tag}-${index}`}
                      className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
           
        </div><span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={ () => removeTag(index)  }>
                        ×
                      </button>
      </div>
    </>
  ))}
                </div>
              )}
            </div>
            <Card />
              <Card.Header />
                <Card.Title className="flex items-center space-x-2" />
                  <Upload className="w-5 h-5" />
                  <span>Importar contatos</span>
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4" />
                <div className=" ">$2</div><h4 className="font-medium">Template de CSV</h4>
                  <Button type="button" onClick={downloadTemplate} variant="outline" size="sm" className="flex items-center space-x-1" />
                    <Download className="w-4 h-4" />
                    <span>Baixar</span></Button></div>
                {!uploading ? (
                  <div className=" ">$2</div><Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Envie um CSV ou XLSX com as colunas email,name,phone,company</p>
                    <Input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="max-w-xs mx-auto" />
                    <p className="text-xs text-gray-500 mt-2">Tamanho máximo: 5MB</p>
      </div>
    </>
  ) : (
                  <div className=" ">$2</div><div className=" ">$2</div><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600">
           
        </div><span>Importando...</span></div><Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                  </div>
                )}
              </Card.Content></Card></form>
        </Card.Content></Card></div>);};

export default EmailListForm;
