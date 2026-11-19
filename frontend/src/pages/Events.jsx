
import { useEffect, useState } from "react";
import {
  LogIn,
  LogOut,
  Activity,
  Clock,
} from "lucide-react";

import { getEvents } from "../services/api";

function getEventIcon(type) {
  if (type === "check_in") {
    return <LogIn size={18} />;
  }

  if (type === "check_out") {
    return <LogOut size={18} />;
  }

  return <Activity size={18} />;
}

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchEvents() {
      try {
        const data = await getEvents();

        if (!active) return;

        if (!Array.isArray(data)) {
          throw new Error("Invalid events response from server");
        }

        setEvents(data);
        setError("");
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load events");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchEvents();

    const interval = setInterval(fetchEvents, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1>Events</h1>
          <p>Recent activity across the campus.</p>
        </div>

        <div className="event-count">
          {events.length} Recent Events
        </div>
      </div>

      <section className="dashboard-card events-card">
        <div className="card-header">
          <div>
            <h2>Campus Activity</h2>
            <p>Latest events received from campus systems</p>
          </div>
        </div>

        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p>Unable to load events: {error}</p>
        ) : events.length === 0 ? (
          <p>No events available currently.</p>
        ) : (
          <div className="events-table">
            <div className="events-table-header">
              <span>EVENT</span>
              <span>LOCATION</span>
              <span>TIME</span>
              <span>TYPE</span>
            </div>

            {events.map((event, index) => {
              const type = event.event_type || "activity";
              const isCheckIn = type === "check_in";
              const isCheckOut = type === "check_out";

              return (
                <div
                  className="event-row"
                  key={event.event_id || event.id || index}
                >
                  <div className="event-name">
                    <div className="event-icon">
                      {getEventIcon(type)}
                    </div>

                    <div>
                      <strong>{type.replaceAll("_", " ").toUpperCase()}</strong>
                      <span>{event.student_id || "Unknown student"}</span>
                    </div>
                  </div>

                  <span className="event-location">
                    {event.zone || "Unknown location"}
                  </span>

                  <div className="event-time">
                    <Clock size={14} />
                    {event.timestamp
                      ? new Date(event.timestamp).toLocaleString()
                      : "Time unavailable"}
                  </div>

                  <span className="event-type">
                    {isCheckIn
                      ? "ENTRY"
                      : isCheckOut
                      ? "EXIT"
                      : "ACTIVITY"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Events;
