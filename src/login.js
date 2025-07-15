import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput, Image, ScrollView} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import LottieView from 'lottie-react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCyRo6yXcGdTAVR6M5CKlwRPFDnbNogrbg",
  authDomain: "blueconnect-47909.firebaseapp.com",
  projectId: "blueconnect-47909",
  storageBucket: "blueconnect-47909.firebasestorage.app",
  messagingSenderId: "585057120917",
  appId: "1:585057120917:web:3906c4e4f2ed106b78e19c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isHidden: true,
      loading:false
    }
  }
  login = async () => {
  const { email, password } = this.state;
  this.setState({ loading: true });

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data();
      const role = userData.role || 'customer';

      this.setState({ loading: false });
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs', params: { role } }]
      });
    } else {
      throw new Error("User data not found");
    }

  } catch (error) {
    this.setState({ loading: false });
    alert("Login failed: " + error.message);
  }
};

 

  render(){
    let {email, password, isHidden} = this.state;
     if (this.state.loading) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5'}}>
      <LottieView
        source={require('../assets/Loading.json')} 
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}
    return(
        <ScrollView> 
            <View style={{backgroundColor: "#F6F6F6", flex: 1, paddingTop: "17%"}}>
            <Image source={require("../assets/logo.jpg")} style={{height: 200, width: "100%"}} resizeMode="contain" />
            <TextInput
              style={{
                  width:"90%",
                  height:50,
                  marginHorizontal: "5%",
                  backgroundColor: "#fff",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  marginBottom: 16,
                  color: "#000",
                  fontSize: 16
              }}
              value={email}
              placeholder={"Email ID"}
              placeholderTextColor={"#9E9E9E"}
              onChangeText={(txt) =>  this.setState({email: txt})}
              keyboardType="email-address"
          />
          <View style={{flexDirection: "row", width:"90%", marginHorizontal: "5%"}}>
            <TextInput
              style={{
                  width: "100%",
                  height:50,
                  backgroundColor: "#fff",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  marginBottom: 16,
                  color: "#000",
                  fontSize: 16
              }}
              value={password}
              placeholder={"Password"}
              placeholderTextColor={"#9E9E9E"}
              onChangeText={(txt) =>  this.setState({password: txt})}
              secureTextEntry={isHidden}
            />
            <TouchableOpacity onPress={()=>this.setState({isHidden: !this.state.isHidden})} style={{position: "absolute", right: 10, top: 15}}>
              <AntDesign name="eyeo" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
              onPress={this.login}
              style={{backgroundColor: "#0d65d9", paddingVertical: 14, borderRadius: 10, width: "90%", marginHorizontal: "5%", marginTop: 25}}>
              <Text style={{color: "#fff", fontWeight:"bold", textAlign: "center", fontSize: 16}}>LOGIN</Text>
          </TouchableOpacity>
          <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: "5.5%", marginVertical: 22}}>
            <View style={{borderBottomWidth: 0.6, width: "44%", borderBottomColor: "#a5a5a5"}}>
            </View>
            <Text>Or</Text>
            <View style={{borderBottomWidth: 0.6, width: "44%", borderBottomColor: "#a5a5a5"}}>
            </View>
          </View>
          <TouchableOpacity
              onPress={()=>this.props.navigation.navigate("RegisterTabs", {
    screen: "Dashboard",
    params: { screen: "Home" }})}
              style={{backgroundColor: "#000", paddingVertical: 14, borderRadius: 10, width: "90%", marginHorizontal: "5%"}}>
              <Text style={{color: "#fff", fontWeight:"bold", textAlign: "center", fontSize: 16}}>Register</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
    )
  }
}