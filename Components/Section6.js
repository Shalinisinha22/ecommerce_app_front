import { View, Text, ScrollView,Pressable, Image, FlatList,Dimensions, TouchableOpacity } from 'react-native'
import React,{useState,useEffect} from 'react'
import { Foundation,Entypo } from '@expo/vector-icons';
import axios from 'axios';
const width = Dimensions.get('screen').width
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQty ,handleIncrement,handleDecrement} from '../redux/actions/userActions';
import { imgUrl } from './Image/ImageUrl';
const Section6 = ({navigation}) => {
  const [shopId, setShopId] = useState('');
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState([]);


  const lmcId = useSelector((state)=>state.shop.shop? state.shop.shop:null)
  const [lmc_id,setLmc]= useState(lmcId)
 
  // console.log(lmcId,"lmcId")


  const getProductsId = async (shop) => {
    const id= JSON.parse(await AsyncStorage.getItem('shopDetails'))




    
    try {
        const res = await axios.get("https://mahilamediplex.com/mediplex/getProductId", {
            params: { client_id: lmcId? lmcId.client_id:id.client_id }
        });
  

        if(res.data.length==0){
          getDefaultShop()
        }
        else{
          const pidArr = res.data.map(item => item.pid);
          // console.log("PID Array:", pidArr);

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
        }).flat();
        let filterProduct=[]
        filterProduct= productArr.filter((item)=>item.category_name=="SURGICAL")
        // console.log("Final Product Array:", filterProduct);

        setProducts(filterProduct);

    } catch (err) {
        console.log("Error fetching products:", err.message);
    }
}

 


useEffect(()=>{
  getProductsId()
},[lmcId])





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
    products.length!=0 &&   <View style={{marginTop:10,backgroundColor:"#fff",borderTopLeftRadius:20,borderTopRightRadius:20,borderTopWidth:4,borderColor:"#D0D0D0"}}>

<View style={{flexDirection:"row",alignItems:"center",marginTop:10,justifyContent:"space-between"}}>
<View style={{flexDirection:"row",alignItems:"center"}}>
<Text  allowFontScaling={false} style={{ padding: 10, fontSize: 14, fontWeight: "bold",letterSpacing:3,color:"#b6306d" }}>
          SPECIAL</Text>
          <Text  allowFontScaling={false} style={{ fontSize: 16, fontWeight: "700",letterSpacing:3,color:"" }}>PRODUCTS
          </Text>
          </View>
          {products.length!=0 && <TouchableOpacity onPress={()=>navigation.navigate("AllProducts",{products:products})}  style={{paddingRight:20}}>
  <Text style={{fontWeight:"bold"}}>VIEW ALL</Text>
</TouchableOpacity> }
          {/* <TouchableOpacity onPress={()=>navigation.navigate("products")} style={{paddingHorizontal:15,paddingVertical:5,marginRight:8}}><Text allowFontScaling={false} style={{fontSize:12,textDecorationLine:"underline",color:"#8ac926",fontWeight:700}}>VIEW ALL</Text></TouchableOpacity> */}
          </View>
          <View style={{paddingRight:10}}>
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

                  {/* <View style={{flexDirection:"row",alignItems:"center",marginLeft:15}}>
  <Text  allowFontScaling={false} style={{ fontSize:12 }}>RS {item.price} </Text>
  <Text  allowFontScaling={false} style={{ fontSize:8,color:"#0a7736" }}>OFFER PRICE</Text>
</View> */}
                </View>

               


{isItemInCart(item.pcode)? <View style={{flexDirection:"row",width:200,justifyContent:"space-between",marginTop:10}}>
<TouchableOpacity onPress={()=>handleDecrementProduct(item.pcode)} style={{paddingVertical:2,borderWidth:1,borderColor:"#D0D0D0",paddingHorizontal:15}}><Text allowFontScaling={false} style={{fontSize:15}}>-</Text></TouchableOpacity>
<TouchableOpacity style={{paddingVertical:2,borderWidth:1,borderColor:"#D0D0D0",paddingHorizontal:35}}><Text>{getQty(item.pcode)}</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>handleIncrementProduct(item.pcode)} style={{paddingVertical:2,borderWidth:1,borderColor:"#D0D0D0",paddingHorizontal:15}}><Text allowFontScaling={false} >+</Text></TouchableOpacity>
</View>:     <TouchableOpacity

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
    </View>
  )
}

export default Section6