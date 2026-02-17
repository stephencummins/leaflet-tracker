const BASE = '/api/admin';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(`${BASE}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  authCheck: () => request('/auth-check'),
  getOverview: () => request('/overview'),

  // Volunteers
  getVolunteers: () => request('/volunteers'),
  getVolunteer: (id) => request(`/volunteers/${id}`),
  updateVolunteer: (id, data) => request(`/volunteers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteVolunteer: (id) => request(`/volunteers/${id}`, { method: 'DELETE' }),

  // Streets
  getStreets: (zone_id) => request(`/streets${zone_id ? `?zone_id=${zone_id}` : ''}`),
  updateStreet: (id, data) => request(`/streets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  completeStreet: (id, volunteer_id) => request(`/streets/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify({ volunteer_id }),
  }),
  uncompleteStreet: (id) => request(`/streets/${id}/uncomplete`, { method: 'POST' }),
  assignStreet: (id, volunteer_id) => request(`/streets/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify({ volunteer_id }),
  }),
  unassignStreet: (id) => request(`/streets/${id}/assign`, { method: 'DELETE' }),

  // Walks
  getWalks: () => request('/walks'),
  createWalk: (data) => request('/walks', { method: 'POST', body: JSON.stringify(data) }),
  updateWalk: (id, data) => request(`/walks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWalk: (id) => request(`/walks/${id}`, { method: 'DELETE' }),
};
