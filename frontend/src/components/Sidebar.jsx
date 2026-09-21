import {
  LayoutDashboard,
  BarChart3,
  Bell,
  Activity,
  CircleCheck,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Activity size={22} />
        </div>

        <div>
          <h2>Campus Pulse</h2>
          <span>Smart Campus</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">MAIN</p>

        <a href="/dashboard" className="sidebar-link active">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </a>

        <a href="/analytics" className="sidebar-link">
          <BarChart3 size={19} />
          <span>Analytics</span>
        </a>

        <a href="/alerts" className="sidebar-link">
          <Bell size={19} />
          <span>Alerts</span>
        </a>

        <a href="/events" className="sidebar-link">
          <Activity size={19} />
          <span>Events</span>
        </a>
      </div>

      <div className="sidebar-status">
        <div className="status-icon">
          <CircleCheck size={18} />
        </div>

        <div>
          <p>System Status</p>
          <span>All systems operational</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;