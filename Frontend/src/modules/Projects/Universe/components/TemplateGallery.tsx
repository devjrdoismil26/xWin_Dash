import React, { useState } from 'react';
import { X, Search, Star, Download, Eye, Filter, Grid, List } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  thumbnail: string;
  nodes: any[];
  edges: any[];
  tags: string[];
  author: string;
  isPremium: boolean;
}
interface TemplateGalleryProps {
  onClose: () => void;
  onLoadTemplate: (template: Template) => void;
}
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'E-Commerce Analytics Flow',
    description: 'Complete analytics setup for e-commerce tracking',
    category: 'E-Commerce',
    rating: 4.8,
    downloads: 1234,
    thumbnail: '/templates/ecommerce-analytics.jpg',
    nodes: [
      { id: '1', type: 'dashboard', position: { x: 100, y: 100 }, data: { label: 'Dashboard' } },
      { id: '2', type: 'analytics', position: { x: 400, y: 100 }, data: { label: 'Analytics' } },
      { id: '3', type: 'ecommerce', position: { x: 100, y: 300 }, data: { label: 'E-Commerce' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e1-3', source: '1', target: '3', animated: true }
    ],
    tags: ['analytics', 'ecommerce', 'dashboard'],
    author: 'Universe Team',
    isPremium: false
  },
  {
    id: '2',
    name: 'AI Marketing Automation',
    description: 'Complete AI-powered marketing automation workflow',
    category: 'Marketing',
    rating: 4.9,
    downloads: 856,
    thumbnail: '/templates/ai-marketing.jpg',
    nodes: [
      { id: '1', type: 'aiAgent', position: { x: 100, y: 100 }, data: { label: 'AI Agent' } },
      { id: '2', type: 'emailMarketing', position: { x: 400, y: 100 }, data: { label: 'Email Marketing' } },
      { id: '3', type: 'socialBuffer', position: { x: 100, y: 300 }, data: { label: 'Social Buffer' } },
      { id: '4', type: 'analytics', position: { x: 400, y: 300 }, data: { label: 'Analytics' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e1-3', source: '1', target: '3', animated: true },
      { id: 'e2-4', source: '2', target: '4', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true }
    ],
    tags: ['ai', 'marketing', 'automation'],
    author: 'AI Experts',
    isPremium: true
  },
  {
    id: '3',
    name: 'Content Creation Hub',
    description: 'Centralized content creation and distribution system',
    category: 'Content',
    rating: 4.7,
    downloads: 654,
    thumbnail: '/templates/content-hub.jpg',
    nodes: [
      { id: '1', type: 'aiLaboratory', position: { x: 100, y: 100 }, data: { label: 'AI Laboratory' } },
      { id: '2', type: 'mediaLibrary', position: { x: 400, y: 100 }, data: { label: 'Media Library' } },
      { id: '3', type: 'socialBuffer', position: { x: 250, y: 300 }, data: { label: 'Social Buffer' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true }
    ],
    tags: ['content', 'ai', 'media'],
    author: 'Content Creators',
    isPremium: false
  }
];
const categories = ['All', 'E-Commerce', 'Marketing', 'Content', 'Analytics', 'AI & Automation'];
const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onClose, onLoadTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.downloads - a.downloads;
      case 'recent': return parseInt(b.id) - parseInt(a.id);
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Template Gallery</h2>
          <Button size="sm" variant="ghost" onClick={onClose} className="p-1">
            <X className="w-4 h-4" />
          </Button>
        </div>
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="p-1"
            >
              <Grid className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="p-1"
            >
              <List className="w-3 h-3" />
            </Button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="popular">Popular</option>
            <option value="recent">Recent</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className={viewMode === 'grid' ? 'space-y-4' : 'space-y-3'}>
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all ${
                viewMode === 'grid' ? 'p-4' : 'p-3'
              }`}
            >
              {/* Template Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm text-gray-800 truncate">
                      {template.name}
                    </h3>
                    {template.isPremium && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      {template.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {template.downloads}
                    </div>
                    <span>{template.author}</span>
                  </div>
                </div>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onLoadTemplate(template)}
                  className="flex-1 text-xs"
                >
                  Load Template
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No templates found</p>
            <p className="text-xs">Try different search terms or categories</p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <p>📚 {filteredTemplates.length} templates available</p>
          <p>🎨 Create your own template and share</p>
        </div>
      </div>
    </div>
  );
};
export default TemplateGallery;
