import React from 'react';
import { Handle, Position } from 'reactflow';
import { RotateCcw, Repeat, ArrowRight, ArrowLeft, Hash, Clock, CheckCircle, AlertCircle, Play, Pause, Square, SkipForward, SkipBack } from 'lucide-react';
import { cn } from '@/lib/utils';
const LoopNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getLoopIcon = (type: unknown) => {
    switch (type) {
      case 'for':
        return <Hash className="h-4 w-4" />;
      case 'while':
        return <Repeat className="h-4 w-4" />;
      case 'foreach':
        return <ArrowRight className="h-4 w-4" />;
      case 'do_while':
        return <ArrowLeft className="h-4 w-4" />;
      case 'infinite':
        return <RotateCcw className="h-4 w-4" />;
      case 'conditional':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Repeat className="h-4 w-4" />;
    } ;

  const getLoopColor = (type: unknown) => {
    switch (type) {
      case 'for':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'while':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'foreach':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'do_while':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'infinite':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'conditional':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      default:
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
    } ;

  const loopType = data?.loopType || 'for';
  const loopName = data?.name || 'Loop';
  const loopDescription = data?.description || 'Executa um loop';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getLoopColor(loopType),
      selected && 'selected shadow-lg ring-2 ring-blue-500'
    )  }>
      </div><Handle
        type="target"
        position={ Position.Left }
        isConnectable={ isConnectable }
        className="workflow-node-handle target"
      / />
      <Handle
        type="source"
        position={ Position.Right }
        isConnectable={ isConnectable }
        className="workflow-node-handle source"
        id="loop"
        style={top: '30%' } / />
      <Handle
        type="source"
        position={ Position.Right }
        isConnectable={ isConnectable }
        className="workflow-node-handle source"
        id="exit"
        style={top: '70%' } / />
      <div className=" ">$2</div><div className="{getLoopIcon(loopType)}">$2</div>
        </div>
        <div className="{loopName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {loopDescription}
        </p>
        {data?.loopType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{loopType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.maxIterations && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Max Iterações:</span>
            <span className="{data.maxIterations}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.currentIteration !== undefined && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Iteração Atual:</span>
            <span className="{data.currentIteration}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.condition && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Condição:</span>
            <span className="{data.condition}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.variable && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Variável:</span>
            <span className="{data.variable}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.startValue && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Valor Inicial:</span>
            <span className="{data.startValue}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.endValue && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Valor Final:</span>
            <span className="{data.endValue}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.step && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Passo:</span>
            <span className="{data.step}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.delay && (
          <div className=" ">$2</div><Clock className="h-3 w-3 text-gray-500" />
            <span className="Delay: {data.delay}ms">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.breakOnError !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).breakOnError ? 'bg-red-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.breakOnError ? 'Parar em Erro' : 'Continuar em Erro'}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.parallel !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).parallel ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.parallel ? 'Execução Paralela' : 'Execução Sequencial'}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.status && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).status === 'running' && 'bg-green-500',
              (data as any).status === 'paused' && 'bg-yellow-500',
              (data as any).status === 'stopped' && 'bg-red-500',
              (data as any).status === 'completed' && 'bg-blue-500'
            )  }>
        </div><span className="Status: {data.status}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Repeat className="h-3 w-3 text-cyan-600" />
            <span className="text-xs text-cyan-600 font-medium">LOOP</span></div><div className=" ">$2</div><div className=" ">$2</div><span className="text-xs text-blue-600">LOOP</span></div><div className=" ">$2</div><div className=" ">$2</div><span className="text-xs text-green-600">EXIT</span></div></div>);};

export default LoopNode;
