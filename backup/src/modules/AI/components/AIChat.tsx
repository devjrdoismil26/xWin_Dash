import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
interface Message { id: string; role: 'user' | 'assistant'; content: string }
const AIChat: React.FC<{ conversationId?: string }> = ({ conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;
    setLoading(true);
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Olá! Como posso ajudar?' }]);
      setLoading(false);
    }, 600);
  };
  return (
    <Card className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bot className="w-12 h-12 mx-auto mb-4" />
            Comece uma conversa
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg rounded-lg p-3 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <div className="flex items-center gap-2 mb-1 text-xs opacity-80">
                  {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  <span>{m.role}</span>
                </div>
                <div className="whitespace-pre-wrap text-sm">{m.content}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Textarea value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} rows={2} className="flex-1" placeholder="Digite sua mensagem..." />
          <Button type="submit" size="sm" disabled={loading || !inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">Pressione Enter para enviar, Shift+Enter para nova linha</div>
      </form>
    </Card>
  );
};
export default AIChat;
