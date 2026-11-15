
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const zones = [
  { name: 'Library', occupancy: 75, color: '#2878C8', status: 'Busy' },
  { name: 'Canteen', occupancy: 55, color: '#198754', status: 'Moderate' },
  { name: 'Computer Lab', occupancy: 40, color: '#E5A13B', status: 'Normal' },
];

const activities = [
  {
    name: 'Student checked in',
    zone: 'Library',
    time: 'Recent activity',
    icon: '🟢',
  },
  {
    name: 'Student checked out',
    zone: 'Canteen',
    time: 'Recent activity',
    icon: '🔵',
  },
  {
    name: 'High occupancy warning',
    zone: 'Library',
    time: 'Campus alert',
    icon: '⚠️',
  },
];

export default function DashboardScreen() {
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
          <Text style={styles.welcome}>Campus Dashboard</Text>
          <Text style={styles.description}>
            Monitor campus activity and occupancy at a glance.
          </Text>
        </View>

        {/* Main Occupancy Card */}
        <View style={styles.mainCard}>
          <Text style={styles.mainLabel}>
            CURRENT CAMPUS OCCUPANCY
          </Text>

          <Text style={styles.mainNumber}>--</Text>

          <Text style={styles.mainDescription}>
            Live student count will appear here
          </Text>

          <View style={styles.liveStatus}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              Awaiting live backend data
            </Text>
          </View>
        </View>

        {/* Quick Statistics */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Monitored Zones</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚠️</Text>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Active Alerts</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📥</Text>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Check-ins Today</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📤</Text>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Check-outs Today</Text>
          </View>
        </View>

        {/* Zone Occupancy */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Zone-wise Occupancy
            </Text>
            <Text style={styles.viewText}>3 Zones</Text>
          </View>

          <Text style={styles.cardDescription}>
            Illustrative occupancy levels
          </Text>

          {zones.map((zone) => (
            <View key={zone.name} style={styles.zoneContainer}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zonePercentage}>
                  {zone.occupancy}%
                </Text>
              </View>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${zone.occupancy}%`,
                      backgroundColor: zone.color,
                    },
                  ]}
                />
              </View>

              <Text style={styles.zoneStatus}>
                {zone.status} occupancy (sample)
              </Text>
            </View>
          ))}
        </View>

        {/* Alerts Preview */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Campus Alerts
            </Text>
            <Text style={styles.alertCount}>Sample</Text>
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
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Recent Campus Activity
          </Text>

          {activities.map((activity, index) => (
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
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Campus Pulse | Smart Campus Monitoring System
        </Text>

        <Text style={styles.note}>
          Sample occupancy and activity information is displayed
          for interface testing. Live data requires backend integration.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

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
    backgroundColor: '#E5A13B',
    marginRight: 8,
  },

  liveText: {
    color: '#FDE7B0',
    fontSize: 11,
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
