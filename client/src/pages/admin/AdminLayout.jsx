import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAdminStore from '../../stores/useAdminStore';
import { setAdminKey, clearAdminKey } from '../../api/adminClient';

function AdminLogin({ onLogin }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    setAdminKey(key.trim());
    try {
      await onLogin();
    } catch {
      clearAdminKey();
      setError('Invalid admin key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 360,
        textAlign: 'center',
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '1.5rem',
          boxShadow: '0 8px 32px rgba(15,43,60,0.25)',
        }}>
          🔐
        </div>
        <h2 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--navy)',
          marginBottom: 8,
          letterSpacing: '-0.03em',
        }}>
          Admin Access
        </h2>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          marginBottom: 24,
        }}>
          Enter the admin key to continue
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Admin key"
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '1rem',
              border: '2px solid var(--border)',
              borderRadius: 12,
              outline: 'none',
              transition: 'all 0.25s',
              background: 'white',
              boxShadow: 'var(--shadow-sm)',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--cyan)';
              e.target.style.boxShadow = 'var(--shadow-glow)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'var(--shadow-sm)';
            }}
          />
          <button
            type="submit"
            disabled={!key.trim() || loading}
            style={{
              width: '100%',
              marginTop: 12,
              padding: '14px 24px',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: 'white',
              background: key.trim()
                ? 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)'
                : 'var(--text-muted)',
              borderRadius: 12,
              transition: 'all 0.25s',
              opacity: loading ? 0.7 : 1,
              boxShadow: key.trim() ? '0 4px 16px rgba(15,43,60,0.25)' : 'none',
            }}
          >
            {loading ? 'Checking...' : 'Log In'}
          </button>
        </form>
        {error && (
          <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: '0.85rem', fontWeight: 500 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { authed, email, authLoading, checkAuth } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => { checkAuth(); }, []);

  if (authLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-text">Verifying access...</div>
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onLogin={checkAuth} />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <span className="admin-email">{email}</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Overview
          </NavLink>
          <NavLink to="/admin/volunteers" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Volunteers
          </NavLink>
          <NavLink to="/admin/streets" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Streets
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-link admin-back-link">
            Back to App
          </NavLink>
          <a href="https://stephen8n.com" className="admin-nav-link admin-back-link">
            stephen8n.com
          </a>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
