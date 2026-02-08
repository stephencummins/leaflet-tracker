import { create } from 'zustand';
import { adminApi } from '../api/adminClient';

const useAdminStore = create((set, get) => ({
  // Auth
  authed: false,
  email: null,
  authLoading: true,
  checkAuth: async () => {
    try {
      const { ok, email } = await adminApi.authCheck();
      set({ authed: ok, email, authLoading: false });
    } catch {
      set({ authed: false, email: null, authLoading: false });
    }
  },

  // Overview
  overview: null,
  loadOverview: async () => {
    const overview = await adminApi.getOverview();
    set({ overview });
  },

  // Volunteers
  volunteers: [],
  loadVolunteers: async () => {
    const volunteers = await adminApi.getVolunteers();
    set({ volunteers });
  },
  updateVolunteer: async (id, data) => {
    await adminApi.updateVolunteer(id, data);
    get().loadVolunteers();
  },
  deleteVolunteer: async (id) => {
    await adminApi.deleteVolunteer(id);
    get().loadVolunteers();
  },

  // Streets
  streets: [],
  zones: [],
  allVolunteers: [],
  selectedZone: '',
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  loadStreets: async (zone_id) => {
    const { streets, zones, volunteers } = await adminApi.getStreets(zone_id || undefined);
    set({ streets, zones, allVolunteers: volunteers });
  },
  updateStreet: async (id, data) => {
    await adminApi.updateStreet(id, data);
    get().loadStreets(get().selectedZone);
  },
  completeStreet: async (id, volunteer_id) => {
    await adminApi.completeStreet(id, volunteer_id);
    get().loadStreets(get().selectedZone);
  },
  uncompleteStreet: async (id) => {
    await adminApi.uncompleteStreet(id);
    get().loadStreets(get().selectedZone);
  },
  assignStreet: async (id, volunteer_id) => {
    await adminApi.assignStreet(id, volunteer_id);
    get().loadStreets(get().selectedZone);
  },
  unassignStreet: async (id) => {
    await adminApi.unassignStreet(id);
    get().loadStreets(get().selectedZone);
  },
}));

export default useAdminStore;
