import { View, Text, StyleSheet, ActivityIndicator, Alert,Image, Dimensions,TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FlatListSlider } from 'react-native-flatlist-slider';
import { Entypo } from '@expo/vector-icons';
import Header from '../Components/Header';
import Section5 from '../Components/Section5';
import { useRoute } from '@react-navigation/native';

const width = Dimensions.get('screen').width
const ProductInnerScreen = ({navigation}) => {
const route=useRoute()  



    const [bannerImage, setBanner] = useState([])

  

    useEffect(()=>{
     getImage()
    },[])


    const getImage = async () => {
      console.log("43", route.params.item.product_image);
      console.log("43", route.params.item.sale_image);
    
      let imgArr = [];
    
      // Check if `image` exists and has elements
      if (route.params.item.product_image && route.params.item.product_image.length > 0) {
        for (let i = 0; i < route.params.item.product_image.length; i++) {
          console.log("image");
          imgArr.push({
            image: `http://192.168.0.109:3000/upload/eproduct/${route.params.item.product_image[i]}`,
            id: i
          });
          console.log(imgArr);
        }
      }
      // Check if `sale_image` exists and has elements
      else if (route.params.item.sale_image && route.params.item.sale_image.length > 0) {
        for (let i = 0; i < route.params.item.sale_image.length; i++) {
          console.log("sale_image");
          imgArr.push({
            image: `http://192.168.0.109:3000/upload/eproduct/${route.params.item.sale_image[i]}`,
            id: i
          });
        }
      } else {
        console.log("nothing");
      }
    
      setBanner(imgArr);
    };
    
      



    const handleImagePress = (item) => {
        // Alert.alert(`Image with ID: ${item.id} pressed!`);
    };

    return (


        <View style={{flex:1,backgroundColor:"#fff"}}>

            <View style={{width:width,alignItems:"center"}}>
            <Header navigation={navigation}></Header>
            </View>

            <ScrollView>
            <Text style={{marginLeft:15,marginTop:20}}>PRODUCT DETAILS</Text>



<View style={{marginTop:20}}>

  {console.log(bannerImage)}

{
                bannerImage.length !== 0 ?
                    <FlatListSlider
                        data={bannerImage}
                        height={180}
                        indicatorActiveColor={'#0a7736'}
                        indicatorActiveWidth={30}
                      
                    />
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator color={"#f08080"} size={"large"} />
                    </View>
            }

</View>
<View style={{marginTop:15,paddingLeft:20,width:width*0.9}}>
<Text allowFontScaling={false} style={{fontSize:16,fontWeight:700}}>{route.params.item.name}</Text>

<Text allowFontScaling={false} style={{fontSize:12,color:"gray",marginTop:5}}>Manufactured by {route.params.item.brand_name}</Text>
<Text  allowFontScaling={false} style={{ textDecorationLine:"line-through",color:"gray",fontSize:10,marginTop:10}}>RS {route.params.item.mrp}</Text>
<View style={{flexDirection:"row",alignItems:"center"}}>
<Text  allowFontScaling={false} style={{ fontSize:16 }}>RS {route.params.item.mrp} </Text>
<Text  allowFontScaling={false} style={{ fontSize:10,color:"#0a7736" }}>OFFER PRICE</Text>
</View>
<Text  allowFontScaling={false} numberOfLines={4} style={{ fontSize:10,color:"gray",textAlign:"justify",marginTop:10}}>
  {route.params.item.details}</Text>
</View>


<View style={{width:width,alignItems:"center",marginTop:20,marginBottom:30}}>
  <TouchableOpacity style={{backgroundColor:"#0a7736",paddingVertical:15,paddingHorizontal:35,borderRadius:15}}><Text style={{letterSpacing:2,color:"#fff"}}><Entypo name="shopping-cart" size={20} color="white"/>  ADD TO CART</Text></TouchableOpacity>
</View>



<Section5 navigation={navigation}></Section5>
            </ScrollView>

    
 
        </View>
  
    );
}

export default ProductInnerScreen;
