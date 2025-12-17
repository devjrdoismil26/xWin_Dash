import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/shared/components/ui/design-tokens';
import { Search, Filter, Star, Download, Heart, Eye, ShoppingCart, LayoutGrid, List, TrendingUp, Clock, Users, Zap, Sparkles, Crown, Shield, Brain, Globe } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import Modal from '@/shared/components/ui/Modal';
import { BaseBlockProps } from '@/types/blocks';

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
  updatedAt: string; }

interface BlockMarketplaceProps {
  onInstallBlock??: (e: any) => void;
  onPreviewBlock??: (e: any) => void;
  installedBlocks?: string[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const BlockMarketplace: React.FC<BlockMarketplaceProps> = ({ onInstallBlock,
  onPreviewBlock,
  installedBlocks = [] as unknown[]
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

      setIsLoading(false);};

    loadBlocks();

  }, [mockBlocks]);

  // Filter and sort blocks
  useEffect(() => {
    const filtered = (blocks || []).filter(block => {
      const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           block.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           block.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort blocks
    filtered.sort((a: unknown, b: unknown) => {
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
      } );

    setFilteredBlocks(filtered);

  }, [blocks, searchTerm, selectedCategory, sortBy]);

  const handleInstallBlock = useCallback((block: MarketplaceBlock) => {
    if (onInstallBlock) {
      onInstallBlock(block);

    } , [onInstallBlock]);

  const handlePreviewBlock = useCallback((block: MarketplaceBlock) => {
    setSelectedBlock(block);

    setIsPreviewOpen(true);

    if (onPreviewBlock) {
      onPreviewBlock(block);

    } , [onPreviewBlock]);

  const renderBlockCard = useCallback((block: MarketplaceBlock) => (
    <div
      key={block.id} className="group">
           
        </div><Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 overflow-hidden" />
        <div className="{/* Eye Image */}">$2</div>
          <div className=" ">$2</div><div className="{block.category === 'AI' && ">$2</div><Brain className="text-purple-500" />}
              {block.category === 'Analytics' && <TrendingUp className="text-blue-500" />}
              {block.category === 'Security' && <Shield className="text-green-500" />}
              {block.category === 'Integration' && <Globe className="text-orange-500" />}
              {block.category === 'Innovation' && <Sparkles className="text-pink-500" />}
            </div>

          {/* Badges */}
          <div className="{block.isNew && (">$2</div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30" />
                New
              </Badge>
            )}
            {block.isFeatured && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30" />
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {block.isPremium && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30" />
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className=" ">$2</div><Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30" />
              {block.price === 0 ? 'Free' : `$${block.price}`}
            </Badge></div><Card.Header className="pb-3" />
          <Card.Title className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            {block.name}
          </Card.Title>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2" />
            {block.description}
          </p>
        </Card.Header>

        <Card.Content className="pt-0" />
          {/* Author and Rating */}
          <div className=" ">$2</div><div className=" ">$2</div><span className="by {block.author}">$2</span>
              </span></div><div className=" ">$2</div><Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="{block.rating}">$2</span>
              </span>
            </div>

          {/* Downloads */}
          <div className=" ">$2</div><Download className="w-4 h-4 text-gray-500" />
            <span className="{block.downloads.toLocaleString()} downloads">$2</span>
            </span>
          </div>

          {/* Tags */}
          <div className="{block.tags.slice(0, 3).map((tag: unknown) => (">$2</div>
              <Badge key={tag} variant="secondary" className="text-xs" />
                {tag}
              </Badge>
            ))}
            {block.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs" />
                +{block.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className=" ">$2</div><Button
              variant="outline"
              size="sm"
              className="flex-1 backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              onClick={ () => handlePreviewBlock(block)  }>
              <Eye className="w-4 h-4 mr-2" />
              Eye
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={ () => handleInstallBlock(block) }
              disabled={ installedBlocks.includes(block.id)  }>
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
            </Button></div></Card.Content></Card></div>
  ), [handleInstallBlock, handlePreviewBlock, installedBlocks]);

  if (isLoading) {
    return (
              <div className=" ">$2</div><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600">);

        </div>
  }

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div>
           
        </div><h2 className="text-2xl font-bold text-gray-900 dark:text-white" />
            Block Marketplace
          </h2>
          <p className="text-gray-600 dark:text-gray-400" />
            Discover and install powerful blocks for your Universe
          </p></div><div className=" ">$2</div><Button
            variant={ viewMode === 'grid' ? 'default' : 'outline' }
            size="sm"
            onClick={ () => setViewMode('grid') }
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            <LayoutGrid className="w-4 h-4" /></Button><Button
            variant={ viewMode === 'list' ? 'default' : 'outline' }
            size="sm"
            onClick={ () => setViewMode('list') }
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            <List className="w-4 h-4" /></Button></div>

      {/* Filters */}
      <div className=" ">$2</div><div className=" ">$2</div><Input
            placeholder="Search blocks..."
            value={ searchTerm }
            onChange={ (e: unknown) => setSearchTerm(e.target.value) }
            className="backdrop-blur-sm bg-white/10 border-white/20"
            startIcon={ <Search className="w-4 h-4" /> } /></div><Select
          value={ selectedCategory }
          onValueChange={ setSelectedCategory }
          className="w-full sm:w-48" />
          {(categories || []).map((category: unknown) => (
            <option key={category.value} value={ category.value } />
              {category.label}
            </option>
          ))}
        </Select>
        <Select
          value={ sortBy }
          onValueChange={ setSortBy }
          className="w-full sm:w-48" />
          {(sortOptions || []).map((option: unknown) => (
            <option key={option.value} value={ option.value } />
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Results */}
      <div className=" ">$2</div><p className="text-sm text-gray-600 dark:text-gray-400" />
          {filteredBlocks.length} blocks found
        </p>
      </div>

      {/* Blocks Grid */}
      <AnimatePresence mode="wait" />
        <div
          key={`${viewMode}-${selectedCategory}-${sortBy}`} className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
        </div>{(filteredBlocks || []).map(renderBlockCard)}
        </div>
      </AnimatePresence>

      {/* Eye Modal */}
      <Modal
        isOpen={ isPreviewOpen }
        onClose={ () => setIsPreviewOpen(false) }
        title={ selectedBlock?.name }
        size="lg"
      >
        {selectedBlock && (
          <div className=" ">$2</div><div className=" ">$2</div><div className="{selectedBlock.category === 'AI' && ">$2</div><Brain className="text-purple-500" />}
                {selectedBlock.category === 'Analytics' && <TrendingUp className="text-blue-500" />}
                {selectedBlock.category === 'Security' && <Shield className="text-green-500" />}
                {selectedBlock.category === 'Integration' && <Globe className="text-orange-500" />}
                {selectedBlock.category === 'Innovation' && <Sparkles className="text-pink-500" />}
              </div>

            <div className=" ">$2</div><p className="text-gray-600 dark:text-gray-400" />
                {selectedBlock.description}
              </p>

              <div className=" ">$2</div><div>
           
        </div><h4 className="font-semibold text-gray-900 dark:text-white mb-2" />
                    Features
                  </h4>
                  <ul className="space-y-1" />
                    {(selectedBlock.features || []).map((feature: unknown, index: unknown) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2" />
                        <Zap className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul></div><div>
           
        </div><h4 className="font-semibold text-gray-900 dark:text-white mb-2" />
                    Compatibility
                  </h4>
                  <ul className="space-y-1" />
                    {(selectedBlock.compatibility || []).map((module: unknown, index: unknown) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2" />
                        <Shield className="w-3 h-3 text-blue-500" />
                        {module}
                      </li>
                    ))}
                  </ul></div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{selectedBlock.rating}</span></div><div className=" ">$2</div><Download className="w-4 h-4 text-gray-500" />
                    <span className="{selectedBlock.downloads.toLocaleString()}">$2</span>
                    </span></div><div className=" ">$2</div><Button
                    variant="outline"
                    onClick={ () => setIsPreviewOpen(false) }
                    className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleInstallBlock(selectedBlock);

                      setIsPreviewOpen(false);

                    } disabled={ installedBlocks.includes(selectedBlock.id) }
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
                  </Button></div></div>
        )}
      </Modal>
    </div>);};

export default BlockMarketplace;
