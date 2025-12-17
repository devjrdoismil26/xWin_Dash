import React, { useState } from 'react';
import { Save, FolderOpen, Download, Upload, Settings, MessageSquare, Image, Trash2, Copy, Undo, Redo, ZoomIn, ZoomOut, Maximize, Play, Pause, RotateCcw, Share2, Eye, EyeOff } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { Node } from 'reactflow';
interface UniverseNavigationBarProps {
  onTemplateGalleryToggle??: (e: any) => void;
  onChatToggle??: (e: any) => void;
  selectedNode: Node | null;
  onDeleteNode??: (e: any) => void;
  onClearCanvas??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const UniverseNavigationBar: React.FC<UniverseNavigationBarProps> = ({ onTemplateGalleryToggle,
  onChatToggle,
  selectedNode,
  onDeleteNode,
  onClearCanvas
   }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [isRunning, setIsRunning] = useState(false);

  const handleSave = () => {};

  const handleExport = () => {};

  const handleImport = () => {};

  const handleShare = () => {};

  const handleRun = () => {
    setIsRunning(!isRunning);};

  return (
            <nav className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 relative z-40" />
      {/* Left Section - Logo & Project Info */}
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><span className="text-white font-bold text-sm">U</span></div><div>
           
        </div><h1 className="font-semibold text-gray-800">Universe</h1>
            <p className="text-xs text-gray-500">Visual Workflow Builder</p>
          </div>
        {selectedNode && (
          <Badge variant="secondary" className="ml-4" />
            Selected: {selectedNode.type}
          </Badge>
        )}
      </div>
      {/* Center Section - Main Actions */}
      <div className="{/* File Operations */}">$2</div>
        <div className=" ">$2</div><Button size="sm" variant="ghost" onClick={ handleSave } />
            <Save className="w-4 h-4" /></Button><Button size="sm" variant="ghost" onClick={ onTemplateGalleryToggle } />
            <FolderOpen className="w-4 h-4" /></Button><Button size="sm" variant="ghost" onClick={ handleImport } />
            <Upload className="w-4 h-4" /></Button><Button size="sm" variant="ghost" onClick={ handleExport } />
            <Download className="w-4 h-4" /></Button></div>
        {/* Edit Operations */}
        <div className=" ">$2</div><Button size="sm" variant="ghost" disabled />
            <Undo className="w-4 h-4" /></Button><Button size="sm" variant="ghost" disabled />
            <Redo className="w-4 h-4" /></Button><Button 
            size="sm" 
            variant="ghost" 
            onClick={ onDeleteNode }
            disabled={ !selectedNode } />
            <Trash2 className="w-4 h-4" /></Button><Button size="sm" variant="ghost" disabled={ !selectedNode } />
            <Copy className="w-4 h-4" /></Button></div>
        {/* View Operations */}
        <div className=" ">$2</div><Button size="sm" variant="ghost" />
            <ZoomIn className="w-4 h-4" /></Button><Button size="sm" variant="ghost" />
            <ZoomOut className="w-4 h-4" /></Button><Button size="sm" variant="ghost" />
            <Maximize className="w-4 h-4" /></Button><Button 
            size="sm" 
            variant="ghost" 
            onClick={ () => setIsPreviewMode(!isPreviewMode)  }>
            {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        {/* Run Controls */}
        <div className=" ">$2</div><Button 
            size="sm" 
            variant={ isRunning ? "destructive" : "default" }
            onClick={ handleRun } />
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={ () => setIsRunning(false)  }>
            <RotateCcw className="w-4 h-4" /></Button></div>
      {/* Right Section - Additional Actions */}
      <div className="{/* Status Indicator */}">$2</div>
        {isRunning && (
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm font-medium">Running</span>
      </div>
    </>
  )}
        {/* Action Buttons */}
        <Button size="sm" variant="ghost" onClick={ onChatToggle } />
          <MessageSquare className="w-4 h-4" /></Button><Button size="sm" variant="ghost" onClick={ handleShare } />
          <Share2 className="w-4 h-4" /></Button><Button size="sm" variant="ghost" />
          <Settings className="w-4 h-4" />
        </Button>
        {/* Danger Zone */}
        <div className=" ">$2</div><Button 
            size="sm" 
            variant="destructive" 
            onClick={ onClearCanvas } />
            Clear All
          </Button>
        </div>
      {/* Eye Mode Overlay Indicator */}
      {isPreviewMode && (
        <div className="Eye Mode Active - Click Eye icon to exit">$2</div>
    </div>
  )}
    </nav>);};

export default UniverseNavigationBar;
