import React, { useState, useEffect } from 'react';
import { Image, Video, File, CheckCircle, XCircle, Play, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Badge from '@/components/ui/Badge';
import useToast from '@/components/ui/useToast';
const SocialPostHasMediaNode = ({ 
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
    mediaTypes: ['image', 'video'],
    minCount: 1,
    maxCount: null,
    checkSpecificFields: false,
    mediaFields: ['media_url', 'attachments'],
    operator: 'any', // any, all, none
    ...data?.config
  });
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onUpdate?.(id, { ...data, config: newConfig });
  };
  const handleMediaTypeChange = (mediaType, checked) => {
    const updatedTypes = checked
      ? [...config.mediaTypes, mediaType]
      : config.mediaTypes.filter(type => type !== mediaType);
    handleConfigChange('mediaTypes', updatedTypes);
  };
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
      const results = samplePosts.map(post => {
        let hasMedia = false;
        let mediaCount = 0;
        const matchedTypes = [];
        // Check media field
        if (post.media && post.media.length > 0) {
          post.media.forEach(media => {
            if (config.mediaTypes.includes(media.type)) {
              mediaCount++;
              matchedTypes.push(media.type);
            }
          });
        }
        // Check attachments field
        if (post.attachments && post.attachments.length > 0) {
          post.attachments.forEach(attachment => {
            if (config.mediaTypes.includes(attachment.type)) {
              mediaCount++;
              matchedTypes.push(attachment.type);
            }
          });
        }
        // Apply operator logic
        switch (config.operator) {
          case 'any':
            hasMedia = mediaCount > 0;
            break;
          case 'all':
            hasMedia = config.mediaTypes.every(type => 
              matchedTypes.includes(type)
            );
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
          matchedTypes: [...new Set(matchedTypes)]
        };
      });
      setTestResult({
        results,
        config: {
          mediaTypes: config.mediaTypes,
          operator: config.operator,
          minCount: config.minCount,
          maxCount: config.maxCount
        }
      });
      const passedCount = results.filter(r => r.hasMedia).length;
      toast.success(`Test completed: ${passedCount}/${results.length} posts passed the condition`);
    } catch (error) {
      toast.error('Test failed');
    } finally {
      setIsTesting(false);
    }
  };
  const getMediaTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <File className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };
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
    }
  };
  return (
    <Card 
      className={`workflow-node social-post-has-media-node ${selected ? 'selected' : ''}`}
      style={{
        minWidth: '320px',
        border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: '#FEF3C7'
      }}
    >
      <div className="node-header">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-900">Social Post Has Media</h3>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Condition
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onConnect?.(id)}
            title="Connect"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDisconnect?.(id)}
            title="Disconnect"
          >
            <XCircle className="w-4 h-4" />
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
        {/* Media Types Selection */}
        <div>
          <InputLabel>Media Types to Check</InputLabel>
          <div className="space-y-2">
            {['image', 'video', 'document', 'audio'].map(type => (
              <div key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`mediaType_${type}`}
                  checked={config.mediaTypes.includes(type)}
                  onChange={(e) => handleMediaTypeChange(type, e.target.checked)}
                />
                <label htmlFor={`mediaType_${type}`} className="flex items-center gap-2 text-sm text-gray-700">
                  {getMediaTypeIcon(type)}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* Operator Selection */}
        <div>
          <InputLabel>Condition</InputLabel>
          <Select
            value={config.operator}
            onChange={(e) => handleConfigChange('operator', e.target.value)}
            options={[
              { value: 'any', label: 'Has ANY of these media types' },
              { value: 'all', label: 'Has ALL of these media types' },
              { value: 'none', label: 'Has NONE of these media types' }
            ]}
          />
          <p className="text-xs text-gray-500 mt-1">{getOperatorDescription()}</p>
        </div>
        {/* Count Constraints */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Count Constraints</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <InputLabel>Minimum Count</InputLabel>
              <Input
                type="number"
                value={config.minCount || ''}
                onChange={(e) => handleConfigChange('minCount', e.target.value ? parseInt(e.target.value) : null)}
                min="0"
                placeholder="No minimum"
              />
            </div>
            <div>
              <InputLabel>Maximum Count</InputLabel>
              <Input
                type="number"
                value={config.maxCount || ''}
                onChange={(e) => handleConfigChange('maxCount', e.target.value ? parseInt(e.target.value) : null)}
                min="0"
                placeholder="No maximum"
              />
            </div>
          </div>
        </div>
        {/* Field Configuration */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Data Fields to Check</h4>
          <div className="space-y-2">
            {['media_url', 'attachments', 'media', 'files'].map(field => (
              <div key={field} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`field_${field}`}
                  checked={config.mediaFields.includes(field)}
                  onChange={(e) => {
                    const updatedFields = e.target.checked
                      ? [...config.mediaFields, field]
                      : config.mediaFields.filter(f => f !== field);
                    handleConfigChange('mediaFields', updatedFields);
                  }}
                />
                <label htmlFor={`field_${field}`} className="text-sm text-gray-700">
                  {field}
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* Test Button */}
        <Button
          onClick={handleTestCondition}
          disabled={isTesting || config.mediaTypes.length === 0}
          className="w-full"
          variant="outline"
        >
          {isTesting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
              Testing...
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
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">Test Results</span>
            </div>
            <div className="space-y-2">
              {testResult.results.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border ${
                    result.hasMedia ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {result.hasMedia ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium text-sm">
                      Post {result.post.id}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Text:</strong> {result.post.text}</div>
                    <div><strong>Media Count:</strong> {result.mediaCount}</div>
                    <div><strong>Matched Types:</strong> {result.matchedTypes.join(', ') || 'None'}</div>
                  </div>
                </div>
              ))}
            </div>
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
        <div className="connection-point output-true" data-node-id={id} data-type="output-true">
          <div className="connection-dot"></div>
        </div>
        <div className="connection-point output-false" data-node-id={id} data-type="output-false">
          <div className="connection-dot"></div>
        </div>
      </div>
    </Card>
  );
};
export default SocialPostHasMediaNode;
