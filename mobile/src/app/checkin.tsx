
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import * as Location from 'expo-location';
import * as Crypto from 'expo-crypto';
import { SafeAreaView } from 'react-native-safe-area-context';

// Exact event format expected by the Campus Pulse processing pipeline
type CampusEvent = {
  event_id: string;
  student_id: string;
  zone: 'Library' | 'Canteen' | 'Lab';
  event_type: 'check_in' | 'check_out';
  timestamp: string;
};

// Replace with your actual assigned student ID when confirmed
const STUDENT_ID = 'S0001';

const zones = ['Library', 'Canteen', 'Computer Lab'];

export default function HomeScreen() {
  const [selectedZone, setSelectedZone] = useState('Library');

  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState('Not Checked In');

  const [lastAction, setLastAction] = useState('');

  const [lastEvent, setLastEvent] =
    useState<CampusEvent | null>(null);

  const [activeZone, setActiveZone] =
    useState<string | null>(null);

  // Convert mobile UI zone names to backend zone names
  const getBackendZone = (
    zone: string
  ): 'Library' | 'Canteen' | 'Lab' => {
    if (zone === 'Computer Lab') {
      return 'Lab';
    }

    return zone as 'Library' | 'Canteen';
  };

  // Generate an event using the exact five-field schema
  const generateEvent = (
    eventType: 'check_in' | 'check_out',
    zone: string
  ): CampusEvent => {
    const event: CampusEvent = {
      event_id: Crypto.randomUUID(),
      student_id: STUDENT_ID,
      zone: getBackendZone(zone),
      event_type: eventType,
      timestamp: new Date().toISOString(),
    };

    setLastEvent(event);

    console.log(
      'CAMPUS PULSE EVENT:',
      JSON.stringify(event, null, 2)
    );

    return event;
  };

  // Capture current GPS location
  const detectLocation = async () => {
    try {
      setLoading(true);

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Location Permission',
          'Please allow location access to use Campus Pulse.'
        );
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      setLocation(currentLocation);

      Alert.alert(
        'Success',
        'Your GPS location has been detected!'
      );
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to retrieve your location.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Check-in
  const handleCheckIn = () => {
    if (!location) {
      Alert.alert(
        'GPS Required',
        'Please detect your location first.'
      );
      return;
    }

    if (status === 'Checked In') {
      Alert.alert(
        'Notice',
        'You are already checked in.'
      );
      return;
    }

    const event = generateEvent(
      'check_in',
      selectedZone
    );

    setActiveZone(selectedZone);
    setStatus('Checked In');
    setLastAction(new Date().toLocaleString());

    Alert.alert(
      'Check-in Successful',
      `Event generated for ${event.zone}!`
    );
  };

  // Check-out
  const handleCheckOut = () => {
    if (status !== 'Checked In' || !activeZone) {
      Alert.alert(
        'Notice',
        'You are not currently checked in.'
      );
      return;
    }

    const event = generateEvent(
      'check_out',
      activeZone
    );

    setStatus('Checked Out');
    setActiveZone(null);
    setLastAction(new Date().toLocaleString());

    Alert.alert(
      'Check-out Successful',
      `Event generated for ${event.zone}!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              CAMPUS PULSE
            </Text>

            <Text style={styles.headerSubtitle}>
              SMART CAMPUS OCCUPANCY
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>
              CP
            </Text>
          </View>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcome}>
            Welcome, Student!
          </Text>

          <Text style={styles.description}>
            Track your campus presence in real time.
          </Text>
        </View>

        {/* GPS Location */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            📍 Your Current Location
          </Text>

          {location ? (
            <View>
              <Text style={styles.locationText}>
                Latitude: {location.coords.latitude.toFixed(6)}
              </Text>

              <Text style={styles.locationText}>
                Longitude: {location.coords.longitude.toFixed(6)}
              </Text>

              <Text style={styles.gpsSuccess}>
                ● GPS Location Detected
              </Text>
            </View>
          ) : (
            <Text style={styles.description}>
              Your location has not been detected yet.
            </Text>
          )}

          <TouchableOpacity
            style={styles.locationButton}
            onPress={detectLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {location
                  ? 'Refresh Location'
                  : 'Detect My Location'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Zone Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Select Campus Zone
          </Text>

          {zones.map((zone) => (
            <TouchableOpacity
              key={zone}
              style={[
                styles.zoneButton,
                selectedZone === zone &&
                  styles.selectedZone,
              ]}
              onPress={() => setSelectedZone(zone)}
            >
              <Text
                style={[
                  styles.zoneText,
                  selectedZone === zone &&
                    styles.selectedZoneText,
                ]}
              >
                {zone}
              </Text>

              <Text style={styles.zoneArrow}>
                {selectedZone === zone ? '✓' : '›'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Attendance Status */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>
            Current Attendance Status
          </Text>

          <Text
            style={[
              styles.statusText,
              status === 'Checked In'
                ? styles.checkedIn
                : status === 'Checked Out'
                  ? styles.checkedOut
                  : styles.notCheckedIn,
            ]}
          >
            ● {status}
          </Text>

          {lastAction !== '' && (
            <Text style={styles.lastAction}>
              Last updated: {lastAction}
            </Text>
          )}

          {activeZone !== null && (
            <Text style={styles.lastAction}>
              Active Zone: {activeZone}
            </Text>
          )}
        </View>

        {/* Latest Generated Event */}
        {lastEvent && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Latest Generated Event
            </Text>

            <Text style={styles.eventJson}>
              {JSON.stringify(lastEvent, null, 2)}
            </Text>

            <Text style={styles.eventNote}>
              Generated locally. Not yet sent to FastAPI.
            </Text>
          </View>
        )}

        {/* Check-in */}
        <TouchableOpacity
          style={styles.checkInButton}
          onPress={handleCheckIn}
        >
          <Text style={styles.buttonText}>
            CHECK IN
          </Text>
        </TouchableOpacity>

        {/* Check-out */}
        <TouchableOpacity
          style={styles.checkOutButton}
          onPress={handleCheckOut}
        >
          <Text style={styles.buttonText}>
            CHECK OUT
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          Campus Pulse | Smart Campus Monitoring System
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

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    backgroundColor: '#142D4E',
    paddingHorizontal: 22,
    paddingVertical: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  headerSubtitle: {
    fontSize: 11,
    color: '#C5D5E8',
    marginTop: 5,
    letterSpacing: 1,
  },

  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#2878C8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIconText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
  },

  welcomeSection: {
    padding: 22,
    paddingBottom: 15,
  },

  welcome: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#142D4E',
  },

  description: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 7,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 15,
    padding: 18,
    borderRadius: 14,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#142D4E',
    marginBottom: 14,
  },

  locationText: {
    color: '#334155',
    fontSize: 13,
    marginBottom: 5,
  },

  gpsSuccess: {
    color: '#198754',
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
  },

  locationButton: {
    backgroundColor: '#2878C8',
    padding: 13,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  zoneButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE4EF',
    padding: 14,
    borderRadius: 9,
    marginBottom: 9,
  },

  selectedZone: {
    backgroundColor: '#E5F0FF',
    borderColor: '#2878C8',
  },

  zoneText: {
    fontSize: 14,
    color: '#334155',
  },

  selectedZoneText: {
    color: '#1765B0',
    fontWeight: 'bold',
  },

  zoneArrow: {
    fontSize: 18,
    color: '#2878C8',
    fontWeight: 'bold',
  },

  statusCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 15,
    padding: 18,
    borderRadius: 14,
    elevation: 2,
  },

  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  checkedIn: {
    color: '#198754',
  },

  checkedOut: {
    color: '#2878C8',
  },

  notCheckedIn: {
    color: '#D97706',
  },

  lastAction: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 8,
  },

  eventJson: {
    color: '#334155',
    fontSize: 12,
    lineHeight: 20,
    fontFamily: 'monospace',
  },

  eventNote: {
    color: '#D97706',
    fontSize: 11,
    marginTop: 12,
  },

  checkInButton: {
    backgroundColor: '#198754',
    padding: 16,
    marginHorizontal: 18,
    marginBottom: 11,
    borderRadius: 10,
    alignItems: 'center',
  },

  checkOutButton: {
    backgroundColor: '#D9534F',
    padding: 16,
    marginHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
  },

  footer: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 25,
  },
});
