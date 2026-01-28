import React from 'react';
import FileInput from '@/components/ui/FileInput';
type Props = { accept?: string; onUpload?: (files: FileList | File[]) => void };
const MediaUploader: React.FC<Props> = ({ accept = 'image/*,video/*', onUpload }) => {
  return (
    <div className="p-4">
      <FileInput multiple accept={accept} onChange={(files) => onUpload?.(files as any)} />
    </div>
  );
};
export { MediaUploader };
export default MediaUploader;
