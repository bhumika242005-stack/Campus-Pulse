function LiveEvents({ zones }) {
  const events = Object.values(zones)
    .filter(Boolean)
    .map((zone) => ({
      time: zone.updated_at
        ? new Date(zone.updated_at).toLocaleTimeString()
        : "--:--:--",
      zone: zone.zone,
      type: zone.alert ? zone.alert.alert_type : "ACTIVITY",
      count: zone.activity_count,
    }));

  return (
    <section className="panel events-panel">

      <div className="panel-header">
        <h2>Live Events</h2>
        <span className="event-count">LIVE STREAM</span>
      </div>

      {events.map((event) => (
        <div className="event" key={event.zone}>
          <span>{event.time}</span>
          <span>—</span>
          <span>→</span>
          <strong>{event.zone}</strong>
          <span>{event.type} ({event.count})</span>
        </div>
      ))}

    </section>
  );
}

export default LiveEvents;