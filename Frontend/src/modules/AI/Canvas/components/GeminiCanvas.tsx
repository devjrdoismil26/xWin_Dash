import React, { useMemo, useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import ModelSelector from './ModelSelector';
const GeminiCanvas = ({ initialPrompts = [] as unknown[], projectId }) => {
  const [activeTab, setActiveTab] = useState('chat');

  const [codeLanguage, setCodeLanguage] = useState('javascript');

  const [codeContent, setCodeContent] = useState('// Escreva código aqui');

  const [canvasContent, setCanvasContent] = useState('<div>\n  <h1>Canvas</h1>\n  <p>Bem-vindo!</p>\n</div>');

  const [input, setInput] = useState('');

  const [selectedModel, setSelectedModel] = useState('gemini-pro');

  const [showPreview, setShowPreview] = useState(true);

  const editorOptions = useMemo(() => ({ spellCheck: false }), []);

  return (
            <div className=" ">$2</div><Card />
        <Card.Content className="p-4 flex items-center gap-4" />
          <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} / />
          <div className=" ">$2</div><Button variant={activeTab === 'chat' ? 'primary' : 'outline'} size="sm" onClick={ () => setActiveTab('chat') }>Chat</Button>
            <Button variant={activeTab === 'code' ? 'primary' : 'outline'} size="sm" onClick={ () => setActiveTab('code') }>Código</Button>
            <Button variant={activeTab === 'canvas' ? 'primary' : 'outline'} size="sm" onClick={ () => setActiveTab('canvas') }>Canvas</Button></div></Card.Content></Card><div className="{activeTab === 'chat' && (">$2</div>
          <Card />
            <Card.Content className="p-4" />
              <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setInput(''); } className="flex gap-2">
                <Textarea value={input} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1" rows={ 3 } />
                <Button type="submit">Enviar</Button></form><div className="text-xs text-gray-500 mt-2">Prompts disponíveis: {initialPrompts.length}</div>
            </Card.Content>
      </Card>
    </>
  )}
        {activeTab === 'code' && (
          <div className=" ">$2</div><Card />
              <Card.Content className="p-3 flex items-center gap-3" />
                <Select value={codeLanguage} onChange={ (e: React.ChangeEvent<HTMLSelectElement>) => setCodeLanguage(e.target.value)  }>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option></Select><Button variant="outline" size="sm" onClick={ () => navigator.clipboard.writeText(codeContent) }>Copiar</Button>
                <Button variant="outline" size="sm" onClick={ () => setCodeContent('') }>Limpar</Button>
              </Card.Content></Card><Card className="flex-1" />
              <Card.Content className="p-3 h-full" />
                <Textarea value={codeContent} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCodeContent(e.target.value)} className="h-96 w-full" placeholder="Código..." />
              </Card.Content></Card></div>
        )}
        {activeTab === 'canvas' && (
          <div className=" ">$2</div><Card />
              <Card.Content className="p-3" />
                <div className=" ">$2</div><span className="font-medium">HTML</span>
                  <div className=" ">$2</div><Button variant="outline" size="sm" onClick={ () => navigator.clipboard.writeText(canvasContent) }>Copiar</Button>
                    <Button variant="outline" size="sm" onClick={ () => setShowPreview((v: unknown) => !v) }>{showPreview ? 'Esconder' : 'Mostrar'} Eye</Button></div><Textarea value={canvasContent} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCanvasContent(e.target.value)} className="h-96 w-full" placeholder="HTML do canvas..." />
              </Card.Content></Card><Card />
              <Card.Content className="p-3" />
                <span className="font-medium">Eye</span>
                {showPreview ? (
                  <iframe title="Canvas Eye" className="w-full h-96 border rounded mt-2" srcDoc={canvasContent} / />
                ) : (
                  <div className="h-96 mt-2 flex items-center justify-center text-gray-500">Eye desabilitado</div>
                )}
              </Card.Content></Card></div>
        )}
      </div>);};

export default GeminiCanvas;
