import { View, Text, Dimensions,ImageBackground,Image } from 'react-native'
import React,{useState,useEffect} from 'react'
import axios from 'axios'
const width= Dimensions.get('screen').width
const Section3 = () => {
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
    bannerImg!=null && 

      <ImageBackground source={{ uri: `https://mahilamediplex.com/upload/app_banner/${bannerImg[0].image}` }}
  style={{width:width,height:200,marginTop:30}} imageStyle={{resizeMode:"contain"}}>
</ImageBackground>
    
  


  )
}

export default Section3