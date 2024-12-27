import { View, Text, Dimensions, Image, ImageBackground, Animated, RefreshControl, BackHandler, Alert } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Section1 from '../Components/Section1';
import Section2 from '../Components/Section2';
import Section3 from '../Components/Section3';
import Section4 from '../Components/Section4';
import Section5 from '../Components/Section5';
import { imgUrl } from '../Components/Image/ImageUrl';
import Section8 from '../Components/Section8';
import Section7 from '../Components/Section7';
import Section6 from '../Components/Section6';
import axios from 'axios';
import Header from '../Components/Header';
import { useSelector } from 'react-redux';
import { get } from 'react-hook-form';

const HomeScreen = ({ navigation }) => {
  const width = Dimensions.get('screen').width;

  const userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);

  const [wallet, setWallet] = useState(userInfo?.mani_wallet);
  const [shoppingWallet, setShoppingWallet] = useState(userInfo?.shopping_wallet);


  const getWallet = async () => {
    console.log(userInfo)
    if (userInfo?.mani_wallet) {
      setWallet(userInfo.mani_wallet);
    
    }
    if (userInfo?.shopping_wallet) {
      setShoppingWallet(userInfo.shoppingWallet);
    
    }
  };

  useEffect(() => {
    getWallet();
  },[userInfo]);

  const scrollY = useRef(new Animated.Value(0)).current;

 
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try{
      const res= await axios.get("https://mahilamediplex.com/mediplex/wallet_amt",{
        params:{
          client_id:userInfo?.client_id
        }
      })
    
      const data = res.data
      console.log("header hme",data[0])
      if(data[0].mani_wallet || data[0].shopping_wallet){
        console.log(data[0],"wallet")
        setWallet(Math.round(userInfo?.mani_wallet || 0) + Math.round(userInfo?.shopping_wallet || 0))
        userInfo.mani_wallet= data[0].mani_wallet
        userInfo.shopping_wallet= data[0].shopping_wallet
        dispatch({ type: 'SET_USER_INFO', payload: user});
    
      }
      }
      catch(err){
        console.log(err.message,"headerwalleterr")
      }
    setRefreshing(false);
  };
  
  useEffect(() => {
    if (userInfo) {
      setWallet(userInfo?.mani_wallet);
      setShoppingWallet(userInfo?.shopping_wallet);
    }
  }, [userInfo]); // Sync local state when Redux state changes
  

  const cart = useSelector((state) => state.cart ? state.cart.cart : null);

  const verifyCart = async (item) => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/verifyCart", {
        params: { product_id: item.sale_id },
      });

      if (res.status !== 200) {
        dispatch(removeFromCart(item.pcode));
      } else {
        console.log("verifyCart successful");
      }
    } catch (err) {
      console.log("Error in verifyCart:", err.message);
    }
  };

  useEffect(() => {
    if (cart) {
      cart.forEach(element => {
        verifyCart(element);
      });
    }
  }, [cart]);
  useEffect(()=>{

  },[])

  return (
    <ImageBackground style={{ width: width, flex: 1, backgroundColor: "#fff", opacity: 1 }}>
      <Header navigation={navigation} wallet={wallet} />
{/* <Text style={{margin:10}}>{userInfo?.shopping_wallet}</Text> */}
      <Animated.ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Section1 navigation={navigation} />
        <Section2 navigation={navigation} />
        <Section4 navigation={navigation} />
        <Section3 navigation={navigation} />
        <Section5 navigation={navigation} />
        <Section6 navigation={navigation} />
        <Section7 navigation={navigation} />
        <Section8 navigation={navigation} />
      </Animated.ScrollView>
    </ImageBackground>
  );
};

export default HomeScreen;
