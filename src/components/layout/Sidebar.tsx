import { Database, ListTodo, Code2, Settings, Sun, Moon, Menu, BookOpen } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';

type Section = 'tasks' | 'query' | 'settings' | 'docs';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
  collections: string[];
  theme: Theme;
  onToggleTheme: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  activeSection,
  onSectionChange,
  collections,
  theme,
  onToggleTheme,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Database size={16} strokeWidth={2.5} />
        </div>
        <span className="sidebar-title">LocalMockDB</span>
        <button
          className="btn-icon"
          style={{ marginLeft: 'auto' }}
          onClick={onMobileClose}
          aria-label="Close sidebar"
        >
          <Menu size={16} />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <span className="sidebar-section-label">Workspace</span>
        <button
          className={`nav-item${activeSection === 'tasks' ? ' active' : ''}`}
          onClick={() => { onSectionChange('tasks'); onMobileClose(); }}
          aria-current={activeSection === 'tasks' ? 'page' : undefined}
        >
          <ListTodo size={16} />
          Tasks
        </button>
        <button
          className={`nav-item${activeSection === 'query' ? ' active' : ''}`}
          onClick={() => { onSectionChange('query'); onMobileClose(); }}
          aria-current={activeSection === 'query' ? 'page' : undefined}
        >
          <Code2 size={16} />
          API Responses
        </button>
        <button
          className={`nav-item${activeSection === 'settings' ? ' active' : ''}`}
          onClick={() => { onSectionChange('settings'); onMobileClose(); }}
          aria-current={activeSection === 'settings' ? 'page' : undefined}
        >
          <Settings size={16} />
          Settings
        </button>
        <button
          className={`nav-item${activeSection === 'docs' ? ' active' : ''}`}
          onClick={() => { onSectionChange('docs'); onMobileClose(); }}
          aria-current={activeSection === 'docs' ? 'page' : undefined}
        >
          <BookOpen size={16} />
          Docs & Use Cases
        </button>

        {collections.length > 0 && (
          <>
            <div className="divider" style={{ margin: '8px 4px' }} />
            <span className="sidebar-section-label">Collections</span>
            {collections.map(col => (
              <div key={col} className="collection-chip">
                <span className="collection-dot" />
                {col}
              </div>
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </aside>
  );
}
