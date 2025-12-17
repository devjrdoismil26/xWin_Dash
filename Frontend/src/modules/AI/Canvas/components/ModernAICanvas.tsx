import React, { useMemo, useState, useCallback } from 'react';
import { Bot, Code, Eye, Maximize2, Minimize2, RotateCcw, Save, Sparkles } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import { cn } from '@/lib/utils';
const ModernAICanvas: React.FC<{ projectId?: string }> = ({ projectId    }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'preview' | 'library'>('chat');

  const [codeLanguage, setCodeLanguage] = useState('javascript');

  const [codeContent, setCodeContent] = useState('// AI Canvas - Digite ou gere código aqui');

  const [canvasContent, setCanvasContent] = useState('<div class="p-4">\n  <h1>🎨 AI Canvas</h1>\n</div>');

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');

  const languageOptions = useMemo(
    () => [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'html', label: 'HTML' },
      { value: 'css', label: 'CSS' },
    ],
    [],);

  const runCode = useCallback(() => setActiveTab('preview'), []);

  const clearCanvas = useCallback(() => {
    setCodeContent('// Canvas limpo - comece a criar!');

    setCanvasContent('<div><h1>Canvas Limpo</h1></div>');

  }, []);

  return (
        <>
      <div className={cn('h-full flex flex-col', isFullscreen && 'fixed inset-0 z-50 bg-white')  }>
      </div><div className=" ">$2</div><div className=" ">$2</div><Badge variant="secondary" className="text-xs" />
            <Sparkles className="w-3 h-3 mr-1" /> Projeto {projectId || '-'}
          </Badge></div><div className=" ">$2</div><Button size="sm" variant="outline" onClick={ () => setIsFullscreen((v: unknown) => !v)  }>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button></div><div className=" ">$2</div><div className=" ">$2</div><Button size="sm" variant={activeTab === 'chat' ? 'default' : 'ghost'} onClick={ () => setActiveTab('chat')  }>
            <Bot className="w-4 h-4 mr-2" /> Chat IA
          </Button>
          <Button size="sm" variant={activeTab === 'code' ? 'default' : 'ghost'} onClick={ () => setActiveTab('code')  }>
            <Code className="w-4 h-4 mr-2" /> Editor
          </Button>
          <Button size="sm" variant={activeTab === 'preview' ? 'default' : 'ghost'} onClick={ () => setActiveTab('preview')  }>
            <Eye className="w-4 h-4 mr-2" /> Eye
          </Button></div><div className="{activeTab === 'chat' && (">$2</div>
          <Card />
            <Card.Content className="p-4" />
              <div className="text-sm text-gray-600">Chat IA simplificado</div>
            </Card.Content>
      </Card>
    </>
  )}
        {activeTab === 'code' && (
          <Card />
            <Card.Content className="p-4 space-y-3" />
              <div className=" ">$2</div><Select 
                  value={ codeLanguage }
                  onChange={ (value: string | number) => setCodeLanguage(value as string) }
                  options={ languageOptions } />
                <Button size="sm" variant="outline" onClick={ runCode }>Executar</Button>
                <Button size="sm" variant="outline" onClick={ clearCanvas }><RotateCcw className="w-4 h-4" /> Limpar</Button>
                <Button size="sm" variant="outline" onClick={ () => navigator.clipboard.writeText(codeContent) }><Save className="w-4 h-4" /> Copiar</Button></div><Textarea value={codeContent} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCodeContent(e.target.value)} className="h-96" />
            </Card.Content>
      </Card>
    </>
  )}
        {activeTab === 'preview' && (
          <Card />
            <Card.Content className="p-4" />
              <iframe title="AI Canvas Eye" className="w-full h-96 border rounded" srcDoc={canvasContent} / />
            </Card.Content>
      </Card>
    </>
  )}
      </div>);};

export default ModernAICanvas;
