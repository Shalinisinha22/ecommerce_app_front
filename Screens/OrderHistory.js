import { View, Text, Dimensions, StyleSheet, FlatList, Image, Pressable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { imgUrl } from '../Components/Image/ImageUrl';
import { useRoute } from '@react-navigation/native';
import moment from 'moment-timezone';
const width = Dimensions.get('screen').width;

const OrderHistory = ({ navigation }) => {
  const route = useRoute();
  const [orders, setOrders] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo || null);

  const getOrders = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/ordersHistory", {
        params: {
          uid: userInfo.client_id,
          order_id: route.params?.order_id
        }
      });
  
      // Access the orderDetails array from the response data
      let newArr = res.data.orderDetails;
  
      // If orderDetails is an array, parse the `image` field for each item
      if (Array.isArray(newArr)) {
        newArr = newArr.map(item => ({
          ...item,
          image: item.image ? JSON.parse(item.image) : null
        }));
      } else {
        // If orderDetails is not an array, set it as an empty array
        newArr = [];
      }
  
      setOrders(newArr);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
  };
  

  useEffect(() => {
    getOrders();
  }, []);

  const renderRow = ({ item }) => (
    <View style={styles.row}>

<Text allowFontScaling={false} style={styles.cell}>{moment(route.params?.order_date).format('YYYY-MM-DD')}</Text>

      <View style={styles.imageContainer}>
        {item.image && item.image[0] ? (
          <Image
            source={{ uri: `${imgUrl}/eproduct/${item.image[0]}` }}
            style={styles.image}
          />
        ) : (
          <Text style={styles.noImageText}>No Image</Text>
        )}
        <Text numberOfLines={4} style={styles.productName}>{item.name}</Text>
      </View>
      <Text style={styles.cell}>{route.params?.shop}</Text>

      <Text style={styles.cell}>{item.qty}</Text>
      <Text style={styles.cell}>RS {item.offer_price * item.qty}</Text>
      {/* Add more fields as needed */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Entypo name="menu" size={40} color="#155d27" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>ORDER HISTORY</Text>
        </View>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </Pressable>
      </View>
      <View style={styles.divider} />
      <View style={styles.tableContainer}>
        <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Shop</Text>
          <Text style={styles.headerCell}>Qty</Text>
          <Text style={styles.headerCell}>Amt</Text>
        </View>
        {orders.length ? (
          <FlatList
            data={orders}
            renderItem={renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.noOrdersText}>No Orders</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  menuButton: {
    paddingTop: 0,
    paddingLeft: 0
  },
  headerTextContainer: {
    alignItems: "center",
    marginTop: 15
  },
  headerText: {
    color: "gray",
    fontSize: 15,
    letterSpacing: 2
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: "contain"
  },
  divider: {
    height: 1,
    borderColor: "whitesmoke",
    borderWidth: 2,
    marginTop: 8,
    width: width
  },
  tableContainer: {
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
  imageContainer: {
    alignItems: "center"
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain"
  },
  noImageText: {
    fontSize: 6,
    color: "gray"
  },
  productName: {
    fontSize: 8,
    // width: 60,
    textAlign: 'center',
    
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 8,
    letterSpacing: 0.5
  },
  noOrdersText: {
    textAlign: "center",
    marginTop: 10
  }
});

export default OrderHistory;
