import React, { useState, useCallback } from 'react';
import { X, Search, Grid, Plus, Layers, Zap, BarChart3, Users, Mail, ShoppingCart, Layout, Image, Brain, Globe, Database, MessageSquare, Workflow, Filter, MessageCircle, SortAsc, Star, Clock, TrendingUp } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Badge from '@/shared/components/ui/Badge';
import { cn } from '@/lib/utils';
import { BlockType, BlockCategory } from '@/types/blocks';
interface UniverseToolbarProps {
  onAddNode?: (e: any) => void;
  onToggle??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  color: string;
  category: BlockCategory;
  description: string;
  isPopular?: boolean;
  isNew?: boolean; }
const blockDefinitions: BlockDefinition[] = [
  // Core Blocks
  {
    type: 'dashboard',
    label: 'Dashboard',
    icon: <Layout className="w-4 h-4" />,
    color: 'bg-blue-500',
    category: 'core',
    description: 'Central dashboard with real-time metrics',
    isPopular: true,
  },
  {
    type: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    color: 'bg-purple-500',
    category: 'core',
    description: 'Advanced analytics and reporting',
    isPopular: true,
  },
  {
    type: 'workflows',
    label: 'Workflows',
    icon: <Workflow className="w-4 h-4" />,
    color: 'bg-indigo-500',
    category: 'core',
    description: 'Automated workflow management',
    isPopular: true,
  },
  // Marketing Blocks
  {
    type: 'emailMarketing',
    label: 'Email Marketing',
    icon: <Mail className="w-4 h-4" />,
    color: 'bg-red-500',
    category: 'marketing',
    description: 'Email campaigns and automation',
    isPopular: true,
  },
  {
    type: 'socialBuffer',
    label: 'Social Buffer',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'bg-pink-500',
    category: 'marketing',
    description: 'Social media management',
  },
  {
    type: 'leads',
    label: 'Leads',
    icon: <Users className="w-4 h-4" />,
    color: 'bg-teal-500',
    category: 'marketing',
    description: 'Lead generation and management',
  },
  {
    type: 'adsTool',
    label: 'Ads Tool',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-yellow-500',
    category: 'marketing',
    description: 'Advertising campaign management',
  },
  // AI Blocks
  {
    type: 'aiLaboratory',
    label: 'AI Laboratory',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-cyan-500',
    category: 'ai',
    description: 'AI content generation and analysis',
    isNew: true,
  },
  {
    type: 'aiAgent',
    label: 'AI Agent',
    icon: <Layers className="w-4 h-4" />,
    color: 'bg-violet-500',
    category: 'ai',
    description: 'Intelligent automation agent',
    isNew: true,
  },
  // Integrations
  {
    type: 'aura',
    label: 'Aura',
    icon: <MessageCircle className="w-4 h-4" />,
    color: 'bg-lime-500',
    category: 'integrations',
    description: 'WhatsApp and messaging automation',
  },
  {
    type: 'webBrowser',
    label: 'Web Browser',
    icon: <Globe className="w-4 h-4" />,
    color: 'bg-amber-500',
    category: 'integrations',
    description: 'Web automation and scraping',
  },
  {
    type: 'mediaLibrary',
    label: 'Media Library',
    icon: <Image className="w-4 h-4" />,
    color: 'bg-rose-500',
    category: 'integrations',
    description: 'Media management and storage',
  },
];
const categories = [
  { id: 'core', name: 'Core', icon: <Grid className="w-4 h-4" />, color: 'text-blue-600' },
  { id: 'marketing', name: 'Marketing', icon: <Zap className="w-4 h-4" />, color: 'text-red-600' },
  { id: 'ai', name: 'AI & Automation', icon: <Brain className="w-4 h-4" />, color: 'text-purple-600' },
  { id: 'integrations', name: 'Integrations', icon: <Database className="w-4 h-4" />, color: 'text-green-600' },
];
const UniverseToolbar: React.FC<UniverseToolbarProps> = ({ onAddNode, 
  onToggle, 
  className 
   }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState<BlockCategory | 'all'>('all');

  const [sortBy, setSortBy] = useState<'name' | 'popular' | 'new'>('name');

  const [showFavorites, setShowFavorites] = useState(false);

  const onDragStart = useCallback((event: React.DragEvent, nodeType: BlockType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);

    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const filteredBlocks = blockDefinitions
    .filter(block => {
      const matchesSearch = block.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           block.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
      const matchesFavorites = !showFavorites || block.isPopular;
      return matchesSearch && matchesCategory && matchesFavorites;
    })
    .sort((a: unknown, b: unknown) => {
      switch (sortBy) {
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);

        case 'new':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);

        default:
          return a.label.localeCompare(b.label);

      } );

  const getCategoryBlocks = (categoryId: BlockCategory) => {
    return (blockDefinitions || []).filter(block => block.category === categoryId);};

  return (
        <>
      <div className={cn(
      "fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 shadow-lg z-50 overflow-hidden flex flex-col",
      className
    )  }>
      </div>{/* Header */}
      <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h2 className="text-lg font-semibold text-gray-800">Block Library</h2>
            <p className="text-xs text-gray-500">Drag blocks to canvas or click to add</p></div><Button
            size="sm"
            variant="ghost"
            onClick={ onToggle }
            className="p-1" />
            <X className="w-4 h-4" /></Button></div>
        {/* Search */}
        <div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search blocks..."
            value={ searchTerm }
            onChange={ (e: unknown) => setSearchTerm(e.target.value) }
            className="pl-10" />
        </div>
        {/* Filters */}
        <div className=" ">$2</div><Button
            size="sm"
            variant={ showFavorites ? "default" : "outline" }
            onClick={ () => setShowFavorites(!showFavorites) }
            className="text-xs"
          >
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Button>
          <select
            value={ sortBy }
            onChange={ (e: unknown) => setSortBy(e.target.value as any) }
            className="text-xs px-2 py-1 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="popular">Popular</option>
            <option value="new">New</option></select></div>
      {/* Category Tabs */}
      <div className=" ">$2</div><div className=" ">$2</div><button
            onClick={ () => setSelectedCategory('all') }
            className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              selectedCategory === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-200'
            )  }>
            <Grid className="w-3 h-3" />
            All ({blockDefinitions.length})
          </button>
          {(categories || []).map((category: unknown) => {
            const count = getCategoryBlocks(category.id as BlockCategory).length;
            return (
                      <button
                key={ category.id }
                onClick={ () => setSelectedCategory(category.id as BlockCategory) }
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  selectedCategory === category.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-200'
                )  }>
                {category.icon}
                {category.name} ({count})
              </button>);

          })}
        </div>
      {/* Content */}
      <div className=" ">$2</div><div className="{(filteredBlocks || []).map((block: unknown) => (">$2</div>
            <div
              key={ block.type }
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
              draggable
              onDragStart={ (event: unknown) => onDragStart(event, block.type) }
              onClick={ () => onAddNode(block.type)  }>
              <div className={`p-2 rounded-md ${block.color} text-white flex-shrink-0 relative`}>
           
        </div>{block.icon}
                {block.isNew && (
                  <div className=" ">$2</div><span className="text-xs text-white font-bold">N</span>
      </div>
    </>
  )}
              </div>
              <div className=" ">$2</div><div className=" ">$2</div><div className="{block.label}">$2</div>
                  </div>
                  {block.isPopular && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700" />
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {block.isNew && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700" />
                      <TrendingUp className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  )}
                </div>
                <div className="{block.description}">$2</div>
                </div>
                <div className="{block.type}">$2</div>
                </div>
              <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          ))}
        </div>
        {filteredBlocks.length === 0 && (
          <div className=" ">$2</div><Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No blocks found for &quot;{searchTerm}&quot;</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
      </div>
    </>
  )}
      </div>
      {/* Footer */}
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><span>💡</span>
            <span>Drag blocks to canvas or click to add</span></div><div className=" ">$2</div><span>🔗</span>
            <span>Connect blocks by dragging between handles</span></div><div className=" ">$2</div><span>⚡</span>
            <span>Use AI Chat for smart suggestions</span></div></div>);};

export default UniverseToolbar;
