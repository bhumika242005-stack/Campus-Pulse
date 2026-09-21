import { AlertTriangle, Info, Clock } from "lucide-react";
import { alerts } from "../data/mockData";

function Alerts() {
  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1>Alerts</h1>
          <p>Monitor events that require attention.</p>
        </div>

        <div className="alert-count">
          {alerts.length} Active Alerts
        </div>
      </div>

      <div className="alerts-page-list">
        {alerts.map((alert) => (
          <div className="alert-card" key={alert.id}>
            <div className="alert-card-icon">
              {alert.severity === "warning" ? (
                <AlertTriangle size={22} />
              ) : (
                <Info size={22} />
              )}
            </div>

            <div className="alert-card-content">
              <div className="alert-card-heading">
                <div>
                  <h2>{alert.type}</h2>
                  <p>{alert.location}</p>
                </div>

                <span className={`severity ${alert.severity}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>

              <p className="alert-message">
                {alert.message}
              </p>

              <div className="alert-time">
                <Clock size={14} />
                <span>Detected recently</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;