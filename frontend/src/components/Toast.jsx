import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const Toast = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-md w-full animate-fadeIn">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start space-x-3 ${
        isError 
          ? 'bg-red-950/90 border-red-800 text-red-200' 
          : isSuccess 
          ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          : 'bg-slate-900/90 border-slate-700 text-slate-200'
      }`}>
        <div className="shrink-0 mt-0.5">
          {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {!isError && !isSuccess && <Info className="w-5 h-5 text-amber-400" />}
        </div>
        <div className="flex-1 text-xs font-semibold leading-relaxed">
          {message}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
