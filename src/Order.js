import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import { auth, db } from '../firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';


export default function Order({ route, navigation }) {
  const { volume } = route.params || {};
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markerCoord, setMarkerCoord] = useState(null);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to place an order.');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
      setLocation(currentLocation.coords);
      setMarkerCoord(currentLocation.coords);

    })();
  }, []);

const handleConfirm = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    // 1. Fetch user details from 'users' collection
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    await addDoc(collection(db, 'orders'), {
      uid: user.uid,
      name: userData.name || 'Unknown',
      phone: userData.phone || 'N/A',
      volume,
      location: markerCoord,
      timestamp: new Date(),
      status: 'pending'
    });

    alert('Order confirmed and location saved!');
    navigation.navigate('Home');
  } catch (err) {
    alert('Failed to save order: ' + err.message);
  }
};

  if (loading) {
    return (
      <View style={styles.loader}>
        <LottieView
          source={require('../assets/Loading.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ marginTop: 10, fontSize: 16, color: '#333' }}>Getting your location...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loader}>
        <Text>Location not available. Please enable location services.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      <Text style={styles.subtitle}>You selected the {volume} container</Text>
      <Text style={{ marginBottom: 10 }}>Drag the pin to confirm your delivery location:</Text>

      <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      <Marker
        coordinate={markerCoord}
        draggable
        onDragEnd={(e) => setMarkerCoord(e.nativeEvent.coordinate)}
        title="Drag to Adjust Location"
      />
    </MapView>
    


      <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f9fc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#0d65d9' },
  subtitle: { fontSize: 16, marginBottom: 20 },
  map: { height: 250, borderRadius: 10, marginBottom: 20 },
  confirmBtn: {
    backgroundColor: '#0d65d9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  confirmText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  cancelBtn: {
    backgroundColor: '#e0e0e0',
    padding: 14,
    borderRadius: 10,
  },
  cancelText: { textAlign: 'center', color: '#333' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
