import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Badge from '@/components/ui/Badge';
import useToast from '@/components/ui/useToast';
const DelayNode = ({ 
  id, 
  data, 
  selected, 
  onUpdate, 
  onDelete, 
  onConnect,
  onDisconnect 
}) => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
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
    }
  }, [isRunning, timeRemaining, toast]);
  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onUpdate?.(id, { ...data, config: newConfig });
  };
  const handleTestDelay = () => {
    const delayTime = config.delayType === 'fixed' 
      ? config.delaySeconds 
      : Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
    setTimeRemaining(delayTime);
    setIsRunning(true);
    toast.info(`Testing delay for ${delayTime} seconds`);
  };
  const handleStopTest = () => {
    setIsRunning(false);
    setTimeRemaining(0);
    toast.info('Delay test stopped');
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
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
    }
  };
  return (
    <Card 
      className={`workflow-node delay-node ${selected ? 'selected' : ''}`}
      style={{
        minWidth: '280px',
        border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: '#FEF3C7'
      }}
    >
      <div className="node-header">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-900">Delay</h3>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Control
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onConnect?.(id)}
            title="Connect"
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDisconnect?.(id)}
            title="Disconnect"
          >
            <Pause className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete?.(id)}
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            ×
          </Button>
        </div>
      </div>
      <div className="node-content space-y-4">
        {/* Delay Type Selection */}
        <div>
          <InputLabel>Delay Type</InputLabel>
          <Select
            value={config.delayType}
            onChange={(e) => handleConfigChange('delayType', e.target.value)}
            options={[
              { value: 'fixed', label: 'Fixed Duration' },
              { value: 'random', label: 'Random Range' },
              { value: 'dynamic', label: 'Dynamic from Data' }
            ]}
          />
        </div>
        {/* Fixed Delay Configuration */}
        {config.delayType === 'fixed' && (
          <div>
            <InputLabel>Delay Duration (seconds)</InputLabel>
            <Input
              type="number"
              value={config.delaySeconds}
              onChange={(e) => handleConfigChange('delaySeconds', parseInt(e.target.value) || 0)}
              min="1"
              max="3600"
              placeholder="Enter delay in seconds"
            />
          </div>
        )}
        {/* Random Delay Configuration */}
        {config.delayType === 'random' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <InputLabel>Min Delay (seconds)</InputLabel>
              <Input
                type="number"
                value={config.minDelay}
                onChange={(e) => handleConfigChange('minDelay', parseInt(e.target.value) || 0)}
                min="1"
                placeholder="Min"
              />
            </div>
            <div>
              <InputLabel>Max Delay (seconds)</InputLabel>
              <Input
                type="number"
                value={config.maxDelay}
                onChange={(e) => handleConfigChange('maxDelay', parseInt(e.target.value) || 0)}
                min="1"
                placeholder="Max"
              />
            </div>
          </div>
        )}
        {/* Dynamic Delay Configuration */}
        {config.delayType === 'dynamic' && (
          <div>
            <InputLabel>Data Field</InputLabel>
            <Input
              value={config.dynamicField}
              onChange={(e) => handleConfigChange('dynamicField', e.target.value)}
              placeholder="e.g., data.delay_time"
            />
            <p className="text-xs text-gray-500 mt-1">
              Field should contain delay time in seconds
            </p>
          </div>
        )}
        {/* Current Configuration Display */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Current Delay:</strong> {getDelayDescription()}
          </p>
        </div>
        {/* Test Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTestDelay}
            disabled={isRunning}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-1" />
            Test Delay
          </Button>
          {isRunning && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleStopTest}
              className="flex-1"
            >
              <Pause className="w-4 h-4 mr-1" />
              Stop
            </Button>
          )}
        </div>
        {/* Timer Display */}
        {isRunning && (
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-mono font-bold text-blue-600">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-blue-600">Time Remaining</p>
          </div>
        )}
        {/* Node Status */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Node ID: {id}</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Ready
          </span>
        </div>
      </div>
      {/* Connection Points */}
      <div className="node-connections">
        <div className="connection-point input" data-node-id={id} data-type="input">
          <div className="connection-dot"></div>
        </div>
        <div className="connection-point output" data-node-id={id} data-type="output">
          <div className="connection-dot"></div>
        </div>
      </div>
    </Card>
  );
};
export default DelayNode;
