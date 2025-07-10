
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: 'Customer'
    };
  }

  async componentDidMount() {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(docRef);
      if (userSnap.exists()) {
        this.setState({ userName: userSnap.data().name });
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.username}>{this.state.userName}</Text>
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
                <TouchableOpacity style={styles.orderBtn}
                  onPress={() => this.props.navigation.navigate("Order", { volume: item.volume })}
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
  customOrderButton: {
    backgroundColor: '#0d65d9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center'
  },
  customOrderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
