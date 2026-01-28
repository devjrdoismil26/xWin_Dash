import React from 'react';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
export function ConfigForm({ config = {}, onChange }) {
  const handle = (k, v) => onChange?.({ ...config, [k]: v });
  return (
    <div className="space-y-3">
      <div>
        <InputLabel htmlFor="key">Key</InputLabel>
        <Input id="key" value={config.key || ''} onChange={(e) => handle('key', e.target.value)} />
      </div>
      <div>
        <InputLabel htmlFor="value">Value</InputLabel>
        <Input id="value" value={config.value || ''} onChange={(e) => handle('value', e.target.value)} />
      </div>
    </div>
  );
}
export default ConfigForm;
