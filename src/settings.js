import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, Switch, FlatList } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // make sure this is your Firebase config

export default function Settings() {
  const [currentScreen, setCurrentScreen] = useState('main');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notifications, setNotifications] = useState({
    orderUpdates: false,
    promotions: false
  });
  const [language, setLanguage] = useState('English');

  const languages = ['English', 'Hindi', 'Tamil'];

  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  // Fetch data from Firestore
  useEffect(() => {
    if (uid) {
      const fetchData = async () => {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setNotifications(data.notifications || { orderUpdates: false, promotions: false });
          setLanguage(data.language || 'English');
        }
      };
      fetchData();
    }
  }, [uid]);

  const saveData = async (field, value) => {
    if (!uid) return;
    const ref = doc(db, 'users', uid);
    await setDoc(ref, { [field]: value }, { merge: true });
  };

  const navigateTo = (screen) => {
    Animated.timing(slideAnim, {
      toValue: -1,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setCurrentScreen(screen);
      slideAnim.setValue(1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    });
  };

  const goBack = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setCurrentScreen('main');
      slideAnim.setValue(-1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    });
  };

  const renderMain = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.item} onPress={() => navigateTo('profile')}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigateTo('notifications')}>
        <Text>Notification Preferences</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigateTo('language')}>
        <Text>Language</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfile = () => (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        onBlur={() => saveData('name', name)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        onBlur={() => saveData('phone', phone)}
      />
    </View>
  );

  const renderNotifications = () => (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>Notification Preferences</Text>
      <View style={styles.row}>
        <Text>Order Updates</Text>
        <Switch
          value={notifications.orderUpdates}
          onValueChange={(val) => {
            const updated = { ...notifications, orderUpdates: val };
            setNotifications(updated);
            saveData('notifications', updated);
          }}
        />
      </View>
      <View style={styles.row}>
        <Text>Promotions</Text>
        <Switch
          value={notifications.promotions}
          onValueChange={(val) => {
            const updated = { ...notifications, promotions: val };
            setNotifications(updated);
            saveData('notifications', updated);
          }}
        />
      </View>
    </View>
  );

  const renderLanguage = () => (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>Language</Text>
      <FlatList
        data={languages}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, language === item && styles.selected]}
            onPress={() => {
              setLanguage(item);
              saveData('language', item);
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-400, 0, 400]
    }) }] }}>
      {currentScreen === 'main' && renderMain()}
      {currentScreen === 'profile' && renderProfile()}
      {currentScreen === 'notifications' && renderNotifications()}
      {currentScreen === 'language' && renderLanguage()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20,color: '#007AFF' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  back: { fontSize: 16, color: '#007AFF', marginBottom: 20,marginTop:20},
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  selected: { backgroundColor: '#e6f0ff' }
});
