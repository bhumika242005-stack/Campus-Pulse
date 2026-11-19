
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getEvents, getZones } from "../services/api";

function Analytics() {
  const [events, setEvents] = useState([]);
  const [zones, setZones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchAnalytics() {
      try {
        const [eventsData, zonesData] = await Promise.all([
          getEvents(),
          getZones(),
        ]);

        if (!Array.isArray(eventsData)) {
          throw new Error("Invalid events response");
        }

        if (!active) return;

        setEvents(eventsData);
        setZones(zonesData);
        setError("");
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load analytics");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const trafficData = Array.from({ length: 24 }, (_, hour) => {
    const count = events.filter((event) => {
      const date = new Date(event.timestamp);
      return !Number.isNaN(date.getTime()) && date.getHours() === hour;
    }).length;

    return {
      time: `${String(hour).padStart(2, "0")}:00`,
      events: count,
    };
  });

  const locationData = zones
    ? Object.entries(zones)
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([location, value]) => ({
          location,
          occupancy: Number(value),
        }))
        .filter((item) => Number.isFinite(item.occupancy))
    : [];

  if (loading) {
    return <div className="page"><h2>Loading analytics...</h2></div>;
  }

  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p>Monitor campus activity and occupancy trends.</p>
        </div>
      </div>

      {error && <p role="alert">Unable to load analytics: {error}</p>}

      <div className="analytics-grid">
        <section className="dashboard-card chart-card">
          <div className="card-header">
            <h2>Campus Traffic</h2>
            <p>Number of recorded events by hour (not active student count)</p>
          </div>

          {events.length === 0 ? (
            <p>No event data available.</p>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="events"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="dashboard-card chart-card">
          <div className="card-header">
            <h2>Location Occupancy</h2>
            <p>Values reported by the backend</p>
          </div>

          {locationData.length === 0 ? (
            <p>Occupancy data unavailable. Waiting for valid backend values.</p>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="occupancy"
                    fill="#2563eb"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Analytics;
