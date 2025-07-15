import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Settings({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Notification Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Language</Text>
      </TouchableOpacity>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0d65d9',
    marginBottom: 30,
  },
  option: {
    backgroundColor: '#e8f0fe',
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  logoutBtn: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
