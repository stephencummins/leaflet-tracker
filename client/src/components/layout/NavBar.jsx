import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', iconActive: '📊', iconInactive: '📊' },
  { to: '/zones', label: 'Zones', iconActive: '🗺️', iconInactive: '🗺️' },
  { to: '/map', label: 'Map', iconActive: '📍', iconInactive: '📍' },
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
      background: 'var(--navy)',
      backgroundImage: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%)',
      borderTop: '3px solid var(--cyan)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 20px rgba(27,67,50,0.2)',
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
            gap: 4,
            textDecoration: 'none',
            color: isActive ? 'var(--cyan)' : 'rgba(245,240,230,0.6)',
            fontWeight: isActive ? 700 : 500,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            minWidth: 72,
            padding: '10px 0',
            transition: 'all 0.2s',
            position: 'relative',
          })}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: -3,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 32,
                  height: 3,
                  background: 'var(--cyan)',
                  boxShadow: '0 0 8px rgba(212,160,60,0.5)',
                }} />
              )}
              <span style={{
                fontSize: '1.4rem',
                transition: 'transform 0.2s',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
                filter: isActive ? 'none' : 'grayscale(0.3)',
              }}>
                {isActive ? item.iconActive : item.iconInactive}
              </span>
              <span>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
