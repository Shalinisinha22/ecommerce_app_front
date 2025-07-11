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
import React, { useState, useEffect, memo } from "react";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as Location from "expo-location";
import { useRoute } from "@react-navigation/native";
import SearchBar from "./SearchBar";
import { imgUrl } from "./Image/ImageUrl";

// Memoized Image Component to prevent unnecessary re-renders
const MemoizedImage = memo(({ source, style }) => (
  <Image source={source} style={style} />
));

const Header = ({ navigation }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.userInfo || null);
  const userImg = useSelector((state) => state.user?.userImg || null);
  const cart = useSelector((state) => state.cart.cart);

  const [wallet, setWallet] = useState(
    Math.round(user?.mani_wallet || 0) + Math.round(user?.shopping_wallet || 0)
  );
  const [profileImg, setProfileImg] = useState(null);
  const [location, setLocation] = useState(user?.location || null);
  const [errorMsg, setErrorMsg] = useState(null);

  const width = Dimensions.get("screen").width;

  // Get profile image URI
  const getProfileImageUri = () => {
    const image = profileImg || userImg || user?.image;
    return image ? { uri: `${imgUrl}/photo/${image}` } : null;
  };

  const getWallet = async () => {
    try {
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/wallet_amt",
        {
          params: {
            client_id: user.client_id,
          },
          headers: { "Cache-Control": "no-cache" },
        }
      );

      const data = res.data;
      if (data[0].mani_wallet || data[0].shopping_wallet) {
        setWallet(
          Math.round(data[0].mani_wallet || 0) +
            Math.round(data[0].shopping_wallet || 0)
        );
        user.mani_wallet = data[0].mani_wallet;
        user.shopping_wallet = data[0].shopping_wallet;
        dispatch({ type: "SET_USER_INFO", payload: user });
      }
    } catch (err) {
      console.log("Error fetching wallet data:", err.message);
    }
  };

  const getProfileImg = async () => {
    try {
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/clientDetails",
        {
          params: { client_id: user?.client_id },
          headers: { "Cache-Control": "no-cache" },
        }
      );

      const data = res.data[0];
      setProfileImg(data.image);
      if (data.client_entry_name !== user?.client_entry_name) {
        dispatch({
          type: "SET_USER_INFO",
          payload: { ...user, client_entry_name: data.client_entry_name },
        });
      }
    } catch (err) {
      console.log("Error fetching profile image:", err.message);
    }
  };

  const fetchLocation = async (retries = 3) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permission denied");
        console.log("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const area = reverseGeocode[0].district || reverseGeocode[0].subregion || "Unknown Area";
        const city = reverseGeocode[0].city || reverseGeocode[0].region || "Unknown City";
        const newLocation = { area, city };
        setLocation(newLocation);
        let newUser = { ...user, location: newLocation };
        dispatch({ type: "SET_USER_INFO", payload: newUser });
        console.log("Location updated:", newLocation);
      } else {
        console.log("No geocode data received");
      }
    } catch (err) {
      console.log("Error fetching location:", err.message);
      if (retries > 0) {
        console.log(`Retrying location fetch... (${retries} attempts left)`);
        setTimeout(() => fetchLocation(retries - 1), 2000);
      } else {
        setErrorMsg("Failed to fetch location");
      }
    }
  };

  useEffect(() => {
    if (user?.client_id) {
      getWallet();
      getProfileImg();
      if (!location || !user?.location) {
        fetchLocation();
      }
    }
  }, [user?.client_id, userImg, user?.client_entry_name, user?.image]);

  return (
    <ImageBackground
      source={require("../assets/bg5.png")}
      style={{ width: width, backgroundColor: "#d8f3dc", opacity: 0.9 }}
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.profileImageContainer}
          >
            {getProfileImageUri() ? (
              <MemoizedImage
                style={styles.profileImage}
                source={getProfileImageUri()}
              />
            ) : (
              <Entypo name="menu" size={40} color="#155d27" />
            )}
          </TouchableOpacity>
          <View style={styles.userInfo}>
            {user && (
              <Text style={styles.userName}>{user.client_entry_name || "User"}</Text>
            )}
            {location && (
              <Text style={styles.userLocation}>
                {location.area}, {location.city}
              </Text>
            )}
          </View>
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
              Rs {wallet}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate("cart")}
          >
            <FontAwesome5 name="shopping-cart" size={25} color="#b6306d" />
            <Text style={styles.cartCount}>{cart.length}</Text>
          </TouchableOpacity>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
            />
          </Pressable>
        </View>
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
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  userInfo: {
    justifyContent: "center",
    maxWidth: 100,
  },
  userName: {
    fontSize: 10,
    fontWeight: "bold",
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