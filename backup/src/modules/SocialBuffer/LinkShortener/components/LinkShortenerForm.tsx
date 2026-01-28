import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
const LinkShortenerForm = ({ onShorten }) => {
  const [url, setUrl] = useState('');
  return (
    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); onShorten?.(url); }}>
      <div className="flex-1">
        <InputLabel htmlFor="url">URL</InputLabel>
        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
      </div>
      <div className="self-end">
        <Button type="submit">Encurtar</Button>
      </div>
    </form>
  );
};
export default LinkShortenerForm;
