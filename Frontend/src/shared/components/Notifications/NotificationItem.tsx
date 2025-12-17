import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, XCircle, AlertCircle, Info, Settings, Share2, TrendingUp, BarChart3, Pin, PinOff, Star, Archive, X } from 'lucide-react';
import { useNotifications } from './NotificationContext';
import type { NotificationItem as NotificationItemType } from './types';

interface NotificationItemProps {
  notification: NotificationItemType;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification    }) => {
  const { markAsRead, removeNotification, togglePin, toggleStar, archiveNotification } = useNotifications();

  const [showActions, setShowActions] = useState(false);

  const getTypeIcon = (type: NotificationItemType['type']) => {
    const icons = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertCircle,
      info: Info,
      system: Settings,
      social: Share2,
      marketing: TrendingUp,
      sales: BarChart3};

    return icons[type] || Bell;};

  const getTypeColor = (type: NotificationItemType['type']) => {
    const colors = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500',
      system: 'text-gray-500',
      social: 'text-purple-500',
      marketing: 'text-pink-500',
      sales: 'text-indigo-500'};

    return colors[type] || 'text-gray-500';};

  const getPriorityColor = (priority: NotificationItemType['priority']) => {
    const colors = {
      urgent: 'border-l-red-500',
      high: 'border-l-orange-500',
      medium: 'border-l-yellow-500',
      low: 'border-l-green-500'};

    return colors[priority] || 'border-l-gray-300';};

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();

    const minutes = Math.floor(diff / 60000);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;};

  const TypeIcon = getTypeIcon(notification.type);

  return (
            <div}
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
        !notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
      }`}
      onClick={ () => !notification.read && markAsRead(notification.id) }
      onMouseEnter={ () => setShowActions(true) }
      onMouseLeave={ () => setShowActions(false)  }>
      <div className=" ">$2</div><div className="{notification.avatar ? (">$2</div>
      <img src={notification.avatar} alt="" className="w-8 h-8 rounded-full" />
    </>
  ) : (
            <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${getTypeColor(notification.type)} `}>
           
        </div><TypeIcon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><p className={`text-sm font-medium text-gray-900 dark:text-white ${!notification.read ? 'font-semibold' : ''} `} />
                  {notification.title}
                </p>
                {notification.pinned && <Pin className="h-3 w-3 text-gray-400" />}
                {notification.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2" />
                {notification.message}
              </p>

              <div className=" ">$2</div><span>{notification.source}</span>
                <span>•</span>
                <span>{formatTime(notification.timestamp)}</span>
                <span>•</span>
                <span className={`px-1.5 py-0.5 rounded ${
                  notification.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                  notification.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                  notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                } `}>
           
        </span>{notification.priority}
                </span>
              </div>

              {notification.actions && notification.actions.length > 0 && (
                <div className="{notification.actions.map((action: unknown) => {">$2</div>
                    const ActionIcon = action.icon;
                    return (
                              <button
                        key={ action.id }
                        onClick={(e: unknown) => {
                          e.stopPropagation();

                          action.action();

                        } className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          action.type === 'primary' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400' :
                          action.type === 'danger' ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                        } `}
  >
                        {ActionIcon && <ActionIcon className="h-3 w-3" />}
                        <span>{action.label}</span>
                      </button>);

                  })}
                </div>
              )}
            </div>

            <AnimatePresence />
              {showActions && (
                <div}
                  className="flex items-center space-x-1 ml-2">
           
        </div><button
                    onClick={(e: unknown) => {
                      e.stopPropagation();

                      toggleStar(notification.id);

                    } className="p-1 text-gray-400 hover:text-yellow-500 rounded transition-colors"
                  >
                    <Star className={`h-3 w-3 ${notification.starred ? 'fill-current text-yellow-500' : ''} `} / /></button><button
                    onClick={(e: unknown) => {
                      e.stopPropagation();

                      togglePin(notification.id);

                    } className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors"
                  >
                    {notification.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                  </button>
                  
                  <button
                    onClick={(e: unknown) => {
                      e.stopPropagation();

                      archiveNotification(notification.id);

                    } className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <Archive className="h-3 w-3" />
                  </button>
                  
                  {notification.dismissible && (
                    <button
                      onClick={(e: unknown) => {
                        e.stopPropagation();

                        removeNotification(notification.id);

                      } className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </AnimatePresence></div></div>);};
