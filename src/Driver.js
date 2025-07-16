import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Alert, RefreshControl, Dimensions
} from 'react-native';
import { auth, db } from '../firebase';
import { collection, getDocs, updateDoc, doc, query, where, addDoc, serverTimestamp,getDoc,orderBy  } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import { Linking } from 'react-native';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function DriverHome() {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const refreshAnim = useRef(null);

  const fetchOrders = async () => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('status', '==', 'pending'),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);

      const fetchedOrders = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const orderData = docSnap.data();
          const userRef = doc(db, 'users', orderData.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};

          return {
            id: docSnap.id,
            ...orderData,
            name: userData.name || 'Unknown',
            phone: userData.phone || 'N/A',
          };
        })
      );

      setOrders(fetchedOrders);
    } catch (e) {
      console.error('Error loading orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshAnim.current?.play();
    fetchOrders().then(() => {
      setTimeout(() => {
        refreshAnim.current?.reset();
        setRefreshing(false);
      }, 1200);
    });
  }, []);

  const acceptOrder = async (order) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to navigate.');
        return;
      }

      const driverLocation = await Location.getCurrentPositionAsync({});
      const origin = `${driverLocation.coords.latitude},${driverLocation.coords.longitude}`;
      const destination = `${order.location.latitude},${order.location.longitude}`;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

      await updateDoc(doc(db, 'orders', order.id), {
        status: 'accepted',
        driverId: auth.currentUser?.uid || 'unknown'
      });

      await addDoc(collection(db, 'notifications'), {
        userId: order.uid,
        message: `Your ${order.volume} order has been accepted!`,
        timestamp: serverTimestamp(),
        read: false,
        role: 'customer'
      });

      Alert.alert('Order Accepted', 'You have accepted this order.');

      if (await Linking.canOpenURL(url)) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open Google Maps.');
      }

      fetchOrders();
    } catch (error) {
      alert('Failed to accept order: ' + error.message);
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.headerRow}>
        <Text style={styles.orderName}>{item.name}</Text>
        <Text style={styles.timeText}>
          {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : ''}
        </Text>
      </View>
      <Text style={styles.detailText}>📞 {item.phone}</Text>
      <Text style={styles.detailText}>💧 Volume: {item.volume}L</Text>

      {item.location?.latitude && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: item.location.latitude,
            longitude: item.location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
          scrollEnabled={false}
          
          zoomEnabled={false}
        >
          <Marker coordinate={item.location} />
        </MapView>
      )}

      <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptOrder(item)}>
        <Text style={styles.acceptText}>Accept Order</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <LottieView
          source={require('../assets/Loading.json')}
          autoPlay
          loop
          style={{ width: 180, height: 180 }}
        />
        <Text style={{ marginTop: 12, color: '#333' }}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Driver Dashboard</Text>

      {refreshing && (
        <LottieView
          ref={refreshAnim}
          source={require('../assets/refresh_blue_wave_clean.json')}
          autoPlay
          loop
          resizeMode="cover"
          style={styles.refreshAnim}
        />
      )}

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={['transparent']}
            progressBackgroundColor="transparent"
            progressViewOffset={-300}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending orders. You're all caught up</Text>
        }
        contentContainerStyle={{ paddingBottom: 40, paddingTop: refreshing ? 100 : 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fbff', padding: 16 },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0d47a1',
    textAlign: 'center',
    marginTop: 16,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  orderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  timeText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4
  },
  detailText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#555'
  },
  map: {
    height: 160,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden'
  },
  acceptBtn: {
    marginTop: 16,
    backgroundColor: '#0d47a1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  acceptText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refreshAnim: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 200
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 15,
    marginTop: 20
  }
});
