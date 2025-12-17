import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';
import useToast from '@/shared/components/ui/useToast';
const DelayNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ 
  id, 
  data, 
  selected, 
  onUpdate, 
  onDelete, 
  onConnect,
  onDisconnect 
}) => {
  const { toast } = useToast();

  const [config, setConfig] = useState<Record<string, any>>({
    delaySeconds: 60,
    delayType: 'fixed', // fixed, random, dynamic
    minDelay: 30,
    maxDelay: 120,
    dynamicField: '',
    ...data?.config
  });

  const [isRunning, setIsRunning] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);

      }, 1000);

      return () => clearTimeout(timer);

    } else if (isRunning && timeRemaining === 0) {
      setIsRunning(false);

      toast.success('Delay completed');

    } , [isRunning, timeRemaining, toast]);

  const handleConfigChange = (field: string, value: unknown) => {
    const newConfig = { ...config, [field]: value};

    setConfig(newConfig);

    onUpdate?.(id, { ...data, config: newConfig });};

  const handleTestDelay = () => {
    const delayTime = config.delayType === 'fixed' 
      ? config.delaySeconds 
      : Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
    setTimeRemaining(delayTime);

    setIsRunning(true);

    toast.info(`Testing delay for ${delayTime} seconds`);};

  const handleStopTest = () => {
    setIsRunning(false);

    setTimeRemaining(0);

    toast.info('Delay test stopped');};

  const formatTime = (seconds: unknown) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;};

  const getDelayDescription = () => {
    switch (config.delayType) {
      case 'fixed':
        return `${config.delaySeconds} seconds`;
      case 'random':
        return `${config.minDelay}-${config.maxDelay} seconds (random)`;
      case 'dynamic':
        return `Dynamic from field: ${config.dynamicField || 'not set'}`;
      default:
        return 'Not configured';
    } ;

  return (
        <>
      <Card 
      className={`workflow-node delay-node ${selected ? 'selected' : ''} `}
      style={minWidth: '280px',
        border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: '#FEF3C7'
      } />
      <div className=" ">$2</div><div className=" ">$2</div><Clock className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-900">Delay</h3>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800" />
            Control
          </Badge></div><div className=" ">$2</div><Button
            size="sm"
            variant="ghost"
            onClick={ () => onConnect?.(id) }
            title="Connect"
          >
            <Play className="w-4 h-4" /></Button><Button
            size="sm"
            variant="ghost"
            onClick={ () => onDisconnect?.(id) }
            title="Disconnect"
          >
            <Pause className="w-4 h-4" /></Button><Button
            size="sm"
            variant="ghost"
            onClick={ () => onDelete?.(id) }
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            ×
          </Button></div><div className="{/* Delay Type Selection */}">$2</div>
        <div>
           
        </div><InputLabel>Delay Type</InputLabel>
          <Select
            value={ config.delayType }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('delayType', e.target.value) }
            options={[
              { value: 'fixed', label: 'Fixed Duration' },
              { value: 'random', label: 'Random Range' },
              { value: 'dynamic', label: 'Dynamic from Data' }
            ]} />
        </div>
        {/* Fixed Delay Configuration */}
        {config.delayType === 'fixed' && (
          <div>
           
        </div><InputLabel>Delay Duration (seconds)</InputLabel>
            <Input
              type="number"
              value={ config.delaySeconds }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('delaySeconds', parseInt(e.target.value) || 0) }
              min="1"
              max="3600"
              placeholder="Enter delay in seconds" />
          </div>
        )}
        {/* Random Delay Configuration */}
        {config.delayType === 'random' && (
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Min Delay (seconds)</InputLabel>
              <Input
                type="number"
                value={ config.minDelay }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('minDelay', parseInt(e.target.value) || 0) }
                min="1"
                placeholder="Min" /></div><div>
           
        </div><InputLabel>Max Delay (seconds)</InputLabel>
              <Input
                type="number"
                value={ config.maxDelay }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('maxDelay', parseInt(e.target.value) || 0) }
                min="1"
                placeholder="Max" />
            </div>
        )}
        {/* Dynamic Delay Configuration */}
        {config.delayType === 'dynamic' && (
          <div>
           
        </div><InputLabel>Data Field</InputLabel>
            <Input
              value={ config.dynamicField }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('dynamicField', e.target.value) }
              placeholder="e.g., (data as any).delay_time" />
            <p className="text-xs text-gray-500 mt-1" />
              Field should contain delay time in seconds
            </p>
      </div>
    </>
  )}
        {/* Current Configuration Display */}
        <div className=" ">$2</div><p className="text-sm text-gray-600" />
            <strong>Current Delay:</strong> {getDelayDescription()}
          </p>
        </div>
        {/* Test Controls */}
        <div className=" ">$2</div><Button
            size="sm"
            variant="outline"
            onClick={ handleTestDelay }
            disabled={ isRunning }
            className="flex-1" />
            <Play className="w-4 h-4 mr-1" />
            Test Delay
          </Button>
          {isRunning && (
            <Button
              size="sm"
              variant="outline"
              onClick={ handleStopTest }
              className="flex-1" />
              <Pause className="w-4 h-4 mr-1" />
              Square
            </Button>
          )}
        </div>
        {/* Timer Display */}
        {isRunning && (
          <div className=" ">$2</div><div className="{formatTime(timeRemaining)}">$2</div>
            </div>
            <p className="text-sm text-blue-600">Time Remaining</p>
      </div>
    </>
  )}
        {/* Node Status */}
        <div className=" ">$2</div><span>Node ID: {id}</span>
          <span className=" ">$2</span><div className="Ready">$2</div>
          </span>
        </div>
      {/* Connection Points */}
      <div className=" ">$2</div><div className="connection-point input" data-node-id={id} data-type="input">
           
        </div><div className="connection-dot">
           
        </div><div className="connection-point output" data-node-id={id} data-type="output">
           
        </div><div className="connection-dot" /></div></Card>);};

export default DelayNode;
