import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} color="#10b981" />;
      case 'error':
        return <AlertTriangle size={18} color="#ef4444" />;
      case 'info':
      default:
        return <Info size={18} color="#3b82f6" />;
    }
  };

  return (
    <div className={`toast ${type}`}>
      {getIcon()}
      <span style={{ fontSize: '0.9rem', flex: 1 }}>{message}</span>
      <button 
        onClick={onClose} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: '#6b7280', 
          display: 'flex' 
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
