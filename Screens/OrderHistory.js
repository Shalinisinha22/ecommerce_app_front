import { View, Text, Dimensions, StyleSheet, FlatList, Image, Pressable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { imgUrl } from '../Components/Image/ImageUrl';
import moment from 'moment-timezone';

const width = Dimensions.get('screen').width;

const OrderHistory = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  const userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);

  const getOrders = async () => { 
    try {
        const res = await axios.get("https://mahilamediplex.com/mediplex/ordersHistory", {
            params: {
                uid: userInfo.client_id
            }
        });

        let newArr = res.data;

        // If newArr is an array, parse the `image` field for each item
        if (Array.isArray(newArr)) {
            newArr = newArr.map(item => ({
                ...item,
                image: item.image ? JSON.parse(item.image) : null
            }));
        } else if (newArr && newArr.image) {
            // If it's an object, parse the `image` field directly
            newArr.image = JSON.parse(newArr.image);
        }
        // newArr = newArr.sort((a, b) => new Date(b.date) - new Date(a.date));

        
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
      <View style={{alignItems:"center"}}>
        <Image
          source={{ uri: `${imgUrl}/eproduct/${item.image[0]}` }} // Replace with your actual image URL
          style={styles.image}
        />
        <Text allowFontScaling={false} style={[styles.cell,{fontSize:6}]}>{item.name}</Text>
      </View>
      <Text allowFontScaling={false} style={styles.cell}>{item.qty}</Text>
      <Text allowFontScaling={false} style={styles.cell}>RS {item.user_payable_amount}</Text>
      <Text allowFontScaling={false} style={styles.cell}>{item.payment_method}</Text>
      {/* <Text allowFontScaling={false} style={styles.cell}>{moment(item.delivery_new_date).format('YYYY-MM-DD')}</Text> */}
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
          <Text allowFontScaling={false} style={styles.headerCell}>Order Date</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Name</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Qty</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Amt</Text>
          <Text allowFontScaling={false} style={styles.headerCell}>Payment Type</Text>
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
});

export default OrderHistory;
