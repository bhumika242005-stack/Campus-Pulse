function Header() {
  return (
    <header className="header">

      <div className="header-left">

        <div className="mobile-brand">
          <div className="mobile-logo">CP</div>

          <div>
            <strong>Campus Pulse</strong>
            <span>Monitoring Dashboard</span>
          </div>
        </div>

        <div className="breadcrumb">
          Dashboard
          <span>/</span>
          Overview
        </div>

      </div>

      <div className="header-right">

        <div className="header-date">
          <span>REAL-TIME DATA</span>
          <strong>Live Campus Activity</strong>
        </div>

        <div className="system-status">

          <span className="live-dot"></span>

          <div>
            <strong>System Live</strong>
            <span>Connected</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;