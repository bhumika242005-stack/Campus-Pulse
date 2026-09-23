export const zones = [
  {
    name: "Library",
    count: 72,
    status: "HIGH",
  },
  {
    name: "Canteen",
    count: 38,
    status: "MEDIUM",
  },
  {
    name: "Lab 1",
    count: 19,
    status: "LOW",
  },
  {
    name: "Academic Block",
    count: 43,
    status: "MEDIUM",
  },
];

export const alerts = [
  {
    zone: "Library",
    message: "Crowd threshold exceeded",
  },
  {
    zone: "Canteen",
    message: "Density increasing",
  },
];

export const events = [
  {
    time: "14:32:01",
    student: "S102",
    zone: "Library",
    type: "Check-in",
  },
  {
    time: "14:32:02",
    student: "S234",
    zone: "Canteen",
    type: "Check-in",
  },
  {
    time: "14:32:03",
    student: "S876",
    zone: "Lab 1",
    type: "Check-in",
  },
];

export const densityData = [
  { time: "10:00", students: 25 },
  { time: "11:00", students: 32 },
  { time: "12:00", students: 45 },
  { time: "13:00", students: 52 },
  { time: "14:00", students: 72 },
  { time: "15:00", students: 65 },
];

export const campusSummary = {
  totalStudents: 172,
  monitoredZones: 4,
  activeAlerts: 2,
};