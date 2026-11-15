
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://172.18.149.145:8080';

type ZoneInfo = {
  zone: string;
  occupancy: number;
  alert: string | null;
  updated_at: string;
};

type ZoneResponse = {
  zone?: string;
  occupancy?: number | string;
  alert?: string | null;
  updated_at?: string;
};

const initialZones: ZoneInfo[] = [
  {
    zone: 'Library',
    occupancy: 0,
    alert: null,
    updated_at: '',
  },
  {
    zone: 'Canteen',
    occupancy: 0,
    alert: null,
    updated_at: '',
  },
  {
    zone: 'Lab',
    occupancy: 0,
    alert: null,
    updated_at: '',
  },
];

const demoActivities = [
  {
    name: 'Student checked in',
    zone: 'Library',
    time: 'Demo activity',
    icon: '🟢',
  },
  {
    name: 'Student checked out',
    zone: 'Canteen',
    time: 'Demo activity',
    icon: '🔵',
  },
  {
    name: 'High occupancy warning',
    zone: 'Library',
    time: 'Demo activity',
    icon: '⚠️',
  },
];

export default function DashboardScreen() {
  const [zones, setZones] = useState<ZoneInfo[]>(initialZones);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch live occupancy data from Member 4's backend
  useEffect(() => {
    let active = true;

    const fetchOccupancy = async () => {
      try {
        const response = await fetch(`${API_URL}/api/zones`);

        if (!response.ok) {
          throw new Error('Unable to fetch occupancy data.');
        }

        const result = await response.json();

        const parsedZones: ZoneInfo[] = Object.entries(
          result as Record<string, string | ZoneResponse>
        ).map(([name, value]) => {
          const zoneData: ZoneResponse =
            typeof value === 'string'
              ? JSON.parse(value)
              : value;

          return {
            zone: name,
            occupancy: Math.max(
              0,
              Number(zoneData.occupancy) || 0
            ),
            alert: zoneData.alert ?? null,
            updated_at: zoneData.updated_at ?? '',
          };
        });

        if (active) {
          setZones(parsedZones);
          setConnected(true);
          setError('');
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setConnected(false);
          setError('Unable to connect to the live server.');
          setLoading(false);
        }
      }
    };

    fetchOccupancy();

    const interval = setInterval(fetchOccupancy, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Calculate total occupancy across all zones
  const totalOccupancy = zones.reduce(
    (total, zone) => total + zone.occupancy,
    0
  );

  const getZoneName = (zone: string) => {
    return zone === 'Lab' ? 'Computer Lab' : zone;
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'Library':
        return '#2878C8';
      case 'Canteen':
        return '#198754';
      case 'Lab':
        return '#E5A13B';
      default:
        return '#2878C8';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>CAMPUS PULSE</Text>

            <Text style={styles.subtitle}>
              SMART CAMPUS OCCUPANCY
            </Text>
          </View>

          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>CP</Text>
          </View>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcome}>
            Campus Dashboard
          </Text>

          <Text style={styles.description}>
            Monitor campus activity and occupancy at a glance.
          </Text>
        </View>

        {/* Main Occupancy Card */}
        <View style={styles.mainCard}>
          <Text style={styles.mainLabel}>
            CURRENT CAMPUS OCCUPANCY
          </Text>

          <Text style={styles.mainNumber}>
            {loading ? '...' : totalOccupancy}
          </Text>

          <Text style={styles.mainDescription}>
            Students currently present across monitored zones
          </Text>

          <View style={styles.liveStatus}>
            <View
              style={[
                styles.liveDot,
                {
                  backgroundColor: connected
                    ? '#22C55E'
                    : '#E5A13B',
                },
              ]}
            />

            <Text style={styles.liveText}>
              {connected
                ? 'Live backend connected'
                : loading
                  ? 'Loading occupancy data...'
                  : 'Backend disconnected'}
            </Text>
          </View>

          {error !== '' && (
            <Text style={styles.connectionError}>
              {error}
            </Text>
          )}
        </View>

        {/* Quick Statistics */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📍</Text>

            <Text style={styles.statNumber}>3</Text>

            <Text style={styles.statLabel}>
              Monitored Zones
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚠️</Text>

            <Text style={styles.statNumber}>--</Text>

            <Text style={styles.statLabel}>
              Active Alerts
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📥</Text>

            <Text style={styles.statNumber}>--</Text>

            <Text style={styles.statLabel}>
              Check-ins Today
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📤</Text>

            <Text style={styles.statNumber}>--</Text>

            <Text style={styles.statLabel}>
              Check-outs Today
            </Text>
          </View>
        </View>

        {/* Live Zone Occupancy */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Zone-wise Occupancy
            </Text>

            <Text style={styles.viewText}>
              3 Zones
            </Text>
          </View>

          <Text style={styles.cardDescription}>
            Live student count by campus zone
          </Text>

          {zones.map((zone) => {
            const share =
              totalOccupancy > 0
                ? (zone.occupancy / totalOccupancy) * 100
                : 0;

            const progressWidth =
              `${share}%` as `${number}%`;

            return (
              <View
                key={zone.zone}
                style={styles.zoneContainer}
              >
                <View style={styles.zoneHeader}>
                  <Text style={styles.zoneName}>
                    {getZoneName(zone.zone)}
                  </Text>

                  <Text style={styles.zonePercentage}>
                    {zone.occupancy} students
                  </Text>
                </View>

                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: progressWidth,
                        backgroundColor: getZoneColor(zone.zone),
                      },
                    ]}
                  />
                </View>

                <Text style={styles.zoneStatus}>
                  {share.toFixed(0)}% of current campus occupancy
                </Text>
              </View>
            );
          })}

          {!connected && !loading && (
            <Text style={styles.dataWarning}>
              Showing the last available occupancy data.
            </Text>
          )}
        </View>

        {/* Demo Alerts */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Campus Alerts
            </Text>

            <Text style={styles.alertCount}>
              Demo
            </Text>
          </View>

          <View style={styles.alertBox}>
            <Text style={styles.alertIcon}>⚠️</Text>

            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>
                High Occupancy Warning
              </Text>

              <Text style={styles.alertDescription}>
                Library is approaching its maximum capacity.
              </Text>
            </View>
          </View>

          <View style={styles.alertBox}>
            <Text style={styles.alertIcon}>👥</Text>

            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>
                Crowd Activity
              </Text>

              <Text style={styles.alertDescription}>
                Higher than usual activity in the Canteen.
              </Text>
            </View>
          </View>

          <Text style={styles.demoNote}>
            These are sample notifications, not live alerts.
          </Text>
        </View>

        {/* Demo Recent Activity */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recent Campus Activity
            </Text>

            <Text style={styles.alertCount}>
              Demo
            </Text>
          </View>

          {demoActivities.map((activity, index) => (
            <View key={index} style={styles.activityRow}>
              <Text style={styles.activityIcon}>
                {activity.icon}
              </Text>

              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>
                  {activity.name}
                </Text>

                <Text style={styles.activityZone}>
                  {activity.zone}
                </Text>
              </View>

              <Text style={styles.activityTime}>
                {activity.time}
              </Text>
            </View>
          ))}

          <Text style={styles.demoNote}>
            Recent activity will be connected to live events later.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Campus Pulse | Smart Campus Monitoring System
        </Text>

        <Text style={styles.note}>
          Occupancy data is refreshed automatically from the
          Campus Pulse backend.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },

  header: {
    backgroundColor: '#142D4E',
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  subtitle: {
    color: '#C5D5E8',
    fontSize: 11,
    marginTop: 5,
    letterSpacing: 1,
  },

  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 25,
    backgroundColor: '#2878C8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
  },

  welcomeSection: {
    padding: 22,
    paddingBottom: 15,
  },

  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#142D4E',
  },

  description: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 7,
    lineHeight: 20,
  },

  mainCard: {
    backgroundColor: '#142D4E',
    marginHorizontal: 18,
    marginBottom: 15,
    padding: 22,
    borderRadius: 16,
    elevation: 3,
  },

  mainLabel: {
    color: '#C5D5E8',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  mainNumber: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 12,
  },

  mainDescription: {
    color: '#C5D5E8',
    fontSize: 12,
    marginTop: 2,
  },

  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginRight: 8,
  },

  liveText: {
    color: '#FDE7B0',
    fontSize: 11,
  },

  connectionError: {
    color: '#FCA5A5',
    fontSize: 11,
    marginTop: 8,
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginBottom: 12,
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  statIcon: {
    fontSize: 22,
  },

  statNumber: {
    color: '#142D4E',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 8,
  },

  statLabel: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginTop: 5,
    marginBottom: 13,
    padding: 18,
    borderRadius: 14,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    color: '#142D4E',
    fontSize: 17,
    fontWeight: 'bold',
  },

  viewText: {
    color: '#2878C8',
    fontSize: 11,
    fontWeight: 'bold',
  },

  cardDescription: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 6,
    marginBottom: 20,
  },

  zoneContainer: {
    marginBottom: 19,
  },

  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  zoneName: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },

  zonePercentage: {
    color: '#142D4E',
    fontWeight: 'bold',
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#E8EDF4',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },

  zoneStatus: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 6,
  },

  dataWarning: {
    color: '#D97706',
    fontSize: 11,
    marginTop: 5,
  },

  alertCount: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: 'bold',
  },

  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7E8',
    padding: 12,
    borderRadius: 10,
    marginTop: 13,
  },

  alertIcon: {
    fontSize: 21,
    marginRight: 10,
  },

  alertInfo: {
    flex: 1,
  },

  alertTitle: {
    color: '#142D4E',
    fontSize: 13,
    fontWeight: 'bold',
  },

  alertDescription: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 5,
    lineHeight: 17,
  },

  demoNote: {
    color: '#D97706',
    fontSize: 10,
    marginTop: 10,
  },

  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1F6',
  },

  activityIcon: {
    fontSize: 19,
    marginRight: 12,
  },

  activityInfo: {
    flex: 1,
  },

  activityTitle: {
    color: '#334155',
    fontSize: 12,
    fontWeight: 'bold',
  },

  activityZone: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },

  activityTime: {
    color: '#94A3B8',
    fontSize: 9,
  },

  footer: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 11,
    marginTop: 15,
  },

  note: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    marginHorizontal: 25,
    marginTop: 8,
    marginBottom: 25,
    lineHeight: 16,
  },
});
