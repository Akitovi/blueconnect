import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function DriverOrderView({ route }) {
  const { location } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Location</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          ...location,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={location} title="Customer Location" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  map: { flex: 1, borderRadius: 10 }
});
