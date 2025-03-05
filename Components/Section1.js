import { View, Text, Dimensions, ImageBackground,Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import Carousel from 'react-native-reanimated-carousel';
import axios from 'axios';
const width = Dimensions.get('screen').width


const Section1 = () => {

   const [bannerImg,setBannerImg]= useState(null)

   const getBannerImg= async()=>{
    try{
       const res = await axios.get("https://mahilamediplex.com/mediplex/bannerImage")
       const data= res.data
       setBannerImg(data)
    }
    catch(err){
      console.log(err.message)
    }
   }
   useEffect(()=>{
    getBannerImg()
   },[])
  return (

<View style={{ flex: 1 }}>
  {
    bannerImg!=null && 

    <Carousel
    loop
    width={width}
    height={150}
    autoPlay={true}
    data={bannerImg}
    scrollAnimationDuration={1000}
    renderItem={({ item, index }) => (
      <Image
        style={{ height: "100%",width:width, resizeMode:"stretch" }}
        source={{ uri: `https://mahilamediplex.com/upload/app_banner/${item.image}` }}
      />
    )}
  />
  
  }

</View>
  )
}


export default Section1

  