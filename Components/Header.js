import {
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as Location from "expo-location";
import { useRoute } from "@react-navigation/native";
import SearchBar from "./SearchBar";
import { imgUrl } from "./Image/ImageUrl";

const Header = ({ navigation }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user.userInfo || null);
  // console.log("userheader", user.image)
  
    const userImg= useSelector((state)=> state.user.userImg?state.user.image:null)
  const cart = useSelector((state) => state.cart.cart);

  const [wallet, setWallet] = useState(
    Math.round(user?.mani_wallet || 0) + Math.round(user?.shopping_wallet || 0)
  );
  const [profileImg, setProfileImg] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const width = Dimensions.get("screen").width;

  // Fetch wallet data
  const getWallet = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/wallet_amt", {
        params: {
          client_id: user.client_id,
        },
      });

      const data = res.data;
      if (data[0].mani_wallet || data[0].shopping_wallet) {
        setWallet(
          Math.round(user?.mani_wallet || 0) + Math.round(user?.shopping_wallet || 0)
        );
        user.mani_wallet = data[0].mani_wallet;
        user.shopping_wallet = data[0].shopping_wallet;
        dispatch({ type: "SET_USER_INFO", payload: user });
      }
    } catch (err) {
      console.log("Error fetching wallet data:", err.message);
    }
  };

  // Fetch profile image
  const getProfileImg = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/clientDetails", {
        params: { client_id: user?.client_id },
      });

      const data = res.data[0];
      console.log(data)
      setProfileImg(data.image);
    } catch (err) {
      console.log("Error fetching profile image:", err.message);
    }
  };

  // Fetch user location
  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const area = reverseGeocode[0].district || reverseGeocode[0].subregion;
        const city = reverseGeocode[0].city || reverseGeocode[0].region;
        setLocation({ area, city });
        let newUser=user
        newUser.location= { area, city }
        dispatch({ type: 'SET_USER_INFO', payload: newUser})

      }
    } catch (err) {
      console.log("Error fetching location:", err.message);
    }
  };

  useEffect(() => {
    getWallet();
  }, [user, route.params?.wallet]);

  useEffect(() => {
    if (userImg) {
      getProfileImg();
    }
  }, [userImg]);

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/bg5.png")}
      style={{ width: width, backgroundColor: "#d8f3dc", opacity: 0.9 }}
    >

   
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          {/* Profile Image or Menu Icon */}
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.profileImageContainer}
          >
            {profileImg ? (
              <Image
                style={styles.profileImage}
                source={{ uri: `${imgUrl}/photo/${profileImg}` }}
              />
            ) : user?.image ? (
              <Image
                style={styles.profileImage}
                source={{ uri: `${imgUrl}/photo/${user.image}` }}
              />
            ) : (
              <Entypo name="menu" size={40} color="#155d27" />
            )}
          </TouchableOpacity>

          {/* User Info */}
          <View style={styles.userInfo}>
            {user && <Text style={styles.userName}>{user.client_entry_name}</Text>}
            {/* {user && <Text style={styles.userId}>{user.client_id}</Text>} */}
            {location && (
              <Text style={styles.userLocation}>
                {location.area}, {location.city}
              </Text>
            )}
          </View>

          {/* Wallet */}
          <TouchableOpacity
            style={styles.walletContainer}
            onPress={() => navigation.navigate("wallet")}
          >
            <FontAwesome5 name="wallet" size={20} color="#0a7736" />
            <Text
              numberOfLines={2}
              allowFontScaling={false}
              style={{
                color: "#a11463",
                fontSize: 10,
                fontWeight: "700",
              }}
            >
              {" "}
              Rs{" "}
              {user
                ? Math.round(user.mani_wallet) + Math.round(user.shopping_wallet)
                : "0"}
            </Text>
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
            <Image source={require("../assets/logo.png")} style={styles.logo} />
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
  userLocation: {
    fontSize: 10,
    color: "#0a7736",
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
