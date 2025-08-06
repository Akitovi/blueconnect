import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity
} from 'react-native';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    const role = 'customer';

    const q = query(
      collection(db, 'notifications'),
      where('role', '==', role),
      where('userId', 'in', [uid, 'all_drivers']), 
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(fetched);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (notifId) => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, item.read ? styles.read : styles.unread]}
      onPress={() => markAsRead(item.id)}
    >
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp?.toDate().toLocaleString() || ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No notifications</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#f6f9ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 16,
    textAlign: 'center'
  },
  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  unread: {
    backgroundColor: '#d0e8ff'
  },
  read: {
    backgroundColor: '#f0f0f0'
  },
  message: {
    fontSize: 16,
    color: '#222',
    marginBottom: 4
  },
  timestamp: {
    fontSize: 12,
    color: '#777'
  },
  empty: {
    textAlign: 'center',
    color: '#555',
    marginTop: 40,
    fontSize: 15
  }
});
