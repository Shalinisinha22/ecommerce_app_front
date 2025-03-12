import { View, Text, Dimensions, TouchableOpacity, FlatList, Pressable, Image, ScrollView, RefreshControl, StyleSheet, ActivityIndicator,T } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import Header from '../Components/Header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, handleIncrement, handleDecrement,removeFromCart} from '../redux/actions/userActions';
import { imgUrl } from '../Components/Image/ImageUrl';
import { setShopType } from '../redux/actions/userActions';
import { useShop } from '../Components/ShopContext';
const width = Dimensions.get('screen').width;

const ProductsScreen = ({ navigation }) => {

  const {globalshop,setShopGlobal}= useShop()  
  const [shopTypes, setShopTypes] = useState([]);
  const [selectedShopType, setSelectedShopType] = useState(null);
  const [shopId, setShopId] = useState('');
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [shopName, setShopName] = useState('');
  //  const [currPage,setCurrentPage]=useState(0)
  

  const [shop,setShop]= useState(null)

  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  const getShop = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/allShops");
      const data = res.data;
      const shopArr = data.map(item => ({ business_name: item.business_name, client_id: item.client_id }));
      setShopTypes(shopArr);
    } catch (err) {
      console.error(err.message);
    }
  };
  const dispatchShop=(item)=>{
  dispatch(setShopType(item))
  }

  const handleSelectShopType = (item) => {
    // console.log("clicked")
    // setCurrentPage((prev)=> prev * 0)
    if (item) {
      // console.log(shop.client_id,item)

      if (shopName && shopName !== item.business_name) {
        setProducts([])
        // Clear the cart if shop changes
        cart.forEach((cartItem) => {
          dispatch(removeFromCart(cartItem.pcode));
        });
      }

      // setCurrentPage((prev)=> prev * 0)
      setSelectedShopType(item);
      setShopName(item.business_name);
      setShop(item);
      setShopGlobal(item)

      //  dispatchShop(item)
  
      // Saving shop details in AsyncStorage
      AsyncStorage.setItem("shopDetails", JSON.stringify(item))
        .then(() => {
          setShopId(item.client_id);
          // Dispatch action after setting state
        })
        .catch((err) => console.error("Error storing shop details:", err));
    }
  }

  // const getProductsId = (client_id, callback) => {
  //   AsyncStorage.getItem('shopDetails')
  //     .then((id) => {
  //       const shop = JSON.parse(id);
      
  //       setShopName(shop.business_name);
  //       return axios.get("https://mahilamediplex.com/mediplex/getProductId", {
  //         params: { client_id: client_id || shop.client_id }
  //       });
  //     })
  //     .then(async(res) => {
  //       const pidArr = res.data.map(item => item.pid);
  //       await getProducts(pidArr);
  //       // callback(pidArr);
  //     })
  //     .catch((err) => console.error("Error fetching product IDs:", err.message));
  // };
  
  // const getProducts = async (pidArr) => {
  //   try {
  //     const productPromises = pidArr.map(pid =>
  //       axios.get("https://mahilamediplex.com/mediplex/products", {
  //         params: { product_id: pid }
  //       })
  //     );

  //     const responses = await Promise.all(productPromises);
  //     const productArr = responses.map(res => {
  //       const data = res.data;
  //       return data.map(item => {
  //         if (item.sale_image) {
  //           item.sale_image = JSON.parse(item.sale_image);
  //         }
  //         if (item.product_image) {
  //           item.product_image = JSON.parse(item.product_image);
  //         }
  //         return item;
  //       });
  //     }).flat();


  //     // console.log(productArr,"91")
  //     setProducts(productArr);
  //   } catch (err) {
  //     console.error("Error fetching products:", err.message);
  //   }
  // };


  const getAllProducts = async () => {
    try {
      const id = await AsyncStorage.getItem('shopDetails');
      if (!id) {
        console.log("No shop details found in AsyncStorage");
        return;
      }
  
      const shop = JSON.parse(id);
      setShopName(shop.business_name);
  
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/allProducts",
        {
          params: { client_id: shop.client_id }
        }
      );
  
      const formattedData = res.data.map((item) => {
        let productImages = [];
        let saleImages = [];
  
        try {
          productImages = item.product_image ? JSON.parse(item.product_image) : [];
        } catch (error) {
          console.error("Error parsing product_image:", error.message);
        }
  
        try {
          saleImages = item.sale_image ? JSON.parse(item.sale_image) : [];
        } catch (error) {
          console.error("Error parsing sale_image:", error.message);
        }
  
        return {
          ...item,
          product_image: productImages,
          sale_image: saleImages
        };
      });
  
      setProducts(formattedData);
      // setLoading(true);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };
  


  const isItemInCart = (id) => {
    return cart.some((product) => product.pcode === id);
  };

  const getQty = (id) => {
    const product = cart.find((product) => product.pcode === id);
    return product ? product.qty : 0;
  };

  const handleCart = (item, id,shop) => {
    dispatch(addToCart({ item, id,shop }));
  };

  const handleIncrementProduct = (id) => {
    dispatch(handleIncrement({ id }));
  };

  const handleDecrementProduct = (id) => {
    dispatch(handleDecrement({ id }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getShop().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    getShop();
  }, []);

  

  useEffect(() => {
    // getProductsId(shopId, getProducts);
    getAllProducts(shopId)
if(shop){
    // console.log(shop)
    //   dispatch(setShopType(shop));
   }
  }, [shopId]);

  // const [hasNavigated, setHasNavigated] = useState(false);

  // const [visibleProducts, setVisibleProducts] = useState(10); // Initially show 10 products

  // const loadMoreProducts = () => {
  //   setVisibleProducts((prev) => prev + 10); // Load 10 more products
  // };
  
  //  const page_size=10
  //  const no_of_pages= Math.ceil(products.length/page_size)
  //  const start_page= currPage * page_size
  //  const end_page= start_page + page_size

  //  const goToNext= async()=>{
  //   if(currPage < no_of_pages - 1){

  //      setCurrentPage((prev)=>prev + 1)
  //   }
  //  }
  //  const goToPrev= async()=>{
  //   if(currPage!==0){

  //      setCurrentPage((prev)=>prev - 1)
  //   }
  //  }

  return (

      <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 0 }}>
        <Header navigation={navigation} />
      
          {shopName && (
              <Text allowFontScaling={false} style={styles.shopName}>
                {shopName}
              </Text>
            )}
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <View style={{ width: width, alignItems: "center" }}>
            <Text allowFontScaling={false} style={styles.modalText}>
              Select Shop name
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedShopType}
                style={{ height: 50, width: width * 0.7 }}
                onValueChange={(itemValue) => handleSelectShopType(itemValue)}
              >
                <Picker.Item label="Select a shop name" value="" />
                {shopTypes.map((item, id) => (
                  <Picker.Item key={id} label={item.business_name} value={item} />
                ))}
              </Picker>
            </View>
          </View>
    
          <View style={styles.productsContainer}>
         
    
            {products.length !== 0 ? (

              <>
                <FlatList
                  data={products} // Show only visible products
                  numColumns={2}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.columnWrapper}
                  renderItem={({ item }) => (
                    <Pressable
                      key={item.id}
                      style={styles.productCard}
                      onPress={() => navigation.navigate("productInner", { item, shopName })}
                    >
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          left: 5,
                          top: 0,
                          backgroundColor: "#111",
                          borderRadius: 20,
                          paddingHorizontal: 8,
                          zIndex: 1000,
                        }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 8,
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#fff",
                          }}
                        >
                          {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                        </Text>
                      </TouchableOpacity>
    
                      <Image
                        style={styles.productImage}
                        source={{
                          uri: `${imgUrl}/eproduct/${item.sale_image?.[0] || item.product_image[0]}`,
                        }}
                      />
    
                      <View style={{ marginTop: 8 }}>
                        <Text allowFontScaling={false} style={styles.productName} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Text allowFontScaling={false} style={styles.productBrand}>
                          Manufactured by {item.brand_name}
                        </Text>
                        <Text allowFontScaling={false} style={styles.productMRP}>
                          Rs {item.mrp}
                        </Text>
                        <Text allowFontScaling={false} style={styles.productPrice}>
                          Rs {item.price}
                        </Text>
                      </View>
    
                      {isItemInCart(item.pcode) ? (
                        <View style={styles.cartButtons}>
                          <TouchableOpacity onPress={() => handleDecrementProduct(item.pcode)} style={styles.qtyButton}>
                            <Text allowFontScaling={false} style={{ fontSize: 18 }}>-</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.qtyCount}>
                            <Text allowFontScaling={false}>{getQty(item.pcode)}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleIncrementProduct(item.pcode)} style={styles.qtyButton}>
                            <Text style={{ fontSize: 18 }} allowFontScaling={false}>+</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleCart(item, item.pcode, shopName)}
                          style={styles.addToCartButton}
                        >
                          <Text allowFontScaling={false} style={styles.addToCartText}>
                            <Entypo name="shopping-cart" size={20} color="white" /> ADD TO CART
                          </Text>
                        </TouchableOpacity>
                      )}
                    </Pressable>
                  )}
                />
    
                {/* View More Button */}
                {/* {visibleProducts < products.length && (
                  <TouchableOpacity onPress={loadMoreProducts} style={styles.viewMoreButton}>
                    <Text style={styles.viewMoreText}>View More</Text>
                  </TouchableOpacity>
                )} */}

                {/* <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",width:width,marginTop:10}}>
                  <TouchableOpacity onPress={()=>goToPrev()} style={[styles.paginationButton,{backgroundColor:currPage==0?"#D0D0D0":"#228B22"}]}><Text style={{color:"white"}}>Prev</Text></TouchableOpacity>
                  <Pressable style={styles.currPageButton}><Text style={{color:"white",fontWeight:"bold"}}>{currPage + 1}</Text></Pressable>
                  <TouchableOpacity onPress={()=>goToNext()} style={[styles.paginationButton,{backgroundColor:currPage==no_of_pages-1 ?"#D0D0D0":"#228B22"}]}><Text style={{color:"white"}}>Next</Text></TouchableOpacity>

                </View> */}
              </>
            ) : (
              <ActivityIndicator size={'large'} />
            )}
          </View>
        </ScrollView>
      </View>
    
  );
};

const styles = StyleSheet.create({
  modalText: {
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1
  },
  pickerContainer: {
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 20,
  },
  productsContainer: {
    width: "100%",
    marginTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  shopName: {
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 15,
    textAlign:"center",
    textDecorationLine:"underline",
    textDecorationColor:"#228B22",
  
  },
  columnWrapper: {
    flex: 1,
    justifyContent: "space-around",
    gap: 5,
  },
  productCard: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    borderColor: "#D0D0D0",
    marginTop: 10,
    width: width * 0.45,
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
  viewMoreButton: {
    padding: 10,
    backgroundColor: "#0a7736",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 20,
    width: "50%",
    alignSelf: "center",
  },
  
  viewMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paginationButton:{
    backgroundColor: "#0a7736",
    padding:8,
    margin:5,
    paddingHorizontal:30,
    borderRadius:15
  },
  currPageButton:{
   backgroundColor:"#b6306d",
    padding:8,
    margin:5,
    paddingHorizontal:25,
    // borderRadius:15
  }
  
  
});

export default ProductsScreen;