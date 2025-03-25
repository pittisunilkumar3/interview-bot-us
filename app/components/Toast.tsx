import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  
  // Toast animations
  useEffect(() => {
    // Show toast animation
    setVisible(true);
    
    // Auto close after duration
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);
    
    return () => clearTimeout(closeTimer);
  }, [duration]);
  
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 300); // Match with animation duration
  };
  
  // Early return if not visible
  if (!visible) return null;
  
  // Type-specific configurations
  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      bgColor: 'bg-green-400/10 border-green-400/30',
      focusRing: 'ring-green-400/30'
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      bgColor: 'bg-red-400/10 border-red-400/30',
      focusRing: 'ring-red-400/30'
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
      bgColor: 'bg-yellow-400/10 border-yellow-400/30',
      focusRing: 'ring-yellow-400/30'
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-400" />,
      bgColor: 'bg-blue-400/10 border-blue-400/30',
      focusRing: 'ring-blue-400/30'
    }
  };
  
  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 
        transition-all duration-300 ease-in-out
        transform ${closing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        max-w-md w-full sm:w-auto
      `}
      role="alert"
      aria-live="assertive"
    >
      <div 
        className={`
          ${config[type].bgColor}
          glass border rounded-lg shadow-lg 
          p-4 pr-12 relative overflow-hidden
          flex items-start gap-3
        `}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {config[type].icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 pt-0.5">
          <p className="text-white/90 text-sm font-medium leading-5">{message}</p>
        </div>
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className={`
            absolute top-3 right-3 text-gray-400 
            hover:text-white focus:outline-none focus:ring-2 
            focus:${config[type].focusRing} rounded-full p-1
            transition-colors
          `}
        >
          <span className="sr-only">Close notification</span>
          <X className="w-4 h-4" />
        </button>
        
        {/* Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-white/20 animate-loading-bar" 
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}

// Create a container component to manage multiple toasts
interface ToastContainerProps {
  toasts: Array<{
    id: number;
    message: string;
    type: ToastType;
  }>;
  removeToast: (id: number) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
