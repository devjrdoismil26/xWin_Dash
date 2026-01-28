import React from 'react';
import PropTypes from 'prop-types';
import { Play, Save, Download, Trash2, Undo2, Redo2, Edit, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import ToggleGroup from '@/components/ui/ToggleGroup';
const CanvasToolbar = ({ mode, onModeChange, onOperation, onUndo, onRedo, canUndoRedo }) => {
  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <ToggleGroup value={mode} onValueChange={onModeChange} className="flex gap-1">
        <Button variant={mode === 'edit' ? 'primary' : 'outline'} size="sm" onClick={() => onModeChange('edit')}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant={mode === 'preview' ? 'primary' : 'outline'} size="sm" onClick={() => onModeChange('preview')}>
          <Eye className="w-4 h-4" />
        </Button>
      </ToggleGroup>
      <div className="flex items-center gap-2 ml-auto">
        <Button onClick={() => onOperation('save')} size="sm">
          <Save className="w-4 h-4" /> Save
        </Button>
        <Button onClick={() => onOperation('run')} size="sm">
          <Play className="w-4 h-4" /> Execute
        </Button>
        <Button onClick={() => onOperation('download')} size="sm">
          <Download className="w-4 h-4" /> Download
        </Button>
        <Button onClick={() => onOperation('clear')} size="sm">
          <Trash2 className="w-4 h-4" /> Clear
        </Button>
        <Button onClick={onUndo} size="sm" disabled={!canUndoRedo}>
          <Undo2 className="w-4 h-4" /> Undo
        </Button>
        <Button onClick={onRedo} size="sm" disabled={!canUndoRedo}>
          <Redo2 className="w-4 h-4" /> Redo
        </Button>
      </div>
    </div>
  );
};
CanvasToolbar.propTypes = {
  mode: PropTypes.string.isRequired,
  onModeChange: PropTypes.func.isRequired,
  onOperation: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  canUndoRedo: PropTypes.bool.isRequired,
};
export default CanvasToolbar;
