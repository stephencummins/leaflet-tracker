import { useNavigate } from 'react-router-dom';
import useTrackerStore from '../../stores/useTrackerStore';

export default function Header() {
  const volunteer = useTrackerStore(s => s.volunteer);
  const navigate = useNavigate();

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'var(--navy)',
      backgroundImage: 'url(/header_banner.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center 40%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '3px solid var(--cyan)',
      boxShadow: '0 4px 20px rgba(27,67,50,0.3)',
    }}>
      {/* Semi-transparent overlay for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(27,67,50,0.85) 0%, rgba(27,67,50,0.6) 50%, rgba(27,67,50,0.85) 100%)',
        pointerEvents: 'none',
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
        {/* Art Deco style icon */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 4,
          background: 'var(--cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          boxShadow: '0 2px 8px rgba(212,160,60,0.4)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}>
          📋
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#F5F0E6',
            fontWeight: 700,
            fontSize: '1.2rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            Leaflet Tracker
          </span>
          <span style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            color: 'var(--cyan)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            Campaign Companion
          </span>
        </div>
      </div>
      {volunteer && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 4,
            background: 'var(--cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 700,
            fontFamily: "'Playfair Display', Georgia, serif",
            color: 'var(--navy-dark)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}>
            {volunteer.name.charAt(0).toUpperCase()}
          </div>
          <span style={{
            color: '#F5F0E6',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: "'Libre Baskerville', Georgia, serif",
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}>
            {volunteer.name}
          </span>
          <button
            onClick={() => navigate('/help')}
            style={{
              width: 28,
              height: 28,
              borderRadius: 4,
              background: 'rgba(245,240,230,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: "'Playfair Display', Georgia, serif",
              color: 'var(--cyan)',
              border: '1px solid rgba(212,160,60,0.3)',
              marginLeft: 2,
            }}
            title="Help guide"
          >
            ?
          </button>
          <a
            href="/admin"
            style={{
              width: 28,
              height: 28,
              borderRadius: 4,
              background: 'rgba(245,240,230,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              color: 'rgba(212,160,60,0.4)',
              border: '1px solid rgba(212,160,60,0.15)',
              textDecoration: 'none',
            }}
            title="Admin"
          >
            &#9881;
          </a>
        </div>
      )}
    </header>
  );
}
