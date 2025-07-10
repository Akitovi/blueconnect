import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput, Image, ScrollView} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";

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
      isHidden: true
    }
  }
  login = () => {
    let {email, password} = this.state;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user)
      this.props.navigation.navigate("Tabs")
    })
    .catch((error) => {

      alert("Not LOGGED IN" + error)
    });
  }
  render(){
    let {email, password, isHidden} = this.state;
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
          <TouchableOpacity
              onPress={()=>this.props.navigation.navigate("Tabs")}
              style={{backgroundColor: "#000", paddingVertical: 14, borderRadius: 10, width: "90%", marginHorizontal: "5%"}}>
              <Text style={{color: "#fff", fontWeight:"bold", textAlign: "center", fontSize: 16}}>home</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
    )
  }
}