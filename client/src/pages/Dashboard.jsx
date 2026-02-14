import { useVolunteer } from '../hooks/useVolunteer';
import { usePolling } from '../hooks/usePolling';
import useTrackerStore from '../stores/useTrackerStore';
import WardProgressRing from '../components/dashboard/WardProgressRing';
import StatsRow from '../components/dashboard/StatsRow';
import ZoneCard from '../components/dashboard/ZoneCard';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function Dashboard() {
  useVolunteer();
  const stats = useTrackerStore(s => s.stats);
  const loadStats = useTrackerStore(s => s.loadStats);

  usePolling(loadStats, 10000);

  if (!stats) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div className="page">
      <WardProgressRing
        completed={stats.ward.completed_houses}
        total={stats.ward.total_houses}
      />

      <StatsRow stats={stats} />

      {Object.entries(
        stats.zones.reduce((acc, zone) => {
          const ward = zone.ward || 'Other';
          if (!acc[ward]) acc[ward] = [];
          acc[ward].push(zone);
          return acc;
        }, {})
      ).map(([ward, wardZones]) => (
        <div key={ward}>
          <h2 className="section-title">{ward}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {wardZones.map(zone => (
              <ZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        </div>
      ))}

      <h2 className="section-title">Recent Activity</h2>
      <RecentActivity recent={stats.recent} />
    </div>
  );
}
