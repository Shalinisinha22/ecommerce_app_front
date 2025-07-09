import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, Dimensions, TouchableOpacity, ScrollView, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FlatListSlider } from 'react-native-flatlist-slider';
import { Entypo,Ionicons } from '@expo/vector-icons';
import Header from '../Components/Header';
import Section5 from '../Components/Section5';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQty, handleIncrement, handleDecrement } from '../redux/actions/userActions';
import { imgUrl } from '../Components/Image/ImageUrl';
const width = Dimensions.get('screen').width
import Carousel from 'react-native-reanimated-carousel';
import axios from 'axios';
import { htmlToText } from "html-to-text";
import { decode } from "html-entities";

const ProductInnerScreen = ({ navigation }) => {
  const route = useRoute()
  const [bannerImage, setBanner] = useState([])
  const { details } = route.params.item;

  // Step 1: Decode HTML entities (convert &lt;pre&gt; to <pre>)
  const decodedHTML = decode(details);

  // Step 2: Remove <pre> and other HTML tags
  const plainText = decodedHTML.replace(/<\/?[^>]+(>|$)/g, "").trim();


  // useEffect(() => {
  //   const backAction = () => {
  //     // Ensure navigation is available and go back in the navigation stack
  //     if (navigation.canGoBack()) {

  //       console.log("goback")
  //       if(route.params?.screen){
  //         navigation.pop();
  //       }


  //     } 

  //     return true; // Prevent the default back button behavior
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => {
  //     backHandler.remove(); // Clean up the event listener
  //   };
  // }, [navigation]);

  // console.log(route.params.item.sale_image[0],route.params.item.product_image[0])

  useEffect(() => {
    getImage()
  }, [route])


  const getImage = async () => {


    let imgArr = [];

    // Check if `image` exists and has elements

    if (route.params.item.sale_image && route.params.item.sale_image.length > 0) {
      for (let i = 0; i < route.params.item.sale_image.length; i++) {
        // console.log("sale_image");
        imgArr.push({
          image: `${imgUrl}/eproduct/${route.params.item.sale_image[i]}`,
          id: i
        });
      }
    }

    // Check if `sale_image` exists and has elements
    else if (route.params.item.product_image && route.params.item.product_image.length > 0) {
      for (let i = 0; i < route.params.item.product_image.length; i++) {
        // console.log("image");
        imgArr.push({
          image: `${imgUrl}/eproduct/${route.params.item.product_image[i]}`,
          id: i
        });
        // console.log(imgArr);
      }
    }
    setBanner(imgArr);
  };





  const handleImagePress = (item) => {
    // Alert.alert(`Image with ID: ${item.id} pressed!`);
  };

  const [carts, setCarts] = useState([])



  const cart = useSelector((state) => state.cart.cart);
  // console.log("cart redux",cart)
  const dispatch = useDispatch();





  const isItemInCart = (id) => {
    if (cart) {
      const isPresent = carts.find((product) => product.pcode == id ? true : false)
      return isPresent
    }
  }
  const getQty = (id) => {

    if (cart) {
      const product = carts.find((product) => product.pcode === id);
      return product ? product.qty : null;
    }



  };



  const handleCart = (item, id) => {

    dispatch(addToCart({ item, id: id }));

  }




  const handleIncrementProduct = (id) => {

    dispatch(handleIncrement({ id: id }))



  }
  const handleDecrementProduct = (id) => {

    dispatch(handleDecrement({ id: id }))
  }





  useEffect(() => {
    setCarts(cart)
  }, [cart])


  return (


    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* {console.log(bannerImage)} */}

      <View style={{ width: width, alignItems: "center" }}>
        <Header navigation={navigation}></Header>
        {/* <Section1 navigation={navigation}></Section1> */}
      </View>

      <ScrollView>
            <TouchableOpacity style={{marginLeft:10}} onPress={()=>navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={{ marginLeft: 15, marginTop: 10 }}>PRODUCT DETAILS</Text>

        <View style={{ marginTop: 40 }}>
    

          <TouchableOpacity style={{
            position: "absolute",
            left: 5,
            top: -10,
            backgroundColor: "#111",
            borderRadius: 20,
            paddingHorizontal: 10,
            zIndex: 1000
          }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 10,
                fontWeight: "bold",
                textAlign: "center",
                color: "#fff",

              }}
            >
              {Math.round(((route.params.item.mrp - route.params.item.price) / route.params.item.mrp) * 100)}% OFF
            </Text>
          </TouchableOpacity>


          <Carousel
            loop
            width={width}
            height={width / 2}
            autoPlay
            data={bannerImage}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                style={{ resizeMode: "contain", width: width, height: "100%" }}
                source={{ uri: item.image }}
              />
            )}
          />
        </View>

     
        <View style={{ marginTop: 15, paddingLeft: 20, width: width * 0.9 }}>
          {console.log(route.params?.item)}
          <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: 700 }}>{route.params?.item?.name || route.params?.item?.product_name}</Text>

          <Text allowFontScaling={false} style={{ fontSize: 12, color: "gray", marginTop: 5 }}>Manufactured by {route.params.item.brand_name}</Text>
          <Text allowFontScaling={false} style={{ textDecorationLine: "line-through", color: "gray", fontSize: 10, marginTop: 10 }}>RS {route.params.item.mrp}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text allowFontScaling={false} style={{ fontSize: 16 }}>RS {route.params.item.price} </Text>
            <Text allowFontScaling={false} style={{ fontSize: 10, color: "#0a7736" }}>OFFER PRICE</Text>
          </View>
          <Text
        allowFontScaling={false}
  
        style={{
          fontSize: 10,
          color: "gray",
          textAlign: "justify",
          marginTop: 10,
        }}
      >
        {plainText}
      </Text>
            {/* {console.log(route.params.item.details,  "plain",plainText)} */}

        </View>

        {isItemInCart(route.params.item.pcode) ? <View style={{ flexDirection: "row", width: width, justifyContent: "space-around", marginTop: 10 }}>
          <TouchableOpacity onPress={() => handleDecrementProduct(route.params.item.pcode)} style={{ paddingVertical: 2, borderWidth: 1, borderColor: "#D0D0D0", paddingHorizontal: 15 }}><Text allowFontScaling={false} style={{ fontSize: 15 }}>-</Text></TouchableOpacity>
          <TouchableOpacity style={{ paddingVertical: 2, borderWidth: 1, borderColor: "#D0D0D0", paddingHorizontal: 35 }}><Text>{getQty(route.params.item.pcode)}</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleIncrementProduct(route.params.item.pcode)} style={{ paddingVertical: 2, borderWidth: 1, borderColor: "#D0D0D0", paddingHorizontal: 15 }}><Text>+</Text></TouchableOpacity>
        </View> :

          <View style={{ width: width, alignItems: "center", marginTop: 20, marginBottom: 30 }}>
            <TouchableOpacity onPress={() => handleCart(route.params.item)} style={{ backgroundColor: "#0a7736", paddingVertical: 15, paddingHorizontal: 35, borderRadius: 15 }}><Text allowFontScaling={false} style={{ letterSpacing: 2, color: "#fff" }}><Entypo name="shopping-cart" size={20} color="white" />  ADD TO CART</Text></TouchableOpacity>
          </View>}



        {/* <Section5 navigation={navigation}></Section5> */}
      </ScrollView>



    </View>

  );
}

export default ProductInnerScreen;
