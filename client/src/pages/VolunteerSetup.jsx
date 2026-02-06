import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTrackerStore from '../stores/useTrackerStore';
import { api } from '../api/client';

export default function VolunteerSetup() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setVolunteer = useTrackerStore(s => s.setVolunteer);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const volunteer = await api.registerVolunteer(name.trim());
      localStorage.setItem('volunteer_name', name.trim());
      setVolunteer(volunteer);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--cyan-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 160,
        height: 160,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--amber-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 380,
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo mark */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '2rem',
          boxShadow: '0 8px 32px rgba(15,43,60,0.25)',
          animation: 'pop 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both',
        }}>
          📋
        </div>

        <h1 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--navy)',
          marginBottom: 8,
          letterSpacing: '-0.04em',
          animation: 'fadeInUp 0.5s ease 0.1s both',
        }}>
          Leaflet Tracker
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: 32,
          lineHeight: 1.6,
          fontSize: '0.95rem',
          animation: 'fadeInUp 0.5s ease 0.2s both',
        }}>
          Help us deliver leaflets to{' '}
          <strong style={{ color: 'var(--amber)', fontWeight: 700 }}>4,439 houses</strong>{' '}
          across the ward. Enter your name to join the campaign.
        </p>

        <form onSubmit={handleSubmit} style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            style={{
              width: '100%',
              padding: '16px 18px',
              fontSize: '1.05rem',
              border: '2px solid var(--border)',
              borderRadius: 14,
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
            disabled={!name.trim() || loading}
            style={{
              width: '100%',
              marginTop: 14,
              padding: '16px 24px',
              fontSize: '1.05rem',
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: 'white',
              background: name.trim()
                ? 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)'
                : 'var(--text-muted)',
              borderRadius: 14,
              transition: 'all 0.25s',
              opacity: loading ? 0.7 : 1,
              boxShadow: name.trim() ? '0 4px 16px rgba(15,43,60,0.25)' : 'none',
              letterSpacing: '-0.01em',
            }}
          >
            {loading ? 'Joining...' : "Let's Go"}
          </button>
        </form>

        {error && (
          <p style={{ color: 'var(--danger)', marginTop: 14, fontSize: '0.9rem', fontWeight: 500 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
