import React, { useState } from 'react';
import { 
  Save, 
  FolderOpen, 
  Download, 
  Upload, 
  Settings, 
  MessageSquare, 
  Image, 
  Trash2, 
  Copy, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Play, 
  Pause,
  RotateCcw,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Node } from 'reactflow';
interface UniverseNavigationBarProps {
  onTemplateGalleryToggle: () => void;
  onChatToggle: () => void;
  selectedNode: Node | null;
  onDeleteNode: () => void;
  onClearCanvas: () => void;
}
const UniverseNavigationBar: React.FC<UniverseNavigationBarProps> = ({
  onTemplateGalleryToggle,
  onChatToggle,
  selectedNode,
  onDeleteNode,
  onClearCanvas
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const handleSave = () => {
  };
  const handleExport = () => {
  };
  const handleImport = () => {
  };
  const handleShare = () => {
  };
  const handleRun = () => {
    setIsRunning(!isRunning);
  };
  return (
    <nav className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 relative z-40">
      {/* Left Section - Logo & Project Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">Universe</h1>
            <p className="text-xs text-gray-500">Visual Workflow Builder</p>
          </div>
        </div>
        {selectedNode && (
          <Badge variant="secondary" className="ml-4">
            Selected: {selectedNode.type}
          </Badge>
        )}
      </div>
      {/* Center Section - Main Actions */}
      <div className="flex items-center gap-2">
        {/* File Operations */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
          <Button size="sm" variant="ghost" onClick={handleSave}>
            <Save className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onTemplateGalleryToggle}>
            <FolderOpen className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleImport}>
            <Upload className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleExport}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
        {/* Edit Operations */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
          <Button size="sm" variant="ghost" disabled>
            <Undo className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" disabled>
            <Redo className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onDeleteNode}
            disabled={!selectedNode}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" disabled={!selectedNode}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        {/* View Operations */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
          <Button size="sm" variant="ghost">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Maximize className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        {/* Run Controls */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
          <Button 
            size="sm" 
            variant={isRunning ? "destructive" : "default"}
            onClick={handleRun}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsRunning(false)}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* Right Section - Additional Actions */}
      <div className="flex items-center gap-2">
        {/* Status Indicator */}
        {isRunning && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Running</span>
          </div>
        )}
        {/* Action Buttons */}
        <Button size="sm" variant="ghost" onClick={onChatToggle}>
          <MessageSquare className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Settings className="w-4 h-4" />
        </Button>
        {/* Danger Zone */}
        <div className="ml-2 pl-2 border-l border-gray-200">
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={onClearCanvas}
          >
            Clear All
          </Button>
        </div>
      </div>
      {/* Preview Mode Overlay Indicator */}
      {isPreviewMode && (
        <div className="absolute top-full left-0 right-0 bg-blue-500 text-white text-center py-1 text-sm">
          Preview Mode Active - Click Eye icon to exit
        </div>
      )}
    </nav>
  );
};
export default UniverseNavigationBar;
