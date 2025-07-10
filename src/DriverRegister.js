
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

export default function DriverRegister({ navigation }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', vehicleNumber: '', password: '', confirmPassword: ''
  });

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        role: 'driver',
        ...form,
        createdAt: new Date()
      });
      navigation.navigate('Tabs', { role: 'driver' });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../assets/logo.jpg")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.header}>Register as Driver</Text>

      <View style={styles.formCard}>
        <TextInput placeholder="Name" style={styles.input} onChangeText={(text) => handleChange('name', text)} />
        <TextInput placeholder="Email" style={styles.input} onChangeText={(text) => handleChange('email', text)} />
        <TextInput placeholder="Phone Number" keyboardType="phone-pad" style={styles.input} onChangeText={(text) => handleChange('phone', text)} />
        <TextInput placeholder="Address" style={styles.input} onChangeText={(text) => handleChange('address', text)} />
        <TextInput placeholder="Vehicle Number" style={styles.input} onChangeText={(text) => handleChange('vehicleNumber', text)} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={(text) => handleChange('password', text)} />
        <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} onChangeText={(text) => handleChange('confirmPassword', text)} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff7f0',
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
    width: '100%'
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
  }
});
