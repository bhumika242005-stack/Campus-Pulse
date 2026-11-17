import {
  LayoutDashboard,
  BarChart3,
  Bell,
  Activity,
  CircleCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";

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

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <BarChart3 size={19} />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Bell size={19} />
          <span>Alerts</span>
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Activity size={19} />
          <span>Events</span>
        </NavLink>
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