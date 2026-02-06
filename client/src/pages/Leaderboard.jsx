import { useVolunteer } from '../hooks/useVolunteer';
import { usePolling } from '../hooks/usePolling';
import useTrackerStore from '../stores/useTrackerStore';
import RankingTable from '../components/leaderboard/RankingTable';
import BadgeGrid from '../components/leaderboard/BadgeGrid';

export default function Leaderboard() {
  const volunteer = useVolunteer();
  const leaderboard = useTrackerStore(s => s.leaderboard);
  const loadLeaderboard = useTrackerStore(s => s.loadLeaderboard);

  usePolling(loadLeaderboard, 10000);

  // Find current volunteer's achievements
  const myEntry = leaderboard.find(v => v.id === volunteer?.id);

  return (
    <div className="page">
      <h1 className="page-title">Leaderboard</h1>
      <RankingTable volunteers={leaderboard} />

      {myEntry && (
        <>
          <h2 className="section-title">Your Achievements</h2>
          <BadgeGrid earned={myEntry.achievements} />
        </>
      )}

      {!myEntry && volunteer && (
        <div style={{
          textAlign: 'center',
          padding: 24,
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginTop: 16,
        }}>
          Complete your first street to appear on the leaderboard!
        </div>
      )}
    </div>
  );
}
