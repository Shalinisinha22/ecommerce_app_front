import { View, Text, ScrollView,Pressable, Image, FlatList,Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Foundation,Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { imgUrl } from '../Components/Image/ImageUrl';

const PackageScreen = ({navigation}) => {
  
    const [healthPackageProducts,setHealthPackageProducts]=useState(null)

    const getHealthPackageProducts= async()=>{
        try{
           const res= await axios.get("https://mahilamediplex.com/mediplex/healthPackage")
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
         {/* <Text
        allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "whitesmoke",
          borderWidth: 2,
          marginBottm:10
        }}
      /> */}

<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 0,paddingLeft:0}}>
<Entypo name="menu" size={40} color="#155d27" />
   
            </TouchableOpacity>

         <View style={{ alignItems: "center", marginTop: 10 }}>
           <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15,letterSpacing:2 }}>
           Explore Health Package
           </Text>
         </View>
         <Pressable onPress={()=>navigation.navigate("Home")}>
              <Image source={require("../assets/logo.png")} style={{ height: 80, width: 80, resizeMode: "contain" }} />
            </Pressable> 
                     </View>
         <Text
     allowFontScaling={false}
     style={{
       height: 1,
       borderColor: "whitesmoke",
       borderWidth: 2,
       marginTop: 10,
     }}
   />
        <ScrollView  keyboardShouldPersistTaps='handled' >


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
style={{ width: 250, height: 150, resizeMode: "contain" }}
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
<Text allowFontScaling={false} style={{textAlign:"center",letterSpacing:2,marginTop:20,marginBottom:20}}>No Products</Text>}

          </ScrollView>  


    
  
    </View>
  )
}

export default PackageScreen