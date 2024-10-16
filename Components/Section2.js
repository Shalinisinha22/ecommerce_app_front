import { View, Text, ScrollView,Pressable, Image, FlatList,Dimensions, TouchableOpacity,StyleSheet } from 'react-native'
import React from 'react'
import { Foundation,Entypo } from '@expo/vector-icons';
import axios from 'axios';
const width = Dimensions.get('screen').width
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQty ,handleIncrement,handleDecrement} from '../redux/actions/userActions';
import { imgUrl } from './Image/ImageUrl';
import { useRoute } from '@react-navigation/native';


const Section2 = ({navigation}) => {



  const [shopId, setShopId] = useState('');
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState([]);


  const lmcId = useSelector((state)=>state.shop.shop? state.shop.shop:null)
  const [lmc_id,setLmc]= useState(lmcId)

 


 
  console.log(lmcId,"26lmcId")



  const getProductsId = async (shop) => {
    const id= JSON.parse(await AsyncStorage.getItem('shopDetails'))
    console.log(id.client_id,"36",lmcId)



    
    try {
        const res = await axios.get("https://mahilamediplex.com/mediplex/getProductId", {
            params: { client_id: lmcId? lmcId.client_id:id.client_id }
        });
  

        console.log("47",res.data)

        if(res.data.length==0){
          getDefaultShop()
        }
        else{
          const pidArr = res.data.map(item => item.pid);
          console.log("PID Array:", pidArr);

          setProductId(pidArr);
          await getProducts(pidArr);
  
        }
 
        

  
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
        }).flat(); // Flatten the array if `res.data` contains arrays of products

        let filterProduct=[]
        filterProduct= productArr.filter((item)=>item.category_name=="Ethicals")
        console.log("Final Product Array:", filterProduct);

        setProducts(filterProduct);

    } catch (err) {
        console.log("Error fetching products:", err.message);
    }
}




useEffect(()=>{
  getProductsId()
},[lmcId])


const getDefaultShop = async()=>{
  try{
    const res= await axios.get("https://mahilamediplex.com/mediplex/defaultShops")
    const data= res.data
    // console.log("105",data,data)

    if(data[0].client_id){
      getProductsId(data[0].client_id)
      await AsyncStorage.setItem("shopDetails",JSON.stringify(data[0]))
    }
   
  }
  catch(err){
    console.log(err.message)
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
   
    
 
  

  useEffect(()=>{
setCarts(cart)
  },[cart])
  

  return (
    <View style={{marginTop:0,backgroundColor:"#fff",borderTopLeftRadius:20,borderTopRightRadius:20,borderTopWidth:5,borderColor:"#fff"}}>

<View style={{flexDirection:"row",alignItems:"center",marginTop:10,justifyContent:"space-between"}}>
<View style={{flexDirection:"row",alignItems:"center"}}>
<Text  allowFontScaling={false} style={{ padding: 10, fontSize: 14, fontWeight: "bold",letterSpacing:3,color:"#b6306d" }}>
           OUR</Text>
          <Text  allowFontScaling={false} style={{ fontSize: 16, fontWeight: 800,letterSpacing:3,color:"" }}>PRODUCTS
          </Text>
</View>

{/* <TouchableOpacity onPress={()=>navigation.navigate("products")} style={{paddingHorizontal:15,paddingVertical:5,marginRight:8}}><Text allowFontScaling={false} style={{fontSize:12,textDecorationLine:"underline",color:"#8ac926",fontWeight:700}}>VIEW ALL</Text></TouchableOpacity> */}
</View>

{/* {console.log("products",products)} */}


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
                  padding:12,
                  borderColor:"#D0D0D0",
                  marginLeft:10,
                  marginTop:10
                  
                }}
                onPress={()=>navigation.navigate("productInner",{item:item})}
              >
            {item.sale_image && item.sale_image.length > 0 ? (
  <Image
    style={{ width: 150, height: 130, resizeMode: "contain" }}
    source={{ uri: `${imgUrl}/eproduct/${item.sale_image[0]}` }}
  />
) : (
  <Image
    style={{ width: 150, height: 130, resizeMode: "contain" }}
    source={{ uri: `${imgUrl}/eproduct/${item.product_image[0]}` }}
  />
)}

               
                <View style={{margin:5}}>
                  <Text allowFontScaling={false} style={{fontWeight:600}}>{item.name}</Text>
                  <Text allowFontScaling={false} style={{fontWeight:300,fontSize:10,textAlign:"center"}}>{item.brand_name}</Text>
                  <Text  allowFontScaling={false} style={{ textAlign: "center",textDecorationLine:"line-through",color:"#800000",fontSize:10 }}>
                   Rs {item.mrp}
                  </Text>
                  <Text  allowFontScaling={false} style={{ fontSize:12,fontWeight: "bold",textAlign: "center",color: "#228B22" }}>RS {item.price} </Text>

{/* <View style={{flexDirection:"row",alignItems:"center",marginLeft:15}}> */}
  {/* <Text  allowFontScaling={false} style={{ fontSize:8,color:"#0a7736" }}>OFFER PRICE</Text> */}
{/* </View> */}
                  {/* <Text  allowFontScaling={false} style={{ textAlign: "center",fontSize:15 }}>Rs {item.price}</Text> */}
                </View>

               


{isItemInCart(item.pcode)? <View style={{flexDirection:"row",width:200,justifyContent:"space-between",marginTop:10}}>
<TouchableOpacity onPress={()=>handleDecrementProduct(item.pcode)} style={{paddingVertical:2,borderWidth:1,borderColor:"#D0D0D0",paddingHorizontal:15}}><Text allowFontScaling={false} style={{fontSize:15}}>-</Text></TouchableOpacity>
<TouchableOpacity style={{paddingVertical:2,borderWidth:1,borderColor:"#D0D0D0",paddingHorizontal:35}}><Text>{getQty(item.pcode)}</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>handleIncrementProduct(item.pcode)} style={{paddingVertical:2,borderWidth:1,borderColor:"#D0D0D0",paddingHorizontal:15}}><Text allowFontScaling={false} >+</Text></TouchableOpacity>
</View>:    
 <TouchableOpacity

onPress={()=>handleCart(item,item.pcode)}
  style={{
    backgroundColor: "#228B22",
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
</TouchableOpacity>}
            
              </Pressable>
            )}
>
            
</FlatList>:
<Text allowFontScaling={false} style={{textAlign:"center",letterSpacing:2,marginTop:20,marginBottom:20}}>No Products</Text>}

    </View>
  )
}

const styles = StyleSheet.create({
 
 
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
  }
});

export default Section2