import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import ZoneCard from "./components/ZoneCard";
import DensityChart from "./components/DensityChart";
import AlertsPanel from "./components/AlertsPanel";
import LiveEvents from "./components/LiveEvents";

import { connectWebSocket } from "./services/websocket";

function App() {
  const [zones, setZones] = useState({
    Library: null,
    Canteen: null,
    Lab: null,
  });

  useEffect(() => {
    const socket = connectWebSocket((data) => {
      setZones(data);
    });

    return () => {
      socket.close();
    };
  }, []);

  const zoneList = ["Library", "Canteen", "Lab"];

  return (
    <div className="app">

      <div className="dashboard-shell">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <div className="sidebar-brand">
            <div className="sidebar-logo">CP</div>

            <div>
              <h2>Campus Pulse</h2>
              <span>Monitoring System</span>
            </div>
          </div>

          <nav className="sidebar-nav">

            <div className="nav-section-title">
              MAIN
            </div>

            <div className="nav-item active">
              <span className="nav-icon">▦</span>
              <span>Dashboard</span>
            </div>

            <div className="nav-item">
              <span className="nav-icon">◉</span>
              <span>Live Monitoring</span>
            </div>

            <div className="nav-item">
              <span className="nav-icon">⚠</span>
              <span>Alerts</span>
            </div>

            <div className="nav-section-title">
              DATA
            </div>

            <div className="nav-item">
              <span className="nav-icon">▤</span>
              <span>Events</span>
            </div>

            <div className="nav-item">
              <span className="nav-icon">◫</span>
              <span>Analytics</span>
            </div>

          </nav>

          <div className="sidebar-bottom">

            <div className="connection-card">
              <span className="connection-dot"></span>

              <div>
                <strong>System Online</strong>
                <small>Real-time connection active</small>
              </div>
            </div>

            <div className="sidebar-footer">
              Campus Pulse © 2026
            </div>

          </div>

        </aside>

        {/* MAIN AREA */}
        <div className="main-area">

          <Header />

          <main className="dashboard">

            {/* PAGE TITLE */}
            <section className="page-heading">

              <div>
                <span className="eyebrow">CAMPUS OVERVIEW</span>

                <h1>Campus Dashboard</h1>

                <p>
                  Monitor campus activity, zone density and alerts in real time.
                </p>
              </div>

              <div className="dashboard-status">
                <span className="status-dot"></span>
                LIVE MONITORING
              </div>

            </section>

            {/* SUMMARY */}
            <SummaryCards zones={zones} />

            {/* ZONES */}
            <section className="section-heading">
              <div>
                <h2>Zone Monitoring</h2>
                <p>Current activity across monitored campus zones</p>
              </div>

              <span className="zone-count">
                3 ZONES
              </span>
            </section>

            <section className="zone-grid">

              {zoneList.map((zoneName) => {

                const zone = zones[zoneName];

                return (
                  <ZoneCard
                    key={zoneName}
                    name={zoneName}
                    count={zone?.activity_count ?? 0}
                    status={zone?.alert?.severity ?? "NORMAL"}
                  />
                );
              })}

            </section>

            {/* CHART + ALERTS */}
            <section className="section-heading analytics-heading">

              <div>
                <h2>Campus Analytics</h2>
                <p>Activity trends and real-time alerts</p>
              </div>

            </section>

            <section className="content-grid">

              <DensityChart />

              <AlertsPanel zones={zones} />

            </section>

            {/* EVENTS */}
            <LiveEvents zones={zones} />

          </main>

        </div>

      </div>

    </div>
  );
}

export default App;