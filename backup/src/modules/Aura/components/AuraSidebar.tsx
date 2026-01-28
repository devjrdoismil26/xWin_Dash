import React from 'react';
import { AuraSidebarProps } from '../types/auraTypes';
const AuraSidebar: React.FC<AuraSidebarProps> = ({ 
  connections, 
  chats, 
  selectedChat, 
  onChatSelect, 
  onConnectionSelect 
}) => {
  const handleChatSelect = (chat: typeof chats[0]) => {
    onChatSelect?.(chat);
  };
  const handleConnectionSelect = (connection: typeof connections[0]) => {
    onConnectionSelect?.(connection);
  };
  return (
    <aside className="w-64 border-r h-full p-4 bg-white">
      {/* Conexões */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Conexões</h3>
        <div className="space-y-2">
          {connections.map((connection) => (
            <button
              key={connection.id}
              onClick={() => handleConnectionSelect(connection)}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{connection.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{connection.platform}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  connection.status === 'active' ? 'bg-green-500' : 
                  connection.status === 'error' ? 'bg-red-500' : 
                  'bg-gray-400'
                }`} />
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Chats */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Conversas</h3>
        <div className="space-y-1">
          {chats.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm">Nenhuma conversa</p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedChat?.id === chat.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {chat.contact_name}
                    </div>
                    {chat.last_message && (
                      <div className="text-sm text-gray-500 truncate">
                        {chat.last_message}
                      </div>
                    )}
                    {chat.last_message_at && (
                      <div className="text-xs text-gray-400">
                        {new Date(chat.last_message_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                  {chat.unread_count > 0 && (
                    <div className="ml-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                        {chat.unread_count > 99 ? '99+' : chat.unread_count}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      {/* Estatísticas Rápidas */}
      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {connections.filter(c => c.status === 'active').length}
            </div>
            <div className="text-xs text-gray-500">Conexões</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {chats.filter(c => c.status === 'active').length}
            </div>
            <div className="text-xs text-gray-500">Chats Ativos</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default AuraSidebar;
