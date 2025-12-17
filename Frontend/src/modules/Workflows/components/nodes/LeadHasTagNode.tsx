import React, { useState, useEffect } from 'react';
import { Tag, CheckCircle, XCircle, Search, Plus, Trash2 } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';
import useToast from '@/shared/components/ui/useToast';
const LeadHasTagNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ 
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
    tags: [],
    operator: 'any', // any, all, none
    caseSensitive: false,
    exactMatch: false,
    ...data?.config
  });

  const [newTag, setNewTag] = useState('');

  const [availableTags, setAvailableTags] = useState([
    'hot-lead',
    'cold-lead',
    'qualified',
    'unqualified',
    'vip',
    'enterprise',
    'small-business',
    'follow-up',
    'no-response',
    'interested',
    'not-interested'
  ]);

  const [testResult, setTestResult] = useState<Record<string, any> | null>(null);

  const [isTesting, setIsTesting] = useState(false);

  const handleConfigChange = (field: string, value: unknown) => {
    const newConfig = { ...config, [field]: value};

    setConfig(newConfig);

    onUpdate?.(id, { ...data, config: newConfig });};

  const handleAddTag = () => {
    if (newTag.trim() && !config.tags.includes(newTag.trim())) {
      const updatedTags = [...config.tags, newTag.trim()];
      handleConfigChange('tags', updatedTags);

      setNewTag('');

      toast.success('Tag added');

    } ;

  const handleRemoveTag = (tagToRemove: unknown) => {
    const updatedTags = (config.tags || []).filter((tag: unknown) => tag !== tagToRemove);

    handleConfigChange('tags', updatedTags);

    toast.success('Tag removed');};

  const handleAddExistingTag = (tag: unknown) => {
    if (!config.tags.includes(tag)) {
      const updatedTags = [...config.tags, tag];
      handleConfigChange('tags', updatedTags);

      toast.success('Tag added');

    } ;

  const handleTestCondition = async () => {
    if (config.tags.length === 0) {
      toast.error('Please add at least one tag');

      return;
    }
    setIsTesting(true);

    setTestResult(null);

    try {
      // Simulate testing with sample lead data
      const sampleLead = {
        id: 'lead_123',
        name: 'John Doe',
        email: 'john@example.com',
        tags: ['hot-lead', 'qualified', 'vip']};

      let result = false;
      const leadTags = sampleLead.tags || [];
      switch (config.operator) {
        case 'any':
          result = config.tags.some((tag: unknown) => 
            leadTags.some(leadTag => 
              config.exactMatch 
                ? leadTag === tag 
                : leadTag.toLowerCase().includes(tag.toLowerCase())
            ));

          break;
        case 'all':
          result = config.tags.every((tag: unknown) => 
            leadTags.some(leadTag => 
              config.exactMatch 
                ? leadTag === tag 
                : leadTag.toLowerCase().includes(tag.toLowerCase())
            ));

          break;
        case 'none':
          result = !config.tags.some((tag: unknown) => 
            leadTags.some(leadTag => 
              config.exactMatch 
                ? leadTag === tag 
                : leadTag.toLowerCase().includes(tag.toLowerCase())
            ));

          break;
      }
      setTestResult({
        success: result,
        leadData: sampleLead,
        matchedTags: (config.tags || []).filter((tag: unknown) => 
          leadTags.some(leadTag => 
            config.exactMatch 
              ? leadTag === tag 
              : leadTag.toLowerCase().includes(tag.toLowerCase())
          )
        ),
        operator: config.operator
      });

      toast.success(`Test completed: ${result ? 'Condition met' : 'Condition not met'}`);

    } catch (error) {
      toast.error('Test failed');

    } finally {
      setIsTesting(false);

    } ;

  const getOperatorDescription = () => {
    switch (config.operator) {
      case 'any':
        return 'Lead has ANY of the specified tags';
      case 'all':
        return 'Lead has ALL of the specified tags';
      case 'none':
        return 'Lead has NONE of the specified tags';
      default:
        return 'Unknown operator';
    } ;

  return (
        <>
      <Card 
      className={`workflow-node lead-has-tag-node ${selected ? 'selected' : ''} `}
      style={minWidth: '300px',
        border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: '#F0FDF4'
      } />
      <div className=" ">$2</div><div className=" ">$2</div><Tag className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Lead Has Tag</h3>
          <Badge variant="secondary" className="bg-green-100 text-green-800" />
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
          </Button></div><div className="{/* Operator Selection */}">$2</div>
        <div>
           
        </div><InputLabel>Condition</InputLabel>
          <Select
            value={ config.operator }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('operator', e.target.value) }
            options={[
              { value: 'any', label: 'Has ANY of these tags' },
              { value: 'all', label: 'Has ALL of these tags' },
              { value: 'none', label: 'Has NONE of these tags' }
            ]} />
          <p className="text-xs text-gray-500 mt-1">{getOperatorDescription()}</p>
        </div>
        {/* Tags Configuration */}
        <div>
           
        </div><InputLabel>Tags to Check</InputLabel>
          {/* Add New Tag */}
          <div className=" ">$2</div><Input
              value={ newTag }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value) }
              placeholder="Enter tag name"
              onKeyPress={ (e: unknown) => e.key === 'Enter' && handleAddTag() } />
            <Button
              onClick={ handleAddTag }
              disabled={ !newTag.trim() }
              size="sm"
              variant="outline" />
              <Plus className="w-4 h-4" /></Button></div>
          {/* Current Tags */}
          {config.tags.length > 0 && (
            <div className=" ">$2</div><p className="text-sm font-medium text-gray-700">Selected Tags:</p>
              <div className="{(config.tags || []).map((tag: unknown, index: unknown) => (">$2</div>
                  <Badge
                    key={ index }
                    variant="secondary"
                    className="bg-green-100 text-green-800 flex items-center gap-1" />
                    {tag}
                    <button
                      onClick={ () => handleRemoveTag(tag) }
                      className="ml-1 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" /></button></Badge>
                ))}
              </div>
          )}
          {/* Available Tags */}
          <div className=" ">$2</div><p className="text-sm font-medium text-gray-700 mb-2">Available Tags:</p>
            <div className="{availableTags">$2</div>
                .filter((tag: unknown) => !config.tags.includes(tag))
                .map((tag: unknown, index: unknown) => (
                  <button
                    key={ index }
                    onClick={ () => handleAddExistingTag(tag) }
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
            </div>
        </div>
        {/* Matching Options */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2">Matching Options</h4>
          <div className=" ">$2</div><div className=" ">$2</div><input
                type="checkbox"
                id="exactMatch"
                checked={ config.exactMatch }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('exactMatch', e.target.checked) } />
              <label htmlFor="exactMatch" className="text-sm text-gray-700" />
                Exact match (case-sensitive)
              </label></div><div className=" ">$2</div><input
                type="checkbox"
                id="caseSensitive"
                checked={ config.caseSensitive }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('caseSensitive', e.target.checked) } />
              <label htmlFor="caseSensitive" className="text-sm text-gray-700" />
                Case sensitive
              </label></div></div>
        {/* Test Button */}
        <Button
          onClick={ handleTestCondition }
          disabled={ isTesting || config.tags.length === 0 }
          className="w-full"
          variant="outline" />
          {isTesting ? (
            <>
              <div className="Testing...">$2</div>
      </>
    </>
  ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Test Condition
            </>
          )}
        </Button>
        {/* Test Results */}
        {testResult && (
          <div className={`p-3 rounded-lg ${testResult.success ? 'bg-green-50' : 'bg-red-50'} `}>
           
        </div><div className="{testResult.success ? (">$2</div>
      <CheckCircle className="w-4 h-4 text-green-600" />
    </>
  ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className={`font-semibold ${testResult.success ? 'text-green-800' : 'text-red-800'} `}>
           
        </span>{testResult.success ? 'Condition Met' : 'Condition Not Met'}
              </span></div><div className=" ">$2</div><div>
           
        </div><strong>Operator:</strong> {testResult.operator}
              </div>
              <div>
           
        </div><strong>Lead Tags:</strong> {testResult.leadData.tags.join(', ')}
              </div>
              <div>
           
        </div><strong>Matched Tags:</strong> {testResult.matchedTags.join(', ') || 'None'}
              </div>
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

export default LeadHasTagNode;
