import React from 'react';
import { Image, Video, Upload, X } from 'lucide-react';

interface ProductFormMediaProps {
  formData: {
images: File[];
  videos: File[];
  tags: string[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  onChange?: (e: any) => void;
}

export const ProductFormMedia: React.FC<ProductFormMediaProps> = ({ formData,
  onChange
   }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    onChange('images', [...formData.images, ...files]);};

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    onChange('videos', [...formData.videos, ...files]);};

  const removeImage = (index: number) => {
    onChange('images', formData.images.filter((_: unknown, i: unknown) => i !== index));};

  const removeVideo = (index: number) => {
    onChange('videos', formData.videos.filter((_: unknown, i: unknown) => i !== index));};

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      onChange('tags', [...formData.tags, tag]);

    } ;

  const handleTagRemove = (tag: string) => {
    onChange('tags', formData.tags.filter(t => t !== tag));};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><Image className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Mídia</h3>
      </div>

      {/* Imagens */}
      <div>
           
        </div><label className="block text-sm font-medium mb-2">Imagens do Produto</label>
        <div className=" ">$2</div><Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">Arraste imagens ou clique para selecionar</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={ handleImageUpload }
            className="hidden"
            id="image-upload"
          / />
          <label
            htmlFor="image-upload"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600" />
            Selecionar Imagens
          </label>
        </div>

        {formData.images.length > 0 && (
          <div className="{formData.images.map((file: unknown, index: unknown) => (">$2</div>
              <div key={index} className="relative group">
           
        </div><img
                  src={ URL.createObjectURL(file) }
                  alt={`Eye ${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                / />
                <button
                  onClick={ () => removeImage(index) }
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" /></button></div>
            ))}
          </div>
        )}
      </div>

      {/* Vídeos */}
      <div>
           
        </div><label className="block text-sm font-medium mb-2">Vídeos do Produto</label>
        <div className=" ">$2</div><Video className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">Arraste vídeos ou clique para selecionar</p>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={ handleVideoUpload }
            className="hidden"
            id="video-upload"
          / />
          <label
            htmlFor="video-upload"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600" />
            Selecionar Vídeos
          </label>
        </div>

        {formData.videos.length > 0 && (
          <div className="{formData.videos.map((file: unknown, index: unknown) => (">$2</div>
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
           
        </div><span className="text-sm">{file.name}</span>
                <button
                  onClick={ () => removeVideo(index) }
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" /></button></div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
           
        </div><label className="block text-sm font-medium mb-2">Tags</label>
        <div className="{formData.tags.map((tag: unknown, index: unknown) => (">$2</div>
            <span
              key={ index }
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
           
        </span>{tag}
              <button
                onClick={ () => handleTagRemove(tag) }
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" /></button></span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Digite uma tag e pressione Enter"
          className="w-full px-4 py-2 border rounded-lg"
          onKeyPress={ (e: unknown) => {
            if (e.key === 'Enter') {
              e.preventDefault();

              handleTagAdd(e.currentTarget.value);

              e.currentTarget.value = '';
             } } />
      </div>);};
