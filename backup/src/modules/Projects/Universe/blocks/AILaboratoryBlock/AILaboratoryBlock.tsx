import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Brain, 
  Image, 
  Video, 
  Wand2, 
  Play, 
  Pause, 
  Download, 
  Settings,
  Layers,
  Sparkles,
  Cpu,
  Zap
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
interface AILaboratoryBlockProps {
  data?: any;
  isConnectable?: boolean;
}
const AILaboratoryBlock: React.FC<AILaboratoryBlockProps> = ({ data, isConnectable = true }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'text'>('image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const startGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGeneratedContent(prev => [...prev, {
            type: activeTab,
            id: Date.now(),
            url: `generated-${activeTab}-${Date.now()}`,
            prompt: 'AI Generated Content'
          }]);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'image': return <Image className="w-3 h-3" />;
      case 'video': return <Video className="w-3 h-3" />;
      case 'text': return <Brain className="w-3 h-3" />;
      default: return <Brain className="w-3 h-3" />;
    }
  };
  return (
    <div className="w-80 h-96 bg-white rounded-lg shadow-lg border-2 border-cyan-200 hover:border-cyan-400 transition-all relative overflow-hidden">
      {/* Handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="prompt-in" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-cyan-500"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="content-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle 
        type="source" 
        position={Position.Top} 
        id="media-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-cyan-500 rounded text-white relative">
              <Layers className="w-4 h-4" />
              {isGenerating && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
                  <Sparkles className="w-2 h-2 text-yellow-800 m-0.5" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">AI Laboratory</h3>
              <p className="text-xs text-gray-500">Content generation hub</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-cyan-100 to-blue-100">
              <Cpu className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-3 h-full pb-16">
        {/* Tabs */}
        <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1">
          {(['image', 'video', 'text'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded text-xs font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-white text-cyan-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {getTabIcon(tab)}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {/* Generation Status */}
        {isGenerating && (
          <div className="mb-3 p-2 bg-cyan-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-cyan-700">Generating {activeTab}...</span>
              <span className="text-xs text-cyan-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}
        {/* Content Area */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {generatedContent.filter(item => item.type === activeTab).map((item) => (
            <div key={item.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTabIcon(item.type)}
                  <span className="text-xs text-gray-700 truncate">{item.prompt}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="p-1">
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-1">
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {generatedContent.filter(item => item.type === activeTab).length === 0 && !isGenerating && (
            <div className="text-center py-8 text-gray-400">
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No {activeTab} content generated yet</p>
            </div>
          )}
        </div>
      </div>
      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={startGeneration}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-3 h-3 mr-1" />
                Generate {activeTab}
              </>
            )}
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>
      {/* AI Processing Indicator */}
      {isGenerating && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AILaboratoryBlock;
