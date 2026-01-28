import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Send, 
  Brain, 
  Lightbulb, 
  Wand2, 
  Settings, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { ChatMessage, AISuggestion, UniverseBlock } from '../../types/universe';
interface UniverseAIChatProps {
  onClose: () => void;
  selectedBlock?: UniverseBlock | null;
  onNodeAction?: (action: string, nodeId?: string) => void;
  className?: string;
}
const UniverseAIChat: React.FC<UniverseAIChatProps> = ({ 
  onClose, 
  selectedBlock,
  onNodeAction,
  className 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your Universe AI assistant. I can help you build workflows, suggest optimizations, and answer questions about your blocks. What would you like to work on?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      suggestions: [
        {
          id: '1',
          type: 'optimization',
          title: 'Optimize my current workflow',
          description: 'Analyze and improve your existing workflow',
          confidence: 0.9,
          action: { type: 'optimize', parameters: {}, execute: async () => {} },
          metadata: {}
        },
        {
          id: '2',
          type: 'connection',
          title: 'Add analytics to my dashboard',
          description: 'Connect analytics block to your dashboard',
          confidence: 0.8,
          action: { type: 'connect', parameters: {}, execute: async () => {} },
          metadata: {}
        },
        {
          id: '3',
          type: 'automation',
          title: 'Connect blocks automatically',
          description: 'Set up automatic connections between blocks',
          confidence: 0.7,
          action: { type: 'auto_connect', parameters: {}, execute: async () => {} },
          metadata: {}
        },
        {
          id: '4',
          type: 'template',
          title: 'Generate content ideas',
          description: 'Create content suggestions for your campaign',
          confidence: 0.85,
          action: { type: 'generate_content', parameters: {}, execute: async () => {} },
          metadata: {}
        }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  useEffect(() => {
    if (selectedBlock) {
      const contextMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `I notice you've selected the ${selectedBlock.type} block. I can help you configure it, connect it to other blocks, or suggest improvements. What would you like to do?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        nodeContext: selectedBlock.id,
        suggestions: [
          {
            id: 'config',
            type: 'optimization',
            title: `Configure ${selectedBlock.type} settings`,
            description: 'Open configuration panel for this block',
            confidence: 0.9,
            action: { type: 'configure', parameters: { blockId: selectedBlock.id }, execute: async () => {} },
            metadata: { blockId: selectedBlock.id }
          },
          {
            id: 'connect',
            type: 'connection',
            title: 'Connect to other blocks',
            description: 'Suggest connections to related blocks',
            confidence: 0.8,
            action: { type: 'suggest_connections', parameters: { blockId: selectedBlock.id }, execute: async () => {} },
            metadata: { blockId: selectedBlock.id }
          },
          {
            id: 'optimize',
            type: 'optimization',
            title: 'Optimize performance',
            description: 'Analyze and improve block performance',
            confidence: 0.7,
            action: { type: 'optimize_block', parameters: { blockId: selectedBlock.id }, execute: async () => {} },
            metadata: { blockId: selectedBlock.id }
          },
          {
            id: 'automate',
            type: 'automation',
            title: 'Add automation rules',
            description: 'Set up automated actions for this block',
            confidence: 0.75,
            action: { type: 'add_automation', parameters: { blockId: selectedBlock.id }, execute: async () => {} },
            metadata: { blockId: selectedBlock.id }
          }
        ]
      };
      setMessages(prev => [...prev, contextMessage]);
    }
  }, [selectedBlock]);
  const generateAIResponse = useCallback((userMessage: string): ChatMessage => {
    const responses = [
      {
        content: "Great question! Based on your current setup, I'd recommend connecting your analytics block to the dashboard for real-time insights. This will help you track performance metrics automatically.",
        suggestions: [
          {
            id: 'connect_analytics',
            type: 'connection',
            title: 'Show me how to connect them',
            description: 'Step-by-step connection guide',
            confidence: 0.9,
            action: { type: 'show_connection_guide', parameters: {}, execute: async () => {} },
            metadata: {}
          },
          {
            id: 'metrics_guide',
            type: 'optimization',
            title: 'What metrics should I track?',
            description: 'Recommended metrics for your setup',
            confidence: 0.8,
            action: { type: 'suggest_metrics', parameters: {}, execute: async () => {} },
            metadata: {}
          },
          {
            id: 'auto_reports',
            type: 'automation',
            title: 'Set up automated reports',
            description: 'Configure automatic report generation',
            confidence: 0.7,
            action: { type: 'setup_reports', parameters: {}, execute: async () => {} },
            metadata: {}
          }
        ]
      },
      {
        content: "I can help you optimize that workflow! Try adding an AI agent block between your data sources and outputs. This will enable smart routing and automated decision-making.",
        suggestions: [
          {
            id: 'add_ai_agent',
            type: 'connection',
            title: 'Add AI agent block',
            description: 'Insert AI agent into your workflow',
            confidence: 0.9,
            action: { type: 'add_block', parameters: { type: 'aiAgent' }, execute: async () => {} },
            metadata: {}
          },
          {
            id: 'smart_routing',
            type: 'automation',
            title: 'Configure smart routing',
            description: 'Set up intelligent data routing',
            confidence: 0.8,
            action: { type: 'configure_routing', parameters: {}, execute: async () => {} },
            metadata: {}
          },
          {
            id: 'automation_rules',
            type: 'automation',
            title: 'Set up automation rules',
            description: 'Create automated decision rules',
            confidence: 0.7,
            action: { type: 'setup_automation', parameters: {}, execute: async () => {} },
            metadata: {}
          }
        ]
      },
      {
        content: "For content generation, I suggest connecting your AI Laboratory to the Media Library. This creates a seamless content creation and storage pipeline.",
        suggestions: [
          {
            id: 'connect_ai_media',
            type: 'connection',
            title: 'Connect AI Lab to Media Library',
            description: 'Link content generation to storage',
            confidence: 0.9,
            action: { type: 'connect_blocks', parameters: { source: 'aiLaboratory', target: 'mediaLibrary' }, execute: async () => {} },
            metadata: {}
          },
          {
            id: 'auto_save',
            type: 'automation',
            title: 'Set up auto-save',
            description: 'Automatically save generated content',
            confidence: 0.8,
            action: { type: 'setup_auto_save', parameters: {}, execute: async () => {} },
            metadata: {}
          },
          {
            id: 'content_templates',
            type: 'template',
            title: 'Configure content templates',
            description: 'Set up reusable content templates',
            confidence: 0.7,
            action: { type: 'setup_templates', parameters: {}, execute: async () => {} },
            metadata: {}
          }
        ]
      }
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    return {
      id: Date.now().toString(),
      content: response.content,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      suggestions: response.suggestions
    };
  }, []);
  const sendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }, [inputValue, generateAIResponse]);
  const handleSuggestionClick = useCallback((suggestion: AISuggestion) => {
    setInputValue(suggestion.title);
    // Execute suggestion action
    suggestion.action.execute();
  }, []);
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);
  const toggleListening = useCallback(() => {
    setIsListening(!isListening);
    // Implement voice input functionality
  }, [isListening]);
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    // Implement audio output toggle
  }, [isMuted]);
  return (
    <div className={cn(
      "fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded text-white">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">AI Assistant</h2>
              <p className="text-xs text-gray-500">Universe workflow helper</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose} className="p-1">
            <X className="w-4 h-4" />
          </Button>
        </div>
        {selectedBlock && (
          <Badge variant="secondary" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            Focused on: {selectedBlock.type}
          </Badge>
        )}
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-lg rounded-br-sm' 
                : 'bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm'
            } p-3`}>
              {message.sender === 'ai' && (
                <div className="flex items-center gap-1 mb-1">
                  <Brain className="w-3 h-3" />
                  <span className="text-xs font-medium">AI Assistant</span>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs font-medium text-gray-600 mb-1">Suggestions:</div>
                  {message.suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-xs p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        <span className="font-medium">{suggestion.title}</span>
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {Math.round(suggestion.confidence * 100)}%
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-1">{suggestion.description}</p>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200">
                <span className="text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.sender === 'ai' && (
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm p-3 max-w-[85%]">
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3" />
                <span className="text-xs font-medium">AI Assistant is thinking...</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Quick Actions */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs font-medium text-gray-600 mb-2">Quick Actions</div>
        <div className="flex gap-1 flex-wrap">
          <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSuggestionClick({
            id: 'optimize',
            type: 'optimization',
            title: 'Help me optimize my workflow',
            description: 'Analyze and improve your workflow',
            confidence: 0.9,
            action: { type: 'optimize', parameters: {}, execute: async () => {} },
            metadata: {}
          })}>
            <Wand2 className="w-3 h-3 mr-1" />
            Optimize
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSuggestionClick({
            id: 'add_block',
            type: 'connection',
            title: 'Add a new block',
            description: 'Suggest a new block for your workflow',
            confidence: 0.8,
            action: { type: 'suggest_block', parameters: {}, execute: async () => {} },
            metadata: {}
          })}>
            Add Block
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSuggestionClick({
            id: 'connect',
            type: 'connection',
            title: 'Connect my blocks',
            description: 'Suggest connections between blocks',
            confidence: 0.7,
            action: { type: 'suggest_connections', parameters: {}, execute: async () => {} },
            metadata: {}
          })}>
            Connect
          </Button>
        </div>
      </div>
      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2 mb-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your workflow..."
            className="flex-1 text-sm"
          />
          <Button 
            size="sm" 
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={toggleListening}
              className={cn("p-1", isListening && "bg-red-100 text-red-600")}
            >
              {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={toggleMute}
              className={cn("p-1", isMuted && "bg-gray-100 text-gray-600")}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};
export default UniverseAIChat;
