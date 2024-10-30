import { View, Text, Dimensions, StyleSheet, FlatList, Image, Pressable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { imgUrl } from '../Components/Image/ImageUrl';
import moment from 'moment-timezone';

const width = Dimensions.get('screen').width;

const AllOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  const userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);

  const getOrders = async () => { 
    try {
        const res = await axios.get("https://mahilamediplex.com/mediplex/allOrders", {
            params: {
                uid: userInfo.client_id
            }
        });

      
let newArr= res.data
        
        setOrders(newArr);
    } catch (err) {
        console.log(err.message);
    }
};


  useEffect(() => {
    getOrders();
  }, []);

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text allowFontScaling={false} style={styles.cell}>{moment(item.order_date).format('YYYY-MM-DD')}</Text>
      <Text allowFontScaling={false} style={styles.cell}>{item.order_id}</Text>
      <Text allowFontScaling={false} style={styles.cell}>{item.business_name}</Text>
      <Text allowFontScaling={false} style={styles.cell}>Rs{item.user_payable_amount}</Text>
  
      {/* Add a View Order button */}
      <TouchableOpacity
        style={styles.viewOrderButton}
        onPress={() => navigation.navigate("orderHistory", { order_id: item.order_id,shop:item.business_name,order_date:item.order_date })}
      >
        <Text allowFontScaling={false} style={styles.viewOrderButtonText}>View Order</Text>
      </TouchableOpacity>
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
            ORDER HISTORY
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

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text allowFontScaling={false} style={styles.headerCell}>Order_date</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Order_id</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Shop</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Amt</Text>
          <Text allowFontScaling={false} style={styles.headerCell}></Text>

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
    fontSize: 10
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
    letterSpacing: 0.5
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain"
  },
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

export default AllOrders;
