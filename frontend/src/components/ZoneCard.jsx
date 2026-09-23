function ZoneCard({ name, count, status }) {
  const statusClass = status.toLowerCase();

  return (
    <div className="zone-card">
      <h3>{name}</h3>

      <div className="density">
        {count}
      </div>

      <p>Activity Events</p>

      <span className={`status ${statusClass}`}>
        {status}
      </span>
    </div>
  );
}

export default ZoneCard;