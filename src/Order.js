import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Order({ route, navigation }) {
  const { volume } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      <Text style={styles.subtitle}>You selected the {volume} container</Text>

      <TouchableOpacity style={styles.confirmBtn} onPress={() => alert('Order placed!')}>
        <Text style={styles.confirmText}>Confirm Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    color: '#0d65d9',
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 40,
  },
  confirmBtn: {
    backgroundColor: '#0d65d9',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  cancelText: {
    color: '#333',
    fontSize: 15,
  },
});
