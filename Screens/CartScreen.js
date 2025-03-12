import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, ActivityIndicator, Modal, TextInput, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
const width = Dimensions.get('screen').width;
import axios from 'axios';
import { removeFromCart, handleIncrement, handleDecrement } from '../redux/actions/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { imgUrl } from '../Components/Image/ImageUrl';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';  // Import for image picker
import * as Location from 'expo-location';



const CartPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [paymentType, setPaymentType] = useState("")
  const [usedShoppingWallet, setUsedShoppingWallet] = useState(0);
  const [usedMainWallet, setUsedMainWallet] = useState(0);
  const [walletType, setWalletType] = useState(null)
  const [location, setLocation] = useState(null);
  const [coupon, setCoupon] = useState("");

  let userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);

  // console.log(userInfo,"userinfo")
  let walletBalance = userInfo ? userInfo.mani_wallet : 0
  let shoppingWallet = userInfo ? userInfo.shopping_wallet : 0
  const [flag, setFlag] = useState(false);
  const [lmc_id, setLMCId] = useState('');
  const [totalAmt, setTotalAmt] = useState(0);
  const [prescriptionImages, setPrescriptionImages] = useState({});
  const [clicked, setClicked] = useState(false); // State to track if checkout is processing
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [cashback, setCashback] = useState(0);
  const [finalDiscount, setFinalDiscount] = useState(0);
  const [allPid, setAllPid] = useState([])

  useEffect(() => {
    if (userInfo?.address) {
      setDeliveryAddress(userInfo.address);
    }
  }, [userInfo?.address]);
  const getTotalAmt = () => {
    let price = 0;
    cart.forEach((item) => {
      price = price + item.price * item.qty;
    });
    return price;
  };




  const handlePaymentTypeSelection = async (type) => {
    setPaymentType(type);
    setPopupVisible(false); // Close popup after selection

    if (type === 'Cash') {
      const orderId = await proceedOrder();
      if (orderId) {
        finalizeOrder();
      }
    } else if (type === 'Wallet') {
      const orderId = await proceedOrder(type);
      if (orderId) {
        // console.log("Order ID received:", orderId);
        const updateShopping = await updateShoppingWallet(cashback, orderId); // Ensure order_id is passed
        // const updateMain = await updateMainWallet();

        if (updateShopping || updateMain) {
          finalizeOrder();
        } else {
          Alert.alert('', 'Network Issue.');
          setClicked(false);
        }
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



    if (getTotalAmt() < 100) {
      Alert.alert("Order Amount", "Order amount must be greater than 100 to place an order.");
      return;
    }
 
  
    if (!deliveryAddress.trim()) {

      Alert.alert("Delivery Address Required", "Please enter your delivery address.");
      return;
    }

    if (!location?.area && !location?.city) {
      Alert.alert("Location Required", "Please enable location services.");
      fetchLocation();
      return;
    }

    setPopupVisible(true)
  };

  const proceedOrder = async (type) => {
    setClicked(true);
    const random = Math.floor(1000 + Math.random() * 9000);

    try {
      // Check for missing prescriptions
      const hasPrescriptionItem = cart.filter(item => item.prescription === 'yes');
      const hasUploadedPrescription = hasPrescriptionItem.some(item => prescriptionImages[item.pcode]);

      if (hasPrescriptionItem.length > 0 && !hasUploadedPrescription) {
        Alert.alert("Prescription Required", "Please upload at least one prescription.");
        setClicked(false);
        return;
      }

      // Fetch shop details
      const shopData = await AsyncStorage.getItem('shopDetails');
      if (!shopData) {
        console.error("Shop details not found in AsyncStorage.");
        setClicked(false);
        return;
      }

      const shop = JSON.parse(shopData);
      const orderId = `ORD${Math.floor(1000 + Math.random() * 9000)}`;
      let orderSuccess = true;

      // Upload prescriptions
      const uploadTasks = hasPrescriptionItem.map(item =>
        prescriptionImages[item.pcode] ? uploadImage(prescriptionImages[item.pcode], item.pcode, random) : true
      );
      const uploadResults = await Promise.all(uploadTasks);
      if (uploadResults.some(result => !result)) {
        Alert.alert("Error", "Failed to upload prescriptions.");
        setClicked(false);
        return;
      }

      // Place all orders
      const allOrdersResult = await makeAllOrders(shop.client_id, type, orderId);
      if (!allOrdersResult) {
        Alert.alert("Error", "Failed to place all orders.");
        setClicked(false);
        return;
      }

      // Place individual orders

      for (const item of cart) {

        const orderResult = await makeOrder(item, shop.client_id, type, orderId, random);
        if (!orderResult) {
          orderSuccess = false;
          break;
        }
      }


      if (orderSuccess) {

        showToast();
        return orderId;

      } else {
        Alert.alert("Error", "Failed to place order.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setClicked(false);
    }
  };


  // const updateMainWallet = async () => {
  //   const orderAmount = getTotalAmt()

  //   try {
  //     const res = await axios.get("https://mahilamediplex.com/mediplex/updateMainWallet", {
  //       params: {
  //         newBalance: walletBalance,
  //         client_id: userInfo.client_id
  //       }

  //     })


  //     // console.log(res.data.mani_wallet,155)

  //     if (res.data.mani_wallet) {
  //       // console.log(res.data.mani_wallet,"cartwallet")
  //       userInfo.mani_wallet = await res.data.mani_wallet
  //       dispatch({ type: 'SET_USER_INFO', payload: userInfo });
  //       return true;

  //     }

  //   }
  //   catch (err) {
  //     console.log(err.message)
  //     return false;
  //   }
  // }


  const updateShoppingWalletLog = async (cashback, order_id) => {
    let allPID = []
    cart.forEach((item) => {
      allPID.push(item.sale_id)
    });
    // console.log(allPid)
    const orderAmount = getTotalAmt()
    try {
      const res = await axios.post("https://mahilamediplex.com/mediplex/shopping-wallet-log", {
        params: {
          shopping_wallet: Math.round(orderAmount * 100) / 100,
          user_id: userInfo.client_id,
          order_id: order_id,
          reason: "Order Products",
          product_id: allPID.join(","),
          status: "Debit"


        }

      })


      if (res.data.message == "Data inserted successfully") {
        return true;
      }


    }
    catch (err) {
      console.log(err.message)
      return false;
    }
  }

  const updateShoppingWallet = async (cashback, order_id) => {


    const walletLogUpdate = await updateShoppingWalletLog(cashback, order_id);
    if (walletLogUpdate) {
      try {
        const res = await axios.get("https://mahilamediplex.com/mediplex/updateShoppingWallet", {
          params: {
            newBalance: cashback ? shoppingWallet + cashback : shoppingWallet,
            client_id: userInfo.client_id
          }
        });

        if (res.data.shopping_wallet) {
          userInfo.shopping_wallet = await res.data.shopping_wallet;
          dispatch({ type: 'SET_USER_INFO', payload: userInfo });
          return true;
        }
      } catch (err) {
        console.log(err.message);
        return false;
      }
    }
  };

  // const updateWallet = async () => {


  //   try {
  //     const res = await axios.get("https://mahilamediplex.com/mediplex/updateShoppingWallet", {
  //       params:{
  //         newBalance: 500,
  //         client_id: userInfo.client_id
  //       }

  //     })



  //       if(res.data.shopping_wallet){

  //        userInfo.shopping_wallet= await res.data.shopping_wallet
  //       await  dispatch({ type: 'SET_USER_INFO', payload: userInfo });


  //     }

  //   }
  //   catch (err) {
  //     console.log(err.message,"266")
  //   }
  // }

  // updateWallet()



  const makeAllOrders = async (lmcId, type, order_id) => {




    let remainingAmount = Math.round((getTotalAmt() * 100) / 100); // Total item price
    let shoppingUsed = 0; // Amount deducted from shopping wallet
    let mainUsed = 0; // Amount deducted from main wallet
    let sufficientFunds = false; // Wallet balance status
    let walletType = "";


    // Wallet Deduction Logic
    if (type === "Wallet") {
      if (Number(shoppingWallet) >= Number(remainingAmount)) {
        // Deduct entirely from shopping wallet
        shoppingUsed = remainingAmount;
        shoppingWallet -= remainingAmount;
        walletType = "Shopping Wallet";
        sufficientFunds = true;
      } else if (Number(shoppingWallet) > 0 && Number(shoppingWallet) <= Number(remainingAmount)) {
        // Partially deduct from shopping wallet, rest from main wallet
        shoppingUsed = shoppingWallet;
        remainingAmount -= shoppingWallet;
        shoppingWallet = 0;

        if (Number(walletBalance) >= Number(remainingAmount)) {
          mainUsed = remainingAmount;
          walletBalance -= remainingAmount;
          sufficientFunds = true;
          walletType = "Shopping + Main Wallet";
        }

      } else if (Number(walletBalance) >= Number(remainingAmount)) {
        // console.log(walletBalance,"walletBalance")
        // Deduct entirely from main wallet if shopping wallet is empty or insufficient
        mainUsed = remainingAmount;
        walletBalance -= remainingAmount;
        sufficientFunds = true;
        walletType = "Main Wallet";
      }

      if (sufficientFunds) {
        setUsedShoppingWallet(shoppingUsed); // Track shopping wallet usage
        setUsedMainWallet(mainUsed); // Track main wallet usage
      }
      else {
        Alert.alert('', 'You have insufficient funds in your wallet.');
        return false;
      }
    }

    // Order Submission
    try {


      const orderPayload = {
        uid: userInfo.client_id,
        order_id,
        lmc_id: lmcId || lmcId,
        wallet_type: type === "Wallet" ? "Wallet" : "Cash on Delivery",
        shoppingWallet: shoppingUsed,
        mainWallet: mainUsed,
        cby: lmcId || lmcId,
        payment_type: type ? type : "Cash",
        location: `${location?.area},${location?.city}`,
        address: deliveryAddress,
        coupon_code: responseMessage ? coupon : null,
        coupon_value: responseMessage ? finalDiscount : null,
      };


      const res = await axios.post("https://mahilamediplex.com/mediplex/orderDetails", orderPayload);

      // console.log("Order successfully placed:", res.data);
      if (res.data) {
        return true;

      }
      else {
        return false;
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      return false;
    }
  };

  const makeOrder = async (item, lmcId, type, order_id, random) => {
    // Generate a unique order ID


    try {



      const payload = {
        uid: userInfo.client_id,
        order_id,
        pid: item.sale_id,
        mrp: item.mrp,
        offer_price: Math.round(((item.mrp - item.price) * 100) / 100),
        qty: item.qty,
        barcode: item.barcode,
        cby: lmcId || lmcId,
        image: item.prescription === "yes" ? `${random}${userInfo.client_id}${item.pcode}.jpg` : null,
      };

      const res = await axios.post("https://mahilamediplex.com/mediplex/orderProductDetails", payload);

      // console.log("Order successfully placed:", res.data);
      if (res.data) {
        return true;

      }
      else {
        return false;
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      return false;
    }
  };


  // Fetch user location
  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const area = await reverseGeocode[0].district || reverseGeocode[0].subregion;
        const city =  await reverseGeocode[0].city || reverseGeocode[0].region;
        setLocation({ area, city });
      }
    } catch (err) {
      console.log("Error fetching location:", err.message);
    }
  };



  useEffect(()=>{
    fetchLocation()
  },[])

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

  const uploadImage = async (imageUri, pcode, random) => {
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
      // console.log('Upload success:', response.data);
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
    <View key={item.id} style={styles.cartItem}>

      <Image
        style={{ width: 70, height: 100, resizeMode: "contain" }}
        source={{ uri: `${imgUrl}/eproduct/${item.sale_image?.[0] || item.product_image?.[0]}` }}
      />
      <View style={styles.itemDetails}>
        <Text allowFontScaling={false} style={styles.itemName}>{item.name}</Text>
        <Text allowFontScaling={false} style={[styles.itemName, { marginTop: 2 }]}>{item.shop}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecrementProduct(item.pcode)}>
            <Icon name="remove-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.quantity}>{item.qty}</Text>
          <TouchableOpacity onPress={() => handleIncrementProduct(item.pcode)}>
            <Icon name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text allowFontScaling={false} style={styles.itemPrice}>RS {Math.round((item.price * item.qty) * 100) / 100}</Text>
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
          {!flag && <Text allowFontScaling={false} style={{ color: "red", fontSize: 10 }}>Prescription is required</Text>}
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

  const PaymentModal = ({ visible, onClose }) => (
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


  const handleCouponApply = async (couponCode) => {
    setResponseMessage(null);
    setErrorMessage(null);

    // Validate inputs
    if (!couponCode) {
      setErrorMessage("Please provide coupon code.");
      return;
    }

    try {
      const response = await axios.post("https://mahilamediplex.com/mediplex/validateCoupon", {
        couponCode,
        cartValue: parseFloat(getTotalAmt()),
      });

      // console.log(response.data, "coupon")
      setResponseMessage(response.data.message);

      if (response.data.type === "cashback") {
        const cartValue = parseFloat(getTotalAmt());
        const discountValue = (cartValue * parseFloat(response.data.discountValue)) / 100;
        // console.log(`Discount Applied: ${discountValue}`);

        // Ensure the discount does not exceed the max discount value
        const finalDiscount = Math.min(discountValue, parseFloat(response.data.maxDiscount));

        // console.log(`Discount Applied: ${finalDiscount}`);
        setFinalDiscount(finalDiscount);
        setCashback(finalDiscount)

        setResponseMessage(
          `You received a cashback of ₹${finalDiscount} after successfully placing your order.`
        );

      }
    } catch (error) {

      if (error.response) {

        setErrorMessage(error.response.data.error || "Something went wrong");
        // setErrorMessage("An error occurred. Please try again.");
      }
    }
  }



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
          marginBottom: 10
        }}
      />
      <View style={{ width: width, alignItems: "center" }}>
        <Text allowFontScaling={false} style={styles.title}>Your Cart</Text>
        {/* {location?.area && location?.city && <Text allowFontScaling={false}  style={styles.locationTitle}>{location.area},{location.city}</Text> } */}
      </View>

      <Text
        allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "whitesmoke",
          borderWidth: 2,
          marginTop: 10,
          width: width,
          marginBottom: 25
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

            <View style={{ width: width, alignItems: "flex-end", paddingRight: 20, justifyContent: "center" }}>
              <View style={{ marginRight: 0, flexDirection: "row" }}>
                <Text style={{ color: "#4CAF50" }}>Total: </Text>
                <Text style={{ color: "#4CAF50", fontWeight: 800 }}>Rs{Math.round(getTotalAmt() * 100) / 100}</Text>

              </View>

            </View>
            <Text
              allowFontScaling={false}
              style={{
                height: 1,
                borderColor: "whitesmoke",
                borderWidth: 2,
                marginTop: 15,
                width: width,
                marginBottom: 10
              }}
            />





            <Text style={{ paddingHorizontal: 20, marginTop: 10, color: "#4CAF50", fontWeight: 800, letterSpacing: 1 }}>Enter Coupon Code:</Text>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 20,
              marginTop: 2,
              borderWidth: 1,
              padding: 8,
              borderRadius: 5,
              backgroundColor: "white",
              marginBottom: 0
            }}>




              <TextInput
                style={{ width: "50%", color: "black", backgroundColor: "white" }}
                placeholder=""
                placeholderTextColor="gray"
                allowFontScaling={false}
                multiline
                numberOfLines={4}
                onChangeText={(text) => {
                  setCoupon(text);
                  if (text === "") {
                    setErrorMessage(null);
                    setResponseMessage(null);
                  }
                }}
                onBlur={() => {
                  if (coupon === "") {
                    setErrorMessage(null);
                    setResponseMessage(null);
                  }
                }}
                onFocus={() => {
                  if (coupon === "") {
                    setErrorMessage(null);
                    setResponseMessage(null);
                  }
                }}
                value={coupon}
              />



              <Pressable onPress={() => handleCouponApply(coupon)}>
                <Text style={{ color: "#4CAF50", }}>APPLY</Text>
              </Pressable>


            </View>

            {responseMessage && <Text style={styles.successMessage}>{responseMessage}</Text>}
            {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}




            <Text style={{ paddingHorizontal: 20, marginTop: 10, color: "#4CAF50", fontWeight: 800, letterSpacing: 1 }}>Delivery Address:</Text>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 20,
              marginTop: 2,
              borderWidth: 1,
              padding: 8,
              borderRadius: 5,
              backgroundColor: "white"
            }}>




              <TextInput
                style={{ width: "80%", color: "black", backgroundColor: "white" }}
                placeholder='Enter Delivery Address'
                placeholderTextColor="gray"
                allowFontScaling={false}
                multiline
                numberOfLines={4}
                onChangeText={(text) => setDeliveryAddress(text)}
                value={deliveryAddress}

              />

              <Image source={require("../assets/delivery.png")} style={{ width: 35, height: 45, resizeMode: "contain" }} />

            </View>


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


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 16,
    letterSpacing: 2
  },
  locationTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    // marginBottom: 16,
    letterSpacing: 2
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
  successMessage: {
    color: "green",
    marginTop: 10,
    textAlign: "center",
    marginBottom: 5
  },
  errorMessage: {
    color: "red",
    marginTop: 0,
    textAlign: "center",
    margin: 8,
    marginBottom: 5,
    paddingHorizontal: 10,
    fontWeight: 800,
    letterSpacing: 0.2
  }
});

export default CartPage;
