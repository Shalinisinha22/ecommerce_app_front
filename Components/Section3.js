import { View, Text, Dimensions,ImageBackground,Image } from 'react-native'
import React from 'react'
const width= Dimensions.get('screen').width
const Section3 = () => {
  return (
  <ImageBackground source={require("../assets/n2.png")} style={{width:width,height:200,marginTop:30}} imageStyle={{resizeMode:"cover"}}>
</ImageBackground>


  )
}

export default Section3