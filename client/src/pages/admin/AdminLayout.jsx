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
          <NavLink to="/admin/canvassing" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            Canvassing
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
