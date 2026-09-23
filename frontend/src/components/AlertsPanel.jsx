function AlertsPanel({ zones }) {
  const alerts = Object.values(zones).filter(
    (zone) => zone?.alert
  );

  return (
    <div className="panel">
      <h2>Alerts</h2>

      {alerts.length === 0 ? (
        <p>No active alerts</p>
      ) : (
        alerts.map((zone) => (
          <div className="alert" key={zone.zone}>
            <span>⚠</span>

            <div>
              <strong>{zone.zone}</strong>
              <p>{zone.alert.message}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AlertsPanel;