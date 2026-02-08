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

  // Complete/uncomplete
  completeStreet: (streetId, volunteer_id) => request(`/streets/${streetId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ volunteer_id }),
  }),
  uncompleteStreet: (streetId) => request(`/streets/${streetId}/uncomplete`, {
    method: 'POST',
  }),
};
