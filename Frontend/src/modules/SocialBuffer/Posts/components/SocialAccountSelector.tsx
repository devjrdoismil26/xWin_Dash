import React from 'react';
import Select from '@/shared/components/ui/Select';
interface SocialAccountSelectorProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const SocialAccountSelector = ({ accounts = [] as unknown[], value, onChange }) => (
  <Select value={value || ''} onChange={ (e: unknown) => onChange?.(e.target.value)  }>
    <option value="">Selecionar conta</option>
    {(accounts || []).map((a: unknown) => (
      <option key={a.id} value={ a.id }>{a.network} — {a.name}</option>
    ))}
  </Select>);

export default SocialAccountSelector;
