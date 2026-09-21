import {
  LogIn,
  LogOut,
  Bus,
  Activity,
  Clock,
} from "lucide-react";

import { recentEvents } from "../data/mockData";

function getEventIcon(type) {
  if (type.toLowerCase().includes("entry")) {
    return <LogIn size={18} />;
  }

  if (type.toLowerCase().includes("exit")) {
    return <LogOut size={18} />;
  }

  if (type.toLowerCase().includes("bus")) {
    return <Bus size={18} />;
  }

  return <Activity size={18} />;
}

function Events() {
  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1>Events</h1>
          <p>Recent activity across the campus.</p>
        </div>

        <div className="event-count">
          {recentEvents.length} Recent Events
        </div>
      </div>

      <section className="dashboard-card events-card">
        <div className="card-header">
          <div>
            <h2>Campus Activity</h2>
            <p>Latest events received from campus systems</p>
          </div>
        </div>

        <div className="events-table">
          <div className="events-table-header">
            <span>EVENT</span>
            <span>LOCATION</span>
            <span>TIME</span>
            <span>TYPE</span>
          </div>

          {recentEvents.map((event) => (
            <div className="event-row" key={event.id}>
              <div className="event-name">
                <div className="event-icon">
                  {getEventIcon(event.type)}
                </div>

                <div>
                  <strong>{event.type}</strong>
                  <span>Campus activity</span>
                </div>
              </div>

              <span className="event-location">
                {event.location}
              </span>

              <div className="event-time">
                <Clock size={14} />
                {event.time}
              </div>

              <span className="event-type">
                {event.type.toLowerCase().includes("entry")
                  ? "ENTRY"
                  : event.type.toLowerCase().includes("exit")
                  ? "EXIT"
                  : event.type.toLowerCase().includes("bus")
                  ? "TRANSPORT"
                  : "ACTIVITY"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Events;