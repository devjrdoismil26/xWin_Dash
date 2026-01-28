import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';

const typeConfig = {
  success: { icon: CheckCircle, bgColor: 'bg-green-50', borderColor: 'border-green-200', iconColor: 'text-green-400', titleColor: 'text-green-800', messageColor: 'text-green-700' },
  error: { icon: AlertCircle, bgColor: 'bg-red-50', borderColor: 'border-red-200', iconColor: 'text-red-400', titleColor: 'text-red-800', messageColor: 'text-red-700' },
  warning: { icon: AlertTriangle, bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', iconColor: 'text-yellow-400', titleColor: 'text-yellow-800', messageColor: 'text-yellow-700' },
  info: { icon: Info, bgColor: 'bg-blue-50', borderColor: 'border-blue-200', iconColor: 'text-blue-400', titleColor: 'text-blue-800', messageColor: 'text-blue-700' },
};

const Toast = ({ id, type = 'info', title, message, onClose, duration = 4000, action, className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (!duration) return undefined;
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 200);
  }, [id, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`max-w-sm w-full ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      } ${className}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && <p className={`text-sm font-medium ${config.titleColor}`}>{title}</p>}
            {message && <p className={`text-sm ${config.messageColor} ${title ? 'mt-1' : ''}`}>{message}</p>}
            {action && <div className="mt-3">{action}</div>}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={handleClose} className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none">
              <span className="sr-only">Fechar</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const positions = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2',
};

export const ToastContainer = ({ toasts = [], position = 'top-right', onClose }) => (
  <div className={`fixed z-50 p-6 space-y-4 ${positions[position]}`} style={{ maxWidth: '420px' }}>
    {toasts.map((t) => (
      <Toast key={t.id} {...t} onClose={onClose} />
    ))}
  </div>
);

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  duration: PropTypes.number,
  action: PropTypes.node,
  className: PropTypes.string,
};

ToastContainer.propTypes = {
  toasts: PropTypes.array,
  position: PropTypes.oneOf(['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center']),
  onClose: PropTypes.func,
};

export default Toast;
