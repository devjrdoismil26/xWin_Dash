import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
const GeminiChatInterface = React.memo(function GeminiChatInterface({ messages, input, setInput, onSendMessage, processing }) {
  const messagesEndRef = useRef(null);
  useEffect(() => {
    (messagesEndRef.current)?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Comece a conversa...</div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`p-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>{m.content}</div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={onSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1 resize-none" rows={1} />
          <Button type="submit" disabled={processing || !input?.trim()}>Enviar</Button>
        </div>
      </form>
    </div>
  );
});
GeminiChatInterface.propTypes = {
  messages: PropTypes.array.isRequired,
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  processing: PropTypes.bool.isRequired,
};
export default GeminiChatInterface;
