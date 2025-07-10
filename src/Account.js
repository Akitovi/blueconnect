import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Account({ navigation }) {
  const [userData, setUserData] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        alert('User data not found!');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d65d9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{userData.name}</Text>
      <Text style={styles.email}>{userData.email}</Text>

      <View style={styles.details}>
        <Text style={styles.detailLabel}>Phone:</Text>
        <Text style={styles.detailValue}>{userData.phone || 'N/A'}</Text>
        <Text style={styles.detailLabel}>Address:</Text>
        <Text style={styles.detailValue}>{userData.address}</Text>
      </View>

      <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#f2f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  details: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  detailLabel: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
  detailValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  settingsBtn: {
    marginTop: 20,
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  settingsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: '#ff5252',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
