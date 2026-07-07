const API_BASE = "/api/capsules";

async function handleResponse(res, fallbackMessage) {
  if (!res.ok) {
    let message = fallbackMessage;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON - keep fallback
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function fetchCapsules() {
  const res = await fetch(API_BASE);
  return handleResponse(res, "Couldn't load capsules. Is the server running?");
}

export async function createCapsule(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Couldn't save capsule. Try again.");
}

export async function deleteCapsule(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  return handleResponse(res, "Couldn't delete capsule. Try again.");
}
