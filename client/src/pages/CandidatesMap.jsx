import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVolunteer } from '../hooks/useVolunteer';

// Clickable regions as % of image dimensions (polygon points)
// Image natural size: 1553 x 731
const W = 1553;
const H = 731;

const WARD_REGIONS = [
  {
    ward: 'Eastwood Park',
    points: [[55,76],[97,14],[285,49],[282,89],[252,97],[273,146],[144,136]],
  },
  {
    ward: 'St Laurence',
    points: [[289,56],[340,47],[339,68],[536,102],[561,209],[555,215],[383,172],[339,156],[277,148],[252,99],[285,88]],
  },
  {
    ward: 'Belfairs',
    points: [[51,79],[155,139],[254,152],[225,178],[156,303],[214,304],[144,296],[152,279],[70,249],[55,213],[74,181]],
  },
  {
    ward: 'Blenheim Park',
    points: [[260,153],[335,152],[318,242],[389,246],[388,265],[361,266],[363,319],[334,324],[218,305],[222,185]],
  },
  {
    ward: 'Prittlewell',
    points: [[383,262],[390,245],[322,241],[311,186],[336,153],[393,176],[473,186],[552,214],[562,206],[583,271],[496,323],[488,276],[454,267]],
  },
  {
    ward: "St Luke's",
    points: [[535,98],[631,144],[759,168],[781,194],[749,250],[762,346],[728,357],[722,335],[696,336],[648,271],[605,265],[586,270]],
  },
  {
    ward: 'Kursaal',
    points: [[657,571],[658,611],[725,575],[725,382],[747,379],[740,356],[727,359],[720,335],[639,341],[632,370]],
  },
  {
    ward: 'Southchurch',
    points: [[763,170],[860,184],[864,208],[975,239],[994,327],[977,392],[750,379],[742,357],[764,349],[745,251],[782,194]],
  },
  {
    ward: 'West Shoebury',
    points: [[976,240],[1084,223],[1089,286],[1031,307],[1055,405],[1084,416],[1018,666],[930,665],[984,695],[973,631]],
  },
  {
    ward: 'Shoeburyness',
    points: [[1090,284],[1032,309],[1057,406],[1088,421],[1032,553],[1072,642],[1037,686],[1105,721],[1331,702],[1512,612],[1468,672],[1494,541],[1276,312],[1254,348],[1104,329]],
  },
  {
    ward: 'Leigh',
    points: [[171,304],[294,315],[320,399],[279,512],[119,375],[124,540],[174,360]],
  },
  {
    ward: 'Chalkwell',
    points: [[276,512],[323,398],[293,317],[467,343],[435,425],[439,527],[355,505]],
  },
  {
    ward: 'Milton',
    points: [[438,527],[653,567],[627,374],[521,380],[469,346],[437,421]],
  },
  {
    ward: 'West Leigh',
    points: [[53,215],[70,250],[151,280],[144,297],[166,308],[174,358],[121,373],[114,511],[70,512],[24,492],[14,431],[8,321],[23,278],[18,253]],
  },
  {
    ward: 'Victoria',
    points: [[603,263],[614,277],[654,274],[663,336],[639,339],[640,371],[521,379],[463,339],[519,307]],
  },
  {
    ward: 'Thorpe',
    points: [[724,383],[973,397],[979,485],[971,635],[892,687],[727,604]],
  },
  {
    ward: 'Westborough',
    points: [[364,268],[457,267],[488,277],[498,325],[453,341],[363,324]],
  },
];

function toPercent(points) {
  return points.map(([x, y]) => `${(x / W) * 100}% ${(y / H) * 100}%`).join(', ');
}

function getCenter(points) {
  const cx = points.reduce((s, p) => s + p[0], 0) / points.length;
  const cy = points.reduce((s, p) => s + p[1], 0) / points.length;
  return [(cx / W) * 100, (cy / H) * 100];
}

export default function CandidatesMap() {
  useVolunteer();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(() => searchParams.get('ward'));
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [candidates, setCandidates] = useState({});

  useEffect(() => {
    fetch('/api/candidates').then(r => r.json()).then(rows => {
      const map = {};
      for (const c of rows) {
        map[c.ward] = { name: c.candidate_name, phone: c.phone || '', paper: !!c.is_paper };
      }
      setCandidates(map);
    });
  }, []);

  const handleWardClick = (ward, e) => {
    if (selected === ward) {
      setSelected(null);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPopupPos({ x, y });
    setSelected(ward);
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (selected && containerRef.current && !e.target.closest('.ward-popup')) {
        setSelected(null);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, [selected]);

  const candidate = selected ? candidates[selected] : null;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <h1 className="page-title">Our Candidates</h1>

      <div className="card" style={{ padding: '14px 18px', marginBottom: 16 }}>
        <p style={{
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          Tap a ward to see the Liberal Democrat candidate standing on <strong>7 May 2026</strong>.
        </p>
      </div>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          border: '2px solid var(--border-light)',
          background: '#fff',
        }}
      >
        <img
          src="/ward-map.png"
          alt="Southend-on-Sea Ward Map"
          style={{ width: '100%', display: 'block' }}
          draggable={false}
        />

        {WARD_REGIONS.map(({ ward, points }) => (
          <div
            key={ward}
            onClick={(e) => { e.stopPropagation(); handleWardClick(ward, e); }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              clipPath: `polygon(${toPercent(points)})`,
              background: selected === ward
                ? 'rgba(27, 67, 50, 0.25)'
                : 'transparent',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (selected !== ward) e.currentTarget.style.background = 'rgba(212, 160, 60, 0.15)';
            }}
            onMouseLeave={(e) => {
              if (selected !== ward) e.currentTarget.style.background = 'transparent';
            }}
          />
        ))}

        {selected && candidate && (
          <div
            className="ward-popup"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: Math.min(popupPos.x, containerRef.current?.offsetWidth - 240 || popupPos.x),
              top: popupPos.y + 8,
              background: 'var(--card)',
              border: '2px solid var(--navy)',
              borderRadius: 10,
              padding: '16px 20px',
              minWidth: 210,
              zIndex: 100,
              boxShadow: '0 8px 32px rgba(27,67,50,0.25)',
              animation: 'fadeInUp 0.2s ease',
              pointerEvents: 'auto',
            }}
          >
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 4,
            }}>
              {selected}
            </div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--navy)',
              marginBottom: 8,
              lineHeight: 1.3,
            }}>
              {candidate.name}
            </div>
            <a
              href={`tel:${candidate.phone.replace(/\s/g, '')}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {candidate.phone}
            </a>
            <div style={{
              marginTop: 10,
              paddingTop: 8,
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}>
              {candidate.paper ? 'Paper candidate' : 'Candidate'}
            </div>
          </div>
        )}
      </div>

      <div style={{
        marginTop: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 8,
      }}>
        {Object.entries(candidates).sort(([a], [b]) => a.localeCompare(b)).map(([ward, c]) => (
          <div
            key={ward}
            className="card"
            onClick={() => {
              setSelected(ward);
              const region = WARD_REGIONS.find(r => r.ward === ward);
              if (region && containerRef.current) {
                const [cx, cy] = getCenter(region.points);
                setPopupPos({
                  x: (cx / 100) * containerRef.current.offsetWidth,
                  y: (cy / 100) * containerRef.current.offsetHeight,
                });
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: selected === ward ? '2px solid var(--navy)' : '2px solid var(--border-light)',
              background: selected === ward ? 'rgba(27, 67, 50, 0.05)' : 'var(--card)',
            }}
          >
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 2,
            }}>
              {ward}
            </div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--navy)',
            }}>
              {c.name}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{
        padding: '14px 18px',
        marginTop: 16,
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontStyle: 'italic',
      }}>
        Promoted by Paul Boulton on behalf of Stephen Cummins (Liberal Democrats), both at 379 Victoria Avenue, Southend-on-Sea, SS2 6NJ.
      </div>
    </div>
  );
}
