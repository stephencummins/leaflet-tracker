import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminStreets from './pages/admin/AdminStreets';
import AdminVolunteerDetail from './pages/admin/AdminVolunteerDetail';
import AdminWalks from './pages/admin/AdminWalks';
import AdminCandidates from './pages/admin/AdminCandidates';
import AdminProposers from './pages/admin/AdminProposers';
import AdminMap from './pages/admin/AdminMap';
import AdminPosterBoards from './pages/admin/AdminPosterBoards';
import AdminCanvassers from './pages/admin/AdminCanvassers';
import AdminCanvassing from './pages/admin/AdminCanvassing';
import AdminPostalVotes from './pages/admin/AdminPostalVotes';
import AdminExpenses from './pages/admin/AdminExpenses';
import AdminRounds from './pages/admin/AdminRounds';
import WalkList from './pages/WalkList';
import WalkView from './pages/WalkView';
import CanvassList from './pages/CanvassList';
import CanvassGroupView from "./pages/CanvassGroupView";
import CandidatesMap from "./pages/CandidatesMap";
import PublicMap from "./pages/PublicMap";

export default function App() {
  const volunteer = useTrackerStore(s => s.volunteer);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="volunteers/:id" element={<AdminVolunteerDetail />} />
          <Route path="streets" element={<AdminStreets />} />
          <Route path="walks" element={<AdminWalks />} />
          <Route path="rounds" element={<AdminRounds />} />
          <Route path="candidates" element={<AdminCandidates />} />
          <Route path="proposers" element={<AdminProposers />} />
          <Route path="postal-votes" element={<AdminPostalVotes />} />
          <Route path="expenses" element={<AdminExpenses />} />
          <Route path="map" element={<AdminMap />} />
          <Route path="poster-boards" element={<AdminPosterBoards />} />
          <Route path="canvassers" element={<AdminCanvassers />} />
          <Route path="canvassing" element={<AdminCanvassing />} />
          <Route path="candidate-guide" element={<Navigate to="/help" replace />} />
          <Route path="agents-help" element={<Navigate to="/help" replace />} />
        </Route>
        <Route path="/setup" element={<VolunteerSetup />} />
        <Route path="/" element={volunteer ? <Dashboard /> : <Navigate to="/setup" />} />
        <Route path="/zones" element={volunteer ? <ZoneList /> : <Navigate to="/setup" />} />
        <Route path="/zones/:zoneId" element={volunteer ? <ZoneView /> : <Navigate to="/setup" />} />
        <Route path="/leaderboard" element={volunteer ? <Leaderboard /> : <Navigate to="/setup" />} />
        <Route path="/walks" element={volunteer ? <WalkList /> : <Navigate to="/setup" />} />
        <Route path="/walks/:walkId" element={<WalkView />} />
        <Route path="/map" element={volunteer ? <MapView /> : <Navigate to="/setup" />} />
        <Route path="/canvass" element={volunteer ? <CanvassList /> : <Navigate to="/setup" />} />
        <Route path="/canvass/:groupId" element={volunteer ? <CanvassGroupView /> : <Navigate to="/setup" />} />
        <Route path="/candidates" element={volunteer ? <CandidatesMap /> : <Navigate to="/setup" />} />
        <Route path="/wards" element={<CandidatesMap />} />
        <Route path="/sectors" element={<PublicMap />} />
        <Route path="/help" element={<HelpGuide />} />
      </Routes>
      {!isAdmin && volunteer && <NavBar />}
      {!isAdmin && <CelebrationOverlay />}
    </>
  );
}
