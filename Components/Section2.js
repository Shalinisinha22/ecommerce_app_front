import { View, Text, ScrollView,Pressable, Image, FlatList,Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Foundation,Entypo } from '@expo/vector-icons';
import axios from 'axios';
const width = Dimensions.get('screen').width
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react';
import { get } from 'react-hook-form';
const Section2 = ({navigation}) => {


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
    <View style={{marginTop:0,backgroundColor:"#fff",borderTopLeftRadius:20,borderTopRightRadius:20,borderTopWidth:5,borderColor:"#fff"}}>

<View style={{flexDirection:"row",alignItems:"center",marginTop:10,justifyContent:"space-between"}}>
<View style={{flexDirection:"row",alignItems:"center"}}>
<Text  allowFontScaling={false} style={{ padding: 10, fontSize: 14, fontWeight: "bold",letterSpacing:3,color:"#b6306d" }}>
           OUR</Text>
          <Text  allowFontScaling={false} style={{ fontSize: 16, fontWeight: 800,letterSpacing:3,color:"" }}>PRODUCTS
          </Text>
</View>

<TouchableOpacity onPress={()=>navigation.navigate("products")} style={{paddingHorizontal:15,paddingVertical:5,marginRight:8}}><Text allowFontScaling={false} style={{fontSize:12,textDecorationLine:"underline",color:"#8ac926",fontWeight:700}}>VIEW ALL</Text></TouchableOpacity>
</View>

{/* <Text  allowFontScaling={false}
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginBottom: 18,
              width:width * 0.5
            }}
          /> */}

          {/* <FlatList   
data={offers}
horizontal
showsHorizontalScrollIndicator={false}
      
      
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
                  marginLeft:10,
                  marginTop:10
                  
                }}
                onPress={()=>navigation.navigate("productInner")}
              >
                <Image
              
                  style={{ width: 120, height: 130, resizeMode: "contain" }}
                  source={item.image}
                />
                <View>
                  <Text style={{fontWeight:600}}>{item.title}</Text>
                  <Text  allowFontScaling={false} style={{ textAlign: "center",textDecorationLine:"line-through",color:"gray",fontSize:10 }}>
                    Rs 200
                  </Text>
                  <Text  allowFontScaling={false} style={{ textAlign: "center",fontSize:15 }}>{item.price}</Text>
                </View>

               



                <TouchableOpacity
                  style={{
                    backgroundColor: "#9e0059",
                    paddingVertical: 10,
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
            
</FlatList> */}


{products.length!=0? <FlatList   
data={products}
horizontal
showsHorizontalScrollIndicator={false}
      
      
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
                  marginLeft:10,
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

               
                <View>
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
                    paddingVertical: 10,
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
            
</FlatList>:
<Text style={{textAlign:"center",letterSpacing:2,marginTop:20,marginBottom:20}}>No Products</Text>}

    </View>
  )
}

export default Section2