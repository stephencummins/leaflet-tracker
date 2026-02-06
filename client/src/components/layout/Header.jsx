import useTrackerStore from '../../stores/useTrackerStore';

export default function Header() {
  const volunteer = useTrackerStore(s => s.volunteer);

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 50%, var(--navy-mid) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '2px solid var(--cyan)',
      boxShadow: '0 2px 20px rgba(15,43,60,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber-light) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(232,145,58,0.3)',
        }}>
          📋
        </div>
        <span style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          color: 'white',
          fontWeight: 800,
          fontSize: '1.1rem',
          letterSpacing: '-0.03em',
        }}>
          Leaflet Tracker
        </span>
      </div>
      {volunteer && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--cyan) 0%, var(--cyan-light) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--navy-dark)',
          }}>
            {volunteer.name.charAt(0).toUpperCase()}
          </div>
          <span style={{
            color: 'var(--cyan-light)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            {volunteer.name}
          </span>
        </div>
      )}
    </header>
  );
}
