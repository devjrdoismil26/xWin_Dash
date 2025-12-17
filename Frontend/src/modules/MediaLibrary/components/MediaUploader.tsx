import React from 'react';
import FileInput from '@/shared/components/ui/FileInput';
type Props = { accept?: string; onUpload??: (e: any) => void};

const MediaUploader: React.FC<Props> = ({ accept = 'image/*,video/*', onUpload    }) => {
  return (
            <div className=" ">$2</div><FileInput multiple accept={accept} onChange={ (files: unknown) => onUpload?.(files as any) } />
    </div>);};

export { MediaUploader };

export default MediaUploader;
