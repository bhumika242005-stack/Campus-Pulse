export const dashboardStats = {
  totalStudents: 1284,
  libraryOccupancy: 237,
  libraryCapacity: 300,
  canteenOccupancy: 153,
  canteenCapacity: 250,
  activeAlerts: 3,
};

export const occupancyData = [
  {
    location: "Central Library",
    current: 237,
    capacity: 300,
  },
  {
    location: "Main Canteen",
    current: 153,
    capacity: 250,
  },
  {
    location: "Computer Lab 1",
    current: 42,
    capacity: 100,
  },
  {
    location: "Block A",
    current: 184,
    capacity: 250,
  },
];

export const recentEvents = [
  {
    id: 1,
    type: "Library Entry",
    location: "Central Library",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "Lab Entry",
    location: "Computer Lab 1",
    time: "5 min ago",
  },
  {
    id: 3,
    type: "Bus Arrival",
    location: "Main Gate",
    time: "8 min ago",
  },
  {
    id: 4,
    type: "Library Exit",
    location: "Central Library",
    time: "11 min ago",
  },
];

export const alerts = [
  {
    id: 1,
    type: "High Occupancy",
    location: "Central Library",
    message: "Library is approaching maximum capacity.",
    severity: "warning",
  },
  {
    id: 2,
    type: "High Occupancy",
    location: "Computer Lab 1",
    message: "Occupancy is above the recommended level.",
    severity: "warning",
  },
  {
    id: 3,
    type: "System Alert",
    location: "Block B",
    message: "Unusual activity detected.",
    severity: "info",
  },
];