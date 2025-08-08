import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.label}>Enter the custom amount of water (in Liters)</Text>
          <TextInput
            placeholder="Eg: 750"
            placeholderTextColor="#555"
            keyboardType="numeric"
            style={styles.input}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.button} onPress={submitOrder}>
            <Text style={styles.buttonText}>Submit Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  container: { padding: 20, backgroundColor: '#f5f7fa', borderRadius: 10 },
  label: { fontSize: 18, marginBottom: 10, color: '#0d65d9', fontWeight: 'bold' },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    color: '#000' // typed text dark
  },
  button: { backgroundColor: '#0d65d9', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
