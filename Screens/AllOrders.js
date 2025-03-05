import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Animated,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Entypo, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import Toast from "react-native-toast-message";

const width = Dimensions.get("screen").width;

const PendingOrders = ({ navigation }) => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  const userInfo = useSelector((state) =>
    state.user.userInfo ? state.user.userInfo : null
  );

  const getOrders = async () => {
    try {
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/allProductOrders",
        {
          params: {
            uid: userInfo.client_id,
          },
        }
      );



      // const newArr = res.data.filter((item) => item.status !== 2);
      setOrders(res.data);
      console.log(res.data[0])
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Your Order is cancelled.",
      text2: "Your amount will reflect in your wallet after some time.",
    });
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getOrders();
    setRefreshing(false);
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>

      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          <Entypo name="calendar" size={16} color="#4CAF50" /> Order Date: {moment(item.cdate).format("YYYY-MM-DD")}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardText}>
          <MaterialIcons name="store" size={16} color="#2196F3" /> <Text style={styles.boldText}>Shop:</Text> {item.business_name}
        </Text>
        <Text style={styles.cardText}>
          <Entypo name="location-pin" size={16} color="#FF5722" /> <Text style={styles.boldText}>Address:</Text> {item.address}
        </Text>
        <Text style={styles.cardText}>
          <FontAwesome name="credit-card" size={16} color="#9C27B0" /> <Text style={styles.boldText}>Payment Type:</Text> {item.payment_type}
        </Text>
        {/* <Text style={styles.cardText}>
          <MaterialIcons name="event" size={16} color="#FFC107" /> <Text style={styles.boldText}>Delivery Date:</Text>{" "}
          {item.delivery_date ? moment(item.delivery_date).format("YYYY-MM-DD") : "Not assigned"}
        </Text> */}
        <Text style={styles.cardText}>
          <MaterialIcons
            name="local-shipping"
            size={16}
            color={item.status == 1 || item.status == 2 ? "red" : "#4CAF50"}
          />{" "}
          <Text style={styles.boldText}>Current Status:</Text>{" "}
          <Text
            style={{
              color: item.status == 1 || item.status == 2 ? "red" : item.status == 3 || item.status == 4 ? "#4CAF50" : "red",
              // fontSize: item.status == 1 || item.status == 2 ? 12 : 15,

            }}
          >
            {item.status == 1
              ? "Pending"
              : item.status == 2
                ? "Cancelled"
                : item.status == 3
                  ? "Processing"
                  : item.status == 4
                    ? "Delivered"
                    : "Pending"}
          </Text>
        </Text>

      </View>
      <View style={styles.cardFooter}>
        <TouchableOpacity
          onPress={() => navigation.navigate("OrderDetails", { order_id: item.order_id, deliveryStatus: item.status })}
          style={styles.viewButton}
        >
          <FontAwesome name="eye" size={16} color="#FFFFFF" />
          <Text style={styles.viewButtonText}> View Details</Text>
        </TouchableOpacity>
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
          <Text style={{ color: "gray", fontSize: 15, letterSpacing: 2 }}>ALL ORDERS</Text>
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
          marginTop: 10,
          width: width,
          marginBottom: 25
        }}
      />
      {orders.length == 0 && <Text style={{ textAlign: "center", color: "gray", marginTop: 50 }}>No Orders</Text>}

      <FlatList
        data={orders}
        renderItem={renderCard}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ padding: 10 }}
      />
      <Toast position="top" topOffset={250} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#4CAF50",
    paddingBottom: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  cardBody: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: "#FFF",
    fontSize: 12,
    marginLeft: 5,
  },
});

export default PendingOrders;
