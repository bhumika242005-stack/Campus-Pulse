import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Users, BookOpen, Utensils, Bell } from "lucide-react";

import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import OccupancyCard from "./components/OccupancyCard";

import {
  dashboardStats,
  occupancyData,
  recentEvents,
  alerts,
} from "./data/mockData";

function Dashboard() {
  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, Admin</h1>
          <p>
            Here's what's happening across campus today.
          </p>
        </div>

        <div className="system-online">
          <span></span>
          System Online
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<Users size={21} />}
          title="Total Students"
          value={dashboardStats.totalStudents}
          subtitle="+8.2% from yesterday"
        />

        <StatCard
          icon={<BookOpen size={21} />}
          title="Library Occupancy"
          value={`${dashboardStats.libraryOccupancy}/${dashboardStats.libraryCapacity}`}
          subtitle="79% capacity"
        />

        <StatCard
          icon={<Utensils size={21} />}
          title="Canteen Occupancy"
          value={`${dashboardStats.canteenOccupancy}/${dashboardStats.canteenCapacity}`}
          subtitle="61% capacity"
        />

        <StatCard
          icon={<Bell size={21} />}
          title="Active Alerts"
          value={dashboardStats.activeAlerts}
          subtitle="Requires attention"
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
                capacity={item.capacity}
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
            {alerts.map((alert) => (
              <div className="alert-item" key={alert.id}>
                <div className="alert-dot"></div>

                <div>
                  <strong>{alert.type}</strong>
                  <p>{alert.location}</p>
                  <span>{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h2>Recent Events</h2>
            <p>Latest campus activity</p>
          </div>
        </div>

        <div className="event-list">
          {recentEvents.map((event) => (
            <div className="event-item" key={event.id}>
              <div className="event-indicator"></div>

              <div className="event-info">
                <strong>{event.type}</strong>
                <span>{event.location}</span>
              </div>

              <time>{event.time}</time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Analytics() {
  return (
    <div className="page">
      <h1>Analytics</h1>
      <p>Campus analytics will appear here.</p>
    </div>
  );
}

function Alerts() {
  return (
    <div className="page">
      <h1>Alerts</h1>
      <p>Campus alerts will appear here.</p>
    </div>
  );
}

function Events() {
  return (
    <div className="page">
      <h1>Events</h1>
      <p>Campus events will appear here.</p>
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