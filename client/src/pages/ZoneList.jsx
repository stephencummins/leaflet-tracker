import { useVolunteer } from '../hooks/useVolunteer';
import { usePolling } from '../hooks/usePolling';
import useTrackerStore from '../stores/useTrackerStore';
import ZoneCard from '../components/dashboard/ZoneCard';

export default function ZoneList() {
  useVolunteer();
  const zones = useTrackerStore(s => s.zones);
  const loadZones = useTrackerStore(s => s.loadZones);

  usePolling(loadZones, 10000);

  return (
    <div className="page">
      <h1 className="page-title">Zones</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {zones.map(zone => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
}
