import { useState, useCallback, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-4), { id, message, type }]); // max 5
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };
  const styles = {
    success: 'border-emerald-500/35 text-emerald-300',
    error: 'border-rose-500/35 text-rose-300',
    warning: 'border-amber-500/35 text-amber-300',
    info: 'border-blue-500/35 text-blue-300',
  };
  const bgs = {
    success: 'rgba(16,185,129,0.12)',
    error: 'rgba(244,63,94,0.12)',
    warning: 'rgba(251,191,36,0.12)',
    info: 'rgba(59,130,246,0.12)',
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
        {toasts.map(({ id, message, type }) => {
          const Icon = icons[type] || Info;
          return (
            <div key={id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border ${styles[type]} shadow-[0_8px_40px_rgba(0,0,0,0.6)]`}
              style={{background:`rgba(4,4,18,0.97)`,backdropFilter:'blur(24px)',borderColor:styles[type].split(' ')[0].replace('border-',''),animation:'bounceIn 0.35s ease both'}}>
              <Icon size={15} className="flex-shrink-0" style={{background:bgs[type],borderRadius:'50%',padding:'1px'}}/>
              <span className="text-sm text-white/90 flex-1">{message}</span>
              <button onClick={() => remove(id)} className="opacity-40 hover:opacity-100 transition-opacity flex-shrink-0">
                <X size={13}/>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
