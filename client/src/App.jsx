import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import NavBar from './components/layout/NavBar';
import Dashboard from './pages/Dashboard';
import ZoneList from './pages/ZoneList';
import ZoneView from './pages/ZoneView';
import Leaderboard from './pages/Leaderboard';
import MapView from './pages/MapView';
import HelpGuide from './pages/HelpGuide';
import VolunteerSetup from './pages/VolunteerSetup';
import CelebrationOverlay from './components/celebrations/CelebrationOverlay';
import useTrackerStore from './stores/useTrackerStore';

export default function App() {
  const volunteer = useTrackerStore(s => s.volunteer);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/setup" element={<VolunteerSetup />} />
        <Route path="/" element={volunteer ? <Dashboard /> : <Navigate to="/setup" />} />
        <Route path="/zones" element={volunteer ? <ZoneList /> : <Navigate to="/setup" />} />
        <Route path="/zones/:zoneId" element={volunteer ? <ZoneView /> : <Navigate to="/setup" />} />
        <Route path="/leaderboard" element={volunteer ? <Leaderboard /> : <Navigate to="/setup" />} />
        <Route path="/map" element={volunteer ? <MapView /> : <Navigate to="/setup" />} />
        <Route path="/help" element={<HelpGuide />} />
      </Routes>
      {volunteer && <NavBar />}
      <CelebrationOverlay />
    </>
  );
}
