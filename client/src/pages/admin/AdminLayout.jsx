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
    return (
      <div className="admin-loading">
        <div className="admin-denied">
          <h2>Access Denied</h2>
          <p>You are not authorized to view this page.</p>
          <button className="admin-btn" onClick={() => navigate('/')}>Back to App</button>
        </div>
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
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-link admin-back-link">
            Back to App
          </NavLink>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
