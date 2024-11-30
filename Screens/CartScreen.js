import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, ActivityIndicator,Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
const width = Dimensions.get('screen').width;
import axios from 'axios';
import { addToCart, removeFromCart, updateQty, handleIncrement, handleDecrement } from '../redux/actions/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { imgUrl } from '../Components/Image/ImageUrl';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';  // Import for image picker
import uuid from 'react-native-uuid';

const CartPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [paymentType,setPamentType]= useState("")

  let userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);
let walletBalance = userInfo? userInfo.mani_wallet:0
let shoppingWallet= userInfo? userInfo.shopping_wallet:0
console.log("walletbalance",userInfo)
  const [flag,setFlag]= useState(false);
  const [lmc_id, setLMCId] = useState('');
  const [totalAmt, setTotalAmt] = useState(0);
  const [prescriptionImages, setPrescriptionImages] = useState({});
  const [clicked,setClicked]= useState(false); // State to track if checkout is processing

  const getTotalAmt = () => {
    let price = 0;
    cart.forEach((item) => {
      price = price + item.price * item.qty;
    });
    return price;
  };


  const handlePaymentTypeSelection = async (type) => {
    setPopupVisible(false); // Close popup after selection
    const orderAmount = getTotalAmt();
    
    if (type === 'Cash') {
      const success = await proceedOrder();
      if (success) {
        finalizeOrder();
      }
    } else if (type === 'Wallet') {
      let remainingAmount = orderAmount;
      let sufficientFunds = false;
  
      if (shoppingWallet >= remainingAmount) {
        // Deduct entirely from shopping wallet
        shoppingWallet -= remainingAmount;
        sufficientFunds = true;
      } else if (shoppingWallet > 0 && shoppingWallet < remainingAmount) {
        // Partially deduct from shopping wallet, rest from main wallet
        remainingAmount -= shoppingWallet;
        shoppingWallet = 0;
        
        if (walletBalance >= remainingAmount) {
          walletBalance -= remainingAmount;
          sufficientFunds = true;
        }
      } else if (walletBalance >= remainingAmount) {
        // Deduct entirely from main wallet if shopping wallet is empty or insufficient
        walletBalance -= remainingAmount;
        sufficientFunds = true;
      }
  
      if (sufficientFunds) {
        const success = await proceedOrder();
        if (success) {
          const updateShopping = await updateShoppingWallet();
          const updateMain = await updateMainWallet();
  
          if (updateShopping && updateMain) {
            finalizeOrder();
          } else {
            Alert.alert('', 'Network Issue.');
            setClicked(false);
          }
        }
      } else {
        Alert.alert('', 'You have insufficient funds in your wallet.');
      }
    }
  };
  
  const finalizeOrder = () => {
    setClicked(false); // Re-enable the button after success
    showToast();
    setAlertVisible(true); // Show custom alert
  
    cart.forEach((item) => {
      dispatch(removeFromCart(item.pcode));
    });
  
    setTimeout(() => {
      navigation.navigate("Home");
    }, 1500);
  };
  


  

  const handleCheckOut = async () => {
    setPopupVisible(true)
  };

  const proceedOrder= async()=>{
  
      setClicked(true); // Disable the checkout button and show indicator
      try {
        const hasPrescriptionItem = cart.filter(item => item.prescription === 'yes');
    
        const hasUploadedPrescription = hasPrescriptionItem.some(item => prescriptionImages[item.pcode]);
    
        if (hasPrescriptionItem.length > 0 && !hasUploadedPrescription) {
          Alert.alert("Prescription Required", "Please upload at least one prescription.");
          setClicked(false); // Re-enable the button if validation fails
          return;
        }
    
        const shopData = await AsyncStorage.getItem('shopDetails');
        let shop = null;

    
        if (shopData) {
          shop = JSON.parse(shopData);
          // console.log(shop,"cartj")
          setLMCId(shop.client_id);
        } else {
          console.error("Shop details not found in AsyncStorage.");
          setClicked(false); // Re-enable the button if no shop data is found
          return;
        }
    
        let orderSuccess = true;
    
        for (const item of cart) {
          if (item.prescription === 'yes' && prescriptionImages[item.pcode]) {
            const uploadResult = await uploadImage(prescriptionImages[item.pcode], item.pcode);
            if (!uploadResult) {
              orderSuccess = false;
              break;
            }
          }
          const orderResult = await makeOrder(item, shop.client_id);
          if (!orderResult) {
            orderSuccess = false;
            Alert.alert("Failed", "Your order is not successfull!");
            break;
          }
        }
    
        if (orderSuccess) {
         return orderSuccess;
         
          
          // navigation.navigate("Home");
        }
    
      } catch (error) {
        console.error("Error during checkout:", error);
  
        setClicked(false); // Re-enable the button on error
        Alert.alert("Failed", "Your order is not successfull!");
  
      }
  
  }




  const updateMainWallet = async () => {
    const orderAmount= getTotalAmt()

    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/updateMainWallet", {
        params:{
          newBalance: walletBalance,
          client_id: userInfo.client_id
        }
       
      })
    

      // console.log(res.data.mani_wallet,155)
    
        if(res.data.mani_wallet){
          // console.log(res.data.mani_wallet,"cartwallet")
          userInfo.mani_wallet=await res.data.mani_wallet
          dispatch({ type: 'SET_USER_INFO', payload: userInfo });
          return true;
      
      }
     
    }
    catch (err) {
      console.log(err.message)
      return false;
    }
  }

  const updateShoppingWallet = async () => {
    const orderAmount= getTotalAmt()

    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/updateShoppingWallet", {
        params:{
          newBalance: shoppingWallet,
          client_id: userInfo.client_id
        }
       
      })
    

  
    
        if(res.data.shopping_wallet){
          // console.log(res.data.mani_wallet,"cartwallet")
          userInfo.shopping_wallet=await res.data.shopping_wallet
          dispatch({ type: 'SET_USER_INFO', payload: userInfo });
          return true;
      
      }
     
    }
    catch (err) {
      console.log(err.message)
      return false;
    }
  }


  
  // const updateWallet = async () => {


  //   try {
  //     const res = await axios.get("https://mahilamediplex.com/mediplex/updateMainWallet", {
  //       params:{
  //         newBalance: 200,
  //         client_id: userInfo.client_id
  //       }
       
  //     })
    

    
  //       if(res.data.mani_wallet){
        
  //        userInfo.mani_wallet= await res.data.mani_wallet
  //       await  dispatch({ type: 'SET_USER_INFO', payload: userInfo });
      
  //     }
     
  //   }
  //   catch (err) {
  //     console.log(err.message)
  //   }
  // }
  // updateWallet()
  
  const makeOrder = async (item, lmcId) => {
   const random = Math.floor(1000 + Math.random() * 9000);
    try {
      const res = await axios.post("https://mahilamediplex.com/mediplex/orderDetails", {
        uid: userInfo.client_id,
        lmc_id: lmc_id || lmcId,
        pid: item.sale_id,
        qty: item.qty,
        barcode: item.barcode,
        cby: lmc_id || lmcId,
        image:item.prescription === 'yes'?`${random}${userInfo.client_id}${item.pcode}.jpg`:null,
        payment_type:paymentType
      });

      return true;  
    } catch (err) {
      console.log(err.message);
      return false;
    }
  };
  
  const handleIncrementProduct = (id) => {
    dispatch(handleIncrement({ id }));
  };

  const handleDecrementProduct = (id) => {
    dispatch(handleDecrement({ id }));
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Your Order is confirmed.",
    });
  };

  const handleUploadPrescription = async (item) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setFlag(true);
      setPrescriptionImages((prevState) => ({
        ...prevState,
        [item.pcode]: result.assets[0].uri  
      }));
      Alert.alert("Prescription Uploaded!", "Your prescription has been uploaded.");
    }
  };

  const uploadImage = async (imageUri, pcode) => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${random}${userInfo.client_id}${pcode}.jpg` 
    });
  
    try {
      const response = await axios.post('https://mahilamediplex.com/mediplex/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { imgName: "prescription" },
      });
      console.log('Upload success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload failed:', error);
      return false;
    }
  };

  useEffect(() => {
    setTotalAmt(getTotalAmt());
  }, [cart]);

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {console.log(item.shop)}
      <Image
        style={{ width: 70, height: 100, resizeMode: "contain" }}
        source={{ uri: `${imgUrl}/eproduct/${item.sale_image?.[0] || item.product_image?.[0]}` }}
      />
      <View style={styles.itemDetails}>
        <Text allowFontScaling={false} style={styles.itemName}>{item.name}</Text>
        <Text allowFontScaling={false} style={[styles.itemName,{marginTop:2}]}>{item.shop}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecrementProduct(item.pcode)}>
            <Icon name="remove-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.quantity}>{item.qty}</Text>
          <TouchableOpacity onPress={() => handleIncrementProduct(item.pcode)}>
            <Icon name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text allowFontScaling={false} style={styles.itemPrice}>RS {Math.round(item.price * item.qty)}</Text>
      </View>

      {item.prescription === 'yes' && (
        <View style={styles.prescriptionContainer}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUploadPrescription(item)}
          >
            <Text allowFontScaling={false} style={styles.uploadButtonText}>Upload Prescription</Text>
          </TouchableOpacity>
          {prescriptionImages[item.pcode] && (
            <Image
              source={{ uri: prescriptionImages[item.pcode] }}
              style={styles.prescriptionImage}
            />
          )}
          {!flag && <Text allowFontScaling={false} style={{color:"red", fontSize:10}}>Prescription is required</Text>}
        </View>
      )}

      <TouchableOpacity onPress={() => dispatch(removeFromCart(item.pcode))}>
        <Icon name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );


  const CustomAlert = ({ visible, onClose }) => (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>Success</Text>
          <Text style={styles.alertMessage}>Your order is successfully placed!</Text>
          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const PaymentModal=({visible,onClose})=>(
    <Modal
    visible={isPopupVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setPopupVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Payment Type</Text>




        <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentTypeSelection('Wallet')}>
          <Text style={styles.paymentOptionText}>Wallet</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentTypeSelection('sWallet')}>
          <Text style={styles.paymentOptionText}>Shopping Wallet</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentTypeSelection('Cash')}>
          <Text style={styles.paymentOptionText}>Cash on Delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => setPopupVisible(false)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>

  )



  

  return (
    <View style={styles.container}>
      <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginTop: 15,
            width: width,
            marginBottom:10
          }}
        />
        <View style={{width:width,alignItems:"center"}}>
        <Text allowFontScaling={false}  style={styles.title}>Your Cart</Text>
        </View>
   
      <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginTop: 10,
            width: width,
            marginBottom:25
          }}
        />
      <ScrollView>
        {cart.length > 0 ? (
          <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.pcode.toString()}
          />


          <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: clicked ? 'gray' : '#4CAF50' }]}
          onPress={handleCheckOut}
          disabled={clicked}
        >
          {clicked ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text allowFontScaling={false} style={styles.checkoutButtonText}>Checkout</Text>
          )}
        </TouchableOpacity>
        </>
        ) : (
          <Text allowFontScaling={false} style={styles.emptyText}>Your cart is empty</Text>
        )}

<PaymentModal visible={isPopupVisible} onClose={() => setPopupVisible(false)} />


      </ScrollView>

      <CustomAlert visible={alertVisible} onClose={() => setAlertVisible(false)} />

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 16,
    letterSpacing:2
  },
 
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    margin: 10,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#155d27',
    marginTop: 5,
  },
  prescriptionContainer: {
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#155d27',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 10,
  },
  prescriptionImage: {
    width: 80,
    height: 80,
    marginTop: 10,
    resizeMode: 'contain',
  },
  checkoutButton: {
    backgroundColor: '#155d27',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 16,
    margin: 20,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: '#4CAF50', 
    borderRadius: 10,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF', 
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF', 
  },
  okButton: {
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  okButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f1f1f1', // Light background for options
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  cancelButton: {
    marginTop: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'red',
  },
}); 

export default CartPage;
