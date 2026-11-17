function SummaryCards({ zones }) {
  const zoneValues = Object.values(zones);

  const totalStudents = zoneValues.reduce(
    (total, zone) => total + (zone?.activity_count ?? 0),
    0
  );

  const monitoredZones = zoneValues.filter(Boolean).length;

  const activeAlerts = zoneValues.filter(
    (zone) => zone?.alert
  ).length;

  return (
    <section className="summary-grid">

      <div className="summary-card">
        <p>Total Activity</p>
        <h2>{totalStudents}</h2>
      </div>

      <div className="summary-card">
        <p>Monitored Zones</p>
        <h2>{monitoredZones}</h2>
      </div>

      <div className="summary-card">
        <p>Active Alerts</p>
        <h2>{activeAlerts}</h2>
      </div>

    </section>
  );
}

export default SummaryCards;