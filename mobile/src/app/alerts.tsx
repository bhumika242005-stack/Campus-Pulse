import { API_BASE_URL } from '../constants/api';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CampusAlert = {
  alert_type?: string;
  zone?: string;
  count?: number;
  severity?: string;
  message?: string;
  timestamp?: string;
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<CampusAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');

  // Fetch actual alerts from Member 4's backend
  useEffect(() => {
    let active = true;

    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/alerts`);

        if (!response.ok) {
          throw new Error('Unable to fetch alerts.');
        }

        const responseText = await response.text();

        let result: any = responseText;

        // Handle JSON returned as text, including JSON encoded twice
        if (typeof result === 'string') {
          try {
            result = JSON.parse(result);
          } catch {
            result = null;
          }
        }

        if (typeof result === 'string') {
          try {
            result = JSON.parse(result);
          } catch {
            result = null;
          }
        }

        let parsedAlerts: CampusAlert[] = [];

        if (Array.isArray(result)) {
          parsedAlerts = result;
        } else if (result && typeof result === 'object') {
          if (result.alert_type || result.message) {
            parsedAlerts = [result];
          } else if (result.alert) {
            parsedAlerts = [result.alert];
          }
        }

        if (active) {
          setAlerts(parsedAlerts);
          setConnected(true);
          setError('');
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setConnected(false);
          setError(
            'Unable to connect to the alerts server. Please try again.'
          );
          setLoading(false);
        }
      }
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Convert alert severity into display style
  const getSeverity = (severity?: string) => {
    const value = (severity || 'LOW').toUpperCase();

    if (value === 'HIGH') {
      return 'High';
    }

    if (value === 'MEDIUM') {
      return 'Medium';
    }

    return 'Low';
  };

  const getAlertTitle = (alert: CampusAlert) => {
    if (alert.alert_type) {
      return alert.alert_type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    return 'Campus Alert';
  };

  const getAlertTime = (timestamp?: string) => {
    if (!timestamp) {
      return 'Time unavailable';
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString();
  };

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
          <Text style={styles.title}>
            Alerts & Notifications
          </Text>

          <Text style={styles.description}>
            Stay updated about campus activity and crowd levels.
          </Text>
        </View>

        {/* Alert Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {loading ? '...' : alerts.length}
          </Text>

          <Text style={styles.summaryLabel}>
            Active Campus Alerts
          </Text>

          <View style={styles.connectionRow}>
            <View
              style={[
                styles.connectionDot,
                {
                  backgroundColor: connected
                    ? '#198754'
                    : '#D97706',
                },
              ]}
            />

            <Text style={styles.connectionText}>
              {connected
                ? 'Live backend connected'
                : loading
                  ? 'Loading alerts...'
                  : 'Backend disconnected'}
            </Text>
          </View>
        </View>

        {/* Section Heading */}
        <Text style={styles.sectionTitle}>
          Current Alerts
        </Text>

        {/* Loading */}
        {loading && (
          <View style={styles.messageCard}>
            <ActivityIndicator size="large" color="#2878C8" />

            <Text style={styles.emptyText}>
              Fetching campus alerts...
            </Text>
          </View>
        )}

        {/* Connection Error */}
        {!loading && error !== '' && (
          <View style={styles.messageCard}>
            <Text style={styles.emptyIcon}>⚠️</Text>

            <Text style={styles.emptyTitle}>
              Connection Error
            </Text>

            <Text style={styles.emptyText}>
              {error}
            </Text>
          </View>
        )}

        {/* No Active Alerts */}
        {!loading && connected && alerts.length === 0 && (
          <View style={styles.messageCard}>
            <Text style={styles.emptyIcon}>✓</Text>

            <Text style={styles.emptyTitle}>
              No Active Alerts
            </Text>

            <Text style={styles.emptyText}>
              There are currently no active campus alerts.
              Everything is looking good!
            </Text>
          </View>
        )}

        {/* Actual Backend Alerts */}
        {!loading && alerts.map((alert, index) => {
          const severity = getSeverity(alert.severity);

          const badgeStyle =
            severity === 'High'
              ? styles.high
              : severity === 'Medium'
                ? styles.medium
                : styles.low;

          return (
            <View
              key={`${alert.zone || 'zone'}-${index}`}
              style={styles.alertCard}
            >
              <View style={styles.alertTop}>
                <Text style={styles.alertIcon}>
                  {severity === 'High'
                    ? '⚠️'
                    : severity === 'Medium'
                      ? '👥'
                      : 'ℹ️'}
                </Text>

                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>
                    {getAlertTitle(alert)}
                  </Text>

                  <Text style={styles.zone}>
                    {alert.zone === 'Lab'
                      ? 'Computer Lab'
                      : alert.zone || 'Campus'}
                  </Text>
                </View>

                <View style={[styles.badge, badgeStyle]}>
                  <Text style={styles.badgeText}>
                    {severity}
                  </Text>
                </View>
              </View>

              <Text style={styles.message}>
                {alert.message || 'Campus activity alert.'}
              </Text>

              {alert.count !== undefined && (
                <Text style={styles.count}>
                  Current occupancy: {alert.count} students
                </Text>
              )}

              <Text style={styles.time}>
                {getAlertTime(alert.timestamp)}
              </Text>
            </View>
          );
        })}

        {/* Backend Information */}
        <Text style={styles.note}>
          Alerts are retrieved from the Campus Pulse backend.
          The current backend provides Library alerts only.
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

  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginRight: 7,
  },

  connectionText: {
    color: '#64748B',
    fontSize: 11,
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

  count: {
    color: '#2878C8',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },

  time: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 12,
  },

  messageCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    padding: 25,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 2,
  },

  emptyIcon: {
    fontSize: 32,
    color: '#198754',
    marginBottom: 10,
  },

  emptyTitle: {
    color: '#142D4E',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  emptyText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },

  note: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    margin: 22,
    lineHeight: 18,
  },
});
