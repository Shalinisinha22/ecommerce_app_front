import { 
  View, Text, Dimensions, Image, ImageBackground, 
  TouchableOpacity, StyleSheet, Pressable 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import SearchBar from './SearchBar';
import { imgUrl } from './Image/ImageUrl';

const Header = ({ navigation }) => {
  const route = useRoute();
  console.log(route.params?.wallet)
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);
  const userImg = useSelector((state) => state.user.userImg || null);
  const cart = useSelector((state) => state.cart.cart);

  const [wallet, setWallet] = useState(
    Math.round(user?.mani_wallet || 0) + Math.round(user?.shopping_wallet || 0)
  );
  const [profileImg, setProfileImg] = useState(null);

  const width = Dimensions.get('screen').width;

  // Fetch wallet data
  const getWallet = async()=>{
    console.log("hello from wallet")
    try{
    const res= await axios.get("https://mahilamediplex.com/mediplex/wallet_amt",{
      params:{
        client_id:user.client_id
      }
    })
  
    const data = res.data
    console.log("header hme",data[0])
    if(data[0].mani_wallet || data[0].shopping_wallet){
      console.log(data[0],"wallet")
      setWallet(Math.round(user?.mani_wallet || 0) + Math.round(user?.shopping_wallet || 0))
      user.mani_wallet= data[0].mani_wallet
      user.shopping_wallet= data[0].shopping_wallet
      dispatch({ type: 'SET_USER_INFO', payload: user});
  
    }
    }
    catch(err){
      console.log(err.message,"headerwalleterr")
    }
   }

  // Fetch profile image
  const getProfileImg = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/clientDetails", {
        params: { client_id: user?.client_id },
      });

      const data = res.data[0];
      setProfileImg(data.photo);
    } catch (err) {
      console.log("Error fetching profile image:", err.message);
    }
  };

  useEffect(() => {

      getWallet();

  }, [user,route.params?.wallet]);

  useEffect(() => {
    if (userImg) {
      getProfileImg();
    }
  }, [userImg]);

  return (
    <ImageBackground
      source={require("../assets/bg5.png")}
      style={{ width: width, backgroundColor: "#d8f3dc", opacity: 0.9 }}
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          {/* Profile Image or Menu Icon */}
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.profileImageContainer}>
            {profileImg ? (
              <Image 
                style={styles.profileImage} 
                source={{ uri: `${imgUrl}/photo/${profileImg}` }} 
              />
            ) : user?.user_image ? (
              <Image 
                style={styles.profileImage} 
                source={{ uri: `${imgUrl}/photo/${user.user_image}` }} 
              />
            ) : (
              <Entypo name="menu" size={40} color="#155d27" />
            )}
          </TouchableOpacity>

          {/* User Info */}
          <View style={styles.userInfo}>
            {user && <Text style={styles.userName}>{user.first_name}</Text>}
            {user && <Text style={styles.userId}>{user.client_id}</Text>}
          </View>

          {/* Wallet */}
          <TouchableOpacity 
            style={styles.walletContainer} 
            onPress={() => navigation.navigate("wallet")}
          >
            <FontAwesome5 name="wallet" size={20} color="#0a7736" />
            <Text numberOfLines={2} allowFontScaling={false}style={{ color: "#a11463", fontSize: 10, fontWeight: '700' }}>  Rs {user?Math.round(user.mani_wallet) + Math.round(user.shopping_wallet):"0"}</Text>

            {/* <Text style={styles.walletAmount}>  Rs {wallet}</Text> */}
          </TouchableOpacity>

          {/* Cart */}
          <TouchableOpacity 
            style={styles.cartContainer} 
            onPress={() => navigation.navigate("cart")}
          >
            <FontAwesome5 name="shopping-cart" size={25} color="#b6306d" />
            <Text style={styles.cartCount}>{cart.length}</Text>
          </TouchableOpacity>

          {/* App Logo */}
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Image 
              source={require("../assets/logo.png")} 
              style={styles.logo} 
            />
          </Pressable>
        </View>

        {/* Search Bar */}
        <SearchBar navigation={navigation} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fffffc",
    borderBottomWidth: 5,
    borderBottomColor: "#fff",
    flexWrap: "wrap",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
  },
  profileImageContainer: {
    paddingTop: 7,
  },
  profileImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  userInfo: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  userId: {
    fontSize: 8,
  },
  walletContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "gray",
    height: 35,
    borderRadius: 15,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  walletAmount: {
    color: "#a11463",
    fontSize: 10,
    fontWeight: "700",
  },
  cartContainer: {
    alignItems: "center",
    marginLeft: 8,
    marginTop: 5,
  },
  cartCount: {
    color: "#0a7736",
    position: "absolute",
    top: -12,
    fontWeight: "700",
  },
  logo: {
    height: 65,
    width: 70,
    resizeMode: "contain",
  },
});

export default Header;
