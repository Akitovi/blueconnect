import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Alert, RefreshControl, Dimensions
} from 'react-native';
import { auth, db } from '../firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

export default function DriverHome() {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const refreshAnim = useRef(null);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      const orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
    } catch (e) {
      console.error('Error loading orders', e);
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

  const acceptOrder = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'accepted',
        driverId: auth.currentUser?.uid || 'unknown'
      });
      Alert.alert('Order Accepted', 'You have accepted this order.');
      fetchOrders();
    } catch (error) {
      alert('Failed to accept order: ' + error.message);
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.label}>Name: <Text style={styles.value}>{item.name || 'N/A'}</Text></Text>
      <Text style={styles.label}>Phone: <Text style={styles.value}>{item.phone || 'N/A'}</Text></Text>
      <Text style={styles.label}>Volume: <Text style={styles.value}>{item.volume || 'N/A'}</Text></Text>

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

      <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptOrder(item.id)}>
        <Text style={styles.acceptText}>Accept</Text>
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
      <Text style={styles.heading}>Orders</Text>

      {refreshing && (
        <View style={styles.refreshAnim}>
          <LottieView
            ref={refreshAnim}
            source={require('../assets/refresh.json')}
            autoPlay
            loop
            resizeMode="cover"
            style={{
              width: width,
              height: 10,
              transform: [{ scale: 1 }]
            }}
          />
        </View>
      )}

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
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
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No pending orders found.</Text>}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: refreshing ? 100 : 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3
  },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#333' },
  value: { fontWeight: 'normal' },
  map: {
    height: 160,
    marginTop: 10,
    borderRadius: 10
  },
  acceptBtn: {
    marginTop: 12,
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  acceptText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refreshAnim: {
    position: 'absolute',
    width: '100%',
  }
});
