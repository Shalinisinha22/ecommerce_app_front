import { View, Text,Dimensions,TouchableOpacity, ScrollView,StyleSheet,Pressable } from 'react-native'
import React, {useState,useEffect} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { TextInput } from 'react-native-gesture-handler'
import { useForm, Controller } from "react-hook-form";
const width = Dimensions.get('screen').width
const Wallet = () => {


  const user= useSelector((state)=>state.user.userInfo?state.user.userInfo:null)
 


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
    <Text
      allowFontScaling={false}
      style={{
        height: 1,
        borderColor: "whitesmoke",
        borderWidth: 2,
        marginBottom: 10
      }}
    />
    <View style={{ alignItems: "center", marginTop: 10 }}>
      <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15, letterSpacing: 2 }}>
      YOUR WALLET
      </Text>
    </View>
    <Text
      allowFontScaling={false}
      style={{
        height: 1,
        borderColor: "whitesmoke",
        borderWidth: 2,
        marginTop: 15,
      }}
    />

    <ScrollView>
      <View style={{ width: width, alignItems: "center", marginTop: 40 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18, letterSpacing: 1.2 }}>Total Amount:</Text>
        <Text style={{ fontSize: 18, marginTop: 5 }}>Rs {user.mani_wallet?user.mani_wallet:"0"}</Text>
        <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginTop: 20,
            width: Dimensions.get('screen').width
          }}
        />
      </View>

   

    </ScrollView>
  </View>
);
}


const styles = StyleSheet.create({
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
  },
  columnData: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: "bold"
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginHorizontal: 2,
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 8
  },
  searchInput: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontSize: 14,
    marginHorizontal: 10,
  }
});
export default Wallet;