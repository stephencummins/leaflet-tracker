import { NavLink } from 'react-router-dom';

const Icons = {
  Dashboard: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="13" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  ),
  Zones: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h8v8H3z" />
      <path d="M13 3h8v8h-8z" />
      <path d="M3 13h8v8H3z" />
      <path d="M13 13h8v8h-8z" />
    </svg>
  ),
  Walks: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="1.5" fill={color} stroke="none" />
      <path d="M9 9l3-2 3 2" />
      <path d="M12 7v5l-3 4" />
      <path d="M12 12l3 4" />
      <path d="M8 20l1.5-4" />
      <path d="M16 20l-1.5-4" />
    </svg>
  ),
  Help: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2.5-2.5 4" />
      <circle cx="12" cy="17.5" r="0.75" fill={color} stroke="none" />
    </svg>
  ),
  Map: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.69 2 6 4.69 6 8c0 4.5 6 13 6 13s6-8.5 6-13c0-3.31-2.69-6-6-6z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  ),
  Rankings: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'Dashboard' },
  { to: '/zones', label: 'Zones', icon: 'Zones' },
  { to: '/walks', label: 'Walks', icon: 'Walks' },
  { to: '/map', label: 'Map', icon: 'Map' },
  { to: '/leaderboard', label: 'Rankings', icon: 'Rankings' },
  { to: '/help', label: 'Help', icon: 'Help' },
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
      {NAV_ITEMS.map(item => {
        const Icon = Icons[item.icon];
        return (
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
              minWidth: 52,
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
                <div style={{
                  transition: 'transform 0.2s',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                }}>
                  <Icon color={isActive ? 'var(--cyan)' : 'rgba(245,240,230,0.6)'} />
                </div>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
