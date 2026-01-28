import React from 'react';
import FileInput from '@/components/ui/FileInput';
import Button from '@/components/ui/Button';
const SocialMediaUploader = ({ onUpload }) => (
  <div className="flex items-end gap-2">
    <FileInput onChange={(e) => onUpload?.(e.target.files)} />
    <Button onClick={() => onUpload?.([])}>Enviar</Button>
  </div>
);
export default SocialMediaUploader;
