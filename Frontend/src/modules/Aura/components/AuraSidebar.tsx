/**
 * @module AuraSidebar
 * @description Componente de sidebar para exibir conexões e conversas do Aura.
 * 
 * Este componente exibe uma barra lateral com lista de conexões ativas e conversas
 * do Aura. Permite selecionar conversas e conexões, exibe estatísticas rápidas
 * e mostra indicadores de status (ativo, erro, inativo) para conexões.
 * 
 * @example
 * ```tsx
 * <AuraSidebar
 *   connections={ connections }
 *   chats={ chats }
 *   selectedChat={ selectedChat }
 *   onChatSelect={ (chat: unknown) =>  }
 *   onConnectionSelect={ (connection: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import { AuraSidebarProps } from '../types/auraTypes';

/**
 * Componente de sidebar para conexões e conversas do Aura
 * 
 * @param {AuraSidebarProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const AuraSidebar: React.FC<AuraSidebarProps> = ({ connections, 
  chats, 
  selectedChat, 
  onChatSelect, 
  onConnectionSelect 
   }) => {
  /**
   * Manipula a seleção de uma conversa
   * 
   * @param {typeof chats[0]} chat - Conversa selecionada
   */
  const handleChatSelect = (chat: typeof chats[0]) => {
    onChatSelect?.(chat);};

  /**
   * Manipula a seleção de uma conexão
   * 
   * @param {typeof connections[0]} connection - Conexão selecionada
   */
  const handleConnectionSelect = (connection: typeof connections[0]) => {
    onConnectionSelect?.(connection);};

  return (
            <aside className="w-64 border-r h-full p-4 bg-white" />
      {/* Conexões */}
      <div className=" ">$2</div><h3 className="text-sm font-medium text-gray-900 mb-3">Conexões</h3>
        <div className="{(connections || []).map((connection: unknown) => (">$2</div>
            <button
              key={ connection.id }
              onClick={ () => handleConnectionSelect(connection) }
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <div className=" ">$2</div><div>
           
        </div><div className="font-medium text-gray-900">{connection.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{connection.platform}</div>
                <div className={`w-2 h-2 rounded-full ${
                  connection.status === 'active' ? 'bg-green-500' : 
                  connection.status === 'error' ? 'bg-red-500' : 
                  'bg-gray-400'
                } `} / />
           
        </div></button>
          ))}
        </div>
      {/* Chats */}
      <div>
           
        </div><h3 className="text-sm font-medium text-gray-900 mb-3">Conversas</h3>
        <div className="{chats.length === 0 ? (">$2</div>
            <div className=" ">$2</div><div className="text-2xl mb-2">💬</div>
              <p className="text-sm">Nenhuma conversa</p>
      </div>
    </>
  ) : (
            (chats || []).map((chat: unknown) => (
              <button
                key={ chat.id }
                onClick={ () => handleChatSelect(chat) }
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedChat?.id === chat.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                } `}
  >
                <div className=" ">$2</div><div className=" ">$2</div><div className="{chat.contact_name}">$2</div>
                    </div>
                    {chat.last_message && (
                      <div className="{chat.last_message}">$2</div>
    </div>
  )}
                    {chat.last_message_at && (
                      <div className="{new Date(chat.last_message_at).toLocaleTimeString('pt-BR', {">$2</div>
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                  {chat.unread_count > 0 && (
                    <div className=" ">$2</div><span className="{chat.unread_count > 99 ? '99+' : chat.unread_count}">$2</span>
                      </span>
      </div>
    </>
  )}
                </div>
      </button>
    </>
  ))
          )}
        </div>
      {/* Estatísticas Rápidas */}
      <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><div className="{(connections || []).filter(c => c.status === 'active').length}">$2</div>
            </div>
            <div className="text-xs text-gray-500">Conexões</div>
          <div>
           
        </div><div className="{(chats || []).filter(c => c.status === 'active').length}">$2</div>
            </div>
            <div className="text-xs text-gray-500">Chats Ativos</div></div></aside>);};

export default AuraSidebar;
