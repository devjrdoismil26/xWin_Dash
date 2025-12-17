import React, { useState } from 'react';
import { X, Search, Star, Download, Eye, Filter, Grid, List } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Badge from '@/shared/components/ui/Badge';
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  thumbnail: string;
  nodes: string[];
  edges: string[];
  tags: string[];
  author: string;
  isPremium: boolean; }
interface TemplateGalleryProps {
  onClose??: (e: any) => void;
  onLoadTemplate?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
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
      { id: '1', type: 'dashboard', position: { x: 100, y: 100 }, data: { label: 'Dashboard' } ,
      { id: '2', type: 'analytics', position: { x: 400, y: 100 }, data: { label: 'Analytics' } ,
      { id: '3', type: 'ecommerce', position: { x: 100, y: 300 }, data: { label: 'E-Commerce' } ],
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
      { id: '1', type: 'aiAgent', position: { x: 100, y: 100 }, data: { label: 'AI Agent' } ,
      { id: '2', type: 'emailMarketing', position: { x: 400, y: 100 }, data: { label: 'Email Marketing' } ,
      { id: '3', type: 'socialBuffer', position: { x: 100, y: 300 }, data: { label: 'Social Buffer' } ,
      { id: '4', type: 'analytics', position: { x: 400, y: 300 }, data: { label: 'Analytics' } ],
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
      { id: '1', type: 'aiLaboratory', position: { x: 100, y: 100 }, data: { label: 'AI Laboratory' } ,
      { id: '2', type: 'mediaLibrary', position: { x: 400, y: 100 }, data: { label: 'Media Library' } ,
      { id: '3', type: 'socialBuffer', position: { x: 250, y: 300 }, data: { label: 'Social Buffer' } ],
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
const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onClose, onLoadTemplate    }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');

  const filteredTemplates = (mockTemplates || []).filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a: unknown, b: unknown) => {
    switch (sortBy) {
      case 'popular': return b.downloads - a.downloads;
      case 'recent': return parseInt(b.id) - parseInt(a.id);

      case 'rating': return b.rating - a.rating;
      default: return 0;
    } );

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-800">Template Gallery</h2>
          <Button size="sm" variant="ghost" onClick={onClose} className="p-1" />
            <X className="w-4 h-4" /></Button></div>
        {/* Search */}
        <div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={ searchTerm }
            onChange={ (e: unknown) => setSearchTerm(e.target.value) }
            className="pl-10" />
        </div>
        {/* Controls */}
        <div className=" ">$2</div><div className=" ">$2</div><Button
              size="sm"
              variant={ viewMode === 'grid' ? 'default' : 'ghost' }
              onClick={ () => setViewMode('grid') }
              className="p-1"
            >
              <Grid className="w-3 h-3" /></Button><Button
              size="sm"
              variant={ viewMode === 'list' ? 'default' : 'ghost' }
              onClick={ () => setViewMode('list') }
              className="p-1"
            >
              <List className="w-3 h-3" /></Button></div>
          <select
            value={ sortBy }
            onChange={ (e: unknown) => setSortBy(e.target.value as any) }
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="popular">Popular</option>
            <option value="recent">Recent</option>
            <option value="rating">Rating</option></select></div>
      {/* Categories */}
      <div className=" ">$2</div><div className="{(categories || []).map((category: unknown) => (">$2</div>
            <button
              key={ category }
              onClick={ () => setSelectedCategory(category) }
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } `}
  >
              {category}
            </button>
          ))}
        </div>
      {/* Templates List */}
      <div className=" ">$2</div><div className={viewMode === 'grid' ? 'space-y-4' : 'space-y-3'  }>
        </div>{(filteredTemplates || []).map((template: unknown) => (
            <div
              key={ template.id }
              className={`border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all ${
                viewMode === 'grid' ? 'p-4' : 'p-3'
              } `}>
           
        </div>{/* Template Header */}
              <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h3 className="font-medium text-sm text-gray-800 truncate" />
                      {template.name}
                    </h3>
                    {template.isPremium && (
                      <Badge variant="secondary" className="text-xs" />
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                  {/* Stats */}
                  <div className=" ">$2</div><div className=" ">$2</div><Star className="w-3 h-3 fill-current text-yellow-400" />
                      {template.rating}
                    </div>
                    <div className=" ">$2</div><Download className="w-3 h-3" />
                      {template.downloads}
                    </div>
                    <span>{template.author}</span></div></div>
              {/* Tags */}
              <div className="{(template.tags || []).map((tag: unknown) => (">$2</div>
                  <span
                    key={ tag }
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            {tag}
          </span>
                ))}
              </div>
              {/* Actions */}
              <div className=" ">$2</div><Button
                  size="sm"
                  onClick={ () => onLoadTemplate(template) }
                  className="flex-1 text-xs"
                >
                  Load Template
                </Button>
                <Button size="sm" variant="outline" className="text-xs" />
                  <Eye className="w-3 h-3" /></Button><Button size="sm" variant="outline" className="text-xs" />
                  <Download className="w-3 h-3" /></Button></div>
          ))}
        </div>
        {filteredTemplates.length === 0 && (
          <div className=" ">$2</div><Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No templates found</p>
            <p className="text-xs">Try different search terms or categories</p>
      </div>
    </>
  )}
      </div>
      {/* Footer */}
      <div className=" ">$2</div><div className=" ">$2</div><p>📚 {filteredTemplates.length} templates available</p>
          <p>🎨 Create your own template and share</p></div></div>);};

export default TemplateGallery;
