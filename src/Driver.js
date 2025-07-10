
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function DriverHome() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, 'orders'));
      const orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
    };
    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Customer Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.label}>Name: {item.name}</Text>
            <Text>Amount: {item.volume}</Text>
            <Text>Address: {item.address}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f7fa' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  orderCard: { padding: 14, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8 },
  label: { fontWeight: 'bold' }
});
