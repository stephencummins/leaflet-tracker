import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', iconActive: '📊', iconInactive: '📊' },
  { to: '/zones', label: 'Zones', iconActive: '🗺️', iconInactive: '🗺️' },
  { to: '/leaderboard', label: 'Rankings', iconActive: '🏅', iconInactive: '🏅' },
];

export default function NavBar() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--nav-height)',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            textDecoration: 'none',
            color: isActive ? 'var(--navy)' : 'var(--text-muted)',
            fontWeight: isActive ? 700 : 500,
            fontSize: '0.68rem',
            letterSpacing: '0.02em',
            minWidth: 72,
            padding: '8px 0',
            transition: 'all 0.2s',
            position: 'relative',
          })}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: -1,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  background: 'var(--amber)',
                }} />
              )}
              <span style={{
                fontSize: '1.3rem',
                transition: 'transform 0.2s',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}>
                {isActive ? item.iconActive : item.iconInactive}
              </span>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
