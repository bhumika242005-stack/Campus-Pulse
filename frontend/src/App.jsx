import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import ZoneCard from "./components/ZoneCard";
import DensityChart from "./components/DensityChart";
import AlertsPanel from "./components/AlertsPanel";
import LiveEvents from "./components/LiveEvents";

import { connectWebSocket } from "./services/websocket";
import { getEvents } from "./services/api";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [zones, setZones] = useState({
    Library: null,
    Canteen: null,
    Lab: null,
  });

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");

  // =========================
  // LIVE WEBSOCKET DATA
  // =========================

  useEffect(() => {
    const socket = connectWebSocket((data) => {
      setZones(data);
    });

    return () => {
      socket.close();
    };
  }, []);

  // =========================
  // POSTGRESQL EVENTS
  // =========================

  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      try {
        const data = await getEvents();

        if (!mounted) return;

        setEvents(Array.isArray(data) ? data : []);
        setEventsError("");
      } catch (error) {
        console.error("Failed to load events:", error);

        if (!mounted) return;

        setEventsError(
          "Unable to load events from PostgreSQL."
        );
      } finally {
        if (mounted) {
          setEventsLoading(false);
        }
      }
    }

    loadEvents();

    const interval = setInterval(loadEvents, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const zoneList = [
    "Library",
    "Canteen",
    "Lab",
  ];

  // =========================
  // NAVIGATION
  // =========================

  const mainNavigation = [
    {
      name: "Dashboard",
      icon: "▦",
    },
    {
      name: "Live Monitoring",
      icon: "◉",
    },
    {
      name: "Alerts",
      icon: "⚠",
    },
  ];

  const dataNavigation = [
    {
      name: "Events",
      icon: "▤",
    },
    {
      name: "Analytics",
      icon: "◫",
    },
  ];

  // =========================
  // DASHBOARD
  // =========================

  function DashboardPage() {
    return (
      <>
        <section className="page-heading">
          <div>
            <span className="eyebrow">
              CAMPUS OVERVIEW
            </span>

            <h1>Campus Dashboard</h1>

            <p>
              Monitor campus activity, zone density
              and alerts in real time.
            </p>
          </div>

          <div className="dashboard-status">
            <span className="status-dot"></span>
            LIVE MONITORING
          </div>
        </section>

        <SummaryCards zones={zones} />

        <section className="section-heading">
          <div>
            <h2>Zone Monitoring</h2>

            <p>
              Current activity across monitored
              campus zones
            </p>
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
                count={
                  zone?.activity_count ?? 0
                }
                status={
                  zone?.alert?.severity ??
                  "NORMAL"
                }
              />
            );
          })}
        </section>

        <section className="section-heading analytics-heading">
          <div>
            <h2>Campus Analytics</h2>

            <p>
              Activity trends and real-time alerts
            </p>
          </div>
        </section>

        <section className="content-grid">
          <DensityChart />

          <AlertsPanel zones={zones} />
        </section>

        <LiveEvents zones={zones} />
      </>
    );
  }

  // =========================
  // LIVE MONITORING
  // =========================

  function LiveMonitoringPage() {
    return (
      <>
        <section className="page-heading">
          <div>
            <span className="eyebrow">
              REAL-TIME MONITORING
            </span>

            <h1>Live Monitoring</h1>

            <p>
              Live activity data received from the
              Campus Pulse processing pipeline.
            </p>
          </div>

          <div className="dashboard-status">
            <span className="status-dot"></span>
            LIVE
          </div>
        </section>

        <section className="zone-grid">
          {zoneList.map((zoneName) => {
            const zone = zones[zoneName];

            return (
              <ZoneCard
                key={zoneName}
                name={zoneName}
                count={
                  zone?.activity_count ?? 0
                }
                status={
                  zone?.alert?.severity ??
                  "NORMAL"
                }
              />
            );
          })}
        </section>

        <section className="content-grid">

          <div className="panel">
            <h2>Live System Status</h2>

            <div className="system-status-list">

              <div className="system-status-row">
                <span className="system-status-dot">
                  ●
                </span>

                <strong>
                  WebSocket
                </strong>

                <span>
                  Connected
                </span>
              </div>

              <div className="system-status-row">
                <span className="system-status-dot">
                  ●
                </span>

                <strong>
                  Redis
                </strong>

                <span>
                  Live data available
                </span>
              </div>

              <div className="system-status-row">
                <span className="system-status-dot">
                  ●
                </span>

                <strong>
                  PostgreSQL
                </strong>

                <span>
                  Historical events available
                </span>
              </div>

            </div>
          </div>

          <AlertsPanel zones={zones} />

        </section>
      </>
    );
  }

  // =========================
  // ALERTS
  // =========================

  function AlertsPage() {
    const alerts = Object.values(zones).filter(
      (zone) => zone?.alert
    );

    return (
      <>
        <section className="page-heading">
          <div>
            <span className="eyebrow">
              CAMPUS SAFETY
            </span>

            <h1>Alerts</h1>

            <p>
              Real-time alerts generated by the
              campus activity processing system.
            </p>
          </div>
        </section>

        <div className="panel alerts-page-panel">

          <div className="panel-header">
            <h2>Active Alerts</h2>

            <span className="event-count">
              {alerts.length} ALERTS
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="events-empty">
              No active alerts.
            </div>
          ) : (
            <div className="alerts-list">

              {alerts.map((zone) => (
                <div
                  className="alert"
                  key={zone.zone}
                >
                  <span className="alert-icon">
                    ⚠
                  </span>

                  <div>
                    <strong>
                      {zone.zone}
                    </strong>

                    <p>
                      {zone.alert.message}
                    </p>

                    <small>
                      Severity:{" "}
                      {zone.alert.severity}
                    </small>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </>
    );
  }

  // =========================
  // EVENTS
  // =========================

  function EventsPage() {
    return (
      <>
        <section className="page-heading">

          <div>
            <span className="eyebrow">
              HISTORICAL DATA
            </span>

            <h1>Events</h1>

            <p>
              Events retrieved from the Campus
              Pulse PostgreSQL database.
            </p>
          </div>

          <div className="dashboard-status">
            <span className="status-dot"></span>
            DATABASE CONNECTED
          </div>

        </section>

        <section className="panel events-page-panel">

          <div className="panel-header">

            <div>
              <h2>Recent Campus Events</h2>

              <p>
                Latest events processed by
                Campus Pulse
              </p>
            </div>

            <span className="event-count">
              {events.length} EVENTS
            </span>

          </div>

          {eventsLoading && (
            <div className="events-loading">
              Loading events...
            </div>
          )}

          {!eventsLoading &&
            eventsError && (
              <div className="events-empty">
                <strong>
                  Unable to load events
                </strong>

                <p>
                  {eventsError}
                </p>
              </div>
            )}

          {!eventsLoading &&
            !eventsError &&
            events.length === 0 && (
              <div className="events-empty">
                No events found in PostgreSQL.
              </div>
            )}

          {!eventsLoading &&
            !eventsError &&
            events.length > 0 && (
              <div className="events-table">

                <div className="events-table-header">
                  <span>TIME</span>
                  <span>STUDENT</span>
                  <span>ZONE</span>
                  <span>EVENT TYPE</span>
                </div>

                {events
                  .slice(0, 100)
                  .map((event) => (
                    <div
                      className="events-table-row"
                      key={
                        event.event_id ||
                        event.id
                      }
                    >

                      <span>
                        {event.timestamp
                          ? new Date(
                              event.timestamp
                            ).toLocaleString()
                          : "--"}
                      </span>

                      <strong>
                        {event.student_id ||
                          "--"}
                      </strong>

                      <span>
                        {event.zone || "--"}
                      </span>

                      <span className="event-type">
                        {event.event_type ||
                          "--"}
                      </span>

                    </div>
                  ))}

              </div>
            )}

        </section>
      </>
    );
  }

  // =========================
  // ANALYTICS
  // =========================

  function AnalyticsPage() {
    const totalActivity =
      Object.values(zones).reduce(
        (total, zone) =>
          total +
          (zone?.activity_count ?? 0),
        0
      );

    const activeAlerts =
      Object.values(zones).filter(
        (zone) => zone?.alert
      ).length;

    return (
      <>
        <section className="page-heading">

          <div>
            <span className="eyebrow">
              DATA ANALYTICS
            </span>

            <h1>Analytics</h1>

            <p>
              Overview of campus activity and
              system-generated alerts.
            </p>
          </div>

        </section>

        <SummaryCards zones={zones} />

        <section className="content-grid">

          <DensityChart />

          <div className="panel">

            <h2>Current Statistics</h2>

            <div className="analytics-stat-list">

              <div className="analytics-stat">
                <span>
                  Total Activity
                </span>

                <strong>
                  {totalActivity}
                </strong>
              </div>

              <div className="analytics-stat">
                <span>
                  Monitored Zones
                </span>

                <strong>
                  3
                </strong>
              </div>

              <div className="analytics-stat">
                <span>
                  Active Alerts
                </span>

                <strong>
                  {activeAlerts}
                </strong>
              </div>

              <div className="analytics-stat">
                <span>
                  Database Events
                </span>

                <strong>
                  {events.length}
                </strong>
              </div>

            </div>

          </div>

        </section>

        <LiveEvents zones={zones} />
      </>
    );
  }

  // =========================
  // PAGE SELECTOR
  // =========================

  function renderPage() {
    switch (activePage) {

      case "Live Monitoring":
        return <LiveMonitoringPage />;

      case "Alerts":
        return <AlertsPage />;

      case "Events":
        return <EventsPage />;

      case "Analytics":
        return <AnalyticsPage />;

      case "Dashboard":
      default:
        return <DashboardPage />;
    }
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="app">

      <div className="dashboard-shell">

        {/* SIDEBAR */}

        <aside className="sidebar">

          <div className="sidebar-brand">

            <div className="sidebar-logo">
              CP
            </div>

            <div>
              <h2>
                Campus Pulse
              </h2>

              <span>
                Monitoring System
              </span>
            </div>

          </div>

          <nav className="sidebar-nav">

            <div className="nav-section-title">
              MAIN
            </div>

            {mainNavigation.map(
              (item) => (
                <div
                  key={item.name}
                  className={`nav-item ${
                    activePage ===
                    item.name
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActivePage(
                      item.name
                    )
                  }
                >

                  <span className="nav-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.name}
                  </span>

                </div>
              )
            )}

            <div className="nav-section-title">
              DATA
            </div>

            {dataNavigation.map(
              (item) => (
                <div
                  key={item.name}
                  className={`nav-item ${
                    activePage ===
                    item.name
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActivePage(
                      item.name
                    )
                  }
                >

                  <span className="nav-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.name}
                  </span>

                </div>
              )
            )}

          </nav>

          <div className="sidebar-bottom">

            <div className="connection-card">

              <span className="connection-dot"></span>

              <div>

                <strong>
                  System Online
                </strong>

                <small>
                  Real-time connection active
                </small>

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
            {renderPage()}
          </main>

        </div>

      </div>

    </div>
  );
}

export default App;