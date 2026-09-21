function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>
      </div>

      <p className="stat-title">{title}</p>

      <h2 className="stat-value">{value}</h2>

      <p className="stat-subtitle">{subtitle}</p>
    </div>
  );
}

export default StatCard;