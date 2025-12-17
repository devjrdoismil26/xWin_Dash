import React from 'react';
import FileInput from '@/shared/components/ui/FileInput';
import Button from '@/shared/components/ui/Button';
const SocialMediaUploader = ({ onUpload }) => (
  <div className=" ">$2</div><FileInput onChange={ (e: unknown) => onUpload?.(e.target.files) } />
    <Button onClick={ () => onUpload?.([]) }>Enviar</Button>
  </div>);

export default SocialMediaUploader;
