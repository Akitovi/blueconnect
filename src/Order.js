import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import { auth, db } from '../firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function Order({ route, navigation }) {
  const { volume } = route.params || {};
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [markerCoord, setMarkerCoord] = useState(null);
  const animationRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission is required.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setMarkerCoord(currentLocation.coords);
      setLoading(false);
    })();
  }, []);

 const handleConfirm = async () => {
  const user = auth.currentUser;
  if (!user) return;

  setConfirming(true);
  try {
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

    await addDoc(collection(db, 'notifications'), {
      userId: 'all_drivers',
      role: 'driver',
      message: `New order: ${volume} from ${userData.name || 'a customer'}`,
      timestamp: new Date(),
      read: false
    });

    setTimeout(() => {
      setConfirming(false); 
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    }, 2000); 
  } catch (err) {
    Alert.alert('Error', 'Failed to save order: ' + err.message);
    setConfirming(false);
  }
};


  const onAnimationFinish = () => {
    navigation.navigate('Home');
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
        <Text style={styles.loaderText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      <Text style={styles.subtitle}>You selected the {volume} container</Text>
      <Text style={styles.helperText}>Drag the pin to confirm your delivery location:</Text>

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

      <TouchableOpacity
        style={[styles.confirmBtn, confirming && { opacity: 0.6 }]}
        onPress={handleConfirm}
        disabled={confirming}
      >
        <Text style={styles.confirmText}>
          {confirming ? 'Placing Order...' : 'Confirm Order'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Go Back</Text>
      </TouchableOpacity>

     {confirming && (
  <View style={styles.confirmOverlay}>
    <LottieView
      source={require('../assets/confirming.json')}
      autoPlay
      loop={false}
      style={{ width: 180, height: 180 }}
    />
    <Text style={styles.confirmingText}>Order Confirmed!</Text>
    </View>
  )}

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f9fc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#0d65d9' },
  subtitle: { fontSize: 16, marginBottom: 6 },
  helperText: { marginBottom: 10, fontSize: 14, color: '#444' },
  map: { height: 260, borderRadius: 10, marginBottom: 20 },
  confirmBtn: {
    backgroundColor: '#0d65d9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  confirmText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#e0e0e0',
    padding: 14,
    borderRadius: 10,
  },
  cancelText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 15,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  confirmOverlay: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  confirmingText: {
    fontSize: 16,
    marginTop: 12,
    color: '#444',
  },
});
