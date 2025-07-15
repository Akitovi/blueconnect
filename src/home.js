import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView, Linking } from 'react-native';
import * as Location from 'expo-location';
import { auth, db } from '../firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: 'Customer',
      locationGranted: null,
      location: null,
    };
  }

  async componentDidMount() {
    this.fetchUserName();
    this.askLocationPermission();
  }

  fetchUserName = async () => {
    try {
      const uid = auth.currentUser.uid;
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        this.setState({ userName: data.name });
      }
    } catch (err) {
      console.log("Failed to load user:", err.message);
    }
  };

  askLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        this.setState({ locationGranted: false });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      this.setState({ locationGranted: true, location });
    } catch (err) {
      this.setState({ locationGranted: false });
      console.warn("Error getting location:", err);
    }
  };

  render() {
    const { userName, locationGranted, location } = this.state;

    if (locationGranted === false) {
      return (
        <View style={styles.centered}>
          <Text style={styles.permissionText}>Location permission is required to place an order.</Text>
          <TouchableOpacity
            onPress={() => Linking.openSettings()}
            style={styles.enableBtn}
          >
            <Text style={styles.enableText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.username}>{userName}</Text>
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Notifications")}>
              <Image source={require('../assets/bell.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {[
            { label: 'Perfect for small households or individuals', volume: '250L' },
            { label: 'Ideal for medium-sized families', volume: '500L' },
            { label: 'Best for large families or businesses', volume: '1000L' }
          ].map((item, index) => (
            <View key={index} style={styles.card}>
              <ImageBackground
                source={require('../assets/cardbg.jpg')}
                style={styles.imageBackground}
                imageStyle={{ borderRadius: 20 }}
              >
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardSub}>{item.volume} container</Text>
                <TouchableOpacity
                  style={styles.orderBtn}
                  onPress={() =>
                    this.props.navigation.navigate("Order", {
                      volume: item.volume,
                      location: location
                    })
                  }
                >
                  <Text style={styles.orderBtnText}>Order Now</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  enableBtn: {
    backgroundColor: '#0d65d9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  enableText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  greeting: { fontSize: 26, fontWeight: '700', color: '#222' },
  username: { fontSize: 26, fontWeight: '700', color: '#3567aa', marginLeft: 6 },
  icons: { flexDirection: 'row', marginLeft: 'auto' },
  icon: { width: 24, height: 24, marginLeft: 14, tintColor: '#333' },
  card: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  imageBackground: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1E1E1E' },
  cardSub: { fontSize: 14, color: '#4e5d6a', marginBottom: 12 },
  orderBtn: {
    backgroundColor: '#11a2dc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-end'
  },
  orderBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
