import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { Foundation, Entypo } from "@expo/vector-icons";
import axios from "axios";
const width = Dimensions.get("screen").width;
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQty,
  handleIncrement,
  handleDecrement,
} from "../redux/actions/userActions";
import { imgUrl } from "./Image/ImageUrl";
import { useShop } from "./ShopContext";
const Section6 = ({ navigation }) => {
  const [shopId, setShopId] = useState("");
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState([]);

  const [shopName, setShopName] = useState("");
  const { globalshop } = useShop();
  const lmcId = globalshop;
  const [lmc_id, setLmc] = useState(lmcId);
  const [loading,setLoading]= useState(false)

  const getProductsId = async (shop) => {
    const id = JSON.parse(await AsyncStorage.getItem("shopDetails"));

    setShopName(id ? id.business_name : lmcId.business_name);

    try {
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/getProductId",
        {
          params: { client_id: lmcId ? lmcId.client_id : id.client_id },
        }
      );

      if (res.data.length == 0) {
        getDefaultShop();
      } else {
        const pidArr = res.data.map((item) => item.pid);
        // console.log("PID Array:", pidArr);

        setProductId(pidArr);
        await getProducts(pidArr);
      }
    } catch (err) {
      console.log("Error fetching product IDs:", err.message);
    }
  };

  const getProducts = async (pidArr) => {
    try {
      const productPromises = pidArr.map((pid) =>
        axios.get("https://mahilamediplex.com/mediplex/products", {
          params: { product_id: pid },
        })
      );

      const responses = await Promise.all(productPromises);

      const productArr = responses
        .map((res) => {
          const data = res.data;

          return data.map((item) => {
            if (item.sale_image) {
              item.sale_image = JSON.parse(item.sale_image);
            }
            if (item.product_image) {
              item.product_image = JSON.parse(item.product_image);
            }
            return item;
          });
        })
        .flat();
      let filterProduct = [];
      filterProduct = productArr.filter(
        (item) => item.category_name == "SURGICAL PRODUCT"
      );
      // console.log("Final Product Array:", filterProduct);

      setProducts(filterProduct);
      setLoading(true)
    } catch (err) {
      console.log("Error fetching products:", err.message);
    }
  };

  useEffect(() => {
    getProductsId();
  }, [lmcId]);

  const [carts, setCarts] = useState([]);

  const cart = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();

  const isItemInCart = (id) => {
    if (cart) {
      const isPresent = carts.find((product) =>
        product.pcode == id ? true : false
      );
      return isPresent;
    }
  };
  const getQty = (id) => {
    if (cart) {
      const product = carts.find((product) => product.pcode === id);
      return product ? product.qty : null;
    }
  };

  const handleCart = (item, id, shop) => {
    dispatch(addToCart({ item, id: id, shop }));
  };

  const removeFromCart = (id) => {};

  const handleIncrementProduct = (id) => {
    dispatch(handleIncrement({ id: id }));
  };
  const handleDecrementProduct = (id) => {
    dispatch(handleDecrement({ id: id }));
  };

  useEffect(() => {
    setCarts(cart);
  }, [cart]);

  return (

      <View
        style={{
          marginTop: 10,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 4,
          borderColor: "#D0D0D0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                padding: 10,
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 3,
                color: "#b6306d",
              }}
            >
              SPECIAL
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 16,
                fontWeight: "700",
                letterSpacing: 3,
                color: "",
              }}
            >
              PRODUCTS
            </Text>
          </View>
          {products.length != 0 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AllProducts", {
                  products: products,
                  shopName,
                })
              }
              style={{ paddingRight: 20 }}
            >
              <Text style={{ fontWeight: "bold", color: "#0a7736" }}>
                VIEW ALL
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ paddingRight: 10 }}>
        <FlatList
                    data={!loading ? [1, 2, 3, 4]:products.slice(0, 10)}  // Limit to 10 products
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => 
                      !loading ? (
                        <View style={styles.emptyBox}>
                          <ActivityIndicator size="small" color="#999" />
                        </View>
                      )
                        :
        
                      <Pressable
                        key={item.id}
                        style={styles.productCard}
                        onPress={() => navigation.navigate("productInner", { item: item,shopName })}
                      >
                        
                          <TouchableOpacity style={{
                            position: "absolute",
                            left: 5,
                            top: 0,
                            backgroundColor: "#111",
                            borderRadius:20,
                            paddingHorizontal:10,
                            zIndex:1000
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
                              {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                            </Text>
                          </TouchableOpacity>
        
                        
                        {item.sale_image && item.sale_image.length > 0 ? (
                          <Image
                            style={styles.productImage}
                            source={{ uri: `${imgUrl}/eproduct/${item.sale_image[0]}` }}
                          />
                        ) : (
                          <Image
                            style={styles.productImage}
                            source={{ uri: `${imgUrl}/eproduct/${item.product_image[0]}` }}
                          />
                        )}
                        <View style={{ marginTop: 8 }}>
                          <Text allowFontScaling={false} style={styles.productName}>{item.name}</Text>
                          <Text allowFontScaling={false} style={styles.productBrand}>{item.brand_name}</Text>
                          <Text
                            allowFontScaling={false}
                            style={styles.productMRP}
                          >
                            Rs {item.mrp}
                          </Text>
                          <Text
                            allowFontScaling={false}
                            style={styles.productPrice}
                          >
                            RS {item.price}
                          </Text>
        
        
        
                        </View>
        
                        {isItemInCart(item.pcode) ? (
                         <View style={styles.cartButtons}>
                                                 <TouchableOpacity onPress={() => handleDecrementProduct(item.pcode)} style={styles.qtyButton}>
                                                 <Text style={{color:getQty(item.pcode)==1?"gray":"black",fontSize:15}} allowFontScaling={false} >-</Text>
                                                 </TouchableOpacity>
                                                 <TouchableOpacity style={styles.qtyCount}>
                                                   <Text>{getQty(item.pcode)}</Text>
                                                 </TouchableOpacity>
                                                 <TouchableOpacity onPress={() => handleIncrementProduct(item.pcode)} style={styles.qtyButton}>
                             
                                                   <Text style={{color:getQty(item.pcode)==item.cart_limit?"gray":"black"}} allowFontScaling={false}>+</Text>
                                                   {/* {console.log(getQty(item.pcode),item)} */}
                                                 </TouchableOpacity>
                                               </View>
                        ) : 
                        (
                          <TouchableOpacity
                            onPress={() => handleCart(item, item.pcode,shopName)}
                            style={styles.addToCartButton}
                          >
                            <Text
                              allowFontScaling={false}
                              style={styles.addToCartText}
                            >
                              <Entypo name="shopping-cart" size={20} color="white" /> ADD TO CART
                            </Text>
                          </TouchableOpacity>
                        )}
                      </Pressable>
                    }
                  />
        </View>
            {products.length==0 && <Text style={{textAlign:"center"}}>No Products</Text>}     
      </View>

  );
};
const styles = StyleSheet.create({
  productCard: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    borderColor: "#D0D0D0",
    marginTop: 10,
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
  noProductsText: {
    textAlign: "center",
    fontSize: 14,
    color: "#800000",
    marginTop: 20,
  },
  emptyBox: {
    width: 150,
    height: 140,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
  },
});

export default Section6;
