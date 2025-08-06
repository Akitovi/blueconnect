import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // ✅ Updated

export default function CustomerRegister({ navigation }) {
  const [form, setForm] = useState({
    name: '', email: '', address: '', password: '', confirmPassword: '', phone: ''
  });

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        role: 'customer',
        ...form,
        createdAt: new Date()
      });

      navigation.navigate('Tabs', { role: 'customer' });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.jpg")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.header}>Register as Customer</Text>
      <TextInput placeholder="Name" style={styles.input} onChangeText={(text) => handleChange('name', text)} />
      <TextInput placeholder="Email" style={styles.input} keyboardType='email-address' onChangeText={(text) => handleChange('email', text)} />
      <TextInput placeholder="Phone number" style={styles.input} keyboardType='phone-pad' maxLength={10} onChangeText={(text) => handleChange('phone', text)} />
      <TextInput placeholder="Address" style={styles.input} onChangeText={(text) => handleChange('address', text)} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={(text) => handleChange('password', text)} />
      <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} onChangeText={(text) => handleChange('confirmPassword', text)} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center'
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 10,
    marginTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start'
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    width: '100%'
  },
  button: {
    backgroundColor: '#0d65d9',
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
