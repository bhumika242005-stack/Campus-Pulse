
import { useEffect, useState } from "react";
import { AlertTriangle, Info, Clock } from "lucide-react";
import { getAlerts } from "../services/api";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchAlerts() {
      try {
        const data = await getAlerts();

        if (!active) return;

        if (!Array.isArray(data)) {
          throw new Error("Invalid alerts response from server");
        }

        setAlerts(data);
        setError("");
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load alerts");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

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

      {loading ? (
        <p>Loading alerts...</p>
      ) : error ? (
        <div className="dashboard-card">
          <p>Unable to load alerts: {error}</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="dashboard-card">
          <Info size={28} />
          <h2>No active alerts</h2>
          <p>There are currently no alerts available.</p>
        </div>
      ) : (
        <div className="alerts-page-list">
          {alerts.map((alert, index) => (
            <div className="alert-card" key={alert.id ?? index}>
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
                    <h2>{alert.type || "Alert"}</h2>
                    <p>{alert.location || "Unknown location"}</p>
                  </div>

                  <span
                    className={`severity ${
                      alert.severity || "info"
                    }`}
                  >
                    {(alert.severity || "info").toUpperCase()}
                  </span>
                </div>

                <p className="alert-message">
                  {alert.message || "No additional information"}
                </p>

                <div className="alert-time">
                  <Clock size={14} />
                  <span>
                    {alert.timestamp
                      ? new Date(alert.timestamp).toLocaleString()
                      : "Time unavailable"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;
