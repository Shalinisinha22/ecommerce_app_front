import { View, Text, Dimensions, StyleSheet, FlatList, Image, Pressable, TouchableOpacity,Alert,RefreshControl,Animated,ScrollView } from 'react-native';
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { Entypo } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { imgUrl } from '../Components/Image/ImageUrl';
import moment from 'moment-timezone';
import Toast from 'react-native-toast-message';

const width = Dimensions.get('screen').width;

const PendingOrders = ({ navigation }) => {
  const dispatch= useDispatch()
  const [orders, setOrders] = useState([]);

  const userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);

  const getOrders = async () => { 
    try {
        const res = await axios.get("https://mahilamediplex.com/mediplex/pendingSale", {
            params: {
                uid: userInfo.client_id
            }
        });
        console.log(res.data) 

        // Filter the response data for status == 1
        const newArr = res.data.filter((item) => item.status === 1);

        // Update state with the filtered array
        setOrders(newArr);
    } catch (err) {
        console.error("Error fetching orders:", err.message);
    }
};



  useEffect(() => {
    getOrders();
  }, []);
  const cancelOrders = async (item) => {
    try {
      const res = await axios.post("https://mahilamediplex.com/mediplex/cancelOrder", {
        user_id: userInfo?.client_id, // Ensure userInfo is defined
        order_id: item?.temp_order_id, // Ensure item is defined
      });
  
      if (res.status === 200) {
        const { added_main_wallet, added_shopping_wallet } = res.data;

        if(added_shopping_wallet){
          userInfo.shopping_wallet=await added_shopping_wallet
          dispatch({ type: 'SET_USER_INFO', payload: userInfo });
        }
        if(added_main_wallet){
          userInfo.mani_wallet=await added_main_wallet
          dispatch({ type: 'SET_USER_INFO', payload: userInfo });
        }
  
       
  
        // Fetch updated order list
        getOrders();
    showToast()
        // Display success message to user (optional)
        // Alert.alert("Order cancelled successfully!",'Your amount will reflect in your wallet after some time.');
      }
    } catch (err) {
      console.error("Error canceling order:", err.message);
      if (err.response) {
        console.error("Server Response:", err.response.data);
        Alert.alert('',`Failed to cancel order: ${err.response.data.error}`);
      } else {
        Alert.alert('',"Failed to cancel order. Please try again later.");
      }
    }
  };


   const showToast = () => {
      Toast.show({
        type: "success",
        text1: "Your Order is cancelled.",
        text2:'Your amount will reflect in your wallet after some time.'
      });
    };



     const scrollY = useRef(new Animated.Value(0)).current;
    
     const [refreshing, setRefreshing] = useState(false);
    
      const handleRefresh = async () => {
        setRefreshing(true);
    
      getOrders()
        setRefreshing(false);
      };
  

  const renderRow = ({ item }) => (

    <View style={styles.row}>
      <Text allowFontScaling={false} style={styles.cell}>{moment(item.cdate).format('YYYY-MM-DD')}</Text>
      <Text allowFontScaling={false} style={styles.cell}>{item.temp_order_id}</Text>
      <Text numberOfLines={5} allowFontScaling={false} style={styles.cell}>{item.name}</Text>
      <Text numberOfLines={5} allowFontScaling={false} style={styles.cell}>{item.business_name}</Text>
      {/* <Text allowFontScaling={false} style={styles.cell}>Rs{item.batch_no}</Text> */}
      <Text allowFontScaling={false} style={styles.cell}>Rs{item.price}</Text>
      <Text allowFontScaling={false} style={styles.cell}>{item.payment_type}</Text>
      <View>
      <Text allowFontScaling={false} style={[styles.cell,{color:"red"}]}>Pending</Text>
      {!item.batch_details && <TouchableOpacity onPress={()=>cancelOrders(item)} style={{backgroundColor:"red",paddingHorizontal:10,paddingVertical:2}}><Text style={{color:"#fff",fontSize:8}}>Cancel</Text></TouchableOpacity>
 }
      </View>
    



    </View>
  );
  

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 0, paddingLeft: 0 }}>
          <Entypo name="menu" size={40} color="#155d27" />
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Text allowFontScaling={false} style={{ color: "gray", fontSize: 15, letterSpacing: 2 }}>
            PENDING ORDER
          </Text>
        </View>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Image source={require("../assets/logo.png")} style={{ height: 80, width: 80, resizeMode: "contain" }} />
        </Pressable>
      </View>
      <Text
        allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "whitesmoke",
          borderWidth: 2,
          marginTop: 8,
          width: width
        }}
      />
      <Animated.ScrollView
                          refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                          }
                          onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                          )}
                          scrollEventThrottle={16}
                        >

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text allowFontScaling={false} style={styles.headerCell}>Order_date</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Order_id</Text>

          <Text allowFontScaling={false} style={styles.headerCell}>Name</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Shop</Text>
          {/* <Text allowFontScaling={false} style={styles.headerCell}>Batch</Text> */}
          <Text allowFontScaling={false} style={styles.headerCell}>Amt</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Payment type</Text>

          <Text allowFontScaling={false} style={styles.headerCell}>Status</Text>


          {/* <Text allowFontScaling={false} style={styles.headerCell}>Payment Type</Text> */}
          {/* <Text allowFontScaling={false} style={styles.headerCell}>Status</Text> */}

          {/* <Text allowFontScaling={false} style={styles.headerCell}>Delivery Date</Text> */}
        </View>

        {orders.length != 0 ? (
          <FlatList
            data={orders}
            renderItem={renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 10 }}>No Orders</Text>
        )}
      </View>
      </Animated.ScrollView>
       <Toast
                position='top'
                topOffset={250}
              />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 8
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 8,
    // letterSpacing: 0.5
  },
  // image: {
  //   width: 30,
  //   height: 30,
  //   resizeMode: "contain"
  // },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginHorizontal: 2,
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 8
  },
  viewOrderButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: "#155d27", // Adjust the color as needed
    borderRadius: 5,
    marginLeft: 10,
  },
  viewOrderButtonText: {
    color: "white",
    fontSize: 8,
    textAlign: "center",
  },
  
});

export default PendingOrders;
