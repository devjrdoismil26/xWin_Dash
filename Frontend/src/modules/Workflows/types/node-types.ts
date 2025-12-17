// Base Node Types for Workflow Nodes

export interface BaseNodeProps {
  id: string;
  data: Record<string, any>;
  selected?: boolean;
  isConnectable?: boolean;
  onUpdate??: (e: any) => void;
  onDelete??: (e: any) => void;
  onConnect???: (e: any) => void;
  onDisconnect???: (e: any) => void;
  [key: string]: unknown; }

export interface NodeConfig {
  [key: string]: unknown; }

export interface NodeTestResult {
  success: boolean;
  data?: string;
  error?: string;
  leadData?: string;
  matchedTags?: string; }

export interface NodeHandle {
  type: 'source' | 'target';
  position: 'top' | 'right' | 'bottom' | 'left';
  id?: string; }
