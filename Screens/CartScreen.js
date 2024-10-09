import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
const width = Dimensions.get('screen').width;
import axios from 'axios';
import { addToCart, removeFromCart, updateQty, handleIncrement, handleDecrement } from '../redux/actions/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { imgUrl } from '../Components/Image/ImageUrl';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';  // Import for image picker

const CartPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo.client_id : null);
 
  const [flag,setFlag]= useState(false)
  const [lmc_id, setLMCId] = useState('');
  const [totalAmt, setTotalAmt] = useState(0);
  const [prescriptionImages, setPrescriptionImages] = useState({});

  const getTotalAmt = () => {
    let price = 0;
    cart.forEach((item) => {
      price = price + item.price * item.qty;
    });
    return price;
  };

  // const prescriptionItem = cart.filter(item => item.prescription === 'yes'?item.pcode:null);

  // console.log(prescriptionItem,"#2")

  const handleCheckOut = async () => {
    try {
      const hasPrescriptionItem = cart.filter(item => item.prescription === 'yes');
  
      // Validate that at least one prescription item has an image uploaded
      const hasUploadedPrescription = hasPrescriptionItem.some(item => prescriptionImages[item.pcode]);
  
      if (hasPrescriptionItem.length > 0 && !hasUploadedPrescription) {
        Alert.alert("Prescription Required", "Please upload at least one prescription.");
        return;  // Prevent checkout if no prescription image is uploaded
      }
  
      const shopData = await AsyncStorage.getItem('shopDetails');
      let shop = null;
  
      if (shopData) {
        shop = JSON.parse(shopData);
        setLMCId(shop.client_id);
      } else {
        console.error("Shop details not found in AsyncStorage.");
        return; // Exit if no shop data is found
      }
  
      // Upload prescription images and make orders
      for (const item of cart) {
        if (item.prescription === 'yes' && prescriptionImages[item.pcode]) {
          await uploadImage(prescriptionImages[item.pcode], item.pcode);
        }
        await makeOrder(item, shop.client_id);
      }
  
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  
  
  
  const makeOrder = async (item, lmcId) => {
    try {
      const res = await axios.post("https://mahilamediplex.com/mediplex/orderDetails", {
        uid: userInfo,
        lmc_id: lmc_id || lmcId,
        pid: item.sale_id,
        qty: item.qty,
        barcode: item.barcode,
        cby: lmc_id || lmcId,
      });

      if (res) {
       
        showToast();
        dispatch(removeFromCart(item.pcode));
        navigation.navigate("Home");
        Alert.alert("Your order is successfully placed!!");
      }
    } catch (err) {
      console.log(err.message);
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
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setFlag(true);
      setPrescriptionImages((prevState) => ({
        ...prevState,
        [item.pcode]: result.assets[0].uri  // Save the image path for the item
      }));
      Alert.alert("Prescription Uploaded!", "Your prescription has been uploaded.");
    }
  };
  
  

  const uploadImage = async (imageUri, pcode) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `PRES${userInfo}${pcode}.jpg`  // Unique image name per item
    });
  
    try {
      const response = await axios.post('https://mahilamediplex.com/mediplex/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { imgName: "prescription" },
      });
      console.log('Upload success:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  


  useEffect(() => {
    setTotalAmt(getTotalAmt());
  }, [cart]);

  const renderCartItem = ({ item }) => (
    
    <View style={styles.cartItem}>
      <Image
        style={{ width: 70, height: 100, resizeMode: "contain" }}
        source={{ uri: `${imgUrl}/eproduct/${item.sale_image?.[0] || item.product_image?.[0]}` }}
      />
      <View style={styles.itemDetails}>
        <Text allowFontScaling={false} style={styles.itemName}>{item.name}</Text>
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

  return (
    <View style={styles.container}>
      {console.log(prescriptionImages,"157")}
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
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          ListEmptyComponent={<Text  allowFontScaling={false} style={styles.emptyText}>Your cart is empty</Text>}
        />
        <Toast position='bottom' bottomOffset={80} />
        {cart.length !== 0 && (
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckOut}>
            <Text allowFontScaling={false} style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default CartPage;

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
    resizeMode: 'cover',
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
  checkoutText: {
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
});
