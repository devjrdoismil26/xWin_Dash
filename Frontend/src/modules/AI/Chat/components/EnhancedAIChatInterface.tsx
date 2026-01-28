import React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  type: 'text' | 'code' | 'image' | 'file' | 'system';
  content: string;
}
interface EnhancedAIChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  onSend: (e: any) => void;
  processing?: boolean;
  aiStatus?: string;
  currentAction?: string;
  model?: string;
  className?: string;
}
const EnhancedAIChatInterface: React.FC<EnhancedAIChatInterfaceProps> = ({ messages, input, setInput, onSend, processing, aiStatus, currentAction, model, className }) => {
  return (
    <div className={`flex flex-col h-full bg-white ${className || ''}`}>
      <div className="flex items-center justify-between p-3 border-b">
        <div className="text-sm text-gray-600">{currentAction || 'chat'} • {aiStatus || 'idle'}</div>
        {model && <Badge variant="secondary" className="text-xs">{model}</Badge>}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">Sem mensagens</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`p-2 rounded ${m.sender === 'user' ? 'bg-blue-50 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>{m.content}</div>
          ))
        )}
      </div>
      <form onSubmit={onSend} className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1 resize-none" rows={1} />
          <Button type="submit" disabled={processing || !input?.trim()}>Enviar</Button>
        </div>
      </form>
    </div>
  );
};
export default EnhancedAIChatInterface;
