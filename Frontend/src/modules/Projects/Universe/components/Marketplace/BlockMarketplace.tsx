import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Heart, 
  Eye, 
  ShoppingCart,
  LayoutGrid,
  List,
  TrendingUp,
  Clock,
  Users,
  Zap,
  Sparkles,
  Crown,
  Shield,
  Brain,
  Globe
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import Badge from '@/components/ui/Badge';
import { Card } from "@/components/ui/Card";
import Modal from '@/components/ui/Modal';
import { BaseBlockProps } from '../../types/blocks';

interface MarketplaceBlock {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  version: string;
  price: number;
  rating: number;
  downloads: number;
  tags: string[];
  preview: string;
  features: string[];
  compatibility: string[];
  isPremium: boolean;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlockMarketplaceProps {
  onInstallBlock?: (block: MarketplaceBlock) => void;
  onPreviewBlock?: (block: MarketplaceBlock) => void;
  installedBlocks?: string[];
}

const BlockMarketplace: React.FC<BlockMarketplaceProps> = ({
  onInstallBlock,
  onPreviewBlock,
  installedBlocks = []
}) => {
  const [blocks, setBlocks] = useState<MarketplaceBlock[]>([]);
  const [filteredBlocks, setFilteredBlocks] = useState<MarketplaceBlock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBlock, setSelectedBlock] = useState<MarketplaceBlock | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for marketplace blocks
  const mockBlocks: MarketplaceBlock[] = useMemo(() => [
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics Pro',
      description: 'Analytics avançados com IA para insights profundos',
      category: 'Analytics',
      author: 'xWin Team',
      version: '2.1.0',
      price: 0,
      rating: 4.9,
      downloads: 15420,
      tags: ['analytics', 'ai', 'insights', 'pro'],
      preview: '/previews/advanced-analytics.jpg',
      features: ['IA Insights', 'Real-time Analytics', 'Custom Dashboards', 'Export Reports'],
      compatibility: ['Dashboard', 'CRM', 'E-commerce'],
      isPremium: false,
      isFeatured: true,
      isNew: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'ai-marketing-agent',
      name: 'AI Marketing Agent',
      description: 'Agente IA especializado em marketing automatizado',
      category: 'AI',
      author: 'AI Solutions',
      version: '1.5.2',
      price: 99,
      rating: 4.8,
      downloads: 8930,
      tags: ['ai', 'marketing', 'automation', 'agent'],
      preview: '/previews/ai-marketing.jpg',
      features: ['Campaign Automation', 'Content Generation', 'A/B Testing', 'ROI Optimization'],
      compatibility: ['Email Marketing', 'Social Buffer', 'Analytics'],
      isPremium: true,
      isFeatured: true,
      isNew: true,
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20'
    },
    {
      id: 'enterprise-security',
      name: 'Enterprise Security Suite',
      description: 'Suite completa de segurança empresarial',
      category: 'Security',
      author: 'Security Pro',
      version: '3.0.1',
      price: 299,
      rating: 4.9,
      downloads: 5670,
      tags: ['security', 'enterprise', 'compliance', 'audit'],
      preview: '/previews/enterprise-security.jpg',
      features: ['2FA/MFA', 'Audit Logs', 'Compliance Reports', 'Threat Detection'],
      compatibility: ['All Modules'],
      isPremium: true,
      isFeatured: false,
      isNew: false,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-19'
    },
    {
      id: 'universal-connector',
      name: 'Universal Connector',
      description: 'Conector universal para integrações externas',
      category: 'Integration',
      author: 'Integration Hub',
      version: '1.2.0',
      price: 0,
      rating: 4.7,
      downloads: 12300,
      tags: ['integration', 'api', 'connector', 'universal'],
      preview: '/previews/universal-connector.jpg',
      features: ['50+ Integrations', 'Custom APIs', 'Real-time Sync', 'Error Handling'],
      compatibility: ['All Modules'],
      isPremium: false,
      isFeatured: true,
      isNew: false,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-18'
    },
    {
      id: 'ar-vr-interface',
      name: 'AR/VR Interface',
      description: 'Interface imersiva para realidade aumentada e virtual',
      category: 'Innovation',
      author: 'Future Tech',
      version: '0.9.0',
      price: 199,
      rating: 4.6,
      downloads: 2340,
      tags: ['ar', 'vr', 'immersive', 'innovation'],
      preview: '/previews/ar-vr-interface.jpg',
      features: ['AR Visualization', 'VR Workspace', 'Hand Tracking', 'Spatial Audio'],
      compatibility: ['Dashboard', 'Canvas', '3D View'],
      isPremium: true,
      isFeatured: false,
      isNew: true,
      createdAt: '2024-01-19',
      updatedAt: '2024-01-20'
    }
  ], []);

  const categories = useMemo(() => [
    { value: 'all', label: 'All Categories' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'AI', label: 'AI & Machine Learning' },
    { value: 'Security', label: 'Security' },
    { value: 'Integration', label: 'Integration' },
    { value: 'Innovation', label: 'Innovation' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Productivity', label: 'Productivity' }
  ], []);

  const sortOptions = useMemo(() => [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ], []);

  // Load blocks
  useEffect(() => {
    const loadBlocks = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBlocks(mockBlocks);
      setFilteredBlocks(mockBlocks);
      setIsLoading(false);
    };

    loadBlocks();
  }, [mockBlocks]);

  // Filter and sort blocks
  useEffect(() => {
    const filtered = blocks.filter(block => {
      const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           block.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           block.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort blocks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
        default:
          return b.downloads - a.downloads;
      }
    });

    setFilteredBlocks(filtered);
  }, [blocks, searchTerm, selectedCategory, sortBy]);

  const handleInstallBlock = useCallback((block: MarketplaceBlock) => {
    if (onInstallBlock) {
      onInstallBlock(block);
    }
  }, [onInstallBlock]);

  const handlePreviewBlock = useCallback((block: MarketplaceBlock) => {
    setSelectedBlock(block);
    setIsPreviewOpen(true);
    if (onPreviewBlock) {
      onPreviewBlock(block);
    }
  }, [onPreviewBlock]);

  const renderBlockCard = useCallback((block: MarketplaceBlock) => (
    <motion.div
      key={block.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={ENHANCED_TRANSITIONS.spring}
      className="group"
    >
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 overflow-hidden">
        <div className="relative">
          {/* Preview Image */}
          <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-6xl opacity-50">
              {block.category === 'AI' && <Brain className="text-purple-500" />}
              {block.category === 'Analytics' && <TrendingUp className="text-blue-500" />}
              {block.category === 'Security' && <Shield className="text-green-500" />}
              {block.category === 'Integration' && <Globe className="text-orange-500" />}
              {block.category === 'Innovation' && <Sparkles className="text-pink-500" />}
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {block.isNew && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                New
              </Badge>
            )}
            {block.isFeatured && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {block.isPremium && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {block.price === 0 ? 'Free' : `$${block.price}`}
            </Badge>
          </div>
        </div>

        <Card.Header className="pb-3">
          <Card.Title className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {block.name}
          </Card.Title>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {block.description}
          </p>
        </Card.Header>

        <Card.Content className="pt-0">
          {/* Author and Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                by {block.author}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {block.rating}
              </span>
            </div>
          </div>

          {/* Downloads */}
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {block.downloads.toLocaleString()} downloads
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {block.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {block.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{block.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              onClick={() => handlePreviewBlock(block)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleInstallBlock(block)}
              disabled={installedBlocks.includes(block.id)}
            >
              {installedBlocks.includes(block.id) ? (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Installed
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Install
                </>
              )}
            </Button>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  ), [handleInstallBlock, handlePreviewBlock, installedBlocks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Block Marketplace
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and install powerful blocks for your Universe
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="backdrop-blur-sm bg-white/10 border-white/20"
            startIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full sm:w-48"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
        <Select
          value={sortBy}
          onValueChange={setSortBy}
          className="w-full sm:w-48"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredBlocks.length} blocks found
        </p>
      </div>

      {/* Blocks Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${selectedCategory}-${sortBy}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={ENHANCED_TRANSITIONS.fade}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredBlocks.map(renderBlockCard)}
        </motion.div>
      </AnimatePresence>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={selectedBlock?.name}
        size="lg"
      >
        {selectedBlock && (
          <div className="space-y-6">
            <div className="h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <div className="text-8xl opacity-50">
                {selectedBlock.category === 'AI' && <Brain className="text-purple-500" />}
                {selectedBlock.category === 'Analytics' && <TrendingUp className="text-blue-500" />}
                {selectedBlock.category === 'Security' && <Shield className="text-green-500" />}
                {selectedBlock.category === 'Integration' && <Globe className="text-orange-500" />}
                {selectedBlock.category === 'Innovation' && <Sparkles className="text-pink-500" />}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                {selectedBlock.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Features
                  </h4>
                  <ul className="space-y-1">
                    {selectedBlock.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Compatibility
                  </h4>
                  <ul className="space-y-1">
                    {selectedBlock.compatibility.map((module, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Shield className="w-3 h-3 text-blue-500" />
                        {module}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{selectedBlock.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBlock.downloads.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsPreviewOpen(false)}
                    className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleInstallBlock(selectedBlock);
                      setIsPreviewOpen(false);
                    }}
                    disabled={installedBlocks.includes(selectedBlock.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {installedBlocks.includes(selectedBlock.id) ? (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Installed
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Install Block
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlockMarketplace;
