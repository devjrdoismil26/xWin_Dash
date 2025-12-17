import type { MediaType } from './core.types';

export interface MediaTypeInfo {
  type: MediaType;
  label: string;
  icon: string;
  color: string;
  extensions: string[];
  mime_types: string[];
  max_size?: number;
  supported_operations: string[]; }

export const MEDIA_TYPES: MediaTypeInfo[] = [
  {
    type: 'image',
    label: 'Imagem',
    icon: 'Image',
    color: 'green',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'],
    mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff', 'image/x-icon'],
    max_size: 50 * 1024 * 1024,
    supported_operations: ['resize', 'crop', 'rotate', 'filter', 'watermark', 'compress']
  },
  {
    type: 'video',
    label: 'Vídeo',
    icon: 'Video',
    color: 'purple',
    extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
    mime_types: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'video/x-matroska'],
    max_size: 500 * 1024 * 1024,
    supported_operations: ['compress', 'thumbnail', 'trim', 'watermark']
  },
  {
    type: 'audio',
    label: 'Áudio',
    icon: 'Music',
    color: 'blue',
    extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
    mime_types: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg', 'audio/x-ms-wma', 'audio/mp4'],
    max_size: 100 * 1024 * 1024,
    supported_operations: ['compress', 'convert', 'trim']
  },
  {
    type: 'document',
    label: 'Documento',
    icon: 'FileText',
    color: 'orange',
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'],
    mime_types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'application/rtf'],
    max_size: 50 * 1024 * 1024,
    supported_operations: ['preview', 'extract_text', 'convert']
  },
  {
    type: 'archive',
    label: 'Arquivo',
    icon: 'Archive',
    color: 'gray',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz'],
    mime_types: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'application/gzip'],
    max_size: 200 * 1024 * 1024,
    supported_operations: ['extract', 'compress']
  },
  {
    type: 'other',
    label: 'Outros',
    icon: 'File',
    color: 'gray',
    extensions: [],
    mime_types: [],
    supported_operations: ['download']
  }
];
