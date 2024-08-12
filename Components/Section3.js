import { View, Text, Dimensions,ImageBackground,Image } from 'react-native'
import React from 'react'
const width= Dimensions.get('screen').width
const Section3 = () => {
  return (
    <View style={{width:width,alignItems:"flex-start",marginTop:15,backgroundColor:"#fff"}}>
  <Image source={require("../assets/n2.png")} style={{width:width,height:250}} imageStyle={{borderRadius:20,resizeMode:"contain"}}>
</Image>
    </View>

  )
}

export default Section3