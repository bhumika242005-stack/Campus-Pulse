const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getDashboardData() {
  return apiRequest("/api/dashboard");
}

export async function getAnalyticsData() {
  return apiRequest("/api/analytics");
}

export async function getAlerts() {
  return apiRequest("/api/alerts");
}

export async function getEvents() {
  return apiRequest("/api/events");
}