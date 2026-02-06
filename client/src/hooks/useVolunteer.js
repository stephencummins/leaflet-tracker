import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTrackerStore from '../stores/useTrackerStore';
import { api } from '../api/client';

export function useVolunteer() {
  const volunteer = useTrackerStore(s => s.volunteer);
  const setVolunteer = useTrackerStore(s => s.setVolunteer);
  const navigate = useNavigate();

  useEffect(() => {
    if (volunteer) return;

    const saved = localStorage.getItem('volunteer_name');
    if (saved) {
      api.registerVolunteer(saved).then(setVolunteer).catch(() => {
        localStorage.removeItem('volunteer_name');
        navigate('/setup');
      });
    } else {
      navigate('/setup');
    }
  }, [volunteer, setVolunteer, navigate]);

  return volunteer;
}
