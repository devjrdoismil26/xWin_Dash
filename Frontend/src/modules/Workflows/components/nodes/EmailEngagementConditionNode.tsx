import React, { useState, useEffect } from 'react';
import { Mail, Eye, MousePointer, Clock, CheckCircle, XCircle, Play, Settings } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';
import useToast from '@/shared/components/ui/useToast';
const EmailEngagementConditionNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ 
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
    engagementTypes: ['opened', 'clicked'],
    timeWindow: 24, // hours
    timeWindowUnit: 'hours',
    minEngagements: 1,
    maxEngagements: null,
    operator: 'any', // any, all, none
    checkSpecificLinks: false,
    specificLinks: [],
    ...data?.config
  });

  const [testResult, setTestResult] = useState<Record<string, any> | null>(null);

  const [isTesting, setIsTesting] = useState(false);

  const handleConfigChange = (field: string, value: unknown) => {
    const newConfig = { ...config, [field]: value};

    setConfig(newConfig);

    onUpdate?.(id, { ...data, config: newConfig });};

  const handleEngagementTypeChange = (type: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...config.engagementTypes, type]
      : (config.engagementTypes || []).filter((t: unknown) => t !== type);

    handleConfigChange('engagementTypes', updatedTypes);};

  const handleAddLink = () => {
    const newLink = prompt('Enter link URL:');

    if (newLink && !config.specificLinks.includes(newLink)) {
      handleConfigChange('specificLinks', [...config.specificLinks, newLink]);

    } ;

  const handleRemoveLink = (linkToRemove: unknown) => {
    const updatedLinks = (config.specificLinks || []).filter((link: unknown) => link !== linkToRemove);

    handleConfigChange('specificLinks', updatedLinks);};

  const handleTestCondition = async () => {
    if (config.engagementTypes.length === 0) {
      toast.error('Please select at least one engagement type');

      return;
    }
    setIsTesting(true);

    setTestResult(null);

    try {
      // Simulate testing with sample email engagement data
      const sampleEmails = [
        {
          id: 'email_1',
          subject: 'Welcome to our service!',
          sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          engagements: [
            { type: 'opened', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
            { type: 'clicked', timestamp: new Date(Date.now() - 30 * 60 * 1000), link: 'https://example.com/signup' }
          ]
        },
        {
          id: 'email_2',
          subject: 'Product Update',
          sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 48 hours ago
          engagements: [
            { type: 'opened', timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000) }
          ]
        },
        {
          id: 'email_3',
          subject: 'Newsletter',
          sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          engagements: [
            { type: 'clicked', timestamp: new Date(Date.now() - 30 * 60 * 1000), link: 'https://example.com/newsletter' }
          ]
        },
        {
          id: 'email_4',
          subject: 'No engagement',
          sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          engagements: []
        }
      ];
      const results = (sampleEmails || []).map(email => {
        const timeWindowMs = config.timeWindow * (config.timeWindowUnit === 'hours' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000);

        const cutoffTime = new Date(Date.now() - timeWindowMs);

        // Filter engagements within time window
        const recentEngagements = (email.engagements || []).filter(engagement => 
          new Date(engagement.timestamp) >= cutoffTime);

        let hasEngagement = false;
        let engagementCount = 0;
        const matchedTypes = [] as unknown[];
        // Check engagement types
        recentEngagements.forEach(engagement => {
          if (config.engagementTypes.includes(engagement.type)) {
            engagementCount++;
            matchedTypes.push(engagement.type);

          } );

        // Apply operator logic
        switch (config.operator) {
          case 'any':
            hasEngagement = engagementCount > 0;
            break;
          case 'all':
            hasEngagement = config.engagementTypes.every((type: unknown) => 
              matchedTypes.includes(type));

            break;
          case 'none':
            hasEngagement = engagementCount === 0;
            break;
        }
        // Check count constraints
        if (hasEngagement && config.minEngagements !== null) {
          hasEngagement = engagementCount >= config.minEngagements;
        }
        if (hasEngagement && config.maxEngagements !== null) {
          hasEngagement = engagementCount <= config.maxEngagements;
        }
        // Check specific links if enabled
        if (hasEngagement && config.checkSpecificLinks && config.specificLinks.length > 0) {
          const hasSpecificLink = recentEngagements.some(engagement => 
            engagement.type === 'clicked' && 
            config.specificLinks.some((link: unknown) => engagement.link?.includes(link)));

          hasEngagement = hasSpecificLink;
        }
        return {
          email,
          hasEngagement,
          engagementCount,
          matchedTypes: [...new Set(matchedTypes)],
          recentEngagements};

      });

      setTestResult({
        results,
        config: {
          engagementTypes: config.engagementTypes,
          operator: config.operator,
          timeWindow: config.timeWindow,
          timeWindowUnit: config.timeWindowUnit,
          minEngagements: config.minEngagements,
          maxEngagements: config.maxEngagements
        } );

      const passedCount = (results || []).filter(r => r.hasEngagement).length;
      toast.success(`Test completed: ${passedCount}/${results.length} emails passed the condition`);

    } catch (error) {
      toast.error('Test failed');

    } finally {
      setIsTesting(false);

    } ;

  const getEngagementIcon = (type: unknown) => {
    switch (type) {
      case 'opened':
        return <Eye className="w-4 h-4" />;
      case 'clicked':
        return <MousePointer className="w-4 h-4" />;
      case 'replied':
        return <Mail className="w-4 h-4" />;
      case 'unsubscribed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    } ;

  const getOperatorDescription = () => {
    switch (config.operator) {
      case 'any':
        return 'Email has ANY of the specified engagement types';
      case 'all':
        return 'Email has ALL of the specified engagement types';
      case 'none':
        return 'Email has NONE of the specified engagement types';
      default:
        return 'Unknown operator';
    } ;

  return (
        <>
      <Card 
      className={`workflow-node email-engagement-condition-node ${selected ? 'selected' : ''} `}
      style={minWidth: '340px',
        border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: '#F0F9FF'
      } />
      <div className=" ">$2</div><div className=" ">$2</div><Mail className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Email Engagement Condition</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800" />
            Condition
          </Badge></div><div className=" ">$2</div><Button
            size="sm"
            variant="ghost"
            onClick={ () => onConnect?.(id) }
            title="Connect"
          >
            <CheckCircle className="w-4 h-4" /></Button><Button
            size="sm"
            variant="ghost"
            onClick={ () => onDisconnect?.(id) }
            title="Disconnect"
          >
            <XCircle className="w-4 h-4" /></Button><Button
            size="sm"
            variant="ghost"
            onClick={ () => onDelete?.(id) }
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            ×
          </Button></div><div className="{/* Engagement Types Selection */}">$2</div>
        <div>
           
        </div><InputLabel>Engagement Types to Check</InputLabel>
          <div className="{['opened', 'clicked', 'replied', 'unsubscribed', 'bounced'].map(type => (">$2</div>
              <div key={type} className="flex items-center gap-2">
           
        </div><input
                  type="checkbox"
                  id={`engagementType_${type}`}
                  checked={ config.engagementTypes.includes(type) }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleEngagementTypeChange(type, e.target.checked) } />
                <label htmlFor={`engagementType_${type}`} className="flex items-center gap-2 text-sm text-gray-700" />
                  {getEngagementIcon(type)}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
      </div>
    </>
  ))}
          </div>
        {/* Operator Selection */}
        <div>
           
        </div><InputLabel>Condition</InputLabel>
          <Select
            value={ config.operator }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('operator', e.target.value) }
            options={[
              { value: 'any', label: 'Has ANY of these engagement types' },
              { value: 'all', label: 'Has ALL of these engagement types' },
              { value: 'none', label: 'Has NONE of these engagement types' }
            ]} />
          <p className="text-xs text-gray-500 mt-1">{getOperatorDescription()}</p>
        </div>
        {/* Time Window */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2" />
            <Clock className="w-4 h-4" />
            Time Window
          </h4>
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Duration</InputLabel>
              <Input
                type="number"
                value={ config.timeWindow }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('timeWindow', parseInt(e.target.value) || 24) }
                min="1"
                placeholder="24" /></div><div>
           
        </div><InputLabel>Unit</InputLabel>
              <Select
                value={ config.timeWindowUnit }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('timeWindowUnit', e.target.value) }
                options={[
                  { value: 'hours', label: 'Hours' },
                  { value: 'days', label: 'Days' }
                ]} /></div></div>
        {/* Count Constraints */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2">Count Constraints</h4>
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Minimum Count</InputLabel>
              <Input
                type="number"
                value={ config.minEngagements || '' }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('minEngagements', e.target.value ? parseInt(e.target.value) : null) }
                min="0"
                placeholder="No minimum" /></div><div>
           
        </div><InputLabel>Maximum Count</InputLabel>
              <Input
                type="number"
                value={ config.maxEngagements || '' }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('maxEngagements', e.target.value ? parseInt(e.target.value) : null) }
                min="0"
                placeholder="No maximum" /></div></div>
        {/* Specific Links */}
        <div className=" ">$2</div><div className=" ">$2</div><input
              type="checkbox"
              id="checkSpecificLinks"
              checked={ config.checkSpecificLinks }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('checkSpecificLinks', e.target.checked) } />
            <label htmlFor="checkSpecificLinks" className="font-semibold text-gray-900" />
              Check Specific Links
            </label>
          </div>
          {config.checkSpecificLinks && (
            <div className=" ">$2</div><div className=" ">$2</div><Button
                  onClick={ handleAddLink }
                  size="sm"
                  variant="outline" />
                  Add Link
                </Button>
              </div>
              {config.specificLinks.length > 0 && (
                <div className="{(config.specificLinks || []).map((link: unknown, index: unknown) => (">$2</div>
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
           
        </div><span className="text-sm text-gray-700 flex-1 truncate">{link}</span>
                      <Button
                        onClick={ () => handleRemoveLink(link) }
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                      >
                        ×
                      </Button>
      </div>
    </>
  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Test Button */}
        <Button
          onClick={ handleTestCondition }
          disabled={ isTesting || config.engagementTypes.length === 0 }
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
              Test Condition
            </>
          )}
        </Button>
        {/* Test Results */}
        {testResult && (
          <div className=" ">$2</div><div className=" ">$2</div><Settings className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">Test Results</span></div><div className="{(testResult.results || []).map((result: unknown, index: unknown) => (">$2</div>
                <div
                  key={ index }
                  className={`p-2 rounded border ${
                    result.hasEngagement ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  } `}>
           
        </div><div className="{result.hasEngagement ? (">$2</div>
      <CheckCircle className="w-4 h-4 text-green-600" />
    </>
  ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="{result.email.subject}">$2</span>
                    </span></div><div className=" ">$2</div><div><strong>Engagement Count:</strong> {result.engagementCount}</div>
                    <div><strong>Matched Types:</strong> {result.matchedTypes.join(', ') || 'None'}</div>
                    <div><strong>Recent Engagements:</strong> {result.recentEngagements.length}</div>
    </div>
  ))}
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
           
        </div><div className="connection-point output-true" data-node-id={id} data-type="output-true">
           
        </div><div className="connection-dot">
           
        </div><div className="connection-point output-false" data-node-id={id} data-type="output-false">
           
        </div><div className="connection-dot" /></div></Card>);};

export default EmailEngagementConditionNode;
