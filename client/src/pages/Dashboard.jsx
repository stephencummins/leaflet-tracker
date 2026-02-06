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

      <h2 className="section-title">Zones</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {stats.zones.map(zone => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>

      <h2 className="section-title">Recent Activity</h2>
      <RecentActivity recent={stats.recent} />
    </div>
  );
}
