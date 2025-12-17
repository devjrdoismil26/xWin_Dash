import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, Trash2, Copy, Maximize2, Minimize2, AlertCircle, CheckCircle, Clock, MoreVertical } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { cn } from '@/lib/utils';
import { BaseBlockProps, BlockHandle } from '@/types/blocks';
interface BaseBlockState {
  isExpanded: boolean;
  isConfiguring: boolean;
  isProcessing: boolean;
  error: string | null; }
const BaseBlock: React.FC<BaseBlockProps> = ({ id,
  type,
  data,
  isConnectable = true,
  isSelected = false,
  onUpdate,
  onDelete,
  onConfigure,
  onConnect,
  onDisconnect,
  children
   }) => {
  const [state, setState] = useState<BaseBlockState>({
    isExpanded: false,
    isConfiguring: false,
    isProcessing: false,
    error: null
  });

  const getStatusIcon = useCallback(() => {
    if (state.error) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (state.isProcessing) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  }, [state.error, state.isProcessing]);

  const getStatusColor = useCallback(() => {
    if (state.error) return 'border-red-200 bg-red-50';
    if (state.isProcessing) return 'border-yellow-200 bg-yellow-50';
    if (isSelected) return 'border-blue-300 bg-blue-50';
    return 'border-gray-200 bg-white';
  }, [state.error, state.isProcessing, isSelected]);

  const handleExpand = useCallback(() => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));

  }, []);

  const handleConfigure = useCallback(() => {
    setState(prev => ({ ...prev, isConfiguring: true }));

    onConfigure?.();

  }, [onConfigure]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      onDelete?.();

    } , [onDelete]);

  const handleDuplicate = useCallback(() => {
    // Implement duplication logic
  }, [id]);

  const renderHandles = useCallback((handles: BlockHandle[]) => {
    return (handles || []).map((handle: unknown) => (
      <Handle
        key={ handle.id }
        type={ handle.type }
        position={ handle.position as Position }
        id={ handle.id }
        isConnectable={ handle.isConnectable ?? isConnectable }
        className={cn(
          "w-3 h-3",
          handle.type === 'source' ? 'bg-green-500' : 'bg-blue-500',
          'hover:scale-110 transition-transform'
        )} style={handle.style } />
        {handle.label && (
          <div className="{handle.label}">$2</div>
    </div>
  )}
      </Handle>
    ));

  }, [isConnectable]);

  return (
        <>
      <div className={cn(
      "group relative rounded-lg shadow-lg border-2 transition-all duration-200",
      getStatusColor(),
      state.isExpanded ? 'w-80 h-64' : 'w-64 h-48',
      "hover:shadow-xl"
    )  }>
      </div>{/* Status Indicator */}
      <div className=" ">$2</div><div className="{getStatusIcon()}">$2</div>
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              state.error ? 'bg-red-100 text-red-700' :
              state.isProcessing ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            ) } />
            {state.error ? 'Error' : state.isProcessing ? 'Processing' : 'Active'}
          </Badge>
        </div>
      {/* Block Header */}
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="{/* Icon will be provided by child component */}">$2</div>
            </div>
            <div>
           
        </div><h3 className="font-semibold text-gray-800 truncate" />
                {data.label}
              </h3>
              {data.description && (
                <p className="text-xs text-gray-500 truncate" />
                  {data.description}
                </p>
              )}
            </div>
          <div className=" ">$2</div><Button 
              size="sm" 
              variant="ghost" 
              onClick={ handleExpand }
              className="p-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              {state.isExpanded ? (
                <Minimize2 className="w-3 h-3" />
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </Button></div></div>
      {/* Block Content */}
      <div className="{children}">$2</div>
      </div>
      {/* Block Actions */}
      <div className=" ">$2</div><div className=" ">$2</div><Button 
            size="sm" 
            variant="outline" 
            onClick={ handleConfigure }
            className="flex-1 text-xs" />
            <Settings className="w-3 h-3 mr-1" />
            Configure
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={ handleDuplicate }
            className="text-xs" />
            <Copy className="w-3 h-3" /></Button><Button 
            size="sm" 
            variant="outline" 
            onClick={ handleDelete }
            className="text-xs text-red-600 hover:text-red-700" />
            <Trash2 className="w-3 h-3" /></Button></div>
      {/* Error Display */}
      {state.error && (
        <div className=" ">$2</div><div className=" ">$2</div><AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Error</span></div><p className="text-xs text-red-600 mt-1">{state.error}</p>
      </div>
    </>
  )}
      {/* Processing Overlay */}
      {state.isProcessing && (
        <div className=" ">$2</div><div className=" ">$2</div><Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2 animate-spin" />
            <p className="text-sm text-yellow-700">Processing...</p>
      </div>
    </>
  )}
    </div>);};

export default BaseBlock;
