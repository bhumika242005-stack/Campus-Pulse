
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const zones = [
  { name: 'Library', occupancy: 75, color: '#2878C8' },
  { name: 'Canteen', occupancy: 55, color: '#198754' },
  { name: 'Computer Lab', occupancy: 40, color: '#E5A13B' },
];

const hours = [
  { time: '9 AM', value: 35 },
  { time: '11 AM', value: 80 },
  { time: '1 PM', value: 60 },
  { time: '3 PM', value: 90 },
  { time: '5 PM', value: 45 },
];

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>CAMPUS PULSE</Text>
          <Text style={styles.subtitle}>SMART CAMPUS OCCUPANCY</Text>
        </View>

        {/* Heading */}
        <View style={styles.heading}>
          <Text style={styles.title}>Campus Analytics</Text>
          <Text style={styles.description}>
            Understand campus occupancy and student activity.
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>👥</Text>
            <Text style={styles.summaryNumber}>--</Text>
            <Text style={styles.summaryLabel}>Current Occupancy</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📍</Text>
            <Text style={styles.summaryNumber}>3</Text>
            <Text style={styles.summaryLabel}>Monitored Zones</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📥</Text>
            <Text style={styles.summaryNumber}>--</Text>
            <Text style={styles.summaryLabel}>Total Check-ins</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📤</Text>
            <Text style={styles.summaryNumber}>--</Text>
            <Text style={styles.summaryLabel}>Total Check-outs</Text>
          </View>
        </View>

        {/* Zone Occupancy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Zone-wise Occupancy</Text>
          <Text style={styles.cardDescription}>
            Illustrative occupancy percentages
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
            </View>
          ))}
        </View>

        {/* Peak Hours */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Peak Campus Hours</Text>
          <Text style={styles.cardDescription}>
            Illustrative activity levels throughout the day
          </Text>

          <View style={styles.chart}>
            {hours.map((item) => (
              <View key={item.time} style={styles.barContainer}>
                <Text style={styles.barValue}>{item.value}%</Text>

                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${item.value}%` },
                    ]}
                  />
                </View>

                <Text style={styles.barLabel}>{item.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>📊 Campus Insights</Text>
          <Text style={styles.insightText}>
            • Three campus zones are configured for monitoring.
          </Text>
          <Text style={styles.insightText}>
            • Peak-hour patterns can help identify busy periods.
          </Text>
          <Text style={styles.insightText}>
            • Live insights will be available after backend integration.
          </Text>
        </View>

        <Text style={styles.note}>
          Sample chart values are for interface demonstration only.
          They are not live campus measurements.
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 7,
    lineHeight: 20,
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
