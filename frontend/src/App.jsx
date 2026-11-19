
import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  Users,
  BookOpen,
  Utensils,
  Bell,
} from "lucide-react";

import Alerts from "./pages/Alerts";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import OccupancyCard from "./components/OccupancyCard";
import Analytics from "./pages/Analytics";
import Events from "./pages/Events";

import {
  getZones,
  getEvents,
  getAlerts,
} from "./services/api";

function Dashboard() {
  const [zones, setZones] = useState({});
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState(null);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      const [zoneData, eventData, alertData] = await Promise.all([
        getZones(),
        getEvents(),
        getAlerts(),
      ]);

      console.log("ZONES API RESPONSE:", zoneData);
      console.log("LIBRARY OCCUPANCY:", zoneData?.Library?.occupancy);

      if (!zoneData || typeof zoneData !== "object") {
        throw new Error("Invalid zones API response");
      }

      setZones(zoneData);
      setEvents(Array.isArray(eventData) ? eventData : []);
      setAlerts(alertData);
      setError("");
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(err.message || "Unable to load backend data");
    }
  }

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(loadDashboard, 5000);

    return () => clearInterval(interval);
  }, []);

  const getOccupancy = (zone) => {
    const number = Number(zone?.occupancy ?? 0);
    return Number.isFinite(number) && number >= 0 ? number : 0;
  };

  const library = getOccupancy(zones.Library);
  const canteen = getOccupancy(zones.Canteen);
  const lab = getOccupancy(zones.Lab);

  const capacities = {
    Library: 300,
    Canteen: 250,
    Lab: 100,
  };

  const uniqueStudents = new Set(
    events
      .map((event) => event.student_id)
      .filter(Boolean)
  ).size;

  const occupancyData = [
    { location: "Library", current: library },
    { location: "Canteen", current: canteen },
    { location: "Lab", current: lab },
  ];

  const alertList = Array.isArray(alerts)
    ? alerts
    : alerts
      ? [{ id: 1, type: "System Alert", message: String(alerts) }]
      : [];

  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, Admin</h1>
          <p>Here's what's happening across campus today.</p>
        </div>

        <div className="system-online">
          <span></span>
          System Online
        </div>
      </div>

      {error && (
        <p style={{ color: "red" }}>
          Backend connection error: {error}
        </p>
      )}

      <div className="stats-grid">
        <StatCard
          icon={<Users size={21} />}
          title="Students Tracked"
          value={uniqueStudents}
          subtitle="Unique students in retrieved events"
        />

        <StatCard
          icon={<BookOpen size={21} />}
          title="Library Occupancy"
          value={`${library}/${capacities.Library}`}
          subtitle={`${Math.round(
            (library / capacities.Library) * 100
          )}% capacity`}
        />

        <StatCard
          icon={<Utensils size={21} />}
          title="Canteen Occupancy"
          value={`${canteen}/${capacities.Canteen}`}
          subtitle={`${Math.round(
            (canteen / capacities.Canteen) * 100
          )}% capacity`}
        />

        <StatCard
          icon={<Bell size={21} />}
          title="Active Alerts"
          value={alertList.length}
          subtitle="Alerts returned by backend"
        />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Campus Occupancy</h2>
              <p>Current occupancy across campus locations</p>
            </div>
          </div>

          <div className="occupancy-list">
            {occupancyData.map((item) => (
              <OccupancyCard
                key={item.location}
                location={item.location}
                current={item.current}
                capacity={capacities[item.location]}
              />
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Active Alerts</h2>
              <p>Events requiring attention</p>
            </div>
          </div>

          <div className="alert-list">
            {alertList.length === 0 ? (
              <p>No active alerts.</p>
            ) : (
              alertList.map((alert, index) => (
                <div className="alert-item" key={alert.id ?? index}>
                  <div className="alert-dot"></div>

                  <div>
                    <strong>
                      {alert.type ?? "System Alert"}
                    </strong>
                    <p>{alert.location ?? "Campus"}</p>
                    <span>
                      {alert.message ?? String(alert)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h2>Recent Events</h2>
            <p>Latest events from PostgreSQL</p>
          </div>
        </div>

        <div className="event-list">
          {events.slice(0, 10).map((event, index) => (
            <div
              className="event-item"
              key={event.event_id ?? event.id ?? index}
            >
              <div className="event-indicator"></div>

              <div className="event-info">
                <strong>
                  {event.event_type === "check_in"
                    ? "Campus Entry"
                    : "Campus Exit"}
                </strong>

                <span>
                  {event.student_id} - {event.zone}
                </span>
              </div>

              <time>
                {new Date(event.timestamp).toLocaleString()}
              </time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AppLayout() {
  return (
    <>
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/events" element={<Events />} />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
