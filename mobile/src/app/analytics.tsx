
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://172.18.149.34:8080';

type ZoneInfo = {
  zone: string;
  occupancy: number;
};

type CampusEvent = {
  event_id?: string;
  student_id?: string;
  zone?: string;
  event_type?: string;
  timestamp?: string;
};

type HourActivity = {
  time: string;
  value: number;
};

const initialZones: ZoneInfo[] = [
  { zone: 'Library', occupancy: 0 },
  { zone: 'Canteen', occupancy: 0 },
  { zone: 'Lab', occupancy: 0 },
];

export default function AnalyticsScreen() {
  const [zones, setZones] = useState<ZoneInfo[]>(initialZones);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [occupancyConnected, setOccupancyConnected] = useState(false);
  const [eventsConnected, setEventsConnected] = useState(false);
  const [error, setError] = useState('');

  // Fetch live occupancy and recent events
  useEffect(() => {
    let active = true;

    const fetchAnalytics = async () => {
      try {
        const results = await Promise.allSettled([
          fetch(`${API_URL}/api/zones`),
          fetch(`${API_URL}/api/events`),
        ]);

        // Process zone occupancy
        const zoneResult = results[0];

        if (
          zoneResult.status === 'fulfilled' &&
          zoneResult.value.ok
        ) {
          const zoneData = await zoneResult.value.json();

          const parsedZones: ZoneInfo[] = Object.entries(
            zoneData as Record<
              string,
              string | { occupancy?: number }
            >
          ).map(([name, value]) => {
            const data =
              typeof value === 'string'
                ? JSON.parse(value)
                : value;

            return {
              zone: name,
              occupancy: Math.max(
                0,
                Number(data.occupancy) || 0
              ),
            };
          });

          if (active) {
            setZones(parsedZones);
            setOccupancyConnected(true);
          }
        } else {
          if (active) {
            setOccupancyConnected(false);
          }
        }

        // Process recent PostgreSQL events
        const eventResult = results[1];

        if (
          eventResult.status === 'fulfilled' &&
          eventResult.value.ok
        ) {
          const eventData = await eventResult.value.json();

          const parsedEvents: CampusEvent[] =
            Array.isArray(eventData)
              ? eventData
              : Array.isArray(eventData.events)
                ? eventData.events
                : [];

          if (active) {
            setEvents(parsedEvents);
            setEventsConnected(true);
          }
        } else {
          if (active) {
            setEventsConnected(false);
          }
        }

        if (active) {
          const bothConnected =
            zoneResult.status === 'fulfilled' &&
            zoneResult.value.ok &&
            eventResult.status === 'fulfilled' &&
            eventResult.value.ok;

          setError(
            bothConnected
              ? ''
              : 'Some analytics data could not be loaded.'
          );

          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError('Unable to load analytics data.');
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Calculate current occupancy
  const totalOccupancy = zones.reduce(
    (total, zone) => total + zone.occupancy,
    0
  );

  // Count check-ins and check-outs
  const totalCheckIns = events.filter(
    event => event.event_type?.toLowerCase() === 'check_in'
  ).length;

  const totalCheckOuts = events.filter(
    event => event.event_type?.toLowerCase() === 'check_out'
  ).length;

  // Build activity chart from actual event timestamps
  const hourCounts: Record<string, number> = {};

  events.forEach(event => {
    if (!event.timestamp) return;

    const date = new Date(event.timestamp);

    if (Number.isNaN(date.getTime())) return;

    const hourKey = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
    ].join('-');

    hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
  });

  const hours: HourActivity[] = Object.entries(hourCounts)
    .sort(([keyA], [keyB]) => {
      const dateA = keyA.split('-').map(Number);
      const dateB = keyB.split('-').map(Number);

      for (let i = 0; i < dateA.length; i++) {
        if (dateA[i] !== dateB[i]) {
          return dateA[i] - dateB[i];
        }
      }

      return 0;
    })
    .slice(-5)
    .map(([key, value]) => {
      const hour = Number(key.split('-')[3]);

      const date = new Date();
      date.setHours(hour, 0, 0, 0);

      return {
        time: date.toLocaleTimeString([], {
          hour: 'numeric',
          hour12: true,
        }),
        value,
      };
    });

  const maxActivity = Math.max(
    1,
    ...hours.map(item => item.value)
  );

  const getZoneName = (zone: string) =>
    zone === 'Lab' ? 'Computer Lab' : zone;

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

  const connected = occupancyConnected && eventsConnected;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>CAMPUS PULSE</Text>
          <Text style={styles.subtitle}>
            SMART CAMPUS OCCUPANCY
          </Text>
        </View>

        {/* Heading */}
        <View style={styles.heading}>
          <Text style={styles.title}>Campus Analytics</Text>
          <Text style={styles.description}>
            Understand campus occupancy and student activity.
          </Text>
        </View>

        {/* Connection Status */}
        <View style={styles.connectionCard}>
          <View
            style={[
              styles.connectionDot,
              {
                backgroundColor: connected
                  ? '#198754'
                  : '#E5A13B',
              },
            ]}
          />

          <Text style={styles.connectionText}>
            {loading
              ? 'Loading analytics...'
              : connected
                ? 'Live backend connected'
                : 'Some backend data is unavailable'}
          </Text>
        </View>

        {error !== '' && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>👥</Text>
            <Text style={styles.summaryNumber}>
              {loading
                ? '...'
                : occupancyConnected
                  ? totalOccupancy
                  : '--'}
            </Text>
            <Text style={styles.summaryLabel}>
              Current Occupancy
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📍</Text>
            <Text style={styles.summaryNumber}>3</Text>
            <Text style={styles.summaryLabel}>
              Monitored Zones
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📥</Text>
            <Text style={styles.summaryNumber}>
              {loading
                ? '...'
                : eventsConnected
                  ? totalCheckIns
                  : '--'}
            </Text>
            <Text style={styles.summaryLabel}>
              Check-ins (last 100 events)
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📤</Text>
            <Text style={styles.summaryNumber}>
              {loading
                ? '...'
                : eventsConnected
                  ? totalCheckOuts
                  : '--'}
            </Text>
            <Text style={styles.summaryLabel}>
              Check-outs (last 100 events)
            </Text>
          </View>
        </View>

        {/* Zone Occupancy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Zone-wise Occupancy
          </Text>

          <Text style={styles.cardDescription}>
            Current students present in each campus zone
          </Text>

          {zones.map(zone => {
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
                    {occupancyConnected
                      ? `${zone.occupancy} students`
                      : '--'}
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
                  {occupancyConnected
                    ? `${share.toFixed(0)}% of current campus occupancy`
                    : 'Occupancy unavailable'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Recent Activity by Hour */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Recent Campus Activity
          </Text>

          <Text style={styles.cardDescription}>
            Events grouped by hour from the latest 100 records
          </Text>

          {(!eventsConnected || hours.length === 0) ? (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyText}>
                {eventsConnected
                  ? 'No event activity available yet.'
                  : 'Event activity is currently unavailable.'}
              </Text>
            </View>
          ) : (
            <View style={styles.chart}>
              {hours.map((item, index) => {
                const barHeight =
                  (item.value / maxActivity) * 100;

                const heightValue =
                  `${barHeight}%` as `${number}%`;

                return (
                  <View
                    key={`${item.time}-${index}`}
                    style={styles.barContainer}
                  >
                    <Text style={styles.barValue}>
                      {item.value}
                    </Text>

                    <View style={styles.barBackground}>
                      <View
                        style={[
                          styles.bar,
                          { height: heightValue },
                        ]}
                      />
                    </View>

                    <Text style={styles.barLabel}>
                      {item.time}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>
            📊 Campus Insights
          </Text>

          <Text style={styles.insightText}>
            • {zones.length} campus zones are configured for monitoring.
          </Text>

          <Text style={styles.insightText}>
            • {eventsConnected
              ? `${events.length} recent event records retrieved from the backend.`
              : 'Recent event information is unavailable.'}
          </Text>

          <Text style={styles.insightText}>
            • {occupancyConnected
              ? `${totalOccupancy} students are currently present across monitored zones.`
              : 'Live occupancy information is unavailable.'}
          </Text>
        </View>

        <Text style={styles.note}>
          Analytics refresh automatically every 5 seconds.
          Event totals and hourly activity are based on the latest
          100 records returned by the backend.
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

  heading: {
    padding: 22,
  },

  title: {
    color: '#142D4E',
    fontSize: 24,
    fontWeight: 'bold',
  },

  description: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 7,
    lineHeight: 20,
  },

  connectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 14,
    padding: 13,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  connectionDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 9,
  },

  connectionText: {
    color: '#64748B',
    fontSize: 12,
  },

  errorText: {
    color: '#D97706',
    fontSize: 11,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginBottom: 12,
    gap: 12,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 14,
    elevation: 2,
  },

  summaryIcon: {
    fontSize: 22,
  },

  summaryNumber: {
    color: '#142D4E',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 8,
  },

  summaryLabel: {
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

  cardTitle: {
    color: '#142D4E',
    fontSize: 17,
    fontWeight: 'bold',
  },

  cardDescription: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 6,
    marginBottom: 20,
  },

  zoneContainer: {
    marginBottom: 18,
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

  zoneStatus: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 6,
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

  chart: {
    height: 190,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 15,
  },

  barContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },

  barValue: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 5,
  },

  barBackground: {
    height: 115,
    width: 25,
    backgroundColor: '#E8EDF4',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },

  bar: {
    width: '100%',
    backgroundColor: '#2878C8',
    borderRadius: 6,
  },

  barLabel: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 8,
  },

  emptyChart: {
    paddingVertical: 35,
    alignItems: 'center',
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },

  insightCard: {
    backgroundColor: '#E5F0FF',
    marginHorizontal: 18,
    marginTop: 5,
    padding: 18,
    borderRadius: 14,
  },

  insightTitle: {
    color: '#142D4E',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  insightText: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 21,
    marginBottom: 6,
  },

  note: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    margin: 20,
    lineHeight: 18,
  },
});
