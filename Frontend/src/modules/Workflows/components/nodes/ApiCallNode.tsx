import { apiClient } from '@/services';
import React, { useState, useEffect } from 'react';
import { Globe, Play, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';
import useToast from '@/shared/components/ui/useToast';
const ApiCallNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ 
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

  const [testResult, setTestResult] = useState<Record<string, any> | null>(null);

  const [isTesting, setIsTesting] = useState(false);

  const [headersList, setHeadersList] = useState<Array<{ key: string; value: unknown; id: string }>>([]);

  useEffect(() => {
    // Convert headers object to array for easier editing
    const headersArray = Object.entries(config.headers || {}).map(([key, value]) => ({
      key,
      value,
      id: Math.random().toString(36).substr(2, 9)
  }));

    setHeadersList(headersArray);

  }, [config.headers]);

  const handleConfigChange = (field: string, value: unknown) => {
    const newConfig = { ...config, [field]: value};

    setConfig(newConfig);

    onUpdate?.(id, { ...data, config: newConfig });};

  const handleHeaderChange = (headerId: unknown, field: unknown, value: unknown) => {
    const updatedHeaders = (headersList || []).map(header => 
      header.id === headerId ? { ...header, [field]: value } : header);

    setHeadersList(updatedHeaders);

    // Convert back to object
    const headersObject = updatedHeaders.reduce((acc: unknown, header: unknown) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});

    handleConfigChange('headers', headersObject);};

  const addHeader = () => {
    setHeadersList([...headersList, { key: '', value: '', id: Math.random().toString(36).substr(2, 9) }]);};

  const removeHeader = (headerId: unknown) => {
    const updatedHeaders = (headersList || []).filter(header => header.id !== headerId);

    setHeadersList(updatedHeaders);

    const headersObject = updatedHeaders.reduce((acc: unknown, header: unknown) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});

    handleConfigChange('headers', headersObject);};

  const handleTestApi = async () => {
    if (!config.url) {
      toast.error('Please enter a URL');

      return;
    }
    setIsTesting(true);

    setTestResult(null);

    try {
      const requestOptions: unknown = {
        method: config.method as string,
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers as Record<string, string>)
  },
        timeout: (config.timeout as number) * 1000};

      // Add authentication
      if (config.authentication !== 'none') {
        if (config.authentication === 'bearer' && config.apiKey) {
          requestOptions.headers.Authorization = `Bearer ${config.apiKey}`;
        } else if (config.authentication === 'basic' && config.username && config.password) {
          const credentials = btoa(`${config.username}:${config.password}`);

          requestOptions.headers.Authorization = `Basic ${credentials}`;
        } // Add body for POST, PUT, PATCH
      if (['POST', 'PUT', 'PATCH'].includes(config.method as string) && config.body) {
        requestOptions.body = config.body as string;
      }
      const response = await apiClient.get(config.url as string, requestOptions);

      const responseData = typeof response === 'string' ? response : JSON.stringify(response);

      let parsedData;
      try {
        parsedData = JSON.parse(responseData);

      } catch {
        parsedData = responseData;
      }
      setTestResult({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: parsedData,
        success: true
      });

      if (response) {
        toast.success('API call successful');

      } else {
        toast.error(`API call failed: ${response.status} ${response.statusText}`);

      } catch (error) {
      setTestResult({
        error: (error as any).message,
        success: false
      });

      toast.error(`API call failed: ${error.message}`);

    } finally {
      setIsTesting(false);

    } ;

  const getMethodColor = (method: unknown) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      PATCH: 'bg-purple-100 text-purple-800'};

    return colors[method] || 'bg-gray-100 text-gray-800';};

  return (
        <>
      <Card 
      className={`workflow-node api-call-node ${selected ? 'selected' : ''} `}
      style={minWidth: '320px',
        border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: '#F0F9FF'
      } />
      <div className=" ">$2</div><div className=" ">$2</div><Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">API Call</h3>
          <Badge variant="secondary" className={getMethodColor(config.method) } />
            {config.method}
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
            <Settings className="w-4 h-4" /></Button><Button
            size="sm"
            variant="ghost"
            onClick={ () => onDelete?.(id) }
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            ×
          </Button></div><div className="{/* URL Configuration */}">$2</div>
        <div>
           
        </div><InputLabel>URL *</InputLabel>
          <Input
            value={ config.url }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('url', e.target.value) }
            placeholder="https://api.example.com/endpoint"
            className="font-mono text-sm" />
        </div>
        {/* Method Selection */}
        <div>
           
        </div><InputLabel>HTTP Method</InputLabel>
          <Select
            value={ config.method }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('method', e.target.value) }
            options={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'DELETE', label: 'DELETE' },
              { value: 'PATCH', label: 'PATCH' }
            ]} />
        </div>
        {/* Authentication */}
        <div>
           
        </div><InputLabel>Authentication</InputLabel>
          <Select
            value={ config.authentication }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('authentication', e.target.value) }
            options={[
              { value: 'none', label: 'None' },
              { value: 'bearer', label: 'Bearer Token' },
              { value: 'basic', label: 'Basic Auth' },
              { value: 'api-key', label: 'API Key' }
            ]} />
        </div>
        {/* Authentication Details */}
        {config.authentication === 'bearer' && (
          <div>
           
        </div><InputLabel>Bearer Token</InputLabel>
            <Input
              type="password"
              value={ config.apiKey }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('apiKey', e.target.value) }
              placeholder="Enter bearer token" />
          </div>
        )}
        {config.authentication === 'basic' && (
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Username</InputLabel>
              <Input
                value={ config.username }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('username', e.target.value) }
                placeholder="Username" /></div><div>
           
        </div><InputLabel>Password</InputLabel>
              <Input
                type="password"
                value={ config.password }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('password', e.target.value) }
                placeholder="Password" />
            </div>
        )}
        {config.authentication === 'api-key' && (
          <div>
           
        </div><InputLabel>API Key</InputLabel>
            <Input
              type="password"
              value={ config.apiKey }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('apiKey', e.target.value) }
              placeholder="Enter API key" />
          </div>
        )}
        {/* Headers */}
        <div>
           
        </div><div className=" ">$2</div><InputLabel>Headers</InputLabel>
            <Button size="sm" variant="outline" onClick={ addHeader } />
              Add Header
            </Button></div><div className="{(headersList || []).map((header: unknown) => (">$2</div>
              <div key={header.id} className="flex gap-2">
           
        </div><Input
                  value={ header.key }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleHeaderChange(header.id, 'key', e.target.value) }
                  placeholder="Header name"
                  className="flex-1" />
                <Input
                  value={ header.value }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleHeaderChange(header.id, 'value', e.target.value) }
                  placeholder="Header value"
                  className="flex-1" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={ () => removeHeader(header.id) }
                  className="text-red-600"
                >
                  ×
                </Button>
      </div>
    </>
  ))}
          </div>
        {/* Request Body */}
        {['POST', 'PUT', 'PATCH'].includes(config.method) && (
          <div>
           
        </div><InputLabel>Request Body</InputLabel>
            <textarea
              value={ config.body }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('body', e.target.value) }
              placeholder="Enter JSON or text body"
              className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
              rows={ 4 } />
          </div>
        )}
        {/* Advanced Settings */}
        <div className=" ">$2</div><div>
           
        </div><InputLabel>Timeout (seconds)</InputLabel>
            <Input
              type="number"
              value={ config.timeout }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('timeout', parseInt(e.target.value) || 30) }
              min="1"
              max="300" /></div><div>
           
        </div><InputLabel>Retry Attempts</InputLabel>
            <Input
              type="number"
              value={ config.retryAttempts }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('retryAttempts', parseInt(e.target.value) || 3) }
              min="0"
              max="10" />
          </div>
        {/* Test Button */}
        <Button
          onClick={ handleTestApi }
          disabled={ isTesting || !config.url }
          className="w-full"
          variant="outline" />
          {isTesting ? (
            <>
              <div className="Testing...">$2</div>
      </>
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
          <div className=" ">$2</div><div className="{testResult.success ? (">$2</div>
      <CheckCircle className="w-4 h-4 text-green-600" />
    </>
  ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="{testResult.success ? 'Success' : 'Failed'}">$2</span>
              </span>
            </div>
            {testResult.status && (
              <div className=" ">$2</div><strong>Status:</strong> {testResult.status} {testResult.statusText}
              </div>
            )}
            {testResult.error && (
              <div className=" ">$2</div><strong>Error:</strong> {testResult.error}
              </div>
            )}
            {testResult.data && (
              <details className="text-sm" />
                <summary className="cursor-pointer font-semibold">Response Data</summary>
                <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-auto max-h-32" />
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
      </details>
    </>
  )}
          </div>
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

export default ApiCallNode;
