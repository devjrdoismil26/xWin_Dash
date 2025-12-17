/**
 * AdvancedNotificationCenter - Centro Avançado de Notificações
 * Refatorado em 28/11/2025 - Reduzido de 1104 linhas (40KB) para 220 linhas (7KB)
 * 
 * Componentes extraídos:
 * - types.ts - Interfaces e tipos
 * - NotificationContext.tsx - Provider e hook
 * - NotificationItem.tsx - Componente de item individual
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Settings, Search } from 'lucide-react';
import { useNotifications } from './NotificationContext';
import { NotificationItem } from './NotificationItem';

export const AdvancedNotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isOpen,
    openCenter,
    closeCenter,
    markAllAsRead,
    clearRead,
    settings,
    updateSettings
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned' | 'starred'>('all');

  const [searchQuery, setSearchQuery] = useState('');

  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = useMemo(() => {
    let filtered = (notifications || []).filter(n => !n.archived);

    switch (filter) {
      case 'unread':
        filtered = filtered.filter(n => !n.read);

        break;
      case 'pinned':
        filtered = filtered.filter(n => n.pinned);

        break;
      case 'starred':
        filtered = filtered.filter(n => n.starred);

        break;
    }

    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase()));

    }

    return filtered.sort((a: unknown, b: unknown) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();

    });

  }, [notifications, filter, searchQuery]);

  return (
            <>
      <div className=" ">$2</div><button
          onClick={ openCenter }
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative" />
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
          )}
        </button></div><AnimatePresence />
        {isOpen && (
          <div}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end pt-16 pr-6 z-50"
            onClick={ closeCenter  }>
        </div><div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-hidden"
              onClick={ (e: unknown) => e.stopPropagation()  }>
              <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-900 dark:text-white" />
                    Notificações
                  </h2>
                  <div className=" ">$2</div><button
                      onClick={ () => setShowSettings(!showSettings) }
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4" /></button><button
                      onClick={ closeCenter }
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors" />
                      <X className="h-4 w-4" /></button></div>

                <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar notificações..."
                      value={ searchQuery }
                      onChange={ (e: unknown) => setSearchQuery(e.target.value) }
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div><div className="{[">$2</div>
                      { key: 'all', label: 'Todas', count: (notifications || []).filter(n => !n.archived).length },
                      { key: 'unread', label: 'Não lidas', count: unreadCount },
                      { key: 'pinned', label: 'Fixadas', count: (notifications || []).filter(n => n.pinned && !n.archived).length },
                      { key: 'starred', label: 'Favoritas', count: (notifications || []).filter(n => n.starred && !n.archived).length }
                    ].map(({ key, label, count }) => (
                      <button
                        key={ key }
                        onClick={ () => setFilter(key as typeof filter) }
                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                          filter === key
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } `}
  >
                        {label} {count > 0 && `(${count})`}
                      </button>
                    ))}
                  </div>

                  <div className="{unreadCount > 0 && (">$2</div>
                      <button
                        onClick={ markAllAsRead }
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" />
                        Marcar todas como lidas
                      </button>
                    )}
                    <button
                      onClick={ clearRead }
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                      Limpar lidas
                    </button></div></div>

              <AnimatePresence />
                {showSettings && (
                  <div}
                    className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-3 overflow-hidden">
           
        </div>{['enabled', 'sound', 'desktop'].map((key: unknown) => (
                      <div key={key} className="flex items-center justify-between">
           
        </div><span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{key}</span>
                        <label className="relative inline-flex items-center cursor-pointer" />
                          <input
                            type="checkbox"
                            checked={ settings[key as keyof typeof settings] as boolean }
                            onChange={(e: unknown) => updateSettings({ [key]: e.target.checked })}
                            className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" /></label></div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <div className="{filteredNotifications.length === 0 ? (">$2</div>
                  <div className=" ">$2</div><Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400" />
                      {searchQuery ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação'}
                    </p>
      </div>
    </>
  ) : (
                  <div className=" ">$2</div><AnimatePresence />
                      {filteredNotifications.map((notification: unknown) => (
                        <NotificationItem
                          key={ notification.id }
                          notification={ notification }
                        / />
                      ))}
                    </AnimatePresence>
      </div>
    </>
  )}
              </div>
    </div>
  )}
      </AnimatePresence>
    </>);};

export default AdvancedNotificationCenter;
