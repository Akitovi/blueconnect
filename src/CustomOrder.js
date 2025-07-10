// src/CustomOrder.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function CustomOrder({ navigation }) {
  const [amount, setAmount] = useState('');

  const submitOrder = () => {
    if (amount) {
      navigation.navigate("Order", { volume: amount + "L" });
    } else {
      alert("Please enter a valid amount");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter the custom amount of water (in Liters)</Text>
      <TextInput
        placeholder="Eg: 750"
        keyboardType="numeric"
        style={styles.input}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={submitOrder}>
        <Text style={styles.buttonText}>Submit Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f7fa', justifyContent: 'center' },
  label: { fontSize: 18, marginBottom: 10 },
  input: { backgroundColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#0d65d9', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
