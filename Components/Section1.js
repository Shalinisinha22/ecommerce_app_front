import { View, Text, Dimensions, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
const width = Dimensions.get('screen').width

const Section1 = () => {

   
  return (
   <ImageBackground source={require("../assets/b13.png")} style={{width:width,alignItems:"flex-end",marginTop:0,height:250,opacity:1,paddingTop:40}} imageStyle={{resizeMode:"cover",borderRadius:10}}>

    <View style={{  paddingVertical:10,borderRadius:30,borderWidth:0,borderColor:"#fff",opacity:0.9,backgroundColor:null,width:width * 0.85,alignItems:"center"}}>
        <Text allowFontScaling={false} style={{letterSpacing:1,fontSize:25,marginBottom:20,color:"black",fontWeight:700,textAlign:"center"}}>BASIC</Text>
        <View style={{borderWidth:1.5,borderColor:"#fff",paddingHorizontal:8,paddingVertical:10,borderRadius:15,alignItems:"center",marginLeft:18,backgroundColor:"#f1cfdf",opacity:0.7}}>
        <Text allowFontScaling={false} style={{color:"#14080e",fontWeight:900,fontSize:18}}> 10  <Entypo name="cross" size={12} color="green" />  30 <Entypo name="cross" size={12} color="green" /> 10  month <MaterialCommunityIcons name="equal" size={15} color="green" />  Rs 3000</Text>

        </View>

    </View>


   </ImageBackground>
  )
}

export default Section1

    {/* <View style={{width:width * 0.95 , paddingVertical:30, alignItems:"center",borderRadius:30,borderWidth:4,borderColor:"#fff",backgroundColor:"#ffc2d1",opacity:0.9}}>
        <Text allowFontScaling={false} style={{letterSpacing:1,fontSize:25,marginBottom:10,color:"black",fontWeight:700}}>BASIC</Text>
        <View style={{borderWidth:1.5,borderColor:"#fff",paddingHorizontal:15,paddingVertical:12,borderRadius:20}}>
        <Text allowFontScaling={false} style={{color:"#14080e",fontWeight:900,fontSize:18}}> 10  <Entypo name="cross" size={20} color="white" />  30 <Entypo name="cross" size={20} color="white" />  10  month <MaterialCommunityIcons name="equal" size={20} color="white" />  Rs 3000</Text>

        </View>

    </View> */}