import React, { useState, useEffect } from 'react';
import { Globe, Play, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Badge from '@/components/ui/Badge';
import useToast from '@/components/ui/useToast';
const ApiCallNode = ({ 
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
    url: '',
    method: 'GET',
    headers: {},
    body: '',
    authentication: 'none',
    authType: 'bearer',
    apiKey: '',
    username: '',
    password: '',
    timeout: 30,
    retryAttempts: 3,
    retryDelay: 1000,
    ...data?.config
  });
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [headersList, setHeadersList] = useState([]);
  useEffect(() => {
    // Convert headers object to array for easier editing
    const headersArray = Object.entries(config.headers || {}).map(([key, value]) => ({
      key,
      value,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setHeadersList(headersArray);
  }, [config.headers]);
  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onUpdate?.(id, { ...data, config: newConfig });
  };
  const handleHeaderChange = (headerId, field, value) => {
    const updatedHeaders = headersList.map(header => 
      header.id === headerId ? { ...header, [field]: value } : header
    );
    setHeadersList(updatedHeaders);
    // Convert back to object
    const headersObject = updatedHeaders.reduce((acc, header) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});
    handleConfigChange('headers', headersObject);
  };
  const addHeader = () => {
    setHeadersList([...headersList, { key: '', value: '', id: Math.random().toString(36).substr(2, 9) }]);
  };
  const removeHeader = (headerId) => {
    const updatedHeaders = headersList.filter(header => header.id !== headerId);
    setHeadersList(updatedHeaders);
    const headersObject = updatedHeaders.reduce((acc, header) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});
    handleConfigChange('headers', headersObject);
  };
  const handleTestApi = async () => {
    if (!config.url) {
      toast.error('Please enter a URL');
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const requestOptions = {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        timeout: config.timeout * 1000
      };
      // Add authentication
      if (config.authentication !== 'none') {
        if (config.authentication === 'bearer' && config.apiKey) {
          requestOptions.headers.Authorization = `Bearer ${config.apiKey}`;
        } else if (config.authentication === 'basic' && config.username && config.password) {
          const credentials = btoa(`${config.username}:${config.password}`);
          requestOptions.headers.Authorization = `Basic ${credentials}`;
        }
      }
      // Add body for POST, PUT, PATCH
      if (['POST', 'PUT', 'PATCH'].includes(config.method) && config.body) {
        requestOptions.body = config.body;
      }
      const response = await fetch(config.url, requestOptions);
      const responseData = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(responseData);
      } catch {
        parsedData = responseData;
      }
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: parsedData,
        success: response.ok
      });
      if (response.ok) {
        toast.success('API call successful');
      } else {
        toast.error(`API call failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult({
        error: error.message,
        success: false
      });
      toast.error(`API call failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };
  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      PATCH: 'bg-purple-100 text-purple-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };
  return (
    <Card 
      className={`workflow-node api-call-node ${selected ? 'selected' : ''}`}
      style={{
        minWidth: '320px',
        border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: '#F0F9FF'
      }}
    >
      <div className="node-header">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">API Call</h3>
          <Badge variant="secondary" className={getMethodColor(config.method)}>
            {config.method}
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
            <Settings className="w-4 h-4" />
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
        {/* URL Configuration */}
        <div>
          <InputLabel>URL *</InputLabel>
          <Input
            value={config.url}
            onChange={(e) => handleConfigChange('url', e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="font-mono text-sm"
          />
        </div>
        {/* Method Selection */}
        <div>
          <InputLabel>HTTP Method</InputLabel>
          <Select
            value={config.method}
            onChange={(e) => handleConfigChange('method', e.target.value)}
            options={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'DELETE', label: 'DELETE' },
              { value: 'PATCH', label: 'PATCH' }
            ]}
          />
        </div>
        {/* Authentication */}
        <div>
          <InputLabel>Authentication</InputLabel>
          <Select
            value={config.authentication}
            onChange={(e) => handleConfigChange('authentication', e.target.value)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'bearer', label: 'Bearer Token' },
              { value: 'basic', label: 'Basic Auth' },
              { value: 'api-key', label: 'API Key' }
            ]}
          />
        </div>
        {/* Authentication Details */}
        {config.authentication === 'bearer' && (
          <div>
            <InputLabel>Bearer Token</InputLabel>
            <Input
              type="password"
              value={config.apiKey}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              placeholder="Enter bearer token"
            />
          </div>
        )}
        {config.authentication === 'basic' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <InputLabel>Username</InputLabel>
              <Input
                value={config.username}
                onChange={(e) => handleConfigChange('username', e.target.value)}
                placeholder="Username"
              />
            </div>
            <div>
              <InputLabel>Password</InputLabel>
              <Input
                type="password"
                value={config.password}
                onChange={(e) => handleConfigChange('password', e.target.value)}
                placeholder="Password"
              />
            </div>
          </div>
        )}
        {config.authentication === 'api-key' && (
          <div>
            <InputLabel>API Key</InputLabel>
            <Input
              type="password"
              value={config.apiKey}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              placeholder="Enter API key"
            />
          </div>
        )}
        {/* Headers */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <InputLabel>Headers</InputLabel>
            <Button size="sm" variant="outline" onClick={addHeader}>
              Add Header
            </Button>
          </div>
          <div className="space-y-2">
            {headersList.map((header) => (
              <div key={header.id} className="flex gap-2">
                <Input
                  value={header.key}
                  onChange={(e) => handleHeaderChange(header.id, 'key', e.target.value)}
                  placeholder="Header name"
                  className="flex-1"
                />
                <Input
                  value={header.value}
                  onChange={(e) => handleHeaderChange(header.id, 'value', e.target.value)}
                  placeholder="Header value"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeHeader(header.id)}
                  className="text-red-600"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
        {/* Request Body */}
        {['POST', 'PUT', 'PATCH'].includes(config.method) && (
          <div>
            <InputLabel>Request Body</InputLabel>
            <textarea
              value={config.body}
              onChange={(e) => handleConfigChange('body', e.target.value)}
              placeholder="Enter JSON or text body"
              className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
              rows={4}
            />
          </div>
        )}
        {/* Advanced Settings */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <InputLabel>Timeout (seconds)</InputLabel>
            <Input
              type="number"
              value={config.timeout}
              onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value) || 30)}
              min="1"
              max="300"
            />
          </div>
          <div>
            <InputLabel>Retry Attempts</InputLabel>
            <Input
              type="number"
              value={config.retryAttempts}
              onChange={(e) => handleConfigChange('retryAttempts', parseInt(e.target.value) || 3)}
              min="0"
              max="10"
            />
          </div>
        </div>
        {/* Test Button */}
        <Button
          onClick={handleTestApi}
          disabled={isTesting || !config.url}
          className="w-full"
          variant="outline"
        >
          {isTesting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Testing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Test API Call
            </>
          )}
        </Button>
        {/* Test Results */}
        {testResult && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="font-semibold">
                {testResult.success ? 'Success' : 'Failed'}
              </span>
            </div>
            {testResult.status && (
              <div className="text-sm text-gray-600 mb-2">
                <strong>Status:</strong> {testResult.status} {testResult.statusText}
              </div>
            )}
            {testResult.error && (
              <div className="text-sm text-red-600 mb-2">
                <strong>Error:</strong> {testResult.error}
              </div>
            )}
            {testResult.data && (
              <details className="text-sm">
                <summary className="cursor-pointer font-semibold">Response Data</summary>
                <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-auto max-h-32">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </details>
            )}
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
export default ApiCallNode;
