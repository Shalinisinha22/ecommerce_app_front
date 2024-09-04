import { View, Text, ScrollView,Pressable, Image, FlatList,Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Foundation,Entypo } from '@expo/vector-icons';
import axios from 'axios';
const width = Dimensions.get('screen').width
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react';
import { imgUrl } from '../Components/Image/ImageUrl';

const PackageScreen = ({navigation}) => {
  
    const [healthPackageProducts,setHealthPackageProducts]=useState(null)

    const getHealthPackageProducts= async()=>{
        try{
           const res= await axios.get("http://192.168.0.109:3002/mediplex/healthPackage")
           const data = res.data
           setHealthPackageProducts(data)
        }
        catch(err){
            console.log(err.message)
        }
    }

    useEffect(()=>{
        getHealthPackageProducts()
    },[])

    const handleBuy= async(price,id)=>{
      navigation.navigate("paymentScreen", {price:price,package:id})
    }





  return (
    <View style={{flex:1,backgroundColor:"#fff"}}>
         <Text
        allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "whitesmoke",
          borderWidth: 2,
          marginBottm:10
        }}
      />
            <View style={{ alignItems: "center", marginTop: 15 }}>
              <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15,letterSpacing:2 }}>
                Explore Health Package
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


      {
        healthPackageProducts!=null ?
      healthPackageProducts.map((item)=>(
        <Pressable
        key={item.id}
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderWidth:2,
          borderRadius:20,
          padding:10,
          borderColor:"#D0D0D0",
          margin:10
          
        }}

      >

<Image
style={{ width: 250, height: 130, resizeMode: "contain" }}
source={{ uri: `${imgUrl}/product/${item.image}` }}
/>


       
        <View style={{margin:5}}>
          <Text allowFontScaling={false}style={{fontWeight:600,textAlign:"center"}}>{item.name}</Text>
          <Text  allowFontScaling={false} style={{ textAlign: "center",textDecorationLine:"line-through",color:"gray",fontSize:10 }}>
           Rs {item.mrp}
          </Text>
<View style={{flexDirection:"row",alignItems:"center",marginLeft:15}}>
<Text  allowFontScaling={false} style={{ fontSize:12,fontWeight:"bold" }}>RS {item.price} </Text>
<Text  allowFontScaling={false} style={{ fontSize:8,color:"#0a7736" }}>OFFER PRICE</Text>
</View>
        </View>

       
<TouchableOpacity

style={{
backgroundColor: "#9e0059",
paddingVertical: 10,
paddingHorizontal:20,
justifyContent: "center",
alignItems: "center",
marginTop: 1,
borderRadius: 6,
marginTop:5,


}}
onPress={()=>handleBuy(item.price,item.package_id)}
>
<Text allowFontScaling={false}
style={{
textAlign: "center",
color: "white",
fontSize: 13,
fontWeight: "bold",
}}
><Entypo name="shopping-cart" size={20} color="white"/>  BUY
</Text>
</TouchableOpacity>
    
      </Pressable>
      ))
       
          


            
:
<Text style={{textAlign:"center",letterSpacing:2,marginTop:20,marginBottom:20}}>No Products</Text>}

  
    </View>
  )
}

export default PackageScreen