import React, { useState, useEffect } from 'react';
import { Image, Video, File, CheckCircle, XCircle, Play, Settings } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';
import useToast from '@/shared/components/ui/useToast';
const SocialPostHasMediaNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ 
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
    mediaTypes: ['image', 'video'],
    minCount: 1,
    maxCount: null,
    checkSpecificFields: false,
    mediaFields: ['media_url', 'attachments'],
    operator: 'any', // any, all, none
    ...data?.config
  });

  const [testResult, setTestResult] = useState<Record<string, any> | null>(null);

  const [isTesting, setIsTesting] = useState(false);

  const handleConfigChange = (field: string, value: unknown) => {
    const newConfig = { ...config, [field]: value};

    setConfig(newConfig);

    onUpdate?.(id, { ...data, config: newConfig });};

  const handleMediaTypeChange = (mediaType: unknown, checked: unknown) => {
    const updatedTypes = checked
      ? [...config.mediaTypes, mediaType]
      : (config.mediaTypes || []).filter(type => type !== mediaType);

    handleConfigChange('mediaTypes', updatedTypes);};

  const handleTestCondition = async () => {
    if (config.mediaTypes.length === 0) {
      toast.error('Please select at least one media type');

      return;
    }
    setIsTesting(true);

    setTestResult(null);

    try {
      // Simulate testing with sample social post data
      const samplePosts = [
        {
          id: 'post_1',
          text: 'Check out this amazing product!',
          media: [
            { type: 'image', url: 'https://example.com/image1.jpg' },
            { type: 'video', url: 'https://example.com/video1.mp4' }
          ],
          attachments: [
            { type: 'image', url: 'https://example.com/image2.jpg' }
          ]
        },
        {
          id: 'post_2',
          text: 'Just text post, no media',
          media: [],
          attachments: []
        },
        {
          id: 'post_3',
          text: 'Document attached',
          media: [
            { type: 'document', url: 'https://example.com/doc.pdf' }
          ],
          attachments: []
        }
      ];
      const results = (samplePosts || []).map(post => {
        let hasMedia = false;
        let mediaCount = 0;
        const matchedTypes = [] as unknown[];
        // Check media field
        if (post.media && post.media.length > 0) {
          post.media.forEach(media => {
            if (config.mediaTypes.includes(media.type)) {
              mediaCount++;
              matchedTypes.push(media.type);

            } );

        }
        // Check attachments field
        if (post.attachments && post.attachments.length > 0) {
          post.attachments.forEach(attachment => {
            if (config.mediaTypes.includes(attachment.type)) {
              mediaCount++;
              matchedTypes.push(attachment.type);

            } );

        }
        // Apply operator logic
        switch (config.operator) {
          case 'any':
            hasMedia = mediaCount > 0;
            break;
          case 'all':
            hasMedia = config.mediaTypes.every(type => 
              matchedTypes.includes(type));

            break;
          case 'none':
            hasMedia = mediaCount === 0;
            break;
        }
        // Check count constraints
        if (hasMedia && config.minCount !== null) {
          hasMedia = mediaCount >= config.minCount;
        }
        if (hasMedia && config.maxCount !== null) {
          hasMedia = mediaCount <= config.maxCount;
        }
        return {
          post,
          hasMedia,
          mediaCount,
          matchedTypes: [...new Set(matchedTypes)]};

      });

      setTestResult({
        results,
        config: {
          mediaTypes: config.mediaTypes,
          operator: config.operator,
          minCount: config.minCount,
          maxCount: config.maxCount
        } );

      const passedCount = (results || []).filter(r => r.hasMedia).length;
      toast.success(`Test completed: ${passedCount}/${results.length} posts passed the condition`);

    } catch (error) {
      toast.error('Test failed');

    } finally {
      setIsTesting(false);

    } ;

  const getMediaTypeIcon = (type: unknown) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <File className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    } ;

  const getOperatorDescription = () => {
    switch (config.operator) {
      case 'any':
        return 'Post has ANY of the specified media types';
      case 'all':
        return 'Post has ALL of the specified media types';
      case 'none':
        return 'Post has NONE of the specified media types';
      default:
        return 'Unknown operator';
    } ;

  return (
        <>
      <Card 
      className={`workflow-node social-post-has-media-node ${selected ? 'selected' : ''} `}
      style={minWidth: '320px',
        border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: '#FEF3C7'
      } />
      <div className=" ">$2</div><div className=" ">$2</div><Image className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-900">Social Post Has Media</h3>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800" />
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
          </Button></div><div className="{/* Media Types Selection */}">$2</div>
        <div>
           
        </div><InputLabel>Media Types to Check</InputLabel>
          <div className="{['image', 'video', 'document', 'audio'].map(type => (">$2</div>
              <div key={type} className="flex items-center gap-2">
           
        </div><input
                  type="checkbox"
                  id={`mediaType_${type}`}
                  checked={ config.mediaTypes.includes(type) }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleMediaTypeChange(type, e.target.checked) } />
                <label htmlFor={`mediaType_${type}`} className="flex items-center gap-2 text-sm text-gray-700" />
                  {getMediaTypeIcon(type)}
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
              { value: 'any', label: 'Has ANY of these media types' },
              { value: 'all', label: 'Has ALL of these media types' },
              { value: 'none', label: 'Has NONE of these media types' }
            ]} />
          <p className="text-xs text-gray-500 mt-1">{getOperatorDescription()}</p>
        </div>
        {/* Count Constraints */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2">Count Constraints</h4>
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Minimum Count</InputLabel>
              <Input
                type="number"
                value={ config.minCount || '' }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('minCount', e.target.value ? parseInt(e.target.value) : null) }
                min="0"
                placeholder="No minimum" /></div><div>
           
        </div><InputLabel>Maximum Count</InputLabel>
              <Input
                type="number"
                value={ config.maxCount || '' }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('maxCount', e.target.value ? parseInt(e.target.value) : null) }
                min="0"
                placeholder="No maximum" /></div></div>
        {/* Field Configuration */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2">Data Fields to Check</h4>
          <div className="{['media_url', 'attachments', 'media', 'files'].map(field => (">$2</div>
              <div key={field} className="flex items-center gap-2">
           
        </div><input
                  type="checkbox"
                  id={`field_${field}`}
                  checked={ config.mediaFields.includes(field) }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const updatedFields = e.target.checked
                      ? [...config.mediaFields, field]
                      : (config.mediaFields || []).filter(f => f !== field);

                    handleConfigChange('mediaFields', updatedFields);

                  } />
                <label htmlFor={`field_${field}`} className="text-sm text-gray-700" />
                  {field}
                </label>
      </div>
    </>
  ))}
          </div>
        {/* Test Button */}
        <Button
          onClick={ handleTestCondition }
          disabled={ isTesting || config.mediaTypes.length === 0 }
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
                    result.hasMedia ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  } `}>
           
        </div><div className="{result.hasMedia ? (">$2</div>
      <CheckCircle className="w-4 h-4 text-green-600" />
    </>
  ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="Post {result.post.id}">$2</span>
                    </span></div><div className=" ">$2</div><div><strong>Text:</strong> {result.post.text}</div>
                    <div><strong>Media Count:</strong> {result.mediaCount}</div>
                    <div><strong>Matched Types:</strong> {result.matchedTypes.join(', ') || 'None'}</div>
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

export default SocialPostHasMediaNode;
