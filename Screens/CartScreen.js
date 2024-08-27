import React,{useState,useEffect} from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView,Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart, removeFromCart, updateQty ,handleIncrement,handleDecrement} from '../redux/actions/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { imgUrl } from '../Components/Image/ImageUrl';
import Toast from 'react-native-toast-message';
const CartPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const [carts,setCarts]=useState(null)
  const cart = useSelector((state) => state.cart.cart);
  const userInfo = useSelector(state => state.user.userInfo ? state.user.userInfo.client_id : null);

  console.log(cart)

 const [lmc_id,setLMCId]= useState('')
 const [totalAmt,setTotalAmt]= useState(0)

 const getTotalAmt= ()=>{
  let price = 0;
  cart.forEach((item)=>{
     price = price + item.price * item.qty
  })
  return price;
 }
 

 const handleCheckOut = async () => {
  try {
    const shopData = await AsyncStorage.getItem('shopDetails');
    let shop = null;

    if (shopData) {
      shop = JSON.parse(shopData);
      console.log(shop.client_id, "shopcart");

      if (shop.client_id) {
        setLMCId(shop.client_id);
      }
    } else {
      console.error("Shop details not found in AsyncStorage.");
      return; // Exit if no shop data is found
    }

    console.log(getTotalAmt());

    for (const item of cart) {
      try {
        await makeOrder(item, shop.client_id);
      } catch (error) {
        console.error("Error making order:", error);
      }
    }
  } catch (error) {
    console.error("Error during checkout:", error);
  }
};


const makeOrder = async (item, lmcId) => {
  try {
    const res = await axios.post("https://mahilamediplex.com/mediplex/orderDetails", {
      uid: userInfo,
      lmc_id: lmc_id ? lmc_id : lmcId, // Fallback to passed lmcId if local lmc_id is not set
      pid: item.sale_id,
      qty: item.qty,
      barcode: item.barcode,
      cby: lmc_id ? lmc_id : lmcId, // Ensure that `cby` is set correctly
    });

    if (res) {
      Alert.alert("Your order is successfully placed!!")
   showToast()
      dispatch(removeFromCart(item.pcode));
      navigation.navigate("Home");
    }
  } catch (err) {
    console.log(err.message);
  }
};


 const handleIncrementProduct=(id)=>{
 
     dispatch(handleIncrement({id:id}))
  
   

 }
 const handleDecrementProduct=(id)=>{

     dispatch(handleDecrement({id:id}))
   }
  
   

   const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Your Order is confirmed.",
    });
  };

 useEffect(()=>{
setCarts(cart)
 },[cart])
 
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>

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
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecrementProduct(item.pcode)}>
            <Icon name="remove-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.qty}</Text>
          <TouchableOpacity onPress={() => handleIncrementProduct(item.pcode)}>
            <Icon name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>RS {item.price * item.qty}</Text>
      </View>
      <TouchableOpacity onPress={() => dispatch(removeFromCart(item.pcode))}>
        <Icon name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <ScrollView>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty</Text>}
      />
  <Toast
              position='bottom'
              bottomOffset={80}
            />
      {
        cart.length!=0 &&   <TouchableOpacity style={styles.checkoutButton} onPress={()=>handleCheckOut()}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
      }
     
    </ScrollView>
    </View>
  );
};

export default CartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing:2
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing:1.5
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#155d27',
  },
  checkoutButton: {
    backgroundColor: '#155d27',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
  },
});
