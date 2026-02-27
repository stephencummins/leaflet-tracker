import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAdminStore from '../../stores/useAdminStore';

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
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://auth.stephen8n.com/login?redirect=${returnUrl}`;
    return (
      <div className="admin-loading">
        <div className="admin-loading-text">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <NavLink to="/" className="admin-logo-link">
            <img src="/roadie-logo.png" alt="Roadie" className="admin-logo" />
            <h2>Admin Panel</h2>
          </NavLink>
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
          <NavLink to="/admin/walks" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Walks
          </NavLink>
          <NavLink to="/admin/candidates" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Candidates
          </NavLink>
          <NavLink to="/admin/map" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Map
          </NavLink>
          <NavLink to="/admin/poster-boards" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Poster Boards
          </NavLink>
          <NavLink to="/admin/canvassers" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Canvassers
          </NavLink>
          <NavLink to="/admin/canvassing" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Canvassing
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Help
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <a href="https://stephen8n.com" className="admin-nav-link admin-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6, verticalAlign: '-2px' }}>
              <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor"/>
            </svg>
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
