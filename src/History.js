
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function History() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(collection(db, 'orders'), where('uid', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(list.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()));
      } catch (err) {
        console.error("Failed to fetch order history", err);
      }
    };

    fetchHistory();
  }, []);

  const renderItem = ({ item }) => (
   <ScrollView showsVerticalScrollIndicator={false} >
     <View style={styles.card}>
      <Text style={styles.label}>Volume: <Text style={styles.value}>{item.volume}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}>{item.status}</Text></Text>
      <Text style={styles.label}>Time: <Text style={styles.value}>{item.timestamp?.toDate().toLocaleString()}</Text></Text>
    </View>
   </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No previous orders.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20,marginTop:20 },
  card: {
    backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 1 }, elevation: 3
  },
  label: { fontWeight: 'bold', color: '#333' },
  value: { fontWeight: 'normal' }
});
