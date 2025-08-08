import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function DriverRegister({ navigation }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', vehicleNumber: '', password: '', confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, 'users', uid), {
        uid,
        role: 'driver',
        ...form,
        createdAt: new Date()
      });

      navigation.navigate('Tabs', { role: 'driver' });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/Loading.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff7f0' }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={120} // bigger so Confirm Password & Register are visible
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require("../assets/logo.jpg")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.header}>Register as Driver</Text>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#555"
            style={styles.input}
            onChangeText={(text) => handleChange('name', text)}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#555"
            style={styles.input}
            onChangeText={(text) => handleChange('email', text)}
          />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#555"
            keyboardType="phone-pad"
            style={styles.input}
            onChangeText={(text) => handleChange('phone', text)}
          />
          <TextInput
            placeholder="Address"
            placeholderTextColor="#555"
            style={styles.input}
            onChangeText={(text) => handleChange('address', text)}
          />
          <TextInput
            placeholder="Vehicle Number"
            placeholderTextColor="#555"
            style={styles.input}
            onChangeText={(text) => handleChange('vehicleNumber', text)}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#555"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => handleChange('password', text)}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#555"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => handleChange('confirmPassword', text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer to keep content above bottom tabs */}
        <View style={{ height: 40 }} />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4169e1',
    marginBottom: 20,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    width: '100%',
    color: '#000',
  },
  button: {
    backgroundColor: '#4169e1',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff7f0',
  },
});
