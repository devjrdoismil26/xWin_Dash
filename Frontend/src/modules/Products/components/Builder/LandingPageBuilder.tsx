// ========================================
// PRODUCTS MODULE - LANDING PAGE BUILDER
// ========================================
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { Save, Eye, Undo, Redo, Copy, Trash2, Plus, Settings, Palette, Type, Layout, Image, MousePointer, Move, RotateCcw, ZoomIn, ZoomOut, Grid, Ruler, Smartphone, Tablet, Monitor, Download, Upload, Code, Eye } from 'lucide-react';
import { LandingPage, LandingPageContent, LandingPageSection, SectionType, BuilderElement, ElementType, ElementCategory } from '@/types/products';
import { cn } from '@/lib/utils';
interface LandingPageBuilderProps {
  landingPage: LandingPage;
  onSave?: (e: any) => void;
  onPreview??: (e: any) => void;
  onPublish??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
export const LandingPageBuilder: React.FC<LandingPageBuilderProps> = ({ landingPage,
  onSave,
  onPreview,
  onPublish,
  className
   }) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const [zoom, setZoom] = useState(100);

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const [showGrid, setShowGrid] = useState(true);

  const [showRulers, setShowRulers] = useState(true);

  const [history, setHistory] = useState<LandingPageContent[]>([landingPage.content]);

  const [historyIndex, setHistoryIndex] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState<LandingPageContent>(landingPage.content);

  // Device breakpoints
  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      case 'desktop': return 1200;
      default: return 1200;
    } ;

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 200));

  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 50));

  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(100);

  }, []);

  // History management
  const addToHistory = useCallback((newContent: LandingPageContent) => {
    const newHistory = history.slice(0, historyIndex + 1);

    newHistory.push(newContent);

    setHistory(newHistory);

    setHistoryIndex(newHistory.length - 1);

  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);

      setContent(history[historyIndex - 1]);

    } , [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);

      setContent(history[historyIndex + 1]);

    } , [history, historyIndex]);

  // Element management
  const addSection = useCallback((type: SectionType) => {
    const newSection: LandingPageSection = {
      id: `section-${Date.now()}`,
      type,
      content: getDefaultSectionContent(type),
      styles: getDefaultSectionStyles(type),
      order: content.sections.length,
      isVisible: true};

    const newContent = {
      ...content,
      sections: [...content.sections, newSection]};

    setContent(newContent);

    addToHistory(newContent);

  }, [content, addToHistory]);

  const updateSection = useCallback((sectionId: string, updates: Partial<LandingPageSection>) => {
    const newContent = {
      ...content,
      sections: (content.sections || []).map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )};

    setContent(newContent);

    addToHistory(newContent);

  }, [content, addToHistory]);

  const deleteSection = useCallback((sectionId: string) => {
    const newContent = {
      ...content,
      sections: (content.sections || []).filter(section => section.id !== sectionId)};

    setContent(newContent);

    addToHistory(newContent);

  }, [content, addToHistory]);

  const duplicateSection = useCallback((sectionId: string) => {
    const section = content.sections.find(s => s.id === sectionId);

    if (!section) return;
    const newSection: LandingPageSection = {
      ...section,
      id: `section-${Date.now()}`,
      order: content.sections.length};

    const newContent = {
      ...content,
      sections: [...content.sections, newSection]};

    setContent(newContent);

    addToHistory(newContent);

  }, [content, addToHistory]);

  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    const newSections = [...content.sections];
    const [movedSection] = newSections.splice(fromIndex, 1);

    newSections.splice(toIndex, 0, movedSection);

    const newContent = {
      ...content,
      sections: (newSections || []).map((section: unknown, index: unknown) => ({
        ...section,
        order: index
      }))};

    setContent(newContent);

    addToHistory(newContent);

  }, [content, addToHistory]);

  // Drag and drop
  const handleDragStart = useCallback((e: React.DragEvent, sectionId: string) => {
    e.dataTransfer.setData('text/plain', sectionId);

    setIsDragging(true);

  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();

  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    const sectionId = e.dataTransfer.getData('text/plain');

    const sourceIndex = content.sections.findIndex(s => s.id === sectionId);

    if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
      reorderSections(sourceIndex, targetIndex);

    }
    setIsDragging(false);

  }, [content.sections, reorderSections]);

  // Save and publish
  const handleSave = useCallback(() => {
    onSave(content);

  }, [content, onSave]);

  const handlePreview = useCallback(() => {
    onPreview();

  }, [onPreview]);

  const handlePublish = useCallback(() => {
    onPublish();

  }, [onPublish]);

  // Default content generators
  const getDefaultSectionContent = (type: SectionType) => {
    switch (type) {
      case SectionType.HERO:
        return {
          headline: 'Welcome to Our Product',
          subheadline: 'The best solution for your needs',
          ctaText: 'Get Started',
          ctaUrl: '#',
          backgroundImage: '',
          backgroundVideo: ''};

      case SectionType.FEATURES:
        return {
          title: 'Features',
          subtitle: 'What makes us special',
          features: [
            { title: 'Feature 1', description: 'Description of feature 1', icon: 'star' },
            { title: 'Feature 2', description: 'Description of feature 2', icon: 'heart' },
            { title: 'Feature 3', description: 'Description of feature 3', icon: 'shield' }
          ]};

      case SectionType.TESTIMONIALS:
        return {
          title: 'What Our Customers Say',
          testimonials: [
            { name: 'John Doe', role: 'CEO', company: 'Company Inc', content: 'Great product!', avatar: '' },
            { name: 'Jane Smith', role: 'CTO', company: 'Tech Corp', content: 'Amazing service!', avatar: '' }
          ]};

      case SectionType.PRICING:
        return {
          title: 'Pricing Plans',
          subtitle: 'Choose the plan that works for you',
          plans: [
            { name: 'Basic', price: 29, features: ['Feature 1', 'Feature 2'], cta: 'Get Started' },
            { name: 'Pro', price: 59, features: ['Feature 1', 'Feature 2', 'Feature 3'], cta: 'Get Started' },
            { name: 'Enterprise', price: 99, features: ['All Features'], cta: 'Contact Sales' }
          ]};

      case SectionType.FAQ:
        return {
          title: 'Frequently Asked Questions',
          faqs: [
            { question: 'What is this product?', answer: 'This is a great product that solves your problems.' },
            { question: 'How does it work?', answer: 'It works by doing amazing things.' }
          ]};

      case SectionType.CTA:
        return {
          headline: 'Ready to Get Started?',
          subheadline: 'Join thousands of satisfied customers',
          ctaText: 'Start Free Trial',
          ctaUrl: '#'};

      case SectionType.CONTACT:
        return {
          title: 'Get in Touch',
          subtitle: 'We\'d love to hear from you',
          formFields: ['name', 'email', 'message'],
          contactInfo: {
            email: 'contact@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, City, State 12345'
          } ;

      default:
        return {};

    } ;

  const getDefaultSectionStyles = (type: SectionType) => {
    return {
      padding: { top: 40, right: 20, bottom: 40, left: 20, all: 0 },
      margin: { top: 0, right: 0, bottom: 0, left: 0, all: 0 },
      background: '#ffffff',
      borderRadius: 0,
      boxShadow: 'none'};
};

  // Section type options
  const sectionTypes = [
    { type: SectionType.HERO, label: 'Hero', icon: '🎯', description: 'Main banner section' },
    { type: SectionType.FEATURES, label: 'Features', icon: '✨', description: 'Feature showcase' },
    { type: SectionType.TESTIMONIALS, label: 'Testimonials', icon: '💬', description: 'Customer reviews' },
    { type: SectionType.PRICING, label: 'Pricing', icon: '💰', description: 'Pricing plans' },
    { type: SectionType.FAQ, label: 'FAQ', icon: '❓', description: 'Frequently asked questions' },
    { type: SectionType.CTA, label: 'Call to Action', icon: '📢', description: 'Action prompt' },
    { type: SectionType.CONTACT, label: 'Contact', icon: '📞', description: 'Contact form' }
  ];
  return (
        <>
      <div className={cn('flex h-screen bg-gray-100', className)  }>
      </div>{/* Sidebar - Components */}
      <div className="{/* Header */}">$2</div>
        <div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-900">Components</h2>
          <p className="text-sm text-gray-600">Drag and drop to add sections</p>
        </div>
        {/* Section Types */}
        <div className=" ">$2</div><div className="{(sectionTypes || []).map((sectionType: unknown) => (">$2</div>
              <div
                key={ sectionType.type }
                className="p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={ (e: unknown) => handleDragStart(e, sectionType.type)  }>
                <div className=" ">$2</div><span className="text-2xl">{sectionType.icon}</span>
                  <div>
           
        </div><p className="font-medium text-gray-900">{sectionType.label}</p>
                    <p className="text-sm text-gray-600">{sectionType.description}</p></div></div>
            ))}
          </div>
      </div>
      {/* Main Canvas Area */}
      <div className="{/* Toolbar */}">$2</div>
        <div className=" ">$2</div><div className=" ">$2</div><div className="{/* Device Eye */}">$2</div>
              <div className=" ">$2</div><Button
                  variant={ device === 'desktop' ? 'default' : 'outline' }
                  size="sm"
                  onClick={ () => setDevice('desktop')  }>
                  <Monitor className="w-4 h-4" /></Button><Button
                  variant={ device === 'tablet' ? 'default' : 'outline' }
                  size="sm"
                  onClick={ () => setDevice('tablet')  }>
                  <Tablet className="w-4 h-4" /></Button><Button
                  variant={ device === 'mobile' ? 'default' : 'outline' }
                  size="sm"
                  onClick={ () => setDevice('mobile')  }>
                  <Smartphone className="w-4 h-4" /></Button></div>
              {/* Zoom Controls */}
              <div className=" ">$2</div><Button variant="outline" size="sm" onClick={ handleZoomOut } />
                  <ZoomOut className="w-4 h-4" /></Button><span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                <Button variant="outline" size="sm" onClick={ handleZoomIn } />
                  <ZoomIn className="w-4 h-4" /></Button><Button variant="outline" size="sm" onClick={ handleZoomReset } />
                  <RotateCcw className="w-4 h-4" /></Button></div>
              {/* View Options */}
              <div className=" ">$2</div><Button
                  variant={ showGrid ? 'default' : 'outline' }
                  size="sm"
                  onClick={ () => setShowGrid(!showGrid)  }>
                  <Grid className="w-4 h-4" /></Button><Button
                  variant={ showRulers ? 'default' : 'outline' }
                  size="sm"
                  onClick={ () => setShowRulers(!showRulers)  }>
                  <Ruler className="w-4 h-4" /></Button></div>
            <div className="{/* History */}">$2</div>
              <Button variant="outline" size="sm" onClick={handleUndo} disabled={ historyIndex === 0 } />
                <Undo className="w-4 h-4" /></Button><Button variant="outline" size="sm" onClick={handleRedo} disabled={ historyIndex === history.length - 1 } />
                <Redo className="w-4 h-4" />
              </Button>
              {/* Actions */}
              <Button variant="outline" size="sm" onClick={ handlePreview } />
                <Eye className="w-4 h-4 mr-2" />
                Eye
              </Button>
              <Button variant="outline" size="sm" onClick={ handleSave } />
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" onClick={ handlePublish } />
                <Upload className="w-4 h-4 mr-2" />
                Publish
              </Button></div></div>
        {/* Canvas */}
        <div className=" ">$2</div><div className=" ">$2</div><div
              ref={ canvasRef }
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              style={width: getDeviceWidth(),
                transform: `scale(${zoom / 100} )`,
                transformOrigin: 'top center'
              } >
           
        </div>{/* Grid Overlay */}
              {showGrid && (
                <div className=" ">$2</div><div className="w-full h-full" style={backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  } / />
          )}
        </div>
              {/* Sections */}
              {(content.sections || []).map((section: unknown, index: unknown) => (
                <div
                  key={ section.id }
                  className={cn(
                    'relative group border-2 border-transparent hover:border-blue-300 transition-colors',
                    selectedElement === section.id && 'border-blue-500'
                  )} onMouseEnter={ () => setHoveredElement(section.id) }
                  onMouseLeave={ () => setHoveredElement(null) }
                  onClick={ () => setSelectedElement(section.id) }
                  onDragOver={ handleDragOver }
                  onDrop={ (e: unknown) => handleDrop(e, index)  }>
                  {/* Section Content */}
                  <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-2xl font-bold text-gray-900 mb-2" />
                        {section.content.headline || section.content.title || `${section.type} Section`}
                      </h3>
                      {section.content.subheadline && (
                        <p className="text-gray-600 mb-4">{section.content.subheadline}</p>
                      )}
                      {section.content.ctaText && (
                        <Button>{section.content.ctaText}</Button>
                      )}
                    </div>
                  {/* Section Controls */}
                  { (selectedElement === section.id || hoveredElement === section.id) && (
                    <div className=" ">$2</div><Button variant="ghost" size="sm" onClick={ () => duplicateSection(section.id)  }>
                        <Copy className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={ () => deleteSection(section.id)  }>
                        <Trash2 className="w-4 h-4" /></Button></div>
                  )}
                  {/* Section Label */}
                  <div className=" ">$2</div><Badge variant="secondary" className="text-xs" />
                      {section.type}
                    </Badge>
      </div>
    </>
  ))}
              {/* Empty State */}
              {content.sections.length === 0 && (
                <div className=" ">$2</div><div className=" ">$2</div><Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Start Building Your Landing Page</p>
                    <p className="text-sm">Drag components from the sidebar to get started</p>
      </div>
    </>
  )}
            </div>
        </div>
      {/* Sidebar - Properties */}
      <div className="{/* Header */}">$2</div>
        <div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-600" />
            {selectedElement ? 'Edit selected section' : 'Select a section to edit'}
          </p>
        </div>
        {/* Properties Panel */}
        <div className="{selectedElement ? (">$2</div>
            <div className="{/* Section Type */}">$2</div>
              <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                  Section Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {(sectionTypes || []).map((type: unknown) => (
                    <option key={type.type} value={ type.type } />
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Content Fields */}
              <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                    Headline
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={ content.sections.find(s => s.id === selectedElement)?.content.headline || '' } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                    Subheadline
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={ content.sections.find(s => s.id === selectedElement)?.content.subheadline || '' } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                    CTA Text
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={ content.sections.find(s => s.id === selectedElement)?.content.ctaText || '' } />
                </div>
              {/* Style Options */}
              <div className=" ">$2</div><h3 className="font-medium text-gray-900">Styling</h3>
                <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                    Background Color
                  </label>
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    defaultValue="#ffffff"
                  / /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                    Padding
                  </label>
                  <div className=" ">$2</div><input
                      type="number"
                      placeholder="Top"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    / />
                    <input
                      type="number"
                      placeholder="Bottom"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    / />
                    <input
                      type="number"
                      placeholder="Left"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    / />
                    <input
                      type="number"
                      placeholder="Right"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    / /></div></div>
          ) : (
            <div className=" ">$2</div><Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No Section Selected</p>
              <p className="text-sm">Click on a section to edit its properties</p>
      </div>
    </>
  )}
        </div>
    </div>);};
