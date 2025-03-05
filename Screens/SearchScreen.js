import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather, Entypo, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  handleIncrement,
  handleDecrement,
} from "../redux/actions/userActions";
import { imgUrl } from "../Components/Image/ImageUrl";
import Header from "../Components/Header";
import { ImageBackground } from "react-native";
import Section1 from "../Components/Section1";
import { Searchbar } from "react-native-paper";
import { useShop } from "../Components/ShopContext";

const width = Dimensions.get("screen").width;

export default function SearchBar({ navigation }) {
  const [profileImg, setProfileImg] = useState(null);
  const [filteredProducts, setFilteredProduct] = useState([]);

  let user = useSelector((state) =>
    state.user.userInfo ? state.user.userInfo : null
  );

  const userImg = useSelector((state) =>
    state.user.userImg ? state.user.image : null
  );

  // console.log(user, "header");

  const [wallet, setWallet] = useState(
    user?.mani_wallet + user?.shopping_wallet
  );
  const getWallet = async () => {
    try {
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/wallet_amt",
        {
          params: {
            client_id: user.client_id,
          },
        }
      );

      const data = res.data;
      if (data[0].mani_wallet) {
        // console.log(data[0], "wallet");
        setWallet(data[0].mani_wallet + data[0].shopping_wallet);
        user.mani_wallet = data[0].mani_wallet;
        dispatch({ type: "SET_USER_INFO", payload: user });
      }
    } catch (err) {
      console.log(err.message, "headerwalleterr");
    }
  };

  const getProfileImg = async () => {
    try {
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/clientDetails",
        {
          params: {
            client_id: user.client_id,
          },
        }
      );
      const data = res.data[0];
      setProfileImg(data.image);
    } catch (err) {
      console.log(err.message, "header64");
    }
  };
  useEffect(() => {
    getProfileImg();
  }, [userImg]);
  useEffect(() => {
    getWallet();
  }, [user]);

  const [clicked, setClicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [previousSearches, setPreviousSearches] = useState([]);
  const [error, setError] = useState("");
  const [shopName, setShopName] = useState("");
  const [productId, setProductId] = useState([]);
  const [loading, setLoading] = useState(false);
  const { globalshop } = useShop();
  const lmcId = globalshop;
  const [lmc_id, setLmc] = useState(lmcId);
  // console.log(lmcId, "105", globalshop);

  const handleSearch = (text) => {
    setSearchPhrase(text);
    if(text!==""){
      setLoading(true)
    }

  };

  const searchProducts = async (query) => {
    if(searchPhrase==''){
      setFilteredProduct([])
      return;
    }
    const id = JSON.parse(await AsyncStorage.getItem("shopDetails"));

    setShopName(id ? id.business_name : lmcId.business_name);

    try {
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/searchProducts",
        {
          params: {
            search: searchPhrase,
            client_id: lmcId ? lmcId.client_id : id.client_id,
          },
        }
      );

      // console.log(res.data, "search"); // Handle response

      // Ensure product_image & sale_image are stored as arrays
      const formattedData = res.data.map((item) => ({
        ...item,
        product_image: item.product_image ? JSON.parse(item.product_image) : [], // Parse the JSON string
        sale_image: item.sale_image ? JSON.parse(item.sale_image) : [], // Ensure sale_image is also an array
      }));

      setFilteredProduct(formattedData);
      setLoading(false)
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      searchProducts();
    }, 100);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchPhrase, lmcId]);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isItemInCart = (id) => cart.find((product) => product.pcode === id);

  const getQty = (id) => {
    const product = cart.find((product) => product.pcode === id);
    return product ? product.qty : null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ImageBackground
        source={require("../assets/bg5.png")}
        style={{ opacity: 0.9, marginBottom: 15 }}
      >
        <View style={styles.container}>
          <View
            style={{
              width: width,
              borderRadius: 30,
              borderWidth: 0,
              borderColor: "#a11463",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {/* {console.log(`${imgUrl}/photo/${user.image}`)} */}
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
            {/* {console.log(profileImg,"proflrimg")} */}
            <View style={{ justifyContent: "center" }}>
              {user && (
                <Text
                  allowFontScaling={false}
                  style={{ fontSize: 10, fontWeight: "bold" }}
                >
                  {user.client_entry_name}
                </Text>
              )}
              {/* {user &&  <Text allowFontScaling={false} style={{fontSize:8}}>{user.client_id}</Text> } */}
              {user && (
                <Text
                  allowFontScaling={false}
                  style={{ fontSize: 10, fontWeight: "bold" }}
                >
                  {user?.location?.area},{user?.location?.city}
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  borderWidth: 1,
                  borderColor: "gray",
                  height: 35,
                  borderRadius: 15,
                  paddingHorizontal: 15,
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("wallet")}
              >
                <FontAwesome5 name="wallet" size={20} color="#0a7736" />
                <Text
                  numberOfLines={2}
                  allowFontScaling={false}
                  style={{ color: "#a11463", fontSize: 10, fontWeight: "700" }}
                >
                  {" "}
                  Rs{" "}
                  {user
                    ? Math.round(user.mani_wallet) +
                      Math.round(user.shopping_wallet)
                    : "0"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center" }}>
              <TouchableOpacity
                style={{ alignItems: "center", marginLeft: 8, marginTop: 5 }}
                onPress={() => navigation.navigate("cart")}
              >
                <FontAwesome5 name="shopping-cart" size={25} color="#b6306d" />
                <Text
                  allowFontScaling={false}
                  style={{
                    color: "#0a7736",
                    position: "absolute",
                    top: -12,
                    fontWeight: "700",
                  }}
                >
                  {cart.length}
                </Text>
              </TouchableOpacity>
            </View>

            <Pressable onPress={() => navigation.navigate("Home")}>
              <Image
                source={require("../assets/logo.png")}
                style={{ height: 65, width: 70, resizeMode: "contain" }}
              />
            </Pressable>
          </View>
          {/* <View style={styles.searchBar__unclicked}>
            <Feather
              name="search"
              size={20}
              color="black"
              style={{ marginLeft: 1 }}
            />
            <TextInput
              multiline
              style={styles.input}
              placeholder="Search"
              value={searchPhrase}
              onChangeText={handleSearch}
              onFocus={() => setClicked(true)}
              onBlur={() => setClicked(false)}
            />
            {clicked && (
              <Entypo
                name="cross"
                size={20}
                color="black"
                style={{ padding: 1 }}
                onPress={() => setSearchPhrase("")}
              />
            )}
          </View> */}
          <Searchbar
            placeholder="Search product"
            value={searchPhrase}
            onChangeText={handleSearch}
            onFocus={() => setClicked(true)}
            onBlur={() => setClicked(false)}
            style={{ backgroundColor: "#f0f0f0" }}
          />
        </View>
      </ImageBackground>

      {/* <Section1 navigation={navigation}></Section1> */}
      {/* {console.log(loading)} */}

      {loading?<ActivityIndicator></ActivityIndicator>:null}

      {error ? (
        <Text
          allowFontScaling={false}
          style={{ color: "red", textAlign: "center", marginTop: 20 }}
        >
          {error}
        </Text>
      ) : (
        <>
          <View style={{ paddingLeft: 20, marginTop: 0 }}>
            {/* <Text style={{ letterSpacing: 2, fontSize: 15 }}>Previously searched products</Text> */}
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ marginTop: 20, padding: 10 }}
          >
            <View
              style={{ flexDirection: "row", flexWrap: "wrap", width: width }}
            >
              {filteredProducts.map(
                (product, index) =>
                  product && (
                    <Pressable
                      key={index}
                      onPress={() =>
                        navigation.navigate("productInner", { item: product })
                      }
                      style={styles.productCard}
                    >
                      {/* {console.log(product,"search")} */}
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          left: 5,
                          top: 0,
                          backgroundColor: "#111",
                          borderRadius: 20,
                          paddingHorizontal: 10,
                          zIndex: 1000,
                        }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 10,
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#fff",
                          }}
                        >
                          {Math.round(
                            ((product.mrp - product.price) / product.mrp) * 100
                          )}
                          % OFF
                        </Text>
                      </TouchableOpacity>

                      <Image
                        style={styles.productImage}
                        source={{
                          uri: `${imgUrl}/eproduct/${
                            product.sale_image?.[0] ||
                            product.product_image?.[0]
                          }`,
                        }}
                      />
                      <View
                        onPress={() =>
                          navigation.navigate("productInner", { item: product })
                        }
                        style={{ marginTop: 8 }}
                      >
                        <Text
                          style={styles.productName}
                          allowFontScaling={false}
                        >
                          {product.product_name}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={styles.productBrand}
                        >
                          {product.brand_name}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={styles.productMRP}
                        >
                          Rs {product.mrp}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={styles.productPrice}
                        >
                          Rs {product.price}
                        </Text>
                      </View>
                      {isItemInCart(product.pcode) ? (
                        <View style={styles.cartButtons}>
                          <TouchableOpacity
                            onPress={() =>
                              dispatch(handleDecrement({ id: product.pcode }))
                            }
                            style={styles.qtyButton}
                          >
                            <Text
                              allowFontScaling={false}
                              style={{
                                color:
                                  getQty(product.pcode) == 1 ? "gray" : "black",
                                fontSize: 15,
                              }}
                            >
                              -
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.qtyCount}>
                            <Text
                              allowFontScaling={false}
                              style={{
                                color:
                                  getQty(product.pcode) == product.cart_limit
                                    ? "gray"
                                    : "black",
                              }}
                            >
                              {getQty(product.pcode)}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              dispatch(handleIncrement({ id: product.pcode }))
                            }
                            style={{
                              color:
                                getQty(product.pcode) == product.cart_limit
                                  ? "gray"
                                  : "black",
                            }}
                          >
                            <Text allowFontScaling={false}>+</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            dispatch(
                              addToCart({
                                item: product,
                                id: product.pcode,
                                shop: shopName,
                              })
                            )
                          }
                          style={styles.addToCartButton}
                        >
                          <Text
                            allowFontScaling={false}
                            style={styles.addToCartText}
                          >
                            <Entypo
                              name="shopping-cart"
                              size={20}
                              color="white"
                            />{" "}
                            ADD TO CART
                          </Text>
                        </TouchableOpacity>
                      )}
                    </Pressable>
                  )
              )}
            </View>

            {filteredProducts.length == 0 && !loading &&  (
              <Text style={{ textAlign: "center" }}>No Product Found</Text>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // margin: 15,
    backgroundColor: "#fff",
    // justifyContent: "center",
    // alignItems: "center",
    // flexDirection: "row",
    width: width,
  },
  searchBar__unclicked: {
    padding: 8,
    flexDirection: "row",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "space-evenly",
    marginLeft: 20,
    marginTop: 10,
  },
  input: {
    fontSize: 14,
    marginLeft: 10,
    width: "80%",
    backgroundColor: "#fff",
  },

  profileImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginTop: 10,
  },
  productCard: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    borderColor: "#D0D0D0",
    // marginTop: 10,
    width: width * 0.45,
    margin: 5,
  },

  productImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  productName: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: 10,
  },
  productBrand: {
    fontWeight: "300",
    fontSize: 10,
    textAlign: "center",
  },
  productMRP: {
    fontSize: 10,
    fontWeight: "bold",
    textDecorationLine: "line-through",
    textAlign: "center",
    color: "#800000",
  },
  productPrice: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "#228B22",
  },
  cartButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    paddingVertical: 5,
    marginTop: 10,
    width: "100%",
    padding: 10,
  },
  qtyButton: {
    paddingHorizontal: 5,
  },
  qtyCount: {
    paddingHorizontal: 5,
  },
  addToCartButton: {
    borderRadius: 10,
    backgroundColor: "#228B22",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  addToCartText: {
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
});
