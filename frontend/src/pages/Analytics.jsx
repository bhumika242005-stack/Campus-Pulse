import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const trafficData = [
  { time: "8 AM", students: 420 },
  { time: "10 AM", students: 680 },
  { time: "12 PM", students: 920 },
  { time: "2 PM", students: 810 },
  { time: "4 PM", students: 1040 },
  { time: "6 PM", students: 760 },
];

const locationData = [
  { location: "Library", occupancy: 79 },
  { location: "Canteen", occupancy: 61 },
  { location: "Lab 1", occupancy: 42 },
  { location: "Block A", occupancy: 74 },
];

function Analytics() {
  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p>Monitor campus activity and occupancy trends.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="dashboard-card chart-card">
          <div className="card-header">
            <h2>Campus Traffic</h2>
            <p>Number of active students throughout the day</p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="dashboard-card chart-card">
          <div className="card-header">
            <h2>Location Occupancy</h2>
            <p>Current occupancy percentage</p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis domain={[0, 100]} />
                <Tooltip />

                <Bar
                  dataKey="occupancy"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Analytics;