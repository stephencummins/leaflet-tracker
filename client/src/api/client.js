const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Stats
  getStats: () => request('/stats'),

  // Zones
  getZones: () => request('/zones'),
  getZone: (id) => request(`/zones/${id}`),

  // Volunteers
  registerVolunteer: (name) => request('/volunteers', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
  getVolunteers: () => request('/volunteers'),

  // Assignments
  assignStreet: (street_id, volunteer_id) => request('/assignments', {
    method: 'POST',
    body: JSON.stringify({ street_id, volunteer_id }),
  }),
  unassignStreet: (streetId) => request(`/assignments/${streetId}`, {
    method: 'DELETE',
  }),

  // Map
  getMapStreets: () => request('/streets/map'),
  getBoundaries: () => request('/boundaries'),

  // Walks
  getWalks: () => request('/walks'),
  getWalk: (id) => request(`/walks/${id}`),

  // Complete/uncomplete
  completeStreet: (streetId, volunteer_id) => request(`/streets/${streetId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ volunteer_id }),
  }),
  uncompleteStreet: (streetId) => request(`/streets/${streetId}/uncomplete`, {
    method: 'POST',
  }),

  // Canvassing
  getCanvassGroups: () => request('/canvassing/groups'),
  getCanvassGroup: (id) => request(`/canvassing/groups/${id}`),
  updateRoadStatus: (roadId, status, volunteer_id) => request(`/canvassing/roads/${roadId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, volunteer_id }),
  }),
  updateRoadTally: (roadId, data) => request(`/canvassing/roads/${roadId}/tally`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  addCasework: (roadId, data) => request(`/canvassing/roads/${roadId}/casework`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getCanvassingSummary: () => request('/canvassing/summary'),
  deleteCasework: (id) => request(`/canvassing/casework/${id}`, { method: 'DELETE' }),
};
