function OccupancyCard({ location, current, capacity }) {
  const percentage = Math.round((current / capacity) * 100);

  return (
    <div className="occupancy-item">
      <div className="occupancy-header">
        <span>{location}</span>
        <strong>{percentage}%</strong>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <p>
        {current} / {capacity} people
      </p>
    </div>
  );
}

export default OccupancyCard;