import React from 'react';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';

interface Config {
  key?: string;
  value?: string; }

interface ConfigFormProps {
  config?: Config;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

export function ConfigForm({ config = {} as any, onChange }: ConfigFormProps) {
  const handle = (k: string, v: string) => onChange?.({ ...config, [k]: v });

  return (
            <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="key">Key</InputLabel>
        <Input id="key" value={config.key || ''} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handle('key', e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="value">Value</InputLabel>
        <Input id="value" value={config.value || ''} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handle('value', e.target.value) } />
      </div>);

}
export default ConfigForm;
