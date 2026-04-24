import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { Toast } from '../../hooks/useToast';

interface ToastPortalProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

export default function ToastPortal({ toasts, onRemove }: ToastPortalProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-portal">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && <CheckCircle2 />}
          {t.type === 'error'   && <AlertCircle />}
          {t.type === 'info'    && <Info />}
          <span>{t.message}</span>
          <button className="toast__close btn-icon" onClick={() => onRemove(t.id)} aria-label="Dismiss">
            <X />
          </button>
        </div>
      ))}
    </div>
  );
}
