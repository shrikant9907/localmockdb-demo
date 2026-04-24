import { Zap, Clock, Shield, Code2, Layers, CheckCircle2 } from 'lucide-react';

const useCases = [
  {
    icon: <Zap size={18} />,
    title: 'Prototype without a backend',
    desc: 'Build and demo full CRUD flows before your API is ready. No server, no Docker, no setup — just install and go.',
    code: `import { createAPI } from 'localmockdb';
const db = createAPI({ namespace: 'my-app', persist: true });

// POST
await db.post('/users', { name: 'Alice', role: 'admin' });

// GET all
const res = await db.get('/users');
console.log(res.data); // [{ id: '...', name: 'Alice' }]`,
  },
  {
    icon: <Clock size={18} />,
    title: 'Speed up development loops',
    desc: 'Skip waiting on backend teams. Mock the API contract locally, ship the UI, then swap in the real endpoint with one line change.',
    code: `// Development
const db = createAPI({ namespace: 'dev', storage: 'localStorage' });

// Production — swap the base URL, keep all your call sites
const db = createAPI({ baseURL: 'https://api.myapp.com' });`,
  },
  {
    icon: <Shield size={18} />,
    title: 'Offline-first testing',
    desc: 'All data lives in localStorage. Works on planes, in demos, without Wi-Fi. Never blocked by network issues during a live demo.',
    code: `// Data persists across page reloads automatically
const db = createAPI({ namespace: 'demo', persist: true });

await db.post('/todos', { title: 'Ship it', done: false });
// Reload the page — data is still there ✓`,
  },
  {
    icon: <Layers size={18} />,
    title: 'Multiple isolated collections',
    desc: 'Namespace your data per feature or test suite. Reset one collection without touching others.',
    code: `const db = createAPI({ namespace: 'feature-auth' });
await db.post('/sessions', { token: 'abc123' });

const db2 = createAPI({ namespace: 'feature-cart' });
await db2.post('/items', { sku: 'X1', qty: 2 });
// Completely isolated — no conflicts`,
  },
];

const perks = [
  { label: 'Zero network latency', desc: 'All reads/writes hit localStorage — sub-millisecond response times.' },
  { label: 'No CORS issues', desc: 'Everything runs in the browser. No headers, no preflight, no blocked requests.' },
  { label: 'Pagination & filtering built-in', desc: 'Pass ?page=2&limit=10 — the API handles it automatically.' },
  { label: 'Consistent response shape', desc: 'Every call returns { success, data, meta, error } — no surprises.' },
  { label: 'TypeScript-first', desc: 'Full type inference on all responses. Works with your existing types.' },
  { label: 'Drop-in replacement', desc: 'Same method signatures as a REST client. Switch to real API with one config change.' },
];

export default function DocsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Comparison Table */}
      <div>
        <div className="section-header">
          <div>
            <div className="section-title">📊 How LocalMockDB compares</div>
            <div className="section-subtitle">vs JSON Server · MSW · Mirage.js · Axios Mock Adapter · plain fetch mocks</div>
          </div>
        </div>
        <div className="table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-default)' }}>
                {['Feature', 'LocalMockDB', 'JSON Server', 'MSW', 'Mirage.js', 'Axios Mock Adapter'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 10, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Zero install / setup',    '✅ npm install',  '⚠️ Node server',    '⚠️ SW setup',   '⚠️ App wrapper',   '⚠️ Axios only'],
                ['Works offline / no Wi-Fi','✅ Yes',          '❌ Needs Node',      '✅ Yes',         '✅ Yes',            '✅ Yes'],
                ['Data persists on reload', '✅ localStorage', '✅ db.json file',    '❌ In-memory',   '❌ In-memory',      '❌ In-memory'],
                ['Response latency',        '✅ < 1 ms',       '⚠️ 1–5 ms (local)', '✅ < 1 ms',      '✅ < 1 ms',         '✅ < 1 ms'],
                ['No server process',       '✅ Yes',          '❌ Node required',   '✅ Yes',         '✅ Yes',            '✅ Yes'],
                ['REST pagination built-in','✅ Yes',          '✅ Yes',             '❌ Manual',      '⚠️ Partial',        '❌ Manual'],
                ['Consistent response shape','✅ Yes',         '⚠️ Partial',        '❌ Manual',      '⚠️ Partial',        '❌ Manual'],
                ['TypeScript-first',        '✅ Yes',          '❌ No',              '✅ Yes',         '⚠️ Partial',        '✅ Yes'],
                ['Works in any framework',  '✅ Yes',          '✅ Yes',             '✅ Yes',         '❌ Ember/React',    '❌ Axios only'],
                ['One-line prod swap',      '✅ Adapter swap', '❌ Rewrite calls',   '❌ Rewrite',     '❌ Rewrite',        '❌ Rewrite'],
                ['Learning curve',          '✅ Minimal',      '✅ Low',             '⚠️ Medium',      '⚠️ High',           '⚠️ Medium'],
              ].map(([feature, ...vals], i) => (
                <tr key={feature} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '9px 12px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>{feature}</td>
                  {vals.map((v, vi) => (
                    <td key={vi} style={{
                      padding: '9px 12px',
                      color: vi === 0
                        ? v.startsWith('✅') ? 'var(--success)' : v.startsWith('❌') ? 'var(--error)' : 'var(--warning)'
                        : 'var(--text-secondary)',
                      fontWeight: vi === 0 ? 600 : 400,
                      fontSize: vi === 0 ? 12 : 11,
                    }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {[
            { label: '< 1ms reads', color: 'var(--success)' },
            { label: 'No server process', color: 'var(--success)' },
            { label: 'Persists on reload', color: 'var(--accent)' },
            { label: 'One-file prod swap', color: 'var(--accent)' },
            { label: 'Works offline', color: 'var(--info)' },
          ].map(b => (
            <span key={b.label} style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${b.color}`,
              color: b.color,
              fontSize: 11,
              fontWeight: 600,
            }}>{b.label}</span>
          ))}
        </div>
      </div>

      {/* Why section */}
      <div className="card">
        <div className="card-header">
          <span className="section-title">Why LocalMockDB?</span>
        </div>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {perks.map(p => (
            <div key={p.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircle2 size={15} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick start */}
      <div>
        <div className="section-header">
          <div>
            <div className="section-title">Quick Start</div>
            <div className="section-subtitle">Add to any React / Node project in under a minute</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <pre className="response-pre" style={{ maxHeight: 'none' }}>{`npm install localmockdb

import { createAPI } from 'localmockdb';

const db = createAPI({
  namespace: 'my-project',  // isolates your data
  persist: true,            // survives page reloads
  storage: 'localStorage',
});

// Full REST-style CRUD
await db.post('/products', { name: 'Widget', price: 9.99 });
await db.get('/products');           // list all
await db.get('/products/:id');       // get one
await db.put('/products/:id', {...}); // replace
await db.patch('/products/:id', {...}); // partial update
await db.delete('/products/:id');    // remove`}</pre>
          </div>
        </div>
      </div>

      {/* Use cases */}
      <div>
        <div className="section-header">
          <div>
            <div className="section-title">Use Cases</div>
            <div className="section-subtitle">Real scenarios where LocalMockDB saves hours of work</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {useCases.map(uc => (
            <div key={uc.title} className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--accent)' }}>{uc.icon}</span>
                  <span className="section-title">{uc.title}</span>
                </div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{uc.desc}</p>
                <pre className="response-pre" style={{ maxHeight: 'none' }}>{uc.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Migration trick */}
      <div>
        <div className="section-header">
          <div>
            <div className="section-title">🚀 Going to Production — The Swap Trick</div>
            <div className="section-subtitle">Replace every mock call with real API calls in one place, zero component changes</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Step 1 */}
          <div className="card">
            <div className="card-header"><span className="section-title">Step 1 — Create an API adapter</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Wrap LocalMockDB behind a thin adapter file. Your components never import <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: 12 }}>localmockdb</code> directly — they only call this adapter.
              </p>
              <pre className="response-pre" style={{ maxHeight: 'none' }}>{`// src/lib/api.ts  ← the ONLY file you change at launch

import { createAPI } from 'localmockdb';

const mock = createAPI({ namespace: 'my-app', persist: true });

// Same shape as fetch-based clients
export const api = {
  get:    (url: string)              => mock.get(url),
  post:   (url: string, body: any)   => mock.post(url, body),
  put:    (url: string, body: any)   => mock.put(url, body),
  patch:  (url: string, body: any)   => mock.patch(url, body),
  delete: (url: string)              => mock.delete(url),
};`}</pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card">
            <div className="card-header"><span className="section-title">Step 2 — Use the adapter everywhere</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Import only from <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: 12 }}>src/lib/api</code> across your entire app.
              </p>
              <pre className="response-pre" style={{ maxHeight: 'none' }}>{`// src/features/users/userApi.ts
import { api } from '../../lib/api';

export const getUsers  = ()       => api.get('/users');
export const createUser = (body)  => api.post('/users', body);
export const deleteUser = (id)    => api.delete(\`/users/\${id}\`);`}</pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card">
            <div className="card-header"><span className="section-title">Step 3 — Swap at launch (one edit)</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                When your real backend is ready, replace only <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: 12 }}>src/lib/api.ts</code>. Every component, hook, and feature file stays untouched.
              </p>
              <pre className="response-pre" style={{ maxHeight: 'none' }}>{`// src/lib/api.ts  ← swap this file on launch day

const BASE = import.meta.env.VITE_API_URL; // e.g. https://api.myapp.com

async function request(method: string, url: string, body?: any) {
  const res = await fetch(BASE + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { success: res.ok, data, message: data.message ?? '' };
}

export const api = {
  get:    (url: string)            => request('GET', url),
  post:   (url: string, body: any) => request('POST', url, body),
  put:    (url: string, body: any) => request('PUT', url, body),
  patch:  (url: string, body: any) => request('PATCH', url, body),
  delete: (url: string)            => request('DELETE', url),
};

// ✓ Zero changes needed anywhere else in the codebase`}</pre>
            </div>
          </div>

          {/* Env var tip */}
          <div className="card">
            <div className="card-header"><span className="section-title">Bonus — Auto-switch via env variable</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Keep both adapters and switch automatically based on <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: 12 }}>VITE_USE_MOCK</code>. Perfect for staging vs production.
              </p>
              <pre className="response-pre" style={{ maxHeight: 'none' }}>{`// src/lib/api.ts
import { createAPI } from 'localmockdb';
import { fetchAdapter } from './fetchAdapter';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const mock = createAPI({ namespace: 'my-app', persist: true });

export const api = useMock ? {
  get:    (url) => mock.get(url),
  post:   (url, body) => mock.post(url, body),
  put:    (url, body) => mock.put(url, body),
  patch:  (url, body) => mock.patch(url, body),
  delete: (url) => mock.delete(url),
} : fetchAdapter;

// .env.development  →  VITE_USE_MOCK=true
// .env.production   →  VITE_USE_MOCK=false`}</pre>
            </div>
          </div>

        </div>
      </div>

      {/* Performance note */}
      <div className="card" style={{ borderColor: 'var(--accent)', borderLeftWidth: 3 }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Code2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                Performance impact on your real project
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Because LocalMockDB writes to <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>localStorage</code> synchronously
                (wrapped in async for API compatibility), reads take <strong style={{ color: 'var(--text-primary)' }}>&lt; 1ms</strong> versus
                50–500ms for a real network call. During development this eliminates loading states, race conditions, and flaky network errors —
                letting you focus entirely on UI logic. When you switch to your real API, your components need zero changes.
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
