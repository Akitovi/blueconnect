import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomerRegister from './src/CustomerRegister';
import DriverRegister from './src/DriverRegister';

const Tab = createBottomTabNavigator();

export default function RegisterTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'Customer') iconName = 'person';
          else if (route.name === 'Driver') iconName = 'car';

          return (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name={iconName} size={20} color={focused ? '#fff' : '#ccc'} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Customer" component={CustomerRegister} />
      <Tab.Screen name="Driver" component={DriverRegister} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0f0f0f',
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    marginHorizontal: 40,
    bottom: 40,
    paddingBottom: 5,
    borderTopWidth: 0,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 25,
  },
  activeIconContainer: {
    backgroundColor: '#2196f3',
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderRadius: 25,
  },
});
