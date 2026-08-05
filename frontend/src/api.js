const BASE = "/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  getOptions: () => fetch(`${BASE}/options`).then(handle),
  listTrails: () => fetch(`${BASE}/trails`).then(handle),
  getTrail: (id) => fetch(`${BASE}/trails/${id}`).then(handle),
  matchTrail: (id, profile, tripModifiers) =>
    fetch(`${BASE}/match/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, tripModifiers })
    }).then(handle),
  matchAll: (profile, tripModifiers) =>
    fetch(`${BASE}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, tripModifiers })
    }).then(handle)
};
