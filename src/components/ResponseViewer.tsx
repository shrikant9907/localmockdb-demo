import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { JsonValue } from '../lib/types';

export default function ResponseViewer({ title, value }: { title: string; value: JsonValue | null }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="response-viewer">
      <div className="response-viewer__header">
        <span className="response-viewer__title">{title}</span>
        {value !== null && (
          <button className="btn-icon" onClick={handleCopy} aria-label="Copy to clipboard">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        )}
      </div>
      <pre className="response-pre">{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}