import { create } from 'zustand';
import { api } from '../api/client';

const useTrackerStore = create((set, get) => ({
  // Volunteer
  volunteer: null,
  setVolunteer: (v) => set({ volunteer: v }),

  // Dashboard stats
  stats: null,
  loadStats: async () => {
    const stats = await api.getStats();
    set({ stats });
  },

  // Zones list
  zones: [],
  loadZones: async () => {
    const zones = await api.getZones();
    set({ zones });
  },

  // Active zone detail
  activeZone: null,
  loadZone: async (zoneId) => {
    const zone = await api.getZone(zoneId);
    set({ activeZone: zone });
  },

  // Leaderboard
  leaderboard: [],
  loadLeaderboard: async () => {
    const leaderboard = await api.getVolunteers();
    set({ leaderboard });
  },

  // Map streets
  mapStreets: [],
  loadMapStreets: async () => {
    const mapStreets = await api.getMapStreets();
    set({ mapStreets });
  },

  // Boundaries
  boundaries: null,
  loadBoundaries: async () => {
    try {
      const boundaries = await api.getBoundaries();
      set({ boundaries });
    } catch {
      // boundaries.json may not exist yet
    }
  },

  // Walks
  walks: [],
  activeWalk: null,
  loadWalks: async () => {
    const walks = await api.getWalks();
    set({ walks });
  },
  loadWalk: async (id) => {
    const walk = await api.getWalk(id);
    set({ activeWalk: walk });
  },

  // Actions
  completeStreet: async (streetId) => {
    const { volunteer } = get();
    if (!volunteer) return null;
    const result = await api.completeStreet(streetId, volunteer.id);
    // Refresh data
    get().loadStats();
    if (get().activeZone) get().loadZone(get().activeZone.id);
    return result;
  },

  uncompleteStreet: async (streetId) => {
    await api.uncompleteStreet(streetId);
    get().loadStats();
    if (get().activeZone) get().loadZone(get().activeZone.id);
  },

  assignStreet: async (streetId) => {
    const { volunteer } = get();
    if (!volunteer) return;
    await api.assignStreet(streetId, volunteer.id);
    if (get().activeZone) get().loadZone(get().activeZone.id);
  },

  unassignStreet: async (streetId) => {
    await api.unassignStreet(streetId);
    if (get().activeZone) get().loadZone(get().activeZone.id);
  },

  // Celebrations
  pendingCelebrations: [],
  addCelebration: (celebration) => set(s => ({
    pendingCelebrations: [...s.pendingCelebrations, celebration],
  })),
  clearCelebration: () => set(s => ({
    pendingCelebrations: s.pendingCelebrations.slice(1),
  })),

  // Canvassing
  canvassGroups: [],
  activeCanvassGroup: null,
  loadCanvassGroups: async () => {
    const groups = await api.getCanvassGroups();
    set({ canvassGroups: groups });
  },
  loadCanvassGroup: async (id) => {
    const group = await api.getCanvassGroup(id);
    set({ activeCanvassGroup: group });
  },
  updateRoadStatus: async (roadId, status) => {
    const { volunteer } = get();
    await api.updateRoadStatus(roadId, status, volunteer?.id);
    const { activeCanvassGroup } = get();
    if (activeCanvassGroup) {
      await get().loadCanvassGroup(activeCanvassGroup.id);
    }
    await get().loadCanvassGroups();
  },
  updateRoadTally: async (roadId, data) => {
    const { volunteer } = get();
    await api.updateRoadTally(roadId, { ...data, volunteer_id: volunteer?.id });
    const { activeCanvassGroup } = get();
    if (activeCanvassGroup) {
      await get().loadCanvassGroup(activeCanvassGroup.id);
    }
  },
  addCasework: async (roadId, data) => {
    const { volunteer } = get();
    await api.addCasework(roadId, { ...data, volunteer_id: volunteer?.id });
    const { activeCanvassGroup } = get();
    if (activeCanvassGroup) {
      await get().loadCanvassGroup(activeCanvassGroup.id);
    }
  },
}));

export default useTrackerStore;
