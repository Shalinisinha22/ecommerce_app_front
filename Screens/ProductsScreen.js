import { View, Text,Dimensions,TouchableOpacity,FlatList,Pressable,Image, ScrollView} from 'react-native'
import React,{useState,useEffect} from 'react'
import { Entypo,FontAwesome5,Ionicons,Foundation } from '@expo/vector-icons'
import Header from '../Components/Header'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
const width = Dimensions.get('screen').width


const offers = [
    {
      id: "0",
      title: "Himalaya Baby Cream (Tube)",
      offer: "20% off",
      image: require("../assets/product.jpg"),
      price: "Rs 112",
      rating: "4.8",
    },
    {
      id: "1",
      title: "Himalaya Baby Cream (Tube)",
      offer: "20% off",
      image: require("../assets/product.jpg"),
      price: "Rs 112",
      rating: "4.8",
    },
    {
      id: "2",
      title: "Himalaya Baby Cream (Tube)",
      offer: "20% off",
      image: require("../assets/product.jpg"),
      price: "Rs 112",
      rating: "4.8",
    },
    {
      id: "3",
      title: "Himalaya Baby Cream (Tube)",
      offer: "20% off",
      image: require("../assets/product.jpg"),
      price: "Rs 112",
      rating: "4.8",
    },
    {
        id: "4",
        title: "Himalaya Baby Cream (Tube)",
        offer: "20% off",
        image: require("../assets/product.jpg"),
        price: "Rs 112",
        rating: "4.8",
      },
      {
        id: "5",
        title: "Himalaya Baby Cream (Tube)",
        offer: "20% off",
        image: require("../assets/product.jpg"),
        price: "Rs 112",
        rating: "4.8",
      },
      {
        id: "6",
        title: "Himalaya Baby Cream (Tube)",
        offer: "20% off",
        image: require("../assets/product.jpg"),
        price: "Rs 112",
        rating: "4.8",
      },
      {
        id: "7",
        title: "Himalaya Baby Cream (Tube)",
        offer: "20% off",
        image: require("../assets/product.jpg"),
        price: "Rs 112",
        rating: "4.8",
      },
  ];


 

const ProductsScreen = ({navigation}) => {

  const [shopId, setShopId] = useState('');
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState([]);

  const getShopClientId = async () => {
      try {
          const res = JSON.parse(await AsyncStorage.getItem('shopDetails'));
          console.log("Shop Details:", res);
          if (res?.client_id) {
              setShopId(res.client_id);
              await getProductsId(res.client_id);
          } else {
              console.error("Client ID not found in shop details.");
          }
      } catch (err) {
          console.log("Error fetching shop client ID:", err.message);
      }
  }

  const getProductsId = async (shop) => {
      try {
          const res = await axios.get("http://192.168.0.109:3000/getProductId", {
              params: { client_id: shop }
          });
          console.log("Product IDs:", res.data);

          const pidArr = res.data.map(item => item.pid);
          console.log("PID Array:", pidArr);

          setProductId(pidArr);
          await getProducts(pidArr);
      } catch (err) {
          console.log("Error fetching product IDs:", err.message);
      }
  }

  const getProducts = async (pidArr) => {
      try {
          const productPromises = pidArr.map(pid => 
              axios.get("http://192.168.0.109:3000/products", {
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
          }).flat(); // Flatten the array if `res.data` contains arrays of products

          console.log("Final Product Array:", productArr);
          setProducts(productArr);

      } catch (err) {
          console.log("Error fetching products:", err.message);
      }
  }

  useEffect(() => {
      getShopClientId();
  }, []);

  return (
    <View style={{flex:1,backgroundColor:"#fff",paddingTop:20}}>


<Header navigation={navigation}></Header>




<ScrollView>
<View style={{width:width,marginTop:20,paddingBottom:10}}>
{
  products.length!=0 ?

  <FlatList   
data={products}

      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={{
        flex: 1,
        justifyContent: "space-around",
      }}
      
renderItem={({ item, index }) => (
       
              <Pressable
                key={item.id}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth:2,
                  borderRadius:20,
                  padding:10,
                  borderColor:"#D0D0D0",
                  marginTop:10
                  
                }}
                onPress={()=>navigation.navigate("productInner",{item:item})}
              >
                     {item.sale_image && item.sale_image.length > 0 ? (
  <Image
    style={{ width: 120, height: 130, resizeMode: "contain" }}
    source={{ uri: `http://192.168.0.109:3000/upload/eproduct//${item.sale_image[0]}` }}
  />
) : (
  <Image
    style={{ width: 120, height: 130, resizeMode: "contain" }}
    source={{ uri: `http://192.168.0.109:3000/upload/eproduct/${item.product_image[0]}` }}
  />
)}
                <View style={{marginTop:8}}>
                <Text style={{fontWeight:600}}>{item.name}</Text>
                  <Text allowFontScaling={false} style={{fontWeight:300,fontSize:10}}>{item.brand_name}</Text>
                  <Text  allowFontScaling={false} style={{ textAlign: "center",textDecorationLine:"line-through",color:"gray",fontSize:10 }}>
                   Rs {item.mrp}
                  </Text>
                  <Text  allowFontScaling={false} style={{ textAlign: "center",fontSize:15 }}>Rs {item.price}</Text>
                </View>

               



                <TouchableOpacity
                  style={{
                    backgroundColor: "#9e0059",
                    paddingVertical: 8,
                     paddingHorizontal:20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 1,
                    borderRadius: 6,
                    marginTop:5,
                  
                  }}
                >
                  <Text allowFontScaling={false}
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  ><Entypo name="shopping-cart" size={20} color="white"/>  ADD TO CART
                  </Text>
                </TouchableOpacity>
              </Pressable>
            )}
>
            
</FlatList>

:
<Text style={{textAlign:"center",letterSpacing:2,marginTop:20,marginBottom:20}}>No Products</Text>}



</View>

</ScrollView>



 
  </View>
  )
}

export default ProductsScreen