const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function getZones() {
  const response = await fetch(`${API_BASE_URL}/api/zones`);

  if (!response.ok) {
    throw new Error("Failed to fetch zones");
  }

  return response.json();
}

export async function getAlerts() {
  const response = await fetch(`${API_BASE_URL}/api/alerts`);

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return response.json();
}

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events`);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}