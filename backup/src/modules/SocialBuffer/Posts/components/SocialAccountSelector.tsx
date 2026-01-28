import React from 'react';
import { Select } from '@/components/ui/select';
const SocialAccountSelector = ({ accounts = [], value, onChange }) => (
  <Select value={value || ''} onChange={(e) => onChange?.(e.target.value)}>
    <option value="">Selecionar conta</option>
    {accounts.map((a) => (
      <option key={a.id} value={a.id}>{a.network} — {a.name}</option>
    ))}
  </Select>
);
export default SocialAccountSelector;
