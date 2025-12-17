import React from 'react';
export interface Block {
  id: string;
  type: string;
  content: unknown;
  [key: string]: unknown; }

export type BlockType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'code' 
  | 'chart' 
  | 'table' 
  | 'form' 
  | 'button' 
  | 'divider' 
  | 'spacer'
  | 'custom';

export type BlockCategory = 
  | 'content' 
  | 'media' 
  | 'data' 
  | 'interactive' 
  | 'layout' 
  | 'custom';

export interface BaseBlockProps {
  id: string;
  type: BlockType;
  category: BlockCategory;
  data?: string;
  config?: Record<string, any>;
  style?: React.CSSProperties;
  className?: string;
  onUpdate??: (e: any) => void;
  onDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface BlockHandle {
  id: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  type: 'source' | 'target'; }

export interface DashboardBlockData {
  id: string;
  type: BlockType;
  position: { x: number;
  y: number
  [key: string]: unknown; };

  size: { width: number; height: number};

  data: unknown;
  config: Record<string, any>;
}
