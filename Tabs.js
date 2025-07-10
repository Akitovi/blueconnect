import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Pages
import Home from "./src/home";
import Settings from './src/settings';
import Order from './src/Order';
import Account from './src/Account';
import Notifications from './src/notifications';
import History from "./src/History"
import CustomOrder from './src/CustomOrder';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Dashboard Stack
const HomeScreens = () => (
    <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
            name="Homescreen"
            component={Home}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="Order"
            component={Order}
            options={{ headerShown: false }}
        />
         <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={{ headerShown: false }}
        />
        </Stack.Navigator>
);     
const SettingScreens = () => (
    <Stack.Navigator initialRouteName="Settings">
        <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
        />
    </Stack.Navigator>
    
);
export default function Tabs(){
return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'water' : 'water-outline';
           else if (route.name === 'Add') iconName = focused ? 'add' : 'add-outline';
           else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline';
          return (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name={iconName} size={20} color={focused ? '#fff' : '#ccc'} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Add" component={CustomOrder} />
      <Tab.Screen name="Home" component={HomeScreens} />
      <Tab.Screen name="Account" component={Account} />
      

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
    paddingBottom: 0,
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
  iconLabel: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
});;