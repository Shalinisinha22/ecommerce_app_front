import { View, Text, Dimensions, TouchableOpacity, FlatList, Pressable, Image, ScrollView, Modal, StyleSheet,RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import Header from '../Components/Header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQty ,handleIncrement,handleDecrement,setShopType} from '../redux/actions/userActions';
import { imgUrl } from '../Components/Image/ImageUrl';

const width = Dimensions.get('screen').width;

const ProductsScreen = ({ navigation }) => {
  const [shopType, setShopTypes] = useState(null);
  const [selectedShopType, setSelectedShopType] = useState('');
const [isSelect,setSelect]= useState(false)
  const [shopId, setShopId] = useState('');
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Pull to refresh state
  const [shopName,setShopName]= useState("")


 
  



  const getShop = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/allShops");
      const data = res.data;
      const shopArr = data.map(item => ({ business_name: item.business_name, client_id: item.client_id }));
      setShopTypes(shopArr);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSelectShopType = async (item) => {
    if (item) {
      setSelectedShopType(item); // Directly set the item passed to the function
      console.log(item, "selectedShopType");
      setSelect(true);
      setShopName(item.business_name);
      await AsyncStorage.setItem("shopDetails", JSON.stringify(item));
      await dispatch(setShopType(selectedShopType?selectedShopType:item));
      getShopClientId(); // Proceed with fetching the client ID for the selected shop
    }
  };
  
  
  const getShopClientId = async (value,item) => {
  
       
    
    try {
        const res = JSON.parse(await AsyncStorage.getItem('shopDetails'));
        console.log("Shop Details:", res.business_name);
        if (res?.client_id) {
            setShopId(res.client_id);
            setShopName(res.business_name)

            await getProductsId(res.client_id);
            
        } 
    } catch (err) {
        console.log("Error fetching shop client ID:", err.message);
    }
  }

  const getProductsId = async (shop) => {
    try {
        const res = await axios.get("https://mahilamediplex.com/mediplex/getProductId", {
            params: { client_id: shop }
        });
        // console.log("Product IDs:", res.data);

        const pidArr = res.data.map(item => item.pid);
        // console.log("PID Array:", pidArr);

        setProductId(pidArr);
        await getProducts(pidArr);
    } catch (err) {
        console.log("Error fetching product IDs:", err.message);
    }
  }

  const getProducts = async (pidArr) => {
    try {
        const productPromises = pidArr.map(pid => 
            axios.get("https://mahilamediplex.com/mediplex/products", {
                params: { product_id: pid }
            })
        );

        const responses = await Promise.all(productPromises);

        const productArr = responses.map(res => {
            const data = res.data;

            return data.map(item => {
                if (item.sale_image) {
                    item.sale_image = JSON.parse(item.sale_image);
                }
                if (item.product_image) {
                    item.product_image = JSON.parse(item.product_image);
                }
                return item;
            });
        }).flat();
        setProducts(productArr);

    } catch (err) {
        console.log("Error fetching products:", err.message);
    }
  }





  const [carts,setCarts]= useState([])



  const cart = useSelector((state) => state.cart.cart);
// console.log("cart redux",cart)
  const dispatch = useDispatch();

 

 

   const isItemInCart = (id)=>{
    if(cart){
      const isPresent=carts.find((product)=>product.pcode==id?true:false )
      return isPresent
    }
  }
  const getQty = (id) => {

      if(cart){
        const product = carts.find((product) => product.pcode === id);
        return product ? product.qty : null;
      }


  
  };
  

  
  const handleCart=(item,id)=>{
  
    dispatch(addToCart({ item, id: id }));
  
  }
 

  const removeFromCart=(id)=>{


  }

  const handleIncrementProduct=(id)=>{
  
      dispatch(handleIncrement({id:id}))
   
    

  }
  const handleDecrementProduct=(id)=>{
 
      dispatch(handleDecrement({id:id}))
    }
   
    
 

  //   useEffect(()=>{
  //     getShopClientId()
  //   })
  
  //   const fetchData = async () => {
  //     await getShop(); // Assuming getShop doesn't need dependencies
  //     await getShopClientId(); // Make sure this works based on its requirements
  // };
  //   useEffect(() => {
  //     fetchData()
  // }, [products,selectedShopType]);
  
  
  useEffect(() => {
      setCarts(cart); // Sync the local carts state with Redux cart state
  }, [cart]);
  


  const handleRefresh = async () => {
    setRefreshing(true);
    setSelectedShopType('')
    await getShopClientId(); // Reload data
    setRefreshing(false);
  };


  useEffect(() => {
    getShop()
    getShopClientId()
},[]);


  
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 0 }}>
      
      <Header navigation={navigation} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={{ width: width, alignItems: "center" }}>
          <Text allowFontScaling={false} style={styles.modalText}>
            Select Shop name
          </Text>
          <View
            style={{
              paddingHorizontal: 20,
              borderWidth: 1,
              borderColor: "#D0D0D0",
              borderRadius: 20,
            }}
          >
            <Picker
              selectedValue={selectedShopType} // Bind selectedShopType to the picker
              style={{ height: 50, width: width * 0.7 }} // Adjust width dynamically
              onValueChange={async (itemValue) => {
                await setSelectedShopType(itemValue);
                await handleSelectShopType(itemValue);
              }}
            >
              <Picker.Item label="Select a shop name" value="" />
              {shopType != null &&
                shopType.map((item, id) => (
                  <Picker.Item key={id} label={item.business_name} value={item} />
                ))}
            </Picker>
          </View>
        </View>
  
        <View
          style={{
            width: "100%",
            marginTop: 20,
            paddingBottom: 10,
            alignItems: "center",
          }}
        >

          {shopName && <Text allowFontScaling={false} style={{fontWeight:"bold",letterSpacing:1,marginBottom:10}}>{shopName}</Text>}
          {products.length !== 0 ? (
            <FlatList
              data={products}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{
                flex: 1,
                justifyContent: "space-around",
                gap: 5,
              }}
              renderItem={({ item }) => (
                <Pressable
                  key={item.id}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderRadius: 20,
                    padding: 10,
                    borderColor: "#D0D0D0",
                    marginTop: 10,
                    width: width * 0.45, // Adjusting width to be responsive
                  }}
                  onPress={() => {
                     // Close the modal before navigating
                     console.log("Navigating to productInner with item:", item,navigation);

                    navigation.navigate("productInner", { item: item });
                  }}
                >
                  <Image
                    style={{ width: "100%", height: 100, resizeMode: "contain" }}
                    source={{
                      uri: `${imgUrl}/eproduct/${
                        item.sale_image && item.sale_image.length > 0
                          ? item.sale_image[0]
                          : item.product_image[0]
                      }`,
                    }}
                  />
                  <View style={{ marginTop: 8 }}>
                    <Text
                      allowFontScaling={false}
                      style={{ fontWeight: "600", textAlign: "center", fontSize: 10 }}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{ fontWeight: "300", fontSize: 10, textAlign: "center" }}
                    >
                      Manufactured by {item.brand_name}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        textAlign: "center",
                        textDecorationLine: "line-through",
                        color: "gray",
                        fontSize: 10,
                      }}
                    >
                      Rs {item.mrp}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{ textAlign: "center", fontSize: 15 }}
                    >
                      Rs {item.price}
                    </Text>
                  </View>
  
                  {isItemInCart(item.pcode) ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleDecrementProduct(item.pcode)}
                        style={{
                          paddingVertical: 2,
                          borderWidth: 1,
                          borderColor: "#D0D0D0",
                          paddingHorizontal: 10,
                        }}
                      >
                        <Text allowFontScaling={false} style={{ fontSize: 15 }}>
                          -
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          paddingVertical: 2,
                          borderWidth: 1,
                          borderColor: "#D0D0D0",
                          paddingHorizontal: 35,
                        }}
                      >
                        <Text allowFontScaling={false}>{getQty(item.pcode)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIncrementProduct(item.pcode)}
                        style={{
                          paddingVertical: 2,
                          borderWidth: 1,
                          borderColor: "#D0D0D0",
                          paddingHorizontal: 15,
                        }}
                      >
                        <Text allowFontScaling={false}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleCart(item, item.pcode)}
                      style={{
                        backgroundColor: "#9e0059",
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 6,
                        marginTop: 5,
                        width: "100%", // Ensuring button spans full width
                      }}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontSize: 13,
                          fontWeight: "bold",
                        }}
                      >
                        <Entypo name="shopping-cart" size={20} color="white" />{" "}
                        ADD TO CART
                      </Text>
                    </TouchableOpacity>
                  )}
                </Pressable>
              )}
            />
          ) : (
            <Text
              allowFontScaling={false}
              style={{
                textAlign: "center",
                letterSpacing: 2,
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              No Products
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
  
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 200,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 15,
    fontWeight:"bold",
    letterSpacing:1
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default ProductsScreen; 