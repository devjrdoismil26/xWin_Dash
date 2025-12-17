import React, { useState } from 'react';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
interface LinkShortenerFormProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const LinkShortenerForm = ({ onShorten }) => {
  const [url, setUrl] = useState('');

  return (
            <form className="flex gap-2" onSubmit={(e: unknown) => { e.preventDefault(); onShorten?.(url); } >
      <div className=" ">$2</div><InputLabel htmlFor="url">URL</InputLabel>
        <Input id="url" value={url} onChange={(e: unknown) => setUrl(e.target.value)} placeholder="https://" /></div><div className=" ">$2</div><Button type="submit">Encurtar</Button></div></form>);};

export default LinkShortenerForm;
