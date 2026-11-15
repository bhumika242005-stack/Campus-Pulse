
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const alerts = [
  {
    id: '1',
    title: 'High Occupancy Warning',
    zone: 'Library',
    message: 'The library is approaching its maximum capacity.',
    time: '10 minutes ago',
    level: 'High',
    icon: '⚠️',
  },
  {
    id: '2',
    title: 'Crowd Alert',
    zone: 'Canteen',
    message: 'Higher than usual student activity detected.',
    time: '25 minutes ago',
    level: 'Medium',
    icon: '👥',
  },
  {
    id: '3',
    title: 'Zone Activity Update',
    zone: 'Computer Lab',
    message: 'Student occupancy is within normal limits.',
    time: '1 hour ago',
    level: 'Low',
    icon: 'ℹ️',
  },
];

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>CAMPUS PULSE</Text>
          <Text style={styles.subtitle}>SMART CAMPUS OCCUPANCY</Text>
        </View>

        <View style={styles.heading}>
          <Text style={styles.title}>Alerts & Notifications</Text>
          <Text style={styles.description}>
            Stay updated about campus activity and crowd levels.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>3</Text>
          <Text style={styles.summaryLabel}>Sample Notifications</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Alerts</Text>

        {alerts.map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.alertTop}>
              <Text style={styles.alertIcon}>{alert.icon}</Text>
              <View style={styles.alertInfo}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.zone}>{alert.zone}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  alert.level === 'High'
                    ? styles.high
                    : alert.level === 'Medium'
                    ? styles.medium
                    : styles.low,
                ]}
              >
                <Text style={styles.badgeText}>{alert.level}</Text>
              </View>
            </View>

            <Text style={styles.message}>{alert.message}</Text>
            <Text style={styles.time}>{alert.time}</Text>
          </View>
        ))}

        <Text style={styles.note}>
          Demo notifications shown for interface testing.
          Live alerts will be connected to the backend.
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
    fontSize: 23,
    fontWeight: 'bold',
  },
  description: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 7,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2878C8',
  },
  summaryLabel: {
    color: '#64748B',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#142D4E',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 12,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 13,
    padding: 17,
    borderRadius: 14,
    elevation: 2,
  },
  alertTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 25,
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    color: '#142D4E',
    fontSize: 15,
    fontWeight: 'bold',
  },
  zone: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  high: {
    backgroundColor: '#FCE4E4',
  },
  medium: {
    backgroundColor: '#FFF0D6',
  },
  low: {
    backgroundColor: '#DDF4E5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
  message: {
    color: '#475569',
    fontSize: 13,
    marginTop: 15,
    lineHeight: 20,
  },
  time: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 12,
  },
  note: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    margin: 22,
    lineHeight: 18,
  },
});
