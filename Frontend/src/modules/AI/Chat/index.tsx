import React, { useMemo, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { Brain, Sparkles } from 'lucide-react';
import AIChatInterface from './components/AIChatInterface';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  type: 'text' | 'code' | 'image' | 'file' | 'system';
  content: string; }
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [input, setInput] = useState('');

  const [model, setModel] = useState('gpt-4');

  const [processing, setProcessing] = useState(false);

  const [aiStatus, setAiStatus] = useState<'idle' | 'thinking' | 'processing' | 'streaming' | 'complete' | 'error'>('idle');

  const modelOptions = useMemo(
    () => [
      { value: 'gpt-4', label: 'GPT-4' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      { value: 'gemini-pro', label: 'Gemini Pro' },
      { value: 'claude-3', label: 'Claude 3' },
    ],
    [],);

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!input.trim()) return;
      setProcessing(true);

      const userMessage: ChatMessage = { id: `msg-${Date.now()}`, sender: 'user', type: 'text', content: input};

      setMessages((prev: unknown) => [...prev, userMessage]);

      setInput('');

      setTimeout(() => {
        const aiMessage: ChatMessage = { id: `msg-${Date.now() + 1}`, sender: 'ai', type: 'text', content: 'Resposta simulada.'};

        setMessages((prev: unknown) => [...prev, aiMessage]);

        setProcessing(false);

        setAiStatus('complete');

        setTimeout(() => setAiStatus('idle'), 800);

      }, 600);

    },
    [input],);

  return (
        <>
      <AuthenticatedLayout />
      <Head title="Chat IA - Assistente Inteligente" / />
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Brain className="w-7 h-7 text-blue-600" />
              <div>
           
        </div><h1 className="text-xl font-bold">Assistente IA</h1>
                <p className="text-sm text-gray-600">Converse e gere conteúdo com IA</p></div><div className=" ">$2</div><div className=" ">$2</div><label className="text-xs font-medium mb-1">Modelo</label>
                <Select 
                  value={ model }
                  onChange={ (value: string | number) => setModel(value as string) }
                  className="min-w-40"
                  options={ modelOptions } /></div><Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700" />
                <Sparkles className="w-3 h-3 mr-1" /> {model}
              </Badge></div></div>
        <div className=" ">$2</div><EnhancedAIChatInterface
            messages={ messages }
            input={ input }
            setInput={ setInput }
            onSend={ handleSendMessage }
            processing={ processing }
            aiStatus={ aiStatus }
            currentAction="chat"
            model={ model }
          / /></div></AuthenticatedLayout>);};

export default Chat;
