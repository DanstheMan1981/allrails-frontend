import { useState, useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let nextId = 0;

/** Hook: returns [toasts, showToast, ToastContainer] */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const ToastContainer = useCallback(() => (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
      ))}
    </div>
  ), [toasts]);

  return { showToast, ToastContainer } as const;
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const isError = toast.type === 'error';

  return (
    <div
      onClick={onDismiss}
      className={`cursor-pointer rounded-xl px-4 py-3 shadow-lg border backdrop-blur-sm transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${
        isError
          ? 'bg-red-500/15 border-red-500/30 text-red-400'
          : 'bg-emerald/15 border-emerald/30 text-emerald'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-base shrink-0 mt-0.5">{isError ? '✕' : '✓'}</span>
        <p className="text-sm font-medium leading-snug">{toast.message}</p>
      </div>
    </div>
  );
}
